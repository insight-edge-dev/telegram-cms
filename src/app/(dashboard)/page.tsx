"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Clock, CheckCircle } from "lucide-react";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    sent: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats", { cache: "no-store" });
      const data = await res.json();

      setStats(data);
      setLoading(false);
    } catch (err) {
      console.error("Stats fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchStats();

    // 🔥 auto refresh (real-time feel)
    const interval = setInterval(fetchStats, 4000);

    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      label: "Total Posts",
      value: stats.total,
      icon: <FileText size={22} />,
      color: "from-blue-500 to-purple-600",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: <Clock size={22} />,
      color: "from-yellow-400 to-orange-500",
    },
    {
      label: "Sent",
      value: stats.sent,
      icon: <CheckCircle size={22} />,
      color: "from-green-400 to-emerald-600",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-400 text-sm">
          Overview of your automation system
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
          >
            {/* gradient glow */}
            <div
              className={`absolute inset-0 opacity-20 bg-gradient-to-r ${card.color}`}
            />

            <div className="relative z-10 flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">
                  {card.label}
                </p>

                {/* 🔥 animated number */}
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={card.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="text-3xl font-bold mt-1"
                  >
                    {loading ? "--" : card.value}
                  </motion.h2>
                </AnimatePresence>
              </div>

              <div className="text-white/70">
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}