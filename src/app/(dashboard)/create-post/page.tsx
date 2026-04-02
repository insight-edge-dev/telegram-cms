"use client";

import { useEffect, useState } from "react";
import { parseButtons } from "@/lib/parseButtons";
import ButtonPreview from "@/components/ButtonPreview";
import ChannelSelector from "@/components/ChannelSelector";

import { motion } from "framer-motion";
import { Send, Clock, Eye, Image as ImageIcon } from "lucide-react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreatePost() {
  const [text, setText] = useState("");
  const [buttonsInput, setButtonsInput] = useState("");
  const [keyboard, setKeyboard] = useState<any[][]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  // 🆕 IMAGE
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // FETCH CHANNELS
  useEffect(() => {
    fetch("/api/channels")
      .then((res) => res.json())
      .then(setChannels);
  }, []);

  // PREVIEW BUTTONS
  const handlePreview = () => {
    const parsed = parseButtons(buttonsInput);
    setKeyboard(parsed);
  };

  // IMAGE UPLOAD
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.url) {
        setImageUrl(data.url);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload error");
    }

    setUploading(false);
  };

  // RESET
  const resetForm = () => {
    setText("");
    setButtonsInput("");
    setKeyboard([]);
    setSelectedChannels([]);
    setScheduledTime(null);
    setImageUrl(null);
  };

  // POST NOW
  const handleSend = async () => {
    if ((!text && !imageUrl) || selectedChannels.length === 0) {
      alert("Add content or image + select channel");
      return;
    }

    setLoading(true);
    setSuccessMsg("");

    try {
      await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          buttons: keyboard,
          channels: selectedChannels,
          image_url: imageUrl,
        }),
      });

      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          buttons: keyboard,
          channels: selectedChannels,
          scheduled_at: new Date().toISOString(),
          status: "sent",
          image_url: imageUrl,
          image_created_at: imageUrl ? new Date().toISOString() : null,
        }),
      });

      setSuccessMsg("Post sent successfully 🚀");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to post");
    }

    setLoading(false);
  };

  // SCHEDULE
  const handleSchedule = async () => {
    if ((!text && !imageUrl) || selectedChannels.length === 0) {
      alert("Add content or image + select channel");
      return;
    }

    if (!scheduledTime) {
      alert("Select time first");
      return;
    }

    setLoading(true);
    setSuccessMsg("");

    try {
      await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          buttons: keyboard,
          channels: selectedChannels,
          scheduled_at: scheduledTime.toISOString(),
          status: "pending",
          image_url: imageUrl,
          image_created_at: imageUrl ? new Date().toISOString() : null,
        }),
      });

      setSuccessMsg("Post scheduled successfully");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Scheduling failed");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-white space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Create Post
        </h1>
        <p className="text-gray-400 text-sm">
          Compose and publish content
        </p>
      </div>

      {/* SUCCESS */}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl"
        >
          {successMsg}
        </motion.div>
      )}

      {/* TEXT */}
      <motion.textarea
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your post..."
        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {/* IMAGE UPLOAD (CLEAN UI) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <p className="text-sm text-gray-400 flex items-center gap-2">
          <ImageIcon size={14} /> Upload Image
        </p>

        <label className="flex items-center justify-center w-full h-24 border border-dashed border-white/10 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition">
          <span className="text-gray-400 text-sm">
            {uploading ? "Uploading..." : "Click to upload image"}
          </span>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        {imageUrl && (
          <img
            src={imageUrl}
            className="mt-2 rounded-xl max-h-48 border border-white/10"
          />
        )}
      </motion.div>

      {/* BUTTON INPUT */}
      <motion.textarea
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        value={buttonsInput}
        onChange={(e) => setButtonsInput(e.target.value)}
        placeholder="Button text - https://example.com - style:green"
        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl h-32 backdrop-blur focus:ring-2 focus:ring-purple-500 outline-none"
      />

      {/* PREVIEW BTN */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={handlePreview}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2 rounded-xl"
      >
        <Eye size={16} />
        Preview Buttons
      </motion.button>

      {/* PREVIEW */}
      <div>
        <p className="text-sm text-gray-400 mb-2">Preview</p>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <ButtonPreview keyboard={keyboard} />
        </div>
      </div>

      {/* CHANNELS */}
      <div>
        <p className="text-sm text-gray-400 mb-2">Channels</p>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <ChannelSelector
            channels={channels}
            selected={selectedChannels}
            setSelected={setSelectedChannels}
          />
        </div>
      </div>

      {/* DATE */}
      <div>
        <p className="text-sm text-gray-400 mb-2">Schedule Time</p>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 w-fit">
          <Clock size={16} className="text-gray-400" />
          <DatePicker
            selected={scheduledTime}
            onChange={(date) => setScheduledTime(date)}
            showTimeSelect
            timeFormat="hh:mm aa"
            timeIntervals={1}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select date & time"
            className="bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleSend}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-xl"
        >
          <Send size={16} />
          {loading ? "Posting..." : "Post Now"}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleSchedule}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-xl"
        >
          <Clock size={16} />
          {loading ? "Scheduling..." : "Schedule"}
        </motion.button>
      </div>
    </div>
  );
}