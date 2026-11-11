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

  useEffect(() => {
    fetch("http://localhost:8000/balance")
      .then((res) => res.json())
      .then((data) => {
        setBalance(data.balance);
      })
      .catch((error) => {
        console.log(error);
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
  const [error, setError] = useState("");

  const handleAddMoney = async (e) => {
    e.preventDefault();

    if (Number(amount) < 100) {
      alert("Minimum amount is ৳100");
      return;
    }

    if (!bank) {
      alert("Please select a bank");
      return;
    }

    const res = await fetch("http://localhost:8000/add-money", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Transaction failed");
      return;
    }

    setBalance(data.Balance); // Fixed
    setAmount("");
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button className="p-2 rounded-full hover:bg-gray-200 transition">
            <Link href="/home">
              <ArrowLeft size={22} className="text-gray-700" />
            </Link>
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Add Money</h1>
            <p className="text-sm text-gray-500">
              Add funds to your Lenden wallet
            </p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white mb-7 shadow-lg">
          <div className="flex items-center gap-2 text-purple-100 mb-3">
            <Wallet size={20} />
            <span className="text-sm">Available Balance</span>
          </div>

          <h2 className="text-3xl font-bold">৳ {balance}</h2>

          <p className="text-sm text-purple-100 mt-2">
            Your current wallet balance
          </p>
        </div>

        {/* Add Money Form */}
        <form
          onSubmit={handleAddMoney}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          {/* Amount */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Enter Amount
            </label>

            <div className="flex items-center border-2 border-gray-200 focus-within:border-purple-500 rounded-xl px-4 py-4 transition">
              <span className="text-2xl font-bold text-gray-500 mr-3">৳</span>

              <input
                type="number"
                min="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full outline-none text-2xl font-bold text-gray-800"
                required
              />
            </div>

            <p className="text-xs text-gray-400 mt-2">Minimum amount: ৳100</p>

            {/* Quick Amounts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(String(value))}
                  className={`py-3 rounded-xl border font-semibold text-sm transition ${
                    amount === String(value)
                      ? "bg-purple-600 text-white border-purple-600"
                      : "border-gray-200 text-gray-600 hover:border-purple-500 hover:text-purple-600"
                  }`}
                >
                  ৳{value}
                </button>
              ))}
            </div>
          </div>

          {/* Select Bank */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Bank
            </label>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Building2 size={20} className="text-purple-600" />
              </div>

              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                required
                className="w-full appearance-none pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-700 outline-none focus:border-purple-500 transition cursor-pointer"
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

              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown size={20} className="text-gray-500" />
              </div>
            </div>

            {bank && (
              <div className="flex items-center gap-2 mt-3 text-sm text-purple-600">
                <CheckCircle2 size={16} />
                <span>{bank} selected</span>
              </div>
            )}
          </div>

          {/* Bank Account Number */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Bank Account Number
            </label>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Wallet size={20} className="text-purple-600" />
              </div>

              <input
                type="text"
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter your bank account number"
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 outline-none focus:border-purple-500 transition text-gray-700"
                required
              />
            </div>

            <p className="text-xs text-gray-400 mt-2">
              Enter the account number associated with your selected bank.
            </p>
          </div>

          {/* Security Info */}
          <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl mb-7">
            <ShieldCheck size={22} className="text-purple-600 shrink-0" />

            <div>
              <h3 className="text-sm font-semibold text-purple-800">
                Secure Transaction
              </h3>

              <p className="text-xs text-purple-600 mt-1 leading-relaxed">
                Your banking information and transactions are handled securely.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-xl transition shadow-md"
          >
            <Plus size={20} />
            Add Money
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Please verify your amount and bank before proceeding.
          </p>
        </form>
      </div>
    </div>
  );
}
