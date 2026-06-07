import React, { useState } from "react";
import { Product, Review, DiscountCode } from "../types";
import { X } from "lucide-react";

interface CheckoutModalProps {
  product: Product;
  onClose: () => void;
  onAddReview: (productId: string, review: Review) => void;
  reviews: Review[];
  onAddOrder?: (order: { customerName: string; email: string; phone: string; productName: string; amount: number }) => void;
  settings?: any;
  discountCodes?: DiscountCode[];
}

function VideoCard({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative aspect-[9/16] bg-black border border-[#231a1c] rounded-xl sm:rounded-2xl overflow-hidden hover:scale-[1.03] transition-all duration-300 group shadow-md shadow-black/40">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        loop
        playsInline
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {!isPlaying && (
        <div 
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-[#0a0708] shadow-lg flex items-center justify-center transition-all group-hover:scale-110 font-bold select-none text-[11px] sm:text-xs">
            ▶
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutModal({ product, onClose, onAddReview, reviews, onAddOrder, settings, discountCodes = [] }: CheckoutModalProps) {
  const [showDemoVideos, setShowDemoVideos] = useState(true);

  const handleOpenPayment = () => {
    const targetLink = product.directLink || settings?.paymentLink || "https://reelsbazaar.com/";
    window.open(targetLink, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000]/95 backdrop-blur-md p-0 sm:p-4 select-none overflow-y-auto">
      
      {/* Centered High Fidelity Modal Container */}
      <div className="bg-[#0a0708] border border-[#231a1c] w-full max-w-xl h-screen sm:h-auto sm:max-h-[92vh] sm:rounded-[2rem] flex flex-col justify-between overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {/* Header matching exact user format screen heading */}
        <div className="border-b border-[#231a1c] bg-[#0a0708] py-4.5 px-6 flex items-center justify-between shrink-0 select-none">
          <span className="font-sans font-extrabold text-base md:text-lg tracking-tight text-white line-clamp-1">
            {product.title}
          </span>
          <button 
            onClick={onClose}
            className="p-1.5 bg-[#140f10] hover:bg-white/10 text-gray-400 hover:text-white rounded-full border border-[#231a1c] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable details view */}
        <div className="flex-grow overflow-y-auto p-5 space-y-5 text-left">
          
          {/* Product Cover image set to 16:9 ratio */}
          <div className="w-full relative aspect-[16/9] rounded-2xl overflow-hidden bg-black/40 border border-[#231a1c] shrink-0">
            <img 
              src={product.image} 
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Description Section */}
          <div className="space-y-4 pt-1">
            <div className="text-xs text-gray-500 uppercase tracking-widest font-black">Description</div>
            
            <div className="space-y-3 font-sans">
              <h4 className="text-base font-black text-white leading-tight">
                {product.title} 🔥
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 font-bold leading-relaxed">
                Apni Instagram growth ko fast karne ke liye ye ultimate bundle hai 🚀
              </p>
            </div>

            {/* Features bullet layout list with high contrast icons */}
            <div className="space-y-3 pt-3 border-t border-[#140f10]">
              <div className="flex items-center gap-2.5 text-xs sm:text-base text-gray-200">
                <span className="shrink-0 select-none text-base">🎬</span>
                <span className="font-extrabold leading-snug">5000+ High Quality Movie Edits</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-base text-gray-200">
                <span className="shrink-0 select-none text-base">🌍</span>
                <span className="font-extrabold leading-snug font-sans">Hollywood + Bollywood + South Content</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-base text-gray-200">
                <span className="shrink-0 select-none text-base">✅</span>
                <span className="font-extrabold leading-snug">100% Non-Copyright (Safe to Use)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-base text-gray-200 font-sans">
                <span className="shrink-0 select-none text-base">🔥</span>
                <span className="font-extrabold leading-snug">Millions Views wale Viral Edits</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-base text-gray-200 font-sans">
                <span className="shrink-0 select-none text-base">⚡</span>
                <span className="font-extrabold leading-snug">Ready-to-Use (No Editing Needed)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-base font-extrabold text-[#facc15] font-sans">
                <span className="shrink-0 select-none text-base">⏳</span>
                <span>Save Time  •  📈 Grow Fast  •  🚀 Go Viral</span>
              </div>
            </div>
          </div>

          {/* Demo Reels Videos Trigger Option */}
          <div className="border border-[#231a1c] rounded-2xl bg-[#140f10] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowDemoVideos(!showDemoVideos)}
              className="w-full py-3.5 px-4 flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider outline-none select-none hover:bg-white/[0.02] transition-colors"
            >
              <span className="flex items-center gap-1.5 text-amber-500">
                🎬 <span className="text-white">Watch Sample Previews</span>
              </span>
              <span className="text-[10px] text-gray-500 font-mono font-bold">
                {showDemoVideos ? "Hide Previews ▲" : "Show 3 Demo Clips ▼"}
              </span>
            </button>

            {showDemoVideos && (
              <div className="p-3 border-t border-[#231a1c] bg-black/40 animate-in fade-in duration-300">
                <div className="grid grid-cols-3 gap-2">
                  <VideoCard src={product.demoVideo1 || settings?.video1} />
                  <VideoCard src={product.demoVideo2 || settings?.video2} />
                  <VideoCard src={product.demoVideo3 || settings?.video3} />
                </div>
                <div className="text-[10px] text-gray-600 text-center mt-2.5 font-mono">
                  Click short clip to play audio + preview
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Bottom sticky footer: Screenshot 1 Style */}
        <div className="border-t border-[#231a1c] bg-[#140f10] p-4.5 flex items-center justify-between shrink-0 font-sans text-left">
          <div className="flex flex-col select-none">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Amount total</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-white">₹{product.price}</span>
              <span className="text-xs text-gray-500 line-through font-medium font-mono">₹{product.originalPrice}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenPayment}
            className="py-4 px-6 bg-[#fcc62c] hover:bg-[#fbbf24] text-black font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-500/10 font-sans shrink-0 uppercase cursor-pointer"
          >
            <span>Access Now 📁</span>
            <span className="text-xs">→</span>
          </button>
        </div>

      </div>
    </div>
  );
}
