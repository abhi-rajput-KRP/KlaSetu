import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router';
import { Trash2, ArrowRight, ShieldCheck, Check, ShoppingBag, Loader2 } from 'lucide-react';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, placeOrder, getImageUrl, user } = useShop();

  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [createdOrderRef, setCreatedOrderRef] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 50.0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);

    const orderPayload = {
      customer_name: user?.name || "KlaSetu Guest Patron",
      customer_email: user?.email || "patron@example.com",
      shipping_address: user?.location || "Bandra West, Mumbai, Maharashtra",
      city: user?.location?.split(',')[0] || "Mumbai",
      total_amount: total,
      items: cart.map((ci) => ({
        id: ci.item.id,
        name: ci.item.name,
        price: ci.item.price,
        quantity: ci.quantity,
        image: ci.item.image,
        artisan_id: ci.item.artisan_id || null,
      })),
    };

    try {
      const order = await placeOrder(orderPayload);
      setCreatedOrderRef(order.id);
      setCheckoutComplete(true);
    } catch (err) {
      console.error("Checkout failed:", err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="bg-[#FFFDF9] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif-heading text-3xl font-bold text-[#2B2420]">
            Your Artisan Craft Basket
          </h1>
          <p className="text-sm text-[#8A8078] mt-1">
            Review your handcrafted items before direct dispatch from rural studios.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Column: Cart Line Items (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {cart.length > 0 ? (
              cart.map(({ id, item, quantity }) => {
                return (
                  <div
                    key={id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-[#EDE4D6] bg-white p-4 sm:p-5 card-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover bg-[#F3E6D3] border border-[#EDE4D6]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#B5652F]">{item.maker}</span>
                        <h3 className="font-semibold text-sm text-[#2B2420] line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#8A8078] mt-0.5">{item.material?.split(',')[0]}</p>
                        <p className="text-sm font-bold text-[#3C6E47] mt-1">
                          ₹{item.price} <span className="text-xs text-[#8A8078] font-normal">each</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#EDE4D6]">
                      {/* Quantity Stepper */}
                      <div className="flex items-center rounded-full border border-[#EDE4D6] bg-white px-2.5 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(id, -1)}
                          className="h-6 w-6 rounded-full bg-[#F3E6D3] text-xs font-bold text-[#2B2420] hover:bg-[#E8D5BC] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="mx-3 text-xs font-bold text-[#2B2420]">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(id, 1)}
                          className="h-6 w-6 rounded-full bg-[#F3E6D3] text-xs font-bold text-[#2B2420] hover:bg-[#E8D5BC] cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right sm:min-w-16">
                        <span className="font-bold text-sm text-[#2B2420]">
                          ₹{(item.price * quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Remove  */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => removeFromCart(id)}
                          className="p-1.5 text-[#8A8078] hover:text-red-600 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-3xl border border-dashed border-[#EDE4D6] bg-white p-12 text-center">
                <ShoppingBag size={48} className="mx-auto text-[#8A8078] mb-3" />
                <h3 className="font-serif-heading text-xl font-bold text-[#2B2420]">
                  Your basket is empty
                </h3>
                <p className="mt-1 text-sm text-[#8A8078]">
                  Explore authentic handcrafted goods directly from rural master makers.
                </p>
                <Link
                  to="/products"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#3C6E47] px-6 py-3 text-xs font-bold text-white hover:bg-[#2F5838]"
                >
                  <span>Discover Heritage Crafts</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-[#EDE4D6] bg-white p-6 card-shadow space-y-5">
              <h2 className="font-serif-heading text-xl font-bold text-[#2B2420]">
                Order Summary
              </h2>

              {/* Breakdown */}
              <div className="space-y-3 text-sm border-b border-[#EDE4D6] pb-4">
                <div className="flex justify-between text-[#8A8078]">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-semibold text-[#2B2420]">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[#8A8078]">
                  <span>Direct Studio Shipping</span>
                  <span className="font-semibold text-[#2B2420]">
                    {shipping === 0 ? <span className="text-[#3C6E47] font-bold">FREE</span> : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-baseline justify-between pt-1 text-base">
                <span className="font-bold text-[#2B2420]">Total Amount</span>
                <span className="font-bold text-2xl text-[#3C6E47]">₹{total.toFixed(2)}</span>
              </div>

              {/* Checkout Pill CTA */}
              <button
                type="button"
                disabled={cart.length === 0 || isCheckingOut}
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#3C6E47] py-3.5 px-6 text-sm font-bold text-white shadow-md transition-all hover:bg-[#2F5838] disabled:opacity-50 active:scale-98 cursor-pointer"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Placing Order with Artisan Studio...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-[#8A8078] pt-2">
                <ShieldCheck size={16} className="text-[#3C6E47]" />
                <span>256-bit Direct Fair Trade Artisan Checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Modal Confirmation */}
        {checkoutComplete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center border border-[#EDE4D6] shadow-2xl space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF3EC] text-[#3C6E47]">
                <Check size={32} />
              </div>
              <h3 className="font-serif-heading text-2xl font-bold text-[#2B2420]">
                Order Confirmed!
              </h3>
              <p className="text-xs text-[#8A8078] leading-relaxed">
                Thank you for supporting indigenous craftsmanship! We have recorded your order and notified the master artisans to package your handcrafted pieces.
              </p>
              <div className="rounded-2xl bg-[#F3E6D3]/60 p-3 text-xs text-[#2B2420] font-semibold">
                Order Reference: #{createdOrderRef}
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/profile"
                  onClick={() => setCheckoutComplete(false)}
                  className="inline-block w-full rounded-full bg-[#3C6E47] py-3 text-sm font-bold text-white hover:bg-[#2F5838]"
                >
                  View in My Orders & Track
                </Link>
                <Link
                  to="/products"
                  onClick={() => setCheckoutComplete(false)}
                  className="inline-block w-full rounded-full border border-[#EDE4D6] bg-white py-2.5 text-xs font-bold text-[#2B2420] hover:bg-[#F3E6D3]"
                >
                  Continue Browsing Crafts
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}