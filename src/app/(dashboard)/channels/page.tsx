"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Tv } from "lucide-react";

export default function ChannelsPage() {
  const [channels, setChannels] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  // FETCH CHANNELS
  const fetchChannels = async () => {
    const res = await fetch("/api/channels");
    const data = await res.json();
    setChannels(data);
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  // ADD CHANNEL
  const addChannel = async () => {
    if (!name || !username) return alert("Fill all fields");

    setLoading(true);

    await fetch("/api/channels", {
      method: "POST",
      body: JSON.stringify({ name, username }),
    });

    setName("");
    setUsername("");
    setLoading(false);
    fetchChannels();
  };

  // DELETE CHANNEL
  const deleteChannel = async (id: string) => {
    await fetch("/api/channels", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    fetchChannels();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 text-white">
      
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Tv className="text-blue-500" size={22} />
        <h1 className="text-2xl font-semibold tracking-tight">
          Channels
        </h1>
      </div>

      {/* ADD FORM */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl space-y-4 shadow-lg"
      >
        <input
          placeholder="Channel Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          placeholder="@channelusername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={addChannel}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 rounded-xl hover:opacity-90 transition"
        >
          <Plus size={16} />
          {loading ? "Adding..." : "Add Channel"}
        </button>
      </motion.div>

      {/* CHANNEL LIST */}
      <div className="space-y-3">
        {channels.map((ch, i) => (
          <motion.div
            key={ch.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex justify-between items-center bg-white/5 border border-white/10 backdrop-blur-xl p-4 rounded-2xl hover:bg-white/10 transition"
          >
            <div>
              <p className="font-medium">{ch.name}</p>
              <p className="text-sm text-gray-400">{ch.username}</p>
            </div>

            <button
              onClick={() => deleteChannel(ch.id)}
              className="flex items-center gap-1 text-red-400 hover:text-red-500 transition"
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}