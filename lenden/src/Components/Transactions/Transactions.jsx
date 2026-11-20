"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  History,
  RefreshCw,
  Wallet,
  Banknote,
  ShoppingBag,
  Smartphone,
} from "lucide-react";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Transactions
  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/backend/transactions", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch transactions");
      }

      setTransactions(data.data || []);
      setError("");
    } catch (err) {
      console.log(err);
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadTransactions = async () => {
      await fetchTransactions();
    };

    loadTransactions();
  }, []);

  // Refresh
  const handleRefresh = async () => {
    setLoading(true);
    await fetchTransactions();
  };

  // Format Date
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Transaction Type Configuration
  const getTransactionInfo = (item) => {
    const type = (item.type || "").toLowerCase().replace(/[\s_-]/g, "");

    if (type.includes("addmoney") || type.includes("deposit")) {
      return {
        icon: ArrowDownLeft,
        color: "bg-green-50 text-green-600",
        amountColor: "text-green-600",
        statusColor: "bg-green-50 text-green-600",
        sign: "+",
        label: "Received",
        description: `From: ${item.accountNumber || item.senderNumber || "N/A"}`,
      };
    }

    if (type.includes("sendmoney") || type.includes("transfer")) {
      return {
        icon: ArrowUpRight,
        color: "bg-red-50 text-red-500",
        amountColor: "text-red-500",
        statusColor: "bg-red-50 text-red-600",
        sign: "-",
        label: "Sent",
        description: `To: ${item.recipientNumber || "N/A"}`,
      };
    }

    if (type.includes("cashout") || type.includes("withdraw")) {
      return {
        icon: Banknote,
        color: "bg-orange-50 text-orange-600",
        amountColor: "text-red-500",
        statusColor: "bg-orange-50 text-orange-600",
        sign: "-",
        label: "Withdrawn",
        description: `Agent: ${item.agentNumber || item.recipientNumber || "N/A"}`,
      };
    }

    if (
      type.includes("mobilerecharge") ||
      type.includes("recharge") ||
      type.includes("topup")
    ) {
      return {
        icon: Smartphone,
        color: "bg-blue-50 text-blue-600",
        amountColor: "text-red-500",
        statusColor: "bg-blue-50 text-blue-600",
        sign: "-",
        label: "Recharged",
        description: `Mobile: ${item.mobileNumber || item.recipientNumber || "N/A"}`,
      };
    }

    if (type.includes("payment") || type.includes("pay")) {
      return {
        icon: ShoppingBag,
        color: "bg-purple-50 text-purple-600",
        amountColor: "text-red-500",
        statusColor: "bg-purple-50 text-purple-600",
        sign: "-",
        label: "Paid",
        description: `To: ${item.merchantName || item.recipientName || "Merchant"}`,
      };
    }

    return {
      icon: Wallet,
      color: "bg-gray-100 text-gray-600",
      amountColor: "text-gray-700",
      statusColor: "bg-gray-100 text-gray-600",
      sign: "",
      label: "Transaction",
      description: "Transaction details",
    };
  };

  // Status Configuration
  const getStatusStyle = (status) => {
    switch ((status || "completed").toLowerCase()) {
      case "completed":
      case "success":
        return "bg-green-50 text-green-600";

      case "pending":
        return "bg-yellow-50 text-yellow-600";

      case "failed":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-3">
              <History className="text-purple-700" size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Transaction History
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Keep track of your money activities.
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50 disabled:opacity-50"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Transaction Count */}
        <div className="mb-5 flex items-center justify-between rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm text-gray-500">Total Transactions</p>
            <h2 className="mt-1 text-2xl font-bold text-purple-700">
              {transactions.length}
            </h2>
          </div>

          <div className="rounded-xl bg-purple-50 p-3">
            <Wallet size={25} className="text-purple-700" />
          </div>
        </div>

        {/* Transaction List */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <h2 className="font-bold text-gray-900">Recent Transactions</h2>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="loading loading-spinner loading-lg text-purple-600"></span>
              <p className="mt-4 text-sm text-gray-500">
                Loading transactions...
              </p>
            </div>
          ) : error ? (
            /* Error */
            <div className="py-16 text-center">
              <p className="text-sm text-red-500">{error}</p>

              <button
                onClick={handleRefresh}
                className="mt-4 rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700"
              >
                Try Again
              </button>
            </div>
          ) : transactions.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="rounded-full bg-purple-50 p-5">
                <History size={35} className="text-purple-400" />
              </div>

              <h3 className="mt-4 font-bold text-gray-800">
                No Transactions Yet
              </h3>

              <p className="mt-2 text-center text-sm text-gray-500">
                Your transaction history will appear here.
              </p>
            </div>
          ) : (
            /* Transactions */
            <div className="divide-y divide-gray-100">
              {transactions.map((item, index) => {
                const info = getTransactionInfo(item);
                const Icon = info.icon;

                return (
                  <div
                    key={item._id || index}
                    className="flex items-center justify-between gap-3 p-5 transition hover:bg-purple-50/40"
                  >
                    {/* Left Side */}
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={`shrink-0 rounded-xl p-3 ${info.color}`}>
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-gray-900">
                          {item.type || "Transaction"}
                        </h3>

                        <p className="mt-1 truncate text-xs text-gray-500">
                          {info.description}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {item.createdAt
                            ? formatDate(item.createdAt)
                            : "Date unavailable"}
                        </p>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="shrink-0 text-right">
                      <p className={`font-bold ${info.amountColor}`}>
                        {info.sign} ৳{" "}
                        {Number(item.amount || 0).toLocaleString("en-BD")}
                      </p>

                      <span
                        className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(item.status)}`}
                      >
                        {item.status || "Completed"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
