"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  Plus,
  ArrowLeft,
  Building2,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function AddMoney() {
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bank, setBank] = useState("");
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get logged-in user's balance
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/balance`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch balance");
        }

        return data;
      })
      .then((data) => {
        setBalance(data.balance);
      })
      .catch((error) => {
        console.log("Balance error:", error);
      });
  }, []);

  const quickAmounts = [500, 1000, 2000, 5000];

  const banks = [
    "Sonali Bank",
    "Janata Bank",
    "Agrani Bank",
    "Rupali Bank",
    "Dutch-Bangla Bank",
    "BRAC Bank",
    "Eastern Bank (EBL)",
    "The City Bank",
    "Prime Bank",
    "Bank Asia",
    "Islami Bank Bangladesh",
    "Pubali Bank",
    "United Commercial Bank (UCB)",
    "Southeast Bank",
    "Mutual Trust Bank (MTB)",
    "Standard Chartered Bank",
    "HSBC",
    "Trust Bank",
    "IFIC Bank",
    "Dhaka Bank",
  ];

  // Add Money API
  const handleAddMoney = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const enteredAmount = Number(amount);

      if (!Number.isSafeInteger(enteredAmount) || enteredAmount < 100) {
        setError("Minimum amount is ৳100");
        return;
      }

      if (!bank) {
        setError("Please select a bank");
        return;
      }

      if (!accountNumber.trim()) {
        setError("Please enter your bank account number");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/add-money`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: enteredAmount,
            bank: bank,
            accountNumber: accountNumber.trim(),
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Transaction failed");
        return;
      }

      setBalance(data.amount);

      setAmount("");
      setBank("");
      setAccountNumber("");

      alert("Money added successfully!");
    } catch (error) {
      console.log("Add money error:", error);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Link
            href="/home"
            className="rounded-full p-2 transition hover:bg-purple-100"
          >
            <ArrowLeft size={22} className="text-purple-700" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Money</h1>

            <p className="mt-1 text-sm text-gray-500">
              Add funds to your LenDen wallet.
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-purple-100/50">
          {/* Gradient Balance Header */}
          <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 p-7 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">Available Balance</p>

                <h2 className="mt-2 text-3xl font-bold">
                  ৳ {Number(balance ?? 0).toLocaleString()}
                </h2>

                <p className="mt-2 text-xs text-purple-100">
                  Your current wallet balance
                </p>
              </div>

              <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
                <Wallet size={30} />
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAddMoney} className="space-y-7 p-6 md:p-8">
            {/* Amount */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Enter Amount
              </label>

              <div className="rounded-2xl border-2 border-gray-200 p-5 text-center transition focus-within:border-purple-500">
                <p className="text-sm text-gray-400">Deposit Amount</p>

                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-purple-600">৳</span>

                  <input
                    type="number"
                    min="100"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-40 bg-transparent text-center text-4xl font-bold text-gray-800 outline-none"
                    required
                  />
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-400">Minimum amount: ৳100</p>

              {/* Quick Amounts */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {quickAmounts.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAmount(String(value))}
                    className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold transition ${
                      amount === String(value)
                        ? "border-purple-600 bg-purple-600 text-white"
                        : "border-gray-200 text-gray-600 hover:border-purple-500 hover:text-purple-600"
                    }`}
                  >
                    ৳ {value.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Bank */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Select Bank
              </label>

              <div className="relative">
                <Building2
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-purple-600"
                />

                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  required
                  className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-white py-4 pl-12 pr-12 text-gray-700 outline-none transition focus:border-purple-500"
                >
                  <option value="" disabled>
                    Choose your bank
                  </option>

                  {banks.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={20}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-purple-600"
                />
              </div>

              {bank && (
                <div className="mt-3 flex items-center gap-2 text-sm text-purple-600">
                  <CheckCircle2 size={16} />
                  <span>{bank} selected</span>
                </div>
              )}
            </div>

            {/* Account Number */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Bank Account Number
              </label>

              <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 px-4 py-4 transition focus-within:border-purple-500">
                <Wallet size={20} className="text-purple-600" />

                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter your bank account number"
                  className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                  required
                />
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Enter the account number associated with your selected bank.
              </p>
            </div>

            {/* Transaction Summary */}
            <div className="rounded-2xl bg-purple-50 p-5">
              <div className="mb-3 flex justify-between text-sm text-gray-600">
                <span>Deposit Amount</span>
                <span>৳ {Number(amount || 0).toLocaleString()}</span>
              </div>

              <div className="mb-3 flex justify-between text-sm text-gray-600">
                <span>Transaction Fee</span>
                <span>৳ 0.00</span>
              </div>

              <div className="my-3 border-t border-purple-200" />

              <div className="flex justify-between font-bold text-gray-900">
                <span>Total Deposit</span>
                <span className="text-purple-700">
                  ৳ {Number(amount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-500">
                {error}
              </p>
            )}

            {/* Security */}
            <div className="flex items-center gap-3 rounded-xl bg-purple-50 p-4">
              <ShieldCheck size={22} className="shrink-0 text-purple-600" />

              <div>
                <h3 className="text-sm font-semibold text-purple-800">
                  Secure Transaction
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-purple-600">
                  Your banking information and transactions are handled
                  securely.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-700 to-purple-600 py-4 font-bold text-white shadow-lg shadow-purple-200 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={20} />
              {loading ? "Processing..." : "Add Money"}
            </button>

            <p className="text-center text-xs text-gray-400">
              Please verify your amount and bank before proceeding.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
