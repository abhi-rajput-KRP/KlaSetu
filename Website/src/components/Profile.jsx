import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { User, Package, Heart, MapPin, Award, LogOut, CheckCircle2, Truck, Clock, Store, Plus, Edit2, Save } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

export default function Profile() {
  const { user, isArtisan, orders, logout, updateUserProfile, getImageUrl } = useShop();
  const [activeTab, setActiveTab] = useState('orders');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    location: user?.location || '',
    phone: user?.phone || '',
    store_name: user?.store_name || '',
    craft_discipline: user?.craft_discipline || '',
    bio: user?.bio || '',
  });
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(editForm);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 bg-[#FFFDF9]">
        <div className="mx-auto max-w-md text-center rounded-3xl border border-[#EDE4D6] bg-white p-8 card-shadow space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3E6D3] text-[#3C6E47] border border-[#EDE4D6]">
            <User size={28} />
          </div>
          <h2 className="font-serif-heading text-2xl font-bold text-[#2B2420]">
            Sign in to View Your Account
          </h2>
          <p className="text-xs sm:text-sm text-[#8A8078]">
            Access your artisan dashboard, past order tracking, and profile records.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/login"
              className="rounded-full bg-[#3C6E47] py-3 text-xs sm:text-sm font-bold text-white hover:bg-[#2F5838] transition-all shadow"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-full border border-[#EDE4D6] bg-white py-3 text-xs sm:text-sm font-bold text-[#2B2420] hover:bg-[#F3E6D3] transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF9] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* User Banner Card */}
        <div className="rounded-3xl border border-[#EDE4D6] bg-[#F3E6D3]/60 p-6 sm:p-8 card-shadow mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-[#EDE4D6] shadow-sm text-2xl font-bold text-[#3C6E47]">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="font-serif-heading text-2xl font-bold text-[#2B2420]">
                    {user.name}
                  </h1>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white ${
                      isArtisan ? 'bg-[#B5652F]' : 'bg-[#3C6E47]'
                    }`}
                  >
                    {isArtisan ? 'Master Artisan' : 'Buyer'}
                  </span>
                </div>
                <p className="text-xs text-[#8A8078] mt-0.5">{user.email}</p>
                {user.store_name && (
                  <p className="text-xs font-semibold text-[#3C6E47] mt-1 flex items-center gap-1">
                    <Store size={12} />
                    <span>{user.store_name} • {user.craft_discipline || 'Traditional Crafts'}</span>
                  </p>
                )}
                {user.location && (
                  <p className="text-[11px] text-[#8A8078] mt-0.5 flex items-center gap-1">
                    <MapPin size={11} />
                    <span>{user.location}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isArtisan && (
                <>
                  <Link
                    to="/studio"
                    className="rounded-full bg-[#3C6E47] px-4 py-2 text-xs font-bold text-white hover:bg-[#2F5838] shadow-xs flex items-center gap-1.5"
                  >
                    <Package size={14} />
                    <span>Artisan Studio</span>
                  </Link>
                  <Link
                    to="/sellers_page"
                    className="rounded-full bg-[#B5652F] px-4 py-2 text-xs font-bold text-white hover:bg-[#9B5324] shadow-xs flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>Post New Craft</span>
                  </Link>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  setEditForm({
                    name: user.name || '',
                    location: user.location || '',
                    phone: user.phone || '',
                    store_name: user.store_name || '',
                    craft_discipline: user.craft_discipline || '',
                    bio: user.bio || '',
                  });
                  setIsEditing(!isEditing);
                }}
                className="rounded-full border border-[#EDE4D6] bg-white px-3.5 py-2 text-xs font-bold text-[#2B2420] hover:bg-[#F3E6D3] flex items-center gap-1.5"
              >
                <Edit2 size={13} />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[#EDE4D6] bg-white px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-1.5"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Inline Profile Editor */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-[#EDE4D6] space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2B2420]">Update Profile Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-medium text-[#2B2420] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-white px-3.5 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#2B2420] mb-1">Location / City</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-white px-3.5 py-2 text-xs focus:outline-none"
                  />
                </div>
                {isArtisan && (
                  <>
                    <div>
                      <label className="block font-medium text-[#2B2420] mb-1">Workshop / Store Name</label>
                      <input
                        type="text"
                        value={editForm.store_name}
                        onChange={(e) => setEditForm({ ...editForm, store_name: e.target.value })}
                        className="w-full rounded-xl border border-[#EDE4D6] bg-white px-3.5 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#2B2420] mb-1">Craft Discipline</label>
                      <input
                        type="text"
                        value={editForm.craft_discipline}
                        onChange={(e) => setEditForm({ ...editForm, craft_discipline: e.target.value })}
                        className="w-full rounded-xl border border-[#EDE4D6] bg-white px-3.5 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block font-medium text-[#2B2420] mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-white px-3.5 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#2B2420] mb-1">Bio / Story</label>
                  <input
                    type="text"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-white px-3.5 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="rounded-full bg-[#3C6E47] px-5 py-2 text-xs font-bold text-white hover:bg-[#2F5838] shadow flex items-center gap-1.5"
              >
                <Save size={13} />
                <span>Save Changes</span>
              </button>
            </form>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#EDE4D6] gap-4 sm:gap-8 text-xs sm:text-sm font-semibold mb-8 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'orders'
                ? 'border-b-2 border-[#3C6E47] text-[#3C6E47]'
                : 'text-[#8A8078] hover:text-[#2B2420]'
            }`}
          >
            <Package size={16} />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'addresses'
                ? 'border-b-2 border-[#3C6E47] text-[#3C6E47]'
                : 'text-[#8A8078] hover:text-[#2B2420]'
            }`}
          >
            <MapPin size={16} />
            <span>Addresses & Studio Info</span>
          </button>
        </div>

        {/* Tab Content: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-16 rounded-3xl border border-[#EDE4D6] bg-white p-8">
                <Package size={36} className="mx-auto text-[#8A8078] mb-3" />
                <h3 className="font-serif-heading text-lg font-bold text-[#2B2420]">No Orders Found</h3>
                <p className="text-xs text-[#8A8078] mt-1 mb-4">
                  {isArtisan
                    ? "Orders received for your crafts will appear here."
                    : "You haven't placed any craft orders yet."}
                </p>
                <Link
                  to="/products"
                  className="inline-block rounded-full bg-[#3C6E47] px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-[#2F5838]"
                >
                  Explore Crafts Catalog
                </Link>
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="rounded-3xl border border-[#EDE4D6] bg-white p-6 card-shadow space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EDE4D6] pb-4 text-xs">
                    <div>
                      <span className="text-[#8A8078]">Order #{ord.id}</span>
                      <p className="font-bold text-[#2B2420] text-sm">
                        {ord.created_at ? new Date(ord.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                      </p>
                      {ord.customer_name && (
                        <p className="text-[11px] text-[#8A8078]">Recipient: {ord.customer_name} • {ord.city || ord.shipping_address}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-bold text-xs ${
                          ord.status === 'Delivered'
                            ? 'bg-blue-50 text-blue-700'
                            : ord.status === 'In Transit'
                            ? 'bg-[#EBF3EC] text-[#3C6E47]'
                            : 'bg-[#F3E6D3] text-[#B5652F]'
                        }`}
                      >
                        {ord.status === 'Delivered' ? <CheckCircle2 size={13} /> : <Truck size={13} />}
                        <span>{ord.status}</span>
                      </span>
                      <span className="font-bold text-sm text-[#2B2420]">
                        ₹{ord.total_amount || 0}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    {(ord.items || []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="h-14 w-14 rounded-xl object-cover bg-[#F3E6D3]"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs sm:text-sm text-[#2B2420] truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-[#8A8078]">
                            Qty: {item.quantity || 1} • ₹{item.price} each
                          </p>
                          {ord.tracking_id && (
                            <p className="text-[11px] font-bold text-[#3C6E47] mt-0.5">
                              Tracking ID: #{ord.tracking_id}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content: Addresses */}
        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-[#3C6E47] bg-white p-6 card-shadow space-y-3 relative">
              <span className="absolute top-4 right-4 rounded-full bg-[#3C6E47] px-2.5 py-0.5 text-[10px] font-bold text-white">
                Primary Registered
              </span>
              <h4 className="font-bold text-sm text-[#2B2420]">
                {isArtisan ? "Artisan Workshop / Production Studio" : "Delivery Residence"}
              </h4>
              <p className="text-xs text-[#8A8078] leading-relaxed">
                {user.name}<br />
                {user.location || "Registered Address Pending"}<br />
                Phone: {user.phone || "+91 98765 43210"}<br />
                Email: {user.email}
              </p>
            </div>

            {isArtisan && (
              <div className="rounded-3xl border border-[#EDE4D6] bg-white p-6 card-shadow space-y-3">
                <h4 className="font-bold text-sm text-[#2B2420]">Craft Heritage & Provenance</h4>
                <p className="text-xs text-[#8A8078] leading-relaxed">
                  Store: {user.store_name || "Artisan Atelier"}<br />
                  Tradition: {user.craft_discipline || "Traditional Handmade Crafts"}<br />
                  Bio: {user.bio || "Dedicated master craftsperson preserving regional artisan heritage."}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
