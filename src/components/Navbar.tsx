import React, { useState, useEffect } from "react";
import { Menu, X, ShieldCheck, Sparkles, Star, MessageSquare } from "lucide-react";

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminOpen: boolean;
  logoText?: string;
  onOpenDownloadCenter: () => void;
}

export default function Navbar({ onOpenAdmin, isAdminOpen, logoText, onOpenDownloadCenter }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hidden admin panel activation keys
  const [showAdminTrigger, setShowAdminTrigger] = useState(() => {
    try {
      return localStorage.getItem("is_owner_secret_unlocked") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleCheckSecret = () => {
      const query = window.location.search;
      const hash = window.location.hash;
      const hasAdminQuery = query.includes("admin=true") || 
                           query.includes("key=Ashish") ||
                           hash.includes("admin") ||
                           hash.includes("ashish");
      const hasLockQuery = hash.includes("lock") || query.includes("lock");
      
      if (hasAdminQuery) {
        setShowAdminTrigger(true);
        try {
          localStorage.setItem("is_owner_secret_unlocked", "true");
        } catch (e) {}
      } else if (hasLockQuery) {
        setShowAdminTrigger(false);
        try {
          localStorage.setItem("is_owner_secret_unlocked", "false");
        } catch (e) {}
      }
    };
    handleCheckSecret();
    window.addEventListener("hashchange", handleCheckSecret);
    return () => window.removeEventListener("hashchange", handleCheckSecret);
  }, []);

  // Split logo wording for premium high-contrast coloring
  const words = (logoText || "Digital Hub").split(" ");
  const firstWord = words[0] || "Digital";
  const restWords = words.slice(1).join(" ") || "Hub";

  return (
    <header className="sticky top-0 z-50 bg-[#0a0708]/90 backdrop-blur-md border-b border-[#231a1c] py-4 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo matching design */}
        <div className="flex items-center gap-2 select-none group">
          <span className="font-display font-black text-2xl tracking-tight text-[#fbbf24] group-hover:scale-105 transition-transform duration-200">
            {firstWord} {restWords && <span className="text-white">{restWords}</span>}
          </span>
          <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse"></div>
        </div>

        {/* Right Nav Options */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Claim/Downloaded Files Center */}
          <button
            onClick={onOpenDownloadCenter}
            className="flex items-center gap-1.5 bg-[#fbbf24]/10 hover:bg-[#fbbf24] border border-[#fbbf24]/20 hover:border-amber-400 text-[#fbbf24] hover:text-black px-3 py-1.5 rounded-full select-none text-[10px] sm:text-xs font-black font-sans transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <span>📂 Get Access</span>
          </button>

          {/* ID Pill from screenshot */}
          <div className="flex items-center gap-1.5 bg-[#140f10] border border-[#231a1c] px-3 py-1.5 rounded-full select-none">
            <span className="text-[10px] sm:text-xs font-mono text-gray-500 font-medium uppercase tracking-wider">
              ID:
            </span>
            <span className="text-[11px] sm:text-xs font-mono text-[#facc15] font-bold tracking-widest bg-yellow-400/5 px-1 rounded-sm">
              525237
            </span>
          </div>

          {/* Hamburger Menu Icon */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-[#140f10] rounded-xl border border-transparent hover:border-[#231a1c]"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Slideout Mobile/Utility Drawer */}
      {isMenuOpen && (
        <div className="absolute top-[73px] left-0 right-0 bg-[#0a0708] border-b border-[#231a1c] px-4 py-6 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 z-50">
          <div className="max-w-md mx-auto flex flex-col gap-3">
            {/* Download/Access Center option card */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenDownloadCenter();
              }}
              className="w-full bg-[#140f10] border border-amber-400/30 hover:border-amber-400 hover:bg-[#1a1415] text-white py-5 px-6 rounded-[1.5rem] flex items-center gap-4 transition-all duration-200 group text-left active:scale-98"
            >
              <div className="p-1 bg-[#231a1c] rounded-lg text-amber-400 transition-colors group-hover:bg-amber-400 group-hover:text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-display font-bold tracking-tight block text-amber-400">Claim My Files</span>
                <span className="text-[10px] text-gray-500 font-medium font-sans">Get Google Drive Links instantly (डाउनलोड सेंटर)</span>
              </div>
            </button>

            {/* HOME option card */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-full bg-[#140f10] border border-[#231a1c] hover:border-amber-400/50 hover:bg-[#1a1415] text-white py-5 px-6 rounded-[1.5rem] flex items-center gap-4 transition-all duration-200 group text-left active:scale-98"
            >
              <div className="p-1 bg-[#231a1c] rounded-lg text-[#fbbf24] transition-colors group-hover:bg-amber-400 group-hover:text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="text-xl font-display font-bold tracking-tight">Home</span>
            </button>

            {/* ABOUT option card */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                // Scroll to specifications/trust block at the bottom
                const element = document.getElementById("about-section");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                }
              }}
              className="w-full bg-[#140f10] border border-[#231a1c] hover:border-amber-400/50 hover:bg-[#1a1415] text-white py-5 px-6 rounded-[1.5rem] flex items-center gap-4 transition-all duration-200 group text-left active:scale-98"
            >
              <div className="p-1 bg-[#231a1c] rounded-lg text-[#fbbf24] transition-colors group-hover:bg-amber-400 group-hover:text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <span className="text-xl font-display font-bold tracking-tight">About</span>
            </button>

            {/* CONTACT option card */}
            <a
              href="mailto:ashishrshinde15@gmail.com"
              onClick={() => setIsMenuOpen(false)}
              className="w-full bg-[#140f10] border border-[#231a1c] hover:border-amber-400/50 hover:bg-[#1a1415] text-white py-5 px-6 rounded-[1.5rem] flex items-center gap-4 transition-all duration-200 group text-left active:scale-98"
            >
              <div className="p-1 bg-[#231a1c] rounded-lg text-[#fbbf24] transition-colors group-hover:bg-amber-400 group-hover:text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <span className="text-xl font-display font-bold tracking-tight">Contact</span>
            </a>


          </div>
        </div>
      )}

    </header>
  );
}
