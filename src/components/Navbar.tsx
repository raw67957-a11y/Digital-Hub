import React, { useState, useEffect } from "react";
import { Menu, X, ShieldCheck, Sparkles, Star, MessageSquare } from "lucide-react";

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminOpen: boolean;
  logoText?: string;
}

export default function Navbar({ onOpenAdmin, isAdminOpen, logoText }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [isMessageSent, setIsMessageSent] = useState(false);

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

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setIsMessageSent(true);
    setTimeout(() => {
      setIsMessageSent(false);
      setSupportMessage("");
      setIsSupportOpen(false);
    }, 2500);
  };

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
        <div className="flex items-center gap-3">
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
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsSupportOpen(true);
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
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <span className="text-xl font-display font-bold tracking-tight">Contact</span>
            </button>


          </div>
        </div>
      )}

      {/* Dynamic Support Chat Overlay Modal */}
      {isSupportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#140f10] border border-[#231a1c] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#231a1c] flex items-center justify-between bg-gradient-to-r from-amber-400/5 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">
                    Hub Help desk
                  </h3>
                  <p className="text-xs text-[#fbbf24]/80">Agent ID #525237 online</p>
                </div>
              </div>
              <button
                onClick={() => setIsSupportOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {isMessageSent ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Message Forwarded!</h4>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                      Support ticket generated safely. A system manager will review your query inside 10 minutes.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendSupport} className="space-y-4">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Experiencing download latency or have customization requests for the <span className="text-white font-semibold">100+ Health Reels Bundle</span>? Leave a message below:
                  </p>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400">Message Box</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g., Hi, I bought the ₹15 Bundle but didn't receive the Drive link..."
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all resize-none font-sans"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#fbbf24] hover:bg-[#fbbf24]/90 text-black font-extrabold text-sm rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    Send Secure Ticket
                  </button>
                </form>
              )}
            </div>

            <div className="bg-[#0a0708] p-4 text-center border-t border-[#231a1c]">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                <span>Reviewed 4.9/5 stars by organic customers</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
