import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Lock, Mail, ArrowRight, Sparkles } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/profile");
  };

  return (
    <div className="flex min-h-[80vh] flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#FFFDF9]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3E6D3] text-[#3C6E47] border border-[#EDE4D6] shadow-xs">
          <img src="/favicon.svg" alt="logo" />
        </div>
        <h2 className="mt-4 text-center font-serif-heading text-3xl font-bold tracking-tight text-[#2B2420]">
          Welcome back to KlaSetu
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-[#8A8078]">
          Sign in to access your craft orders and saved artisan collections
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-[#EDE4D6] bg-[#FFFDF9] p-8 card-shadow">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#2B2420]">
                Email Address
              </label>
              <div className="mt-1.5 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-full border border-[#EDE4D6] bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                />
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8078]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-bold text-[#2B2420]">
                  Password
                </label>
              </div>
              <div className="mt-1.5 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-full border border-[#EDE4D6] bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                />
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8078]" />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#3C6E47] py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#2F5838] active:scale-98"
            >
              <span>Sign In to Account</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6 border-t border-[#EDE4D6] pt-6 text-center text-xs text-[#8A8078]">
            <span>Don't have an account yet? </span>
            <Link to="/register" className="font-bold text-[#B5652F] hover:underline">
              Join as Buyer or Artisan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
