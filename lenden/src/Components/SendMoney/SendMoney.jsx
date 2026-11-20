"use client";

import { useEffect, useState } from "react";
import {
  Send,
  User,
  Wallet,
  ArrowLeft,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";
import Link from "next/link";

export default function SendMoney() {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [balanceLoading, setBalanceLoading] = useState(true);

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
    fetch("/api/backend/balance", {
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
      })
      .finally(() => {
        setBalanceLoading(false);
      });
  }, []);

  const quickAmounts = [500, 1000, 2000, 5000];

  // Send Money API
  const handleSendMoney = async () => {
    try {
      setLoading(true);
      setError("");

      if (Number(amount) <= 0) {
        setError("Please enter a valid amount");
        return;
      }

      const res = await fetch("/api/backend/send-money", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          recipientNumber: phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Transaction failed");
        return;
      }

      setBalance(data.balance);
      setAmount("");

      alert("Send money successfull");
    } catch (error) {
      console.log(error);
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
          <button className="rounded-full p-2 transition hover:bg-purple-100">
            <Link href="/home">
              <ArrowLeft size={22} className="text-purple-700" />
            </Link>
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Send Money</h1>
            <p className="mt-1 text-sm text-gray-500">
              Fast, secure and easy money transfer.
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
                  {balanceLoading ? (
                    <LoaderCircle size={28} className="animate-spin" />
                  ) : (
                    <>৳ {Number(balance ?? 0).toLocaleString()}</>
                  )}
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
          <div className="space-y-7 p-6 md:p-8">
            {/* Recipient */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Recipient Number
              </label>

              <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 px-4 py-4 transition focus-within:border-purple-500">
                <User size={20} className="text-purple-600" />

                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Enter Amount
              </label>

              <div className="rounded-2xl border-2 border-gray-200 p-5 text-center transition focus-within:border-purple-500">
                <p className="text-sm text-gray-400">Transfer Amount</p>

                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-purple-600">৳</span>

                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-40 bg-transparent text-center text-4xl font-bold text-gray-800 outline-none"
                  />
                </div>
              </div>

              {/* Quick Amounts */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {quickAmounts.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setAmount(String(item))}
                    className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold transition ${
                      amount === String(item)
                        ? "border-purple-600 bg-purple-600 text-white"
                        : "border-gray-200 text-gray-600 hover:border-purple-500 hover:text-purple-600"
                    }`}
                  >
                    ৳ {item.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction Summary */}
            <div className="rounded-2xl bg-purple-50 p-5">
              <div className="mb-3 flex justify-between text-sm text-gray-600">
                <span>Transfer Amount</span>
                <span>৳ {Number(amount || 0).toLocaleString()}</span>
              </div>

              <div className="mb-3 flex justify-between text-sm text-gray-600">
                <span>Transaction Fee</span>
                <span>৳ 0.00</span>
              </div>

              <div className="my-3 border-t border-purple-200" />

              <div className="flex justify-between font-bold text-gray-900">
                <span>Total Payable</span>
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

            {/* Submit Button */}
            <button
              onClick={handleSendMoney}
              disabled={loading || !amount || Number(amount) <= 0}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-700 to-purple-600 py-4 font-bold text-white shadow-lg shadow-purple-200 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={20} />
              {loading ? "Processing..." : "Send Money"}
            </button>

            {/* Security */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldCheck size={16} className="text-purple-600" />
              Your transactions are protected and secure.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
