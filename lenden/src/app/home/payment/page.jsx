"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ShoppingBag,
  Utensils,
  Bus,
  Pill,
  Store,
  Wallet,
  ShieldCheck,
  LoaderCircle,
  ReceiptText,
} from "lucide-react";
import Link from "next/link";

const categories = [
  {
    name: "Shopping",
    icon: ShoppingBag,
    color: "bg-purple-50 text-purple-600",
  },
  { name: "Restaurant", icon: Utensils, color: "bg-orange-50 text-orange-600" },
  { name: "Transport", icon: Bus, color: "bg-blue-50 text-blue-600" },
  { name: "Pharmacy", icon: Pill, color: "bg-green-50 text-green-600" },
  { name: "Other", icon: Store, color: "bg-gray-100 text-gray-600" },
];

export default function Payment() {
  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [merchantNumber, setMerchantNumber] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const inputs = document.querySelectorAll('input[type="number"]');

    const preventScroll = (e) => {
      e.preventDefault();
    };

    inputs.forEach((input) => {
      input.addEventListener("wheel", preventScroll, { passive: false });
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("wheel", preventScroll);
      });
    };
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch("/api/backend/balance", {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok) setBalance(data.balance ?? data.data?.balance ?? 0);
      } catch (error) {
        console.error("Balance fetch error:", error);
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/backend/payment", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          merchantNumber: merchantNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Transaction failed");
        return;
      }

      setBalance(data.balance);
      setAmount("");

      alert("Payment successful");
    } catch (error) {
      console.log(error);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/home"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
          >
            <ArrowLeft size={19} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Payment</h1>
            <p className="text-sm text-gray-500">
              Pay merchants and service providers
            </p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-700 to-indigo-600 p-7 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100">Available Balance</p>
              <div className="mt-2">
                {balanceLoading ? (
                  <LoaderCircle size={22} className="animate-spin" />
                ) : (
                  <h2 className="text-3xl font-bold">
                    ৳{Number(balance).toLocaleString("en-BD")}
                  </h2>
                )}
              </div>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <Wallet size={26} />
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <ShoppingBag size={21} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Payment Details</h2>
                <p className="text-xs text-gray-500">
                  Enter merchant and payment information
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-6 p-6 md:p-8">
            {/* Category */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Payment Category
              </label>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {categories.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => setCategory(item.name)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition ${
                        category === item.name
                          ? "border-purple-500 bg-purple-50 ring-2 ring-purple-100"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <span className={`rounded-xl p-2.5 ${item.color}`}>
                        <Icon size={20} />
                      </span>
                      <span className="text-center text-xs font-medium text-gray-700">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Merchant Number */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Merchant Number
              </label>
              <input
                type="tel"
                value={merchantNumber}
                onChange={(e) => setMerchantNumber(e.target.value)}
                placeholder="Enter merchant account number"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Merchant Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Merchant / Shop Name
                <span className="ml-1 font-normal text-gray-400">
                  (Optional)
                </span>
              </label>
              <input
                type="text"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                placeholder="Enter merchant name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Payment Amount
              </label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount in BDT"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Note */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Note
                <span className="ml-1 font-normal text-gray-400">
                  (Optional)
                </span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Add a note for this payment"
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Summary */}
            <div className="rounded-2xl bg-purple-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                <ReceiptText size={17} />
                Payment Summary
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-gray-500">Category</span>
                <span className="font-medium text-gray-800">
                  {category || "Not selected"}
                </span>
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-bold text-purple-700">
                  ৳{Number(amount || 0).toLocaleString("en-BD")}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                !category ||
                !merchantNumber.trim() ||
                !amount ||
                Number(amount) <= 0
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <LoaderCircle size={18} className="animate-spin" />}
              Continue to Payment
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <ShieldCheck size={17} className="text-green-600" />
          <p className="text-xs text-gray-500">
            Your payment is protected with secure verification.
          </p>
        </div>
      </div>
    </div>
  );
}
