# KlaSetu Backend & Intelligence Engine

## Overview

The KlaSetu Backend is a high-throughput asynchronous REST API and machine learning pipeline built on FastAPI. It serves as the computational backbone of the KlaSetu platform, orchestrating relational data persistence, secure role-based authentication, and a multimodal artificial intelligence engine designed specifically to empower traditional artisans.

The core innovation of the backend is its automated listing pipeline orchestrated via LangGraph. This pipeline takes a raw smartphone photo and an unstructured spoken voice recording in any of 24 Indian regional languages, transforms them into studio-grade photography and bilingual commercial copy, and computes an equitable, category-aware price floor.

---

## Architectural Highlights

```mermaid
flowchart TD
    subgraph Ingestion ["Artisan Input Layer"]
        IMG["Raw Image Upload (.jpg / .png)"]
        AUD["Spoken Voice Note (.ogg / .wav / .m4a)"]
        META["Craft Discipline & Material Costs"]
    end

    subgraph LangGraph ["LangGraph Execution Pipeline"]
        N1["Node 1: Image Enhancement\n- VLM Analysis (Qwen3-VL)\n- Background Removal (rembg)\n- CLAHE & Sharpening (OpenCV)\n- Composition & Reflection"]
        N2["Node 2: Multilingual Speech-to-Text\n- FFmpeg 16kHz Decoding\n- Indic-Conformer 600M Model\n- Transcribes 24 Regional Languages"]
        N3["Node 3: Listing Synthesis\n- Bilingual Copywriting (Groq / GPT)\n- Title, Bullets, Tags, Category Detection"]
        N4["Node 4: Algorithmic Fair Pricing\n- Base Cost = Materials + Labour\n- Discipline Margin (30% - 50%)\n- Suggested Retail Price"]
    end

    subgraph Output ["Listing Payload"]
        WEB_IMG["Enhanced WebP Image (/bucket)"]
        PAYLOAD["Complete Listing Draft & Price Recommendation"]
    end

    IMG --> N1
    AUD --> N2
    META --> N4
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N1 -.-> WEB_IMG
    N4 --> PAYLOAD
```

---

## Machine Learning & AI Pipeline

### 1. Computer Vision & Photometric Enhancement
Raw workshop photographs frequently suffer from harsh shadows, uneven exposure, and distracting clutter. The enhancement pipeline executes sequentially:
- **Vision-Language Model Inspection**: Evaluates image quality via `Qwen/Qwen3-VL-4B-Instruct` on Featherless AI. The VLM determines blur status, crop requirements, lighting severity (`mild`, `moderate`, `severe`), and optimal backdrop tone (`white`, `light_gray`, `warm_beige`, `cool_gray`, `charcoal`, `black`).
- **Laplacian Blur Scoring**: Calculates image variance using OpenCV Laplacian transforms to flag out-of-focus captures.
- **Neural Background Segmentation**: Extracts the craft subject using `rembg` with the `u2net` weights, loaded as a thread-safe singleton.
- **Auto-Bounding & Cropping**: Trims excess canvas area around non-zero alpha channels while maintaining safety margins.
- **Photometric Balancing**: Applies Contrast Limited Adaptive Histogram Equalization (CLAHE) on the L-channel of the LAB color space to equalize harsh shadows without over-saturating craft dyes, followed by custom sharpening kernels.
- **Synthetic Surface Reflection & Canvas Margin**: Simulates studio lighting with a vertical fade-out reflection and proportional canvas borders.
- **WebP Optimization**: Saves the enhanced composition as an optimized WebP binary into the persistent `/bucket` storage.

### 2. Multilingual Speech Recognition (Indic-Conformer)
Artisans can explain their craft naturally without typing. The speech subsystem:
- Accepts audio in standard recording containers (`.ogg`, `.mp3`, `.wav`, `.m4a`).
- Utilizes an automated FFmpeg pipeline to decode and resample input streams into 16 kHz mono float32 tensors, avoiding host OS dynamic library linking problems.
- Loads the `ai4bharat/indic-conformer-600m-multilingual` model onto CUDA or CPU.
- Decodes spoken voice across 24 official Indian languages into raw text transcripts using RNN-T / CTC decoding.

### 3. Bilingual Listing Synthesis
Using `openai/gpt-oss-120b` via Groq Cloud, the system transforms unstructured transcripts into structured JSON conforming to `ListingDraft`:
- English product title and narrative description.
- Hindi product title (`product_name_hi`) and narrative description (`description_hi`).
- Extracted craft discipline, materials used, and SEO keywords/tags.

### 4. Fair Pricing Engine
Protects artisans from undervaluation using an automated cost-plus framework:
- Form inputs: Material cost + Artisan labour cost.
- Craft margins:
  - Textile: 35%
  - Wood: 40%
  - Metal: 45%
  - Jewelry: 50%
  - Pottery: 35%
  - Other crafts: 30%
- Formula:
  $$\text{Final Price} = (\text{Material Cost} + \text{Labour Cost}) \times (1 + \text{Margin})$$

---

## Database Architecture

The backend utilizes PostgreSQL managed via SQLAlchemy ORM and Alembic migrations.

### Key Models

- **UserModel (`users`)**:
  - Identity & Credentials: `id`, `email`, `password_hash` (Argon2), `user_type` (`buyer` or `artisan`).
  - Artisan Profile: `store_name`, `craft_discipline`, `location`, `phone`, `bio`, `avatar`, `created_at`.
