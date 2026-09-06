import os
import sys
import io
import uuid
from fastapi.testclient import TestClient

# Add Backend to pythonpath
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + "/.."))

from main import app, ensure_db_schema
from utils.database import LocalSession
from src.market.router import seed_database_if_empty

ensure_db_schema()
db = LocalSession()
seed_database_if_empty(db)
db.close()

client = TestClient(app)

def test_full_system():
    print("=== 1. Health check ===")
    res = client.get("/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("Health check OK:", res.json())

    # Generate unique test emails
    unique_suffix = uuid.uuid4().hex[:6]
    artisan_email = f"artisan_{unique_suffix}@test.com"
    buyer_email = f"buyer_{unique_suffix}@test.com"

    print("\n=== 2. Register Artisan ===")
    artisan_payload = {
        "name": "Master Potter Aarav",
        "email": artisan_email,
        "password": "password123",
        "user_type": "artisan",
        "location": "Khurja, Uttar Pradesh",
        "craft_discipline": "Ceramics & Stoneware",
        "store_name": "Aarav Terracotta Kiln",
        "bio": "Third-generation master artisan creating reduction wood-fired ceramics.",
    }
    res = client.post("/user/register", json=artisan_payload)
    assert res.status_code == 201, f"Artisan registration failed: {res.text}"
    artisan_auth = res.json()
    artisan_token = artisan_auth["access_token"]
    assert artisan_token, "No access token returned"
    assert artisan_auth["user"]["user_type"] == "artisan"
    print("Artisan registered successfully. User ID:", artisan_auth["user"]["id"])

    print("\n=== 3. Register Buyer ===")
    buyer_payload = {
        "name": "Maya Sharma",
        "email": buyer_email,
        "password": "password123",
        "user_type": "buyer",
        "location": "Bandra, Mumbai",
    }
    res = client.post("/user/register", json=buyer_payload)
    assert res.status_code == 201, f"Buyer registration failed: {res.text}"
    buyer_auth = res.json()
    buyer_token = buyer_auth["access_token"]
    assert buyer_auth["user"]["user_type"] == "buyer"
    print("Buyer registered successfully. User ID:", buyer_auth["user"]["id"])

    print("\n=== 4. Test Login ===")
    res = client.post("/user/login", json={"email": artisan_email, "password": "password123"})
    assert res.status_code == 200, f"Login failed: {res.text}"
    print("Artisan login OK. Token received.")

    print("\n=== 5. Test Authenticated Profile (/user/me) ===")
    headers = {"Authorization": f"Bearer {artisan_token}"}
    res = client.get("/user/me", headers=headers)
    assert res.status_code == 200
    assert res.json()["email"] == artisan_email
    print("Current profile verified:", res.json()["name"], f"({res.json()['user_type']})")

    print("\n=== 6. Test Products Catalog (/market/products) ===")
    res = client.get("/market/products")
    assert res.status_code == 200
    products = res.json()
    assert len(products) > 0, "Expected seeded products in database"
    print(f"Products catalog retrieved: {len(products)} products available.")
    sample_prod = products[0]
    print(f"Sample product: {sample_prod['name']} (Price: INR {sample_prod['price']}, Maker: {sample_prod['maker']})")

    print("\n=== 7. Test Image Upload to Bucket (/market/upload-image) ===")
    dummy_image = io.BytesIO(b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xff\xdb\x00C\x00")
    res = client.post("/market/upload-image", files={"file": ("test_vase.jpg", dummy_image, "image/jpeg")})
    assert res.status_code == 200, f"Image upload failed: {res.text}"
    upload_res = res.json()
    bucket_url = upload_res["url"]
    print("Image uploaded to bucket:", bucket_url)

    print("\n=== 8. Test Accessing Uploaded Image from Static /bucket Mount ===")
    res = client.get(bucket_url)
    assert res.status_code == 200, f"Failed to fetch static bucket image: {res.status_code}"
    print("Bucket image served statically with status 200 OK.")

    print("\n=== 9. Test Creating Product as Artisan ===")
    new_prod_payload = {
        "name": "Hand-Carved Walnut Tea Tray",
        "category": "Carved Woodwork",
        "price": 850.0,
        "original_price": 1100.0,
        "material": "Kashmiri Walnut Wood",
        "technique": "Hand-Chiseled Relief Carving",
        "in_stock": 8,
        "image": bucket_url,
        "description": "Crafted from single-plank seasoned Kashmiri walnut with intricate floral vine carvings.",
        "description_hi": "कश्मीरी अखरोट की लकड़ी से हाथ से तराशा गया सुंदर चाय का ट्रे।",
        "tags": ["woodwork", "walnut", "kashmir", "hand carved"],
    }
    res = client.post("/market/products", json=new_prod_payload, headers=headers)
    assert res.status_code == 201, f"Product creation failed: {res.text}"
    created_prod = res.json()
    print("New product created in DB! ID:", created_prod["id"], f"Name: {created_prod['name']}")

    print("\n=== 10. Test Placing Order (/market/orders) ===")
    buyer_headers = {"Authorization": f"Bearer {buyer_token}"}
    order_payload = {
        "customer_name": "Maya Sharma",
        "customer_email": buyer_email,
        "shipping_address": "Flat 402, Sea View, Bandra West, Mumbai",
        "city": "Mumbai",
        "total_amount": 850.0,
        "items": [
            {
                "id": created_prod["id"],
                "name": created_prod["name"],
                "price": created_prod["price"],
                "quantity": 1,
                "image": created_prod["image"],
                "artisan_id": str(artisan_auth["user"]["id"]),
            }
        ],
    }
    res = client.post("/market/orders", json=order_payload, headers=buyer_headers)
    assert res.status_code == 201, f"Order placement failed: {res.text}"
    order_res = res.json()
    print("Order placed successfully! Order ID:", order_res["id"], f"Status: {order_res['status']}")

    print("\n=== 11. Test Updating Order Status (/market/orders/{id}/status) ===")
    status_update = {
        "status": "In Transit",
        "tracking_id": "INDPOST-DELHI-88902",
    }
    res = client.put(f"/market/orders/{order_res['id']}/status", json=status_update, headers=headers)
    assert res.status_code == 200, f"Status update failed: {res.text}"
    print("Order status updated to:", res.json()["status"], "Tracking:", res.json()["tracking_id"])

    print("\n=== ALL INTEGRATION TESTS PASSED SUCCESSFULLY! ===")

if __name__ == "__main__":
    test_full_system()
