import React from "react";
import { Product } from "../types";
import { Sparkles, Download, CheckCircle2, Copy, ExternalLink, X } from "lucide-react";

interface PaymentSuccessModalProps {
  product: Product;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onClose: () => void;
}

export default function PaymentSuccessModal({
  product,
  customerName,
  customerEmail,
  customerPhone,
  onClose,
}: PaymentSuccessModalProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    if (product.driveLink) {
      navigator.clipboard.writeText(product.driveLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenFolder = () => {
    if (product.driveLink) {
      window.open(product.driveLink, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
      
      {/* Outer Glow Card */}
      <div className="relative w-full max-w-lg bg-[#0a0708] border-2 border-amber-400 rounded-[2.5rem] p-6 sm:p-8 text-center space-y-6 shadow-[0_0_50px_rgba(251,191,36,0.25)] overflow-hidden">
        
        {/* Background decorative lights */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button top-right */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 bg-[#140f10] border border-[#231a1c] hover:border-amber-400 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
          title="Close window"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Sparkling Success Badge */}
        <div className="mx-auto w-16 h-16 bg-amber-400/10 border border-amber-400/30 rounded-full flex items-center justify-center text-amber-400 animate-pulse">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest bg-amber-500/5 border border-amber-500/10 px-3 py-1 rounded-full">
            Payment Verified & Approved 🎉
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight leading-none pt-1">
            Congratulations {customerName || "Customer"}!
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            Your payment was successfully approved by the gateway.
          </p>
        </div>

        {/* Product Access details box */}
        <div className="bg-[#140f10] border border-[#231a1c] rounded-2xl p-4 text-left space-y-3">
          <div className="flex gap-3 items-center">
            <img 
              src={product.image} 
              alt={product.title} 
              referrerPolicy="no-referrer"
              className="w-16 h-12 object-cover rounded-lg border border-[#231a1c]"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">PURCHASED PRODUCT</span>
              <h4 className="text-xs sm:text-sm font-black text-white truncate">{product.title}</h4>
              <span className="text-[10px] font-mono font-bold text-amber-400">₹{product.price} • Lifetime Access</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#231a1c] space-y-1 text-[11px] text-gray-400">
            <div className="flex justify-between">
              <span>Billing Email:</span>
              <span className="font-mono text-white select-all">{customerEmail || "N/A"}</span>
            </div>
            {customerPhone && (
              <div className="flex justify-between">
                <span>WhatsApp No:</span>
                <span className="font-mono text-white select-all">{customerPhone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Prominent Drive Link Claim Button */}
        <div className="space-y-3">
          {product.driveLink ? (
            <>
              <button
                onClick={handleOpenFolder}
                className="w-full py-4 bg-[#fbbf24] hover:bg-white text-black font-black sm:text-base text-sm rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-amber-500/15 cursor-pointer uppercase tracking-tight"
              >
                <Download className="w-5 h-5 shrink-0" />
                <span>Access Google Drive Folder 📂</span>
              </button>

              <div className="flex justify-between items-center px-2">
                <button
                  onClick={handleCopyLink}
                  className="text-[10px] sm:text-xs text-amber-400 hover:text-white flex items-center gap-1 transition-colors font-bold select-none cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? "Link Copied! ✓" : "Copy Drive Link"}</span>
                </button>

                <span className="text-[9px] text-gray-600 font-mono">
                  Link secures on your Device
                </span>
              </div>
            </>
          ) : (
            <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-xs text-amber-400 leading-relaxed font-medium">
              ⚠️ Admin is currently updating this specific item's Drive link file folder. Please contact customer help at <strong>9623508876</strong> to claim manually with your order receipt copy!
            </div>
          )}
        </div>

        {/* Reassuring note */}
        <div className="pt-2 border-t border-[#140f10] text-[10px] text-gray-500 leading-normal font-sans">
          A copy of this folder has been unlocked. If you refresh or close this screen, you can always retrieve your link inside the **"Retrieve Access"** option on our homepage anytime using your email.
        </div>

      </div>
    </div>
  );
}
