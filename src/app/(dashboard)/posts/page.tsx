"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Clock,
  CheckCircle,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    await fetch(`/api/posts?id=${id}`, {
      method: "DELETE",
    });
    setLoadingId(null);
    fetchPosts();
  };

  return (
    <div className="p-6 text-white max-w-5xl mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold flex items-center gap-2 tracking-tight">
            <FileText size={24} className="text-blue-500" />
            Posts
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage scheduled and published content
          </p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {posts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-gray-500"
        >
          <FileText size={40} className="mb-3 opacity-40" />
          <p>No posts available</p>
        </motion.div>
      )}

      {/* POSTS LIST */}
      <div className="space-y-4">
        {posts.map((post: any, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.01 }}
            className="group relative p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex justify-between items-center transition-all hover:border-white/20"
          >
            {/* LEFT */}
            <div className="space-y-2 max-w-[80%]">
              <p className="font-medium text-base leading-relaxed line-clamp-2">
                {post.text}
              </p>

              <div className="flex flex-wrap gap-3 text-xs items-center">
                {/* STATUS */}
                {post.status === "pending" && (
                  <span className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-md">
                    <Clock size={12} /> Pending
                  </span>
                )}

                {post.status === "sent" && (
                  <span className="flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
                    <CheckCircle size={12} /> Sent
                  </span>
                )}

                {/* TIME */}
                {post.scheduled_at && (
                  <span className="text-gray-400">
                    {new Date(post.scheduled_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT ACTION */}
            {post.status === "pending" && (
              <button
                onClick={() => handleDelete(post.id)}
                disabled={loadingId === post.id}
                className="flex items-center gap-2 text-red-400 opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 size={16} />
                {loadingId === post.id ? "Cancelling..." : "Cancel"}
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}