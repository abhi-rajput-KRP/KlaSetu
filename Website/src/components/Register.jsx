import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";

const handleRequestLocation = () => {
  // 1. Check if the browser supports the Geolocation API
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser.');
    return;
  }

  // 2. This call triggers the native browser permission prompt
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (err) => {
      // Handle explicit denials or system errors
      switch (err.code) {
        case err.PERMISSION_DENIED:
          console.log('Permission denied. Please enable location access in your browser settings.');
          break;
        case err.POSITION_UNAVAILABLE:
          console.log('Location information is unavailable.');
          break;
        case err.TIMEOUT:
          console.log('The request to get user location timed out.');
          break;
        default:
          console.log('An unknown error occurred.');
          break;
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    }
  );
};

export default function Register() {
  const [role, setRole] = useState("buyer");
  const navigate = useNavigate();
  // useEffect(() => {
  //   handleRequestLocation();
  // }, [])
  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/profile");
  };

  return (
    <div className="flex min-h-[85vh] flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#FFFDF9]">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3E6D3] text-[#3C6E47] border border-[#EDE4D6]">
          <img src="/favicon.svg" alt="logo" />
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
            className={`flex-1 rounded-full py-2 text-xs font-bold transition-all ${role === "buyer" ? "bg-[#3C6E47] text-white shadow-xs" : "text-[#8A8078] hover:text-[#2B2420]"
              }`}
          >
            I am a Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole("artisan")}
            className={`flex-1 rounded-full py-2 text-xs font-bold transition-all ${role === "artisan" ? "bg-[#B5652F] text-white shadow-xs" : "text-[#8A8078] hover:text-[#2B2420]"
              }`}
          >
            I am an Artisan / Seller
          </button>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="rounded-3xl border border-[#EDE4D6] bg-[#FFFDF9] p-8 card-shadow">
          <form onSubmit={handleRegister} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#2B2420] mb-1">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya"
                  className="w-full rounded-full border border-[#EDE4D6] bg-white px-4 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-[#2B2420] mb-1">Last Name</label>
                <input
                  type="text"
                  required
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
                placeholder="name@example.com"
                className="w-full rounded-full border border-[#EDE4D6] bg-white px-4 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
              />
            </div>

            {role === "artisan" && (
              <div>
                <label className="block font-medium text-[#2B2420] mb-1">Craft Discipline / Tradition</label>
                <input
                  type="text"
                  placeholder="e.g. Blue Pottery, Handloom Weaving, Dhokra Casting"
                  className="w-full rounded-full border border-[#EDE4D6] bg-white px-4 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block font-medium text-[#2B2420] mb-1">Create Password</label>
              <input
                type="password"
                required
                placeholder="Minimum 8 characters"
                className="w-full rounded-full border border-[#EDE4D6] bg-white px-4 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-[#2B2420] mb-1">Address</label>
              <input
                type="text"
                required
                disabled
                placeholder="Will be Autofetched from the GPS location"
                className="w-full rounded-full border border-[#EDE4D6] bg-gray-100 px-4 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#3C6E47] py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#2F5838] active:scale-98"
            >
              <span>Create Account</span>
              <ArrowRight size={16} />
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
