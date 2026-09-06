import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, AlertCircle, Loader2, MapPin, Sparkles } from "lucide-react";
import { useShop } from "../context/ShopContext";

export default function Register() {
  const [role, setRole] = useState("buyer"); // 'buyer' or 'artisan'
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [craftDiscipline, setCraftDiscipline] = useState("");
  const [storeName, setStoreName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useShop();
  const navigate = useNavigate();

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state_district || "India";
          const state = data.address?.state || "";
          setLocation(`${city}, ${state}`.trim());
        } catch {
          setLocation(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
        } finally {
          setFetchingLocation(false);
        }
      },
      (err) => {
        setFetchingLocation(false);
        console.warn("Location fetch skipped or denied:", err.message);
      },
      { timeout: 10000 }
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const payload = {
      name: fullName || "Artisan",
      email: email.trim(),
      password,
      user_type: role,
      location: location.trim() || (role === "artisan" ? "Varanasi, Uttar Pradesh" : "India"),
      phone: phone.trim(),
      craft_discipline: role === "artisan" ? craftDiscipline.trim() : "",
      store_name: role === "artisan" ? (storeName.trim() || `${firstName.trim()}'s Atelier`) : "",
      bio: role === "artisan" ? `Dedicated heritage maker preserving ${craftDiscipline || 'traditional craft'}.` : "",
    };

    try {
      const newUser = await register(payload);
      if (newUser?.user_type === "artisan") {
        navigate("/studio");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const detail = err.response?.data?.detail || "Could not register account. Please verify your details.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#FFFDF9]">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3E6D3] text-[#3C6E47] border border-[#EDE4D6]">
          <img src="/favicon.svg" alt="logo" className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-center font-serif-heading text-3xl font-bold tracking-tight text-[#2B2420]">
          Join the KlaSetu Guild
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-[#8A8078]">
          Support rural heritage craftspeople directly with radical transparency
        </p>

        {/* Role Toggle */}
        <div className="mt-6 flex rounded-full border border-[#EDE4D6] bg-white p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setRole("buyer")}
            className={`flex-1 rounded-full py-2.5 text-xs font-bold transition-all ${
              role === "buyer"
                ? "bg-[#3C6E47] text-white shadow-xs"
                : "text-[#8A8078] hover:text-[#2B2420]"
            }`}
          >
            I am a Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole("artisan")}
            className={`flex-1 rounded-full py-2.5 text-xs font-bold transition-all ${
              role === "artisan"
                ? "bg-[#B5652F] text-white shadow-xs"
                : "text-[#8A8078] hover:text-[#2B2420]"
            }`}
          >
            I am an Artisan / Seller
          </button>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="rounded-3xl border border-[#EDE4D6] bg-[#FFFDF9] p-8 card-shadow">
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs font-semibold text-red-700">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#2B2420] mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Maya"
                  className="w-full rounded-full border border-[#EDE4D6] bg-white px-4 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-[#2B2420] mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Sharma"
                  className="w-full rounded-full border border-[#EDE4D6] bg-white px-4 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#2B2420] mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-full border border-[#EDE4D6] bg-white px-4 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-[#2B2420] mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-full border border-[#EDE4D6] bg-white px-4 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
              />
            </div>

            {role === "artisan" && (
              <>
                <div>
                  <label className="block font-medium text-[#2B2420] mb-1">Workshop / Studio Name</label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Ganga Clay & Loom Collective"
                    className="w-full rounded-full border border-[#EDE4D6] bg-white px-4 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#2B2420] mb-1">Craft Discipline / Tradition</label>
                  <input
                    type="text"
                    required
                    value={craftDiscipline}
                    onChange={(e) => setCraftDiscipline(e.target.value)}
                    placeholder="e.g. Blue Pottery, Handloom Weaving, Dhokra Casting"
                    className="w-full rounded-full border border-[#EDE4D6] bg-white px-4 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-medium text-[#2B2420]">
                  {role === "artisan" ? "Artisan Workshop Location / Region" : "Delivery Address / City"}
                </label>
                <button
                  type="button"
                  onClick={handleFetchLocation}
                  disabled={fetchingLocation}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3C6E47] hover:underline"
                >
                  <MapPin size={12} />
                  <span>{fetchingLocation ? "Detecting GPS..." : "Auto-detect GPS"}</span>
                </button>
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={role === "artisan" ? "e.g. Khurja, Uttar Pradesh" : "e.g. Bandra West, Mumbai"}
                className="w-full rounded-full border border-[#EDE4D6] bg-white px-4 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-[#2B2420] mb-1">Contact Phone (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-full border border-[#EDE4D6] bg-white px-4 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-white shadow-md transition-all active:scale-98 disabled:opacity-60 ${
                role === "artisan" ? "bg-[#B5652F] hover:bg-[#9B5324]" : "bg-[#3C6E47] hover:bg-[#2F5838]"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>{role === "artisan" ? "Create Artisan Studio Account" : "Create Buyer Account"}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-[#EDE4D6] pt-6 text-center text-xs text-[#8A8078]">
            <span>Already registered? </span>
            <Link to="/login" className="font-bold text-[#B5652F] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
