import React, { useState } from "react";
import { Product } from "../types";
import { X, Search, Download, ShieldAlert, KeyRound, Sparkles, CheckCircle2 } from "lucide-react";

interface DownloadCenterModalProps {
  products: Product[];
  orders: any[];
  userAccesses: any[];
  onClose: () => void;
}

export default function DownloadCenterModal({
  products,
  orders,
  userAccesses,
  onClose,
}: DownloadCenterModalProps) {
  const [searchKey, setSearchKey] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);
  const [matchType, setMatchType] = useState<"order" | "pass" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setMatchedProducts([]);
    setMatchType(null);
    setHasSearched(true);

    const key = searchKey.trim().toLowerCase();
    if (!key) {
      setErrorMessage("Please enter an email, phone number, or 6-digit access ID.");
      return;
    }

    // 1. Search in userAccesses first (6-digit ID)
    const matchedPasses = userAccesses.filter(
      (ua) => ua.userId?.toString().toLowerCase() === key
    );

    if (matchedPasses.length > 0) {
      // User has a dynamic custom access pass!
      const pass = matchedPasses[0];
      if (pass.productName.toLowerCase().includes("all products") || pass.productName.toLowerCase().includes("full access")) {
        // Grant match to ALL products
        setMatchedProducts(products);
      } else {
        // Match specific product by title
        const match = products.filter((p) =>
          p.title.toLowerCase().includes(pass.productName.toLowerCase())
        );
        setMatchedProducts(match);
      }
      setMatchType("pass");
      return;
    }

    // 2. Search in orders (by email or phone number)
    const matchingOrders = orders.filter((o) => {
      const orderEmail = (o.email || "").toString().toLowerCase();
      const orderPhone = (o.phone || "").toString().toLowerCase();
      return orderEmail === key || orderPhone === key || orderPhone.includes(key) || key.includes(orderPhone);
    });

    if (matchingOrders.length > 0) {
      // Match products that are in these orders
      const matched: Product[] = [];
      matchingOrders.forEach((order) => {
        const prodMatch = products.find((p) =>
          p.title.toLowerCase().includes(order.productName.toLowerCase()) ||
          p.id === order.productId
        );
        if (prodMatch && !matched.some((m) => m.id === prodMatch.id)) {
          matched.push(prodMatch);
        }
      });

      // Special fallback: if they bought but titles don't match cleanly due to edits, show matching products by name or first product
      if (matched.length === 0) {
        // Fallback to first available product to hold customer satisfaction if they genuinely paid
        const fallbackProd = products.find(p => p.price <= matchingOrders[0].amount) || products[0];
        if (fallbackProd) matched.push(fallbackProd);
      }

      setMatchedProducts(matched);
      setMatchType("order");
    } else {
      setErrorMessage("No active paid records or complementary passes found for this search keys. Make sure you entered the same Email/Phone used while making payment.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
      
      {/* Search Center Container */}
      <div className="bg-[#0a0708] border border-[#231a1c] w-full max-w-lg rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between overflow-hidden relative shadow-2xl">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#231a1c] select-none">
          <div className="text-left">
            <h3 className="text-lg font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
              📁 Digital Download Center
            </h3>
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-0.5">
              Instant Access Retrieval (डाउनलोड सेंटर)
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 bg-[#140f10] hover:bg-white/10 text-gray-400 hover:text-white rounded-full border border-[#231a1c] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Container */}
        <div className="py-5 space-y-4 text-left">
          <p className="text-xs text-gray-300 leading-relaxed">
            Agar aapne payment kar di hai, toh apna <strong>Registered Email, Phone Number</strong> ya custom <strong>6-digit Access ID Pass</strong> daalke instantly links load karein:
          </p>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Enter Email / WhatsApp No. / 6-digit ID..."
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="w-full bg-[#140f10] border border-[#231a1c] focus:border-amber-400/50 rounded-xl px-3.5 py-3 text-white text-xs outline-none font-bold placeholder-gray-600"
              />
            </div>
            <button
              type="submit"
              className="px-4.5 bg-[#fbbf24] hover:bg-white text-black font-black text-xs rounded-xl flex items-center justify-center gap-1 transition-colors uppercase tracking-tight shadow-md cursor-pointer shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 bg-red-500/5 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-xs text-red-400 leading-normal font-sans">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-extrabold block">No Active Record Found</span>
                <p className="text-[11px] text-gray-400">{errorMessage}</p>
                <p className="text-[10px] text-amber-400 font-bold pt-1.5">
                  💡 Note: Agar Payment success hui hai par yahan link nahi dikha raha, toh payment gateway redirect setup ki vajah se ho sakta hai. Kindly WhatsApp admin at <strong>9623508876</strong> to update order manually!
                </p>
              </div>
            </div>
          )}

          {/* Success Validation Match Output */}
          {hasSearched && matchedProducts.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-[#140f10] animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-emerald-400 font-sans font-black text-xs uppercase tracking-wider select-none">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {matchType === "pass" 
                    ? "🎉 Active Access Pass Unlocked Successfully" 
                    : "🎉 Successful Paid Orders Found!"}
                </span>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {matchedProducts.map((p) => (
                  <div 
                    key={p.id}
                    className="p-3.5 bg-[#140f10] border border-[#231a1c] hover:border-amber-400/20 rounded-xl flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-black text-white truncate">{p.title}</h5>
                      <p className="text-[10px] text-gray-500 font-medium">Auto-unlocked with cloud sync</p>
                    </div>

                    {p.driveLink ? (
                      <a
                        href={p.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3.5 bg-amber-400 hover:bg-white text-black font-extrabold text-[11px] rounded-lg inline-flex items-center gap-1 uppercase transition-colors shrink-0"
                      >
                        <Download className="w-3 h-3" />
                        <span>Get File 📂</span>
                      </a>
                    ) : (
                      <span className="text-[10px] text-gray-500 bg-black px-2 py-1 rounded border border-[#231a1c] font-bold">
                        Updating Drive Folder...
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info lock stamp */}
        <div className="pt-4 border-t border-[#231a1c] flex items-center justify-between text-[10px] text-gray-500 select-none">
          <span className="flex items-center gap-1 font-sans font-bold">
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            <span>Secure Verification Hub</span>
          </span>
          <span>© 100% Automated</span>
        </div>

      </div>
    </div>
  );
}