- **ProductModel (`products`)**:
  - Catalog Details: `id`, `artisan_id` (foreign key to users), `title`, `title_hi`, `description`, `description_hi`, `price`, `material_cost`, `labour_cost`, `category`, `material`, `stock_quantity`, `tags`.
  - Media & Status: `image_url`, `is_published`, `rating`, `review_count`, `created_at`.
- **OrderModel & OrderItemModel (`orders`, `order_items`)**:
  - Transaction Management: `buyer_id`, `total_amount`, `shipping_address`, `status` (`pending`, `confirmed`, `shipped`, `delivered`), line items with unit prices.
- **ReviewModel (`reviews`)**:
  - Buyer feedback: `product_id`, `user_id`, `rating` (1-5), `comment`, `created_at`.

---

## API Reference

### Health Check
- `GET /health`
  - Returns `{"status": "ok", "service": "KlaSetu Backend"}`.

### AI Listing Engine
- `POST /api/process-product`
  - Content-Type: `multipart/form-data`
  - Form Parameters:
    - `image`: Binary image file (`.jpg`, `.png`, `.webp`).
    - `audio`: Binary voice note file (`.ogg`, `.wav`, `.m4a`).
    - `language`: Two-letter ISO language code (default: `hi`).
    - `material_cost`: Numeric float.
    - `labour_cost`: Numeric float.
  - Returns:
    ```json
    {
      "success": true,
      "enhanced_image_url": "/bucket/enhanced_abc123.webp",
      "transcribed_text": "...",
      "listing": {
        "product_name_en": "Handcrafted Terracotta Chai Cup",
        "product_name_hi": "हस्तनिर्मित टेराकोटा कुल्हड़",
        "description_en": "...",
        "description_hi": "...",
        "detected_category": "pottery",
        "detected_material": "clay",
        "tags": ["pottery", "terracotta", "handmade", "culinary"]
      },
      "pricing": {
        "material_cost": 150.0,
        "labour_cost": 100.0,
        "base_cost": 250.0,
        "category": "pottery",
        "margin_pct": 35.0,
        "final_price": 337.5
      },
      "warnings": []
    }
    ```

### User & Authentication Endpoints
- `POST /users/register`: Create a new user (artisan or buyer) with password hashing.
- `POST /users/login`: Authenticate credentials, return JSON Web Token (JWT).
- `GET /users/profile`: Retrieve profile information of the authenticated user.
- `PUT /users/update`: Update profile attributes (bio, store name, phone, location).

### Marketplace & Product Endpoints
- `GET /market/products`: Paginated product feed with category, discipline, and search query filters.
- `GET /market/products/{id}`: Full detail of an individual craft product.
- `POST /market/products`: Create a published or draft product listing (Artisan role required).
- `PUT /market/products/{id}`: Modify an existing product listing.
- `DELETE /market/products/{id}`: Remove an item from the marketplace.
- `GET /market/studio/products`: Retrieve all listings associated with the authenticated artisan.

### Order Endpoints
- `POST /market/orders`: Place a new order with multiple line items.
- `GET /market/orders`: View purchase history for the authenticated buyer.
- `GET /market/studio/orders`: View incoming customer orders for the authenticated artisan.
- `PUT /market/orders/{id}/status`: Update order fulfillment status.

---

## Directory Layout

```
Backend/
├── AI/
│   ├── config.py              # LLM, VLM, and model initialization
│   ├── pipeline/
│   │   ├── build_graph.py     # LangGraph nodes and compilation
│   │   ├── prompts.py         # System and user prompts for VLM/LLM
│   │   └── schema.py          # Pydantic data contracts
│   └── pipeline.py            # Legacy standalone pipeline reference
├── alembic/                   # Alembic environment and version scripts
├── bucket/                    # Static image store (served at /bucket)
├── src/
│   ├── market/
│   │   ├── DTO.py             # Request and response Pydantic models
│   │   ├── models.py          # SQLAlchemy models (Product, Order, Review)
│   │   └── router.py          # FastAPI routes for marketplace operations
│   └── users/
│       ├── DTO.py             # User request and response schemas
│       ├── models.py          # SQLAlchemy models (UserModel)
│       └── router.py          # FastAPI routes for auth and user management
├── utils/
│   ├── auth_helper.py         # JWT tokens and password security
│   ├── database.py            # Database engine and connection factory
│   └── settings.py            # Settings loader from environment
├── alembic.ini                # Alembic configuration
├── main.py                    # Server lifecycle and root application
└── requirements.txt           # Python library dependencies
```

---

## Installation & Setup

### 1. System Requirements
- Python 3.10, 3.11, or 3.12
- PostgreSQL server (local or cloud instance such as Neon, Supabase, or AWS RDS)
- FFmpeg (binaries must be accessible via system `PATH` or configured in `build_graph.py`)

### 2. Environment Configuration
Create a `.env` file in the `Backend` directory containing:

```env
DATABASE_URL=postgresql+psycopg2://postgres:password@localhost:5432/klasetu
JWT_SECRET=your_super_secret_jwt_key_here
FEATHERLESS_API_KEY=your_featherless_api_key_here
GROQ_API_KEY=your_groq_api_key_here
HF_TOKEN=your_huggingface_read_token_here
```

### 3. Python Environment Setup
```bash
# From the Backend directory
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux / macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Database Migrations
Initialize and sync the database schema:
```bash
alembic upgrade head
```

### 5. Running the Service
Start the backend server using Uvicorn:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive OpenAPI documentation is available at `http://localhost:8000/docs`.
ReDoc documentation is accessible at `http://localhost:8000/redoc`.
