"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusSquare,
  Layers,
  FileText,
} from "lucide-react";

const links = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Create Post", href: "/create-post", icon: PlusSquare },
  { name: "Channels", href: "/channels", icon: Layers },
  { name: "Posts", href: "/posts", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full border-r border-white/10 bg-white/5 backdrop-blur-xl flex flex-col">
      
      {/* LOGO */}
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-lg font-semibold tracking-tight">
          Telegram CMS
        </h1>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                pathname === link.href
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER (OPTIONAL CLEAN TOUCH) */}
      <div className="px-6 py-4 border-t border-white/10 text-xs text-gray-500">
        v1.0
      </div>
    </aside>
  );
}