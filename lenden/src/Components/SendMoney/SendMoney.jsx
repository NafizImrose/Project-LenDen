"use client";

import { useEffect, useState } from "react";
import { Send, User, Wallet, ArrowLeft, ShieldCheck } from "lucide-react";

export default function SendMoney() {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
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

  //api call for sendmoney
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendMoney = async () => {
    try {
      setLoading(true);
      setError("");

      if (Number(amount) <= 0) {
        setError("Please enter a valid amount");
        return;
      }

      const res = await fetch("http://localhost:8000/send-money", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Transaction failed");
        return;
      }

      setBalance(data.balance);
      setAmount("");

      alert("Money sent successfully!");
    } catch (error) {
      console.log(error);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <button className="mb-5 flex items-center gap-2 text-gray-500 hover:text-purple-600">
            <ArrowLeft size={18} />
            Back
          </button>

          <h1 className="text-3xl font-bold text-gray-900">Send Money</h1>
          <p className="mt-2 text-gray-500">
            Fast, secure and easy money transfer.
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-purple-100/50">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-pink-500 p-7 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">Available Balance</p>
                <h2 className="mt-2 text-3xl font-bold">
                  ৳ {balance.toLocaleString()}
                </h2>
              </div>

              <div className="rounded-2xl bg-white/20 p-4">
                <Wallet size={30} />
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6 p-6 md:p-8">
            {/* Recipient */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Recipient Number
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 transition focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100">
                <User className="text-purple-600" size={20} />

                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent text-gray-800 outline-none"
                />
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Enter Amount
              </label>

              <div className="rounded-2xl border border-gray-200 p-5 text-center focus-within:border-purple-500">
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

              {/* Quick Amount */}
              <div className="mt-4 flex flex-wrap gap-3">
                {quickAmounts.map((item) => (
                  <button
                    key={item}
                    onClick={() => setAmount(String(item))}
                    className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
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

            {/* Note */}

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

            {/* Error Message */}
            {error && (
              <p className="text-center text-sm font-medium text-red-500">
                {error}
              </p>
            )}

            {/* Send Button */}
            <button
              onClick={handleSendMoney}
              disabled={loading || !amount || Number(amount) <= 0}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-700 to-pink-500 py-4 font-bold text-white shadow-lg shadow-purple-200 transition hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={20} />
              {loading ? "Processing..." : "Send Money"}
            </button>

            {/* Security */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldCheck size={16} className="text-green-500" />
              Your transactions are protected and secure.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
