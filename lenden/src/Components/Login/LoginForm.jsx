"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Wallet,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const LoginForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/home",
        rememberMe: false,
      });

      if (error) {
        alert(error.message);
        return;
      }

      console.log("Login successful:", data);

      router.push("/home");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message || "Something went wrong!");
    } finally {
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
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-lg">
            <Wallet className="h-9 w-9 text-white" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Welcome to <span className="text-purple-300">LenDen</span>
          </h1>

          <p className="mt-2 text-sm text-purple-100/70">
            Your money, your control. Log in to continue.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-8">
          <div className="mb-7">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-300" />
              <h2 className="text-2xl font-bold text-white">Sign In</h2>
            </div>

            <p className="text-sm text-purple-100/60">
              Enter your credentials to access your wallet.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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
                  className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-purple-100/40"
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-purple-100/40"
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
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-white shadow-lg shadow-purple-900/30 transition-all duration-300 hover:-translate-y-0.5 hover:from-purple-400 hover:to-pink-400 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Logging in...
                </>
              ) : (
                <>
                  Login to LenDen
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-7 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-purple-100/70">
              Do not have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-white underline decoration-purple-300 underline-offset-4 transition hover:text-purple-200"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-purple-100/60">
          <ShieldCheck className="h-4 w-4 text-purple-300" />
          Secure access powered by LenDen
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
