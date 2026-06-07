import React, { useState, useEffect } from "react";
import { Product, Review, DiscountCode } from "../types";
import { X, CheckCircle, ExternalLink, Loader2 } from "lucide-react";
import { load } from "@cashfreepayments/cashfree-js";

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
  const [viewPhase, setViewPhase] = useState<'details' | 'payment'>('details');
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone) {
      alert("Please enter your mobile number to proceed.");
      return;
    }
    
    setIsProcessing(true);
    const generatedEmail = customerName ? `${customerName.replace(/\s+/g, '').toLowerCase()}@example.com` : "customer@example.com";
    try {
      const resp = await fetch("/api/cashfree-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: product.price,
          productId: product.id,
          name: customerName || "Customer",
          email: generatedEmail,
          phone: customerPhone
        })
      });
      const data = await resp.json();
      if (data.success && data.paymentSessionId) {
        if (onAddOrder) {
          onAddOrder({
            customerName: customerName || "Customer",
            email: generatedEmail,
            phone: customerPhone,
            productName: product.title,
            amount: product.price
          });
        }
        
        if (data.isDemo) {
          alert('Note: No API keys were supplied. Passing with a dummy simulation order. The user should be redirected immediately.');
          window.open("https://reelsbazaar.com/", '_blank');
        } else {
          // Open Cashfree window via JS SDK
          const cashfree = await load({
            mode: data.env === "production" ? "production" : "sandbox", 
          });
          
          cashfree.checkout({
            paymentSessionId: data.paymentSessionId,
            redirectTarget: "_blank" // _self | _blank | _top - changed to _blank to avoid iframe cookie block issues
          });
        }
      } else {
        alert("Payment initialization failed: " + (data.error || "Please try again later."));
      }
    } catch (err) {
      alert("Error connecting to payment server.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000]/95 backdrop-blur-md p-0 sm:p-4 select-none overflow-y-auto">
      
      {/* Centered High Fidelity Modal Container */}
      <div className="bg-[#0a0708] border border-[#231a1c] w-full max-w-xl h-screen sm:h-auto sm:max-h-[92vh] sm:rounded-[2rem] flex flex-col justify-between overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {/* Header matching exact user format screen heading */}
        <div className="border-b border-[#231a1c] bg-[#0a0708] py-4.5 px-6 flex items-center justify-between shrink-0 select-none">
          <span className="font-sans font-extrabold text-base md:text-lg tracking-tight text-white line-clamp-1">
            {viewPhase === 'payment' ? "Secure Payment" : product.title}
          </span>
          <button 
            onClick={() => viewPhase === 'payment' ? setViewPhase('details') : onClose()}
            className="p-1.5 bg-[#140f10] hover:bg-white/10 text-gray-400 hover:text-white rounded-full border border-[#231a1c] transition-colors"
            aria-label={viewPhase === 'payment' ? "Back" : "Close"}
          >
            {viewPhase === 'payment' ? <span className="text-xl font-bold px-1.5 pt-0.5 leading-none">←</span> : <X className="w-4 h-4" />}
          </button>
        </div>

        {viewPhase === 'details' ? (
          <>
            {/* Scrollable details view */}
            <div className="flex-grow overflow-y-auto p-5 space-y-5 text-left">
              
              {/* Product Cover image set to 16:9 ratio */}
              {product.mainVideo ? (
                <div className="w-full relative aspect-[16/9] md:aspect-video rounded-2xl overflow-hidden bg-black/40 border border-[#231a1c] shrink-0">
                  <video 
                    src={product.mainVideo}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                  />
                </div>
              ) : (
                <div className="w-full relative aspect-[16/9] rounded-2xl overflow-hidden bg-black/40 border border-[#231a1c] shrink-0">
                  <img 
                    src={product.checkoutImage || product.image} 
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Description Section */}
              <div className="space-y-4 pt-1">
                <div className="text-xs text-gray-500 uppercase tracking-widest font-black">Description</div>
                
                <div className="space-y-3 font-sans">
                  <p className="text-sm sm:text-base text-gray-300 font-medium leading-relaxed whitespace-pre-wrap">
                    {product.description || "Apni Instagram growth ko fast karne ke liye ye ultimate bundle hai 🚀"}
                  </p>
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

            {/* Bottom sticky footer for proceeding */}
            <div className="border-t border-[#231a1c] bg-[#140f10] p-4.5 flex items-center justify-between font-sans text-left shrink-0">
              <div className="flex flex-col select-none">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Amount total</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black text-white">₹{product.price}</span>
                  <span className="text-xs text-gray-500 line-through font-medium font-mono">₹{product.originalPrice}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewPhase('payment')}
                className="py-4 px-6 bg-[#fcc62c] hover:bg-[#fbbf24] cursor-pointer active:scale-95 shadow-lg shadow-amber-500/10 text-black font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-all font-sans shrink-0 uppercase"
              >
                <span>Access Now 📁</span>
                <span className="text-xs">→</span>
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleInitiatePayment} className="flex flex-col flex-1 h-full bg-[#0a0708]">
            <div className="flex-grow overflow-y-auto p-6 flex flex-col justify-center max-w-md mx-auto w-full text-left">
              <div className="text-center space-y-3 mb-10">
                <div className="mx-auto w-16 h-16 bg-[#fbbf24]/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-amber-500/20">
                  <CheckCircle className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Checkout Details</h3>
                <p className="text-sm text-gray-400 max-w-[280px] mx-auto">Please enter your details to receive instant access to {product.title}</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Kumar"
                    className="w-full bg-[#140f10] border border-[#231a1c] focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 rounded-2xl px-5 py-4 text-white outline-none text-base transition-all"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    className="w-full bg-[#140f10] border border-[#231a1c] focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 rounded-2xl px-5 py-4 text-white outline-none text-base transition-all"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                  <p className="text-[10px] text-gray-500 ml-1 mt-1 font-medium">We will send your access link to this number</p>
                </div>
              </div>
              
            </div>

            {/* Bottom sticky footer */}
            <div className="border-t border-[#231a1c] bg-[#140f10] p-4.5 sm:px-6 flex items-center justify-between font-sans text-left shrink-0">
              <div className="flex flex-col select-none">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Amount total</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black text-white">₹{product.price}</span>
                  <span className="text-xs text-gray-500 line-through font-medium font-mono">₹{product.originalPrice}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className={`py-4 px-8 sm:px-12 ${isProcessing ? "bg-amber-600/50 cursor-not-allowed" : "bg-[#fcc62c] hover:bg-[#fbbf24] cursor-pointer active:scale-95 shadow-lg shadow-amber-500/10"} text-black font-black text-sm sm:text-base rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-all font-sans shrink-0 uppercase`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Pay Now 🔒</span>
                    <span className="text-xs">→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
