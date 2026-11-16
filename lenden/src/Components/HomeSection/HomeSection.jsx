"use client";

import {
  Wallet,
  ShieldCheck,
  Zap,
  ArrowLeftRight,
  Sparkles,
} from "lucide-react";

export default function HomeSection() {
  return (
    <main className="min-h-screen bg-base-200 px-5 py-10 md:px-10">
      {/* Welcome Hero */}
      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-950 px-7 py-14 text-white shadow-xl md:px-14 md:py-20">
        {/* Decorative Circles */}
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-purple-400/20 blur-2xl" />
        <div className="absolute -bottom-32 right-40 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative z-10 grid items-center gap-12 md:grid-cols-2">
          {/* Welcome Text */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
              <Sparkles size={16} />
              Welcome to LenDen
            </div>

            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Your Money,
              <br />
              Your Control.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-purple-100 md:text-lg">
              Experience a smarter way to manage your money. Simple, secure, and
              seamless digital transactions — all in one place.
            </p>

            <div className="mt-8 flex items-center gap-3 text-sm font-medium text-purple-200">
              <ShieldCheck size={20} />
              Your trusted digital wallet experience
            </div>
          </div>

          {/* Wallet Illustration */}
          <div className="flex justify-center">
            <div className="relative flex h-64 w-64 items-center justify-center md:h-80 md:w-80">
              <div className="absolute inset-0 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm" />

              <div className="absolute inset-7 rounded-full border border-white/10" />

              <div className="relative flex h-48 w-64 rotate-[-8deg] flex-col justify-between rounded-2xl border border-white/30 bg-gradient-to-br from-white/30 to-white/5 p-5 shadow-2xl backdrop-blur-xl md:h-56 md:w-72">
                <div className="flex items-center justify-between">
                  <Wallet size={32} />
                  <span className="text-sm font-semibold tracking-widest">
                    LENDEN
                  </span>
                </div>

                <div>
                  <p className="text-xs text-purple-100">DIGITAL WALLET</p>
                  <div className="mt-3 flex gap-2">
                    <div className="h-1.5 w-8 rounded-full bg-white/70" />
                    <div className="h-1.5 w-8 rounded-full bg-white/70" />
                    <div className="h-1.5 w-8 rounded-full bg-white/70" />
                    <div className="h-1.5 w-8 rounded-full bg-white/70" />
                  </div>
                </div>

                <div className="flex justify-between text-xs text-purple-100">
                  <span>SMART PAYMENTS</span>
                  <span>01 / 26</span>
                </div>
              </div>

              <div className="absolute right-0 top-5 rounded-xl border border-white/20 bg-white/15 p-3 shadow-lg backdrop-blur-lg">
                <ShieldCheck size={28} />
              </div>

              <div className="absolute bottom-5 left-0 rounded-xl border border-white/20 bg-white/15 p-3 shadow-lg backdrop-blur-lg">
                <ArrowLeftRight size={28} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto mt-16 max-w-6xl">
        <div className="mb-9 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            Everything You Need,
            <span className="text-purple-600"> In One Place.</span>
          </h2>

          <p className="mt-3 text-sm text-base-content/60 md:text-base">
            Making everyday financial activities easier and smarter.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-2xl border border-base-300 bg-base-100 p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
              <Zap size={28} />
            </div>

            <h3 className="text-lg font-bold">Lightning Fast</h3>

            <p className="mt-3 text-sm leading-6 text-base-content/60">
              Enjoy quick and seamless money transfers whenever you need them.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl border border-base-300 bg-base-100 p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <ShieldCheck size={28} />
            </div>

            <h3 className="text-lg font-bold">Safe & Secure</h3>

            <p className="mt-3 text-sm leading-6 text-base-content/60">
              Your financial information deserves protection and privacy.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl border border-base-300 bg-base-100 p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-700">
              <ArrowLeftRight size={28} />
            </div>

            <h3 className="text-lg font-bold">Easy Transactions</h3>

            <p className="mt-3 text-sm leading-6 text-base-content/60">
              Manage your everyday financial activities with a simple and
              friendly experience.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Tagline */}
      <section className="mx-auto mt-16 max-w-6xl pb-8 text-center">
        <div className="h-px w-full bg-base-300" />

        <p className="mt-8 text-sm font-medium text-base-content/50">
          LenDen — Making Money Management Simpler.
        </p>
      </section>
    </main>
  );
}
