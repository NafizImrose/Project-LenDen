"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Wallet,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const RegisterForm = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = () => {
    if (!password) return 0;

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const strength = passwordStrength();

  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email(
        {
          name,
          email,
          password,
          callbackURL: "/login",
        },
        {
          onRequest: () => {
            setLoading(true);
          },

          onSuccess: () => {
            setLoading(false);
            router.push("/login");
          },

          onError: (ctx) => {
            setLoading(false);
            alert(ctx.error.message);
          },
        },
      );

      if (error) {
        setLoading(false);
        alert(error.message);
        return;
      }

      console.log("Registration successful:", data);
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.message || "Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#1e1045] via-[#35116b] to-[#641b83] px-4 py-10">
      {/* Background Decorations */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-pink-500/20 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-lg">
            <Wallet className="h-9 w-9 text-white" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Join <span className="text-purple-300">LenDen</span>
          </h1>

          <p className="mt-2 text-sm text-purple-100/70">
            Create your account and take control of your money.
          </p>
        </div>

        {/* Register Card */}
        <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-8">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-300" />
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
            </div>

            <p className="text-sm text-purple-100/60">
              Fill in your details to get started.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Full Name
              </label>

              <div className="group flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 transition-all duration-300 focus-within:border-purple-300 focus-within:bg-white/15 focus-within:ring-2 focus-within:ring-purple-400/30">
                <User className="h-5 w-5 shrink-0 text-purple-200/70 transition-colors group-focus-within:text-purple-300" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-purple-100/40"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Email Address
              </label>

              <div className="group flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 transition-all duration-300 focus-within:border-purple-300 focus-within:bg-white/15 focus-within:ring-2 focus-within:ring-purple-400/30">
                <Mail className="h-5 w-5 shrink-0 text-purple-200/70 transition-colors group-focus-within:text-purple-300" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-purple-100/40"
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Mobile Number
              </label>

              <div className="group flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 transition-all duration-300 focus-within:border-purple-300 focus-within:bg-white/15 focus-within:ring-2 focus-within:ring-purple-400/30">
                <Phone className="h-5 w-5 shrink-0 text-purple-200/70 transition-colors group-focus-within:text-purple-300" />

                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter your mobile number"
                  autoComplete="tel"
                  required
                  className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-purple-100/40"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Password
              </label>

              <div className="group flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 transition-all duration-300 focus-within:border-purple-300 focus-within:bg-white/15 focus-within:ring-2 focus-within:ring-purple-400/30">
                <Lock className="h-5 w-5 shrink-0 text-purple-200/70 transition-colors group-focus-within:text-purple-300" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-purple-100/40"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="shrink-0 text-purple-200/70 transition hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Password Strength */}
              {password.length > 0 && (
                <div className="mt-3">
                  <div className="mb-2 flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          strength >= level
                            ? strength <= 1
                              ? "bg-red-400"
                              : strength <= 2
                                ? "bg-yellow-400"
                                : strength === 3
                                  ? "bg-blue-400"
                                  : "bg-green-400"
                            : "bg-white/15"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="flex items-center gap-1 text-xs text-purple-100/70">
                    {strength === 4 ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                        Strong password
                      </>
                    ) : strength >= 2 ? (
                      "Good password — add more variety"
                    ) : (
                      "Use at least 8 characters, numbers and symbols"
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-white shadow-lg shadow-purple-900/30 transition-all duration-300 hover:-translate-y-0.5 hover:from-purple-400 hover:to-pink-400 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 border-t border-white/10 pt-5 text-center">
            <p className="text-sm text-purple-100/70">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-white underline decoration-purple-300 underline-offset-4 transition hover:text-purple-200"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-purple-100/60">
          <ShieldCheck className="h-4 w-4 text-purple-300" />
          Your information is protected by LenDen
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
