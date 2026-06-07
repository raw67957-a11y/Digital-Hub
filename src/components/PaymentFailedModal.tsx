import React from "react";
import { Product } from "../types";
import { XCircle, RefreshCw, X } from "lucide-react";

interface PaymentFailedModalProps {
  product: Product;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onRetry: () => void;
  onClose: () => void;
}

export default function PaymentFailedModal({
  product,
  customerName,
  customerEmail,
  customerPhone,
  onRetry,
  onClose,
}: PaymentFailedModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#0a0708] border-2 border-red-500/50 rounded-[2.5rem] p-6 sm:p-8 text-center space-y-6 shadow-[0_0_50px_rgba(239,68,68,0.15)] overflow-hidden">
        
        {/* Background decorative lights */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 bg-[#140f10] border border-[#231a1c] hover:border-red-500 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
          title="Close window"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mx-auto w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center text-red-500">
          <XCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] text-red-400 font-extrabold uppercase tracking-widest bg-red-500/5 border border-red-500/10 px-3 py-1 rounded-full">
            Payment Not Successful
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight leading-none pt-1">
            Oops, {customerName || "Customer"}!
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            Your payment could not be processed completely or was cancelled.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <button
            onClick={onRetry}
            className="w-full py-4 bg-white hover:bg-gray-200 text-black font-black sm:text-base text-sm rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer uppercase tracking-tight"
          >
            <RefreshCw className="w-5 h-5 shrink-0" />
            <span>Pay Again</span>
          </button>
        </div>

        <div className="pt-2 border-t border-[#140f10] text-[10px] text-gray-500 leading-normal font-sans">
          If money was deducted, it will be refunded automatically by your bank within 5-7 working days.
        </div>
      </div>
    </div>
  );
}
