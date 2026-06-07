import React, { useState } from "react";
import { Product, Review, OrderForm } from "../types";
import { 
  X, CheckCircle, ShieldCheck, Mail, Phone, User, 
  ArrowRight, Star, ShoppingBag, Download, ArrowLeft, RefreshCw, Sparkles 
} from "lucide-react";

interface CheckoutModalProps {
  product: Product;
  onClose: () => void;
  onAddReview: (productId: string, review: Review) => void;
  reviews: Review[];
  onAddOrder?: (order: { customerName: string; email: string; phone: string; productName: string; amount: number }) => void;
  settings?: any;
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

export default function CheckoutModal({ product, onClose, onAddReview, reviews, onAddOrder, settings }: CheckoutModalProps) {
  // Tabs: 'details' | 'reviews' | 'checkout'
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'checkout'>('details');
  const [formData, setFormData] = useState<OrderForm>({ name: "", email: "", phone: "" });
  const [showBillingForm, setShowBillingForm] = useState(false);
  
  // Checkout states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [openedInNewTab, setOpenedInNewTab] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [currentOrderData, setCurrentOrderData] = useState<any>(null);
  const pollingIntervalRef = React.useRef<any>(null);

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const startPollingPaymentStatus = (orderId: string, name: string, email: string, phone: string, amount: number, title: string) => {
    stopPolling();
    setProcessingStep(3); // Syncing transaction state from secure gateway...

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const verifyRes = await fetch("/api/cashfree-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderId,
            isDemo: false
          })
        });

        if (!verifyRes.ok) return;

        const verifyData = await verifyRes.json();
        if (verifyData.success && verifyData.verified) {
          stopPolling();
          setProcessingStep(4); // Generating lifetime folder download link...
          
          setTimeout(() => {
            setIsPaid(true);
            setIsProcessing(false);
            setOpenedInNewTab(false);
            if (onAddOrder) {
              onAddOrder({
                customerName: name,
                email: email,
                phone: phone,
                productName: title,
                amount: amount
              });
            }
          }, 1500);
        }
      } catch (err) {
        console.error("Polling verify check error: ", err);
      }
    }, 3000);
  };
  
  // Review inputs
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Cashfree system integration config states
  const [payConfig, setPayConfig] = useState<{ isConfigured: boolean; appId: string; env: string } | null>(null);

  React.useEffect(() => {
    fetch("/api/pay-config")
      .then((res) => res.json())
      .then((data) => setPayConfig(data))
      .catch((err) => console.error("Error retrieving billing gateway metadata:", err));

    // Automated deep status check if redirected back with query order token
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("order_id");
    if (orderId) {
      const isDemo = orderId.startsWith("demo_order_");
      setIsProcessing(true);
      setProcessingStep(3); // Syncing transaction state from secure gateway...

      fetch("/api/cashfree-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, isDemo })
      })
        .then((res) => res.json())
        .then((verifyData) => {
          if (verifyData.success && verifyData.verified) {
            setProcessingStep(4); // Generating lifetime folder download link...

            // Restore form inputs from session backup to maintain persistence
            const savedName = localStorage.getItem("pending_customer_name") || "Valued Customer";
            const savedEmail = localStorage.getItem("pending_customer_email") || "delivered@email.com";
            const savedPhone = localStorage.getItem("pending_customer_phone") || "9999999999";

            setFormData({
              name: savedName,
              email: savedEmail,
              phone: savedPhone
            });

            setTimeout(() => {
              setIsPaid(true);
              setIsProcessing(false);
              // Clear query params elegantly to avoid duplicate submission on reload
              window.history.replaceState({}, document.title, window.location.pathname);

              if (onAddOrder) {
                onAddOrder({
                  customerName: savedName,
                  email: savedEmail,
                  phone: savedPhone,
                  productName: product.title,
                  amount: product.price
                });
              }
            }, 1000);
          } else {
            alert("Verification of order status completed: Unpaid or transaction timed out. Try again.");
            setIsProcessing(false);
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        })
        .catch((err) => {
          console.error("Cashfree status sync aborted:", err);
          setIsProcessing(false);
        });
    }

    return () => {
      stopPolling();
    };
  }, []);

  const loadCashfreeScript = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Cashfree) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const processingStepsText = [
    "Establishing secure server connection...",
    "Validating secure transaction tunnel...",
    "Creating verified Cashfree payment order session...",
    "Syncing transaction state from secure gateway...",
    "Generating lifetime Google Drive access token..."
  ];

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    
    setIsProcessing(true);
    setProcessingStep(0); // Establishing secure server connection...

    try {
      // Step 1: Dynamically mount secure Cashfree checkout SDK
      setProcessingStep(1); // Validating secure transaction tunnel...
      const isScriptLoaded = await loadCashfreeScript();
      if (!isScriptLoaded) {
        alert("Cashfree payment scripts failed to load. Please check your network connection.");
        setIsProcessing(false);
        return;
      }

      // Step 2: Query secure Express API proxy order generation
      setProcessingStep(2); // Creating verified Cashfree payment order...
      const res = await fetch("/api/cashfree-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: product.price,
          productId: product.id,
          email: formData.email,
          name: formData.name,
          phone: formData.phone
        })
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || "Unable to create checkout order with merchant terminal.");
      }

      const orderData = await res.json();
      if (!orderData.success) {
        throw new Error(orderData.error || "Order creation failure.");
      }

      if (orderData.isDemo) {
        // High-fidelity local persistent sandbox flow
        setProcessingStep(3); // Syncing transaction signatures...
        await new Promise((r) => setTimeout(r, 1200));
        setProcessingStep(4); // Generating lifetime folder download link...
        await new Promise((r) => setTimeout(r, 1200));

        // Submit client request to our Express signature verification hook
        const verifyRes = await fetch("/api/cashfree-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderData.orderId,
            isDemo: true
          })
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success && verifyData.verified) {
          setIsPaid(true);
          if (onAddOrder) {
            onAddOrder({
              customerName: formData.name,
              email: formData.email,
              phone: formData.phone,
              productName: product.title,
              amount: product.price
            });
          }
        } else {
          alert("Could not process sandbox booking token check.");
        }
        setIsProcessing(false);
      } else {
        // Real active Cashfree Gateway checkout session triggered
        // Save session credentials to dynamically restore on redirect trigger
        localStorage.setItem("pending_customer_name", formData.name);
        localStorage.setItem("pending_customer_email", formData.email);
        localStorage.setItem("pending_customer_phone", formData.phone);

        // Treat sandbox and production iframes with safe popup windows 
        const isInsideIframe = window.self !== window.top;

        if (isInsideIframe) {
          setCurrentOrderData(orderData);
          setPendingOrderId(orderData.orderId);
          setOpenedInNewTab(true);
          setIsProcessing(true); // Keep processing screen active for background querying

          const cashfreeInstance = (window as any).Cashfree({
            mode: payConfig?.env || "sandbox"
          });

          cashfreeInstance.checkout({
            paymentSessionId: orderData.paymentSessionId,
            redirectTarget: "_blank"
          });

          // Start polling backend status in the original iframe
          startPollingPaymentStatus(
            orderData.orderId,
            formData.name,
            formData.email,
            formData.phone,
            product.price,
            product.title
          );
        } else {
          setIsProcessing(false); 

          const cashfreeInstance = (window as any).Cashfree({
            mode: payConfig?.env || "sandbox"
          });

          cashfreeInstance.checkout({
            paymentSessionId: orderData.paymentSessionId,
            redirectTarget: "_self"
          });
        }
      }
    } catch (error: any) {
      console.error("Payment integration workflow aborted:", error);
      alert("Billing Error: " + (error.message || "Please check configuration parameters."));
      setIsProcessing(false);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    
    const newReview: Review = {
      id: `rev-custom-${Date.now()}`,
      name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: "Just now"
    };

    onAddReview(product.id, newReview);
    setReviewSuccess(true);
    setReviewName("");
    setReviewComment("");
    setTimeout(() => {
      setReviewSuccess(false);
    }, 3000);
  };

  // Split logo wording for premium high-contrast coloring
  const words = (settings?.logoText || "Digital Hub").split(" ");
  const firstWord = words[0] || "Digital";
  const restWords = words.slice(1).join(" ") || "Hub";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      {/* Dynamic Slide-Over Right Panel */}
      <div className="bg-[#0a0708] border-l sm:border border-[#231a1c] w-full max-w-3xl h-screen sm:h-[94vh] sm:rounded-3xl flex flex-col justify-between overflow-hidden shadow-2xl relative animate-in slide-in-from-right duration-300">
        
        {/* Brand Header representing website's original branding */}
        <div className="border-b border-[#231a1c] bg-[#140f10] py-4 px-5 sm:px-8 flex items-center justify-between z-20 shrink-0 select-none">
          {/* Brand Logo matching layout */}
          <div className="flex items-center gap-1.5 group">
            <span className="font-display font-black text-lg sm:text-2xl tracking-tight text-[#fbbf24] transition-all duration-200">
              {firstWord} {restWords && <span className="text-white">{restWords}</span>}
            </span>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#fbbf24] animate-pulse"></div>
          </div>

          {/* Right actions matching navbar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* ID Pill */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-[#0a0708] border border-[#231a1c] px-2.5 sm:px-3 py-1.5 rounded-full">
              <span className="text-[10px] sm:text-xs font-mono text-gray-500 font-medium uppercase tracking-wider">
                ID:
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-[#facc15] font-bold tracking-widest bg-yellow-400/5 px-1 rounded-sm">
                525237
              </span>
            </div>

            {/* Elegant Close Button */}
            <button 
              onClick={onClose}
              className="p-2 bg-[#0a0708] hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-[#231a1c] transition-all active:scale-90 flex items-center justify-center"
              aria-label="Close panel"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-6">
          {isProcessing ? (
            /* SECURE PROCESSING STATE */
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-[#231a1c] border-t-[#fbbf24] animate-spin"></div>
                <ShieldCheck className="w-6 h-6 text-[#fbbf24] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-2 max-w-sm">
                <h3 className="font-display font-bold text-lg text-white">Validating Secure Checkout</h3>
                <p className="text-xs text-gray-500 font-mono tracking-wide bg-[#140f10] px-3 py-2 rounded-xl border border-[#231a1c] min-h-[46px] flex items-center justify-center">
                  {processingStepsText[processingStep]}
                </p>
              </div>
              <div className="text-[10px] uppercase font-mono text-gray-600 tracking-widest animate-pulse">
                Order ID Sync: #525237
              </div>

              {openedInNewTab && (
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-center space-y-3 max-w-sm mx-auto">
                  <p className="text-xs text-amber-300 leading-relaxed font-sans">
                    We have opened the secure Cashfree payment page in a new browser tab to satisfy secure sandboxed environment settings.
                  </p>
                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                    Please complete payment in that tab. This window is actively listening and will automatically show your download vault the moment the payment is confirmed by your bank!
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-2.5 pt-1.5">
                    <button 
                      type="button"
                      onClick={() => {
                        if (currentOrderData?.paymentSessionId) {
                          const mode = payConfig?.env || "sandbox";
                          const host_url = mode === "production" ? "payments.cashfree.com" : "sandbox.cashfree.com";
                          window.open(`https://${host_url}/pg/view/checkout?session_id=${currentOrderData.paymentSessionId}`, '_blank');
                        }
                      }}
                      className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-extrabold text-[10px] rounded-xl transition-all tracking-wider uppercase cursor-pointer"
                    >
                      Popup blocked? Open page
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        stopPolling();
                        setIsProcessing(false);
                        setOpenedInNewTab(false);
                        setPendingOrderId(null);
                      }}
                      className="px-3.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-gray-400 hover:text-white text-[10px] rounded-xl font-bold border border-zinc-800/80 transition-all tracking-wider uppercase cursor-pointer"
                    >
                      Cancel Payment
                    </button>
                  </div>
                </div>
              )}
            </div>

          ) : isPaid ? (
            /* CONGRATULATIONS AND GOOGLE DRIVE LINK */
            <div className="space-y-6 py-4 animate-in zoom-in-95 duration-200">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-black text-white">Payment Received Successfully!</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  Congratulations <span className="text-white font-semibold">{formData.name}</span>! Your lifetime access has been created.
                </p>
              </div>

              {/* Secure Delivery Box with Google Drive Link */}
              <div className="bg-[#140f10] border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden bg-gradient-to-b from-emerald-500/[0.02] to-transparent">
                <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl tracking-wider">
                  Verified Purchase
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Download className="w-4 h-4" />
                    <span>Download Package Vault</span>
                  </h4>
                  <p className="text-xs text-gray-300">
                    Click the official secure Google Drive portal below to access the full high-speed directory containing all files and presets.
                  </p>

                  <a 
                    href={product.driveLink || "https://drive.google.com/drive/folders/1-Health-Fitness-Reels-Premium-Bundle"} 
                    target="_blank" 
                    rel="noreferrer noopener"
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 active:scale-98 transition-all text-black font-black text-base rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/10"
                  >
                    <Download className="w-5 h-5 stroke-[2.5px]" />
                    <span>Access Premium Google Drive Link</span>
                  </a>

                  <div className="pt-2 flex flex-col gap-1.5 text-[11px] text-gray-500 font-mono">
                    <div>• Sync ID: <span className="text-gray-300">HUB-525237-{Math.floor(Math.random() * 89999 + 10000)}</span></div>
                    <div>• Delivery Email: <span className="text-gray-300">{formData.email}</span></div>
                    <div>• Lifetime Updates: <span className="text-gray-300">Enabled</span></div>
                    <div>• Support: <span className="text-gray-300">24/7 (Customer Desk #525237)</span></div>
                  </div>
                </div>
              </div>

              <div className="bg-[#140f10] border border-[#231a1c] p-4 rounded-2xl space-y-2">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">How to import assets:</h5>
                <ol className="text-xs text-gray-400 space-y-1.5 list-decimal pl-4 leading-relaxed">
                  <li>Log in to your Google Drive account, open the link and add it to your Starred folders for instant shortcut.</li>
                  <li>Click individual reel folders sorted by wellness category (Workout, Nutrition, Meditation).</li>
                  <li>Download or drag folders straight into your editing programs like CapCut, Canva, Premiere, or upload directly via mobile app.</li>
                </ol>
              </div>

              <button
                onClick={() => {
                  setIsPaid(false);
                }}
                className="w-full py-3 bg-[#231a1c] hover:bg-[#231a1c]/80 text-white font-bold text-sm rounded-xl transition-all"
              >
                Return to Product Main
              </button>
            </div>

          ) : (
            /* DIRECT SINGLE-STAGE CHECKOUT FLOW */
            <div className="space-y-6 pt-4 animate-in fade-in duration-300">
              {/* Product Header Row */}
              <div className="border-b border-[#231a1c] pb-4">
                <div className="text-xs font-mono text-[#fbbf24] uppercase tracking-wider font-bold">
                  ⚡ Instant Delivery Bundle
                </div>
                <h2 className="text-2xl font-display font-black text-white mt-1">
                  {product.title}
                </h2>
              </div>

              {/* Grid block for details + checkout form side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Left Side: Product Preview Card & Features */}
                <div className="space-y-5">
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-black/40 border border-[#231a1c]">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#fbbf24] text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter shadow-md">
                      {product.discountTag} Discount
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Pricing details</span>
                    <div className="flex items-baseline gap-2.5 mt-0.5">
                      <span className="text-3xl font-black text-[#fbbf24]">₹{product.price}</span>
                      <span className="text-sm font-medium text-gray-500 line-through">₹{product.originalPrice}</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/5 px-2.5 py-0.5 rounded-full ml-auto">
                        Best price
                      </span>
                    </div>
                  </div>

                  {/* Feature Quicklist */}
                  <div className="space-y-2">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-widest block">Included deliverables</span>
                    <div className="space-y-2">
                      {product.features.slice(0, 4).map((f, i) => (
                        <div key={i} className="flex gap-2.5 items-start text-xs text-gray-300 leading-relaxed">
                          <CheckCircle className="w-3.5 h-3.5 text-[#fbbf24] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side: Demo Videos Grid OR Simple Fast Checkout Form based on showBillingForm toggle */}
                <div className="bg-[#140f10] border border-[#231a1c] p-5 sm:p-6 rounded-2xl space-y-4">
                  {!showBillingForm ? (
                    /* 4 DEMO VIDEOS GRID PANEL */
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="border-b border-[#231a1c] pb-3 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-[#fbbf24] animate-pulse" />
                            <span>Reels Demo Previews</span>
                          </h3>
                          <p className="text-[11px] text-gray-500 mt-0.5">Click any video to play instantly</p>
                        </div>
                        <span className="text-[10px] bg-amber-400/10 text-[#fbbf24] px-2 py-0.5 rounded-full font-mono border border-amber-400/20">
                          4 CLIPS
                        </span>
                      </div>

                      {/* 2x2 Portrait Grid */}
                      <div className="border border-dashed border-amber-500/20 p-2 rounded-2xl bg-[#0a0708]/45">
                        <div className="grid grid-cols-2 gap-2">
                          <VideoCard src={product.demoVideo1 || settings?.video1 || "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c022f73bcf7407d60f04e22596ab5933&profile_id=165&oauth2_token_id=57447761"} />
                          <VideoCard src={product.demoVideo2 || settings?.video2 || "https://player.vimeo.com/external/434045526.sd.mp4?s=c27db11cf4ca9aa14704e6c310fb4e067fd4b39b&profile_id=165&oauth2_token_id=57447761"} />
                          <VideoCard src={product.demoVideo3 || settings?.video3 || "https://player.vimeo.com/external/403842104.sd.mp4?s=d7fb47da2f1464b5849dfb0c95a2879f91a5ad56&profile_id=165&oauth2_token_id=57447761"} />
                          <VideoCard src={product.demoVideo4 || settings?.video4 || "https://player.vimeo.com/external/434045546.sd.mp4?s=6761014cc6efc8e874f676be980b18f77eb513e9&profile_id=165&oauth2_token_id=57447761"} />
                        </div>
                      </div>

                      {/* Glowing Buy Now button to open Form input */}
                      <button
                        onClick={() => setShowBillingForm(true)}
                        className="w-full py-4 bg-[#fbbf24] hover:bg-white text-black font-extrabold text-xs rounded-xl tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(251,191,36,0.55)] active:scale-95 flex items-center justify-center gap-2 cursor-pointer font-sans relative overflow-hidden group mt-1"
                      >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span>INSTANT ACCESS FOR ₹{product.price} ⚡</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5px] transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  ) : (
                    /* CHECKOUT BILLING FORM PANEL */
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                      <div className="border-b border-[#231a1c] pb-3 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Secure Checkout</h3>
                          <p className="text-[11px] text-gray-500 mt-0.5">Fill details to retrieve your cloud folders</p>
                        </div>
                        <button
                          onClick={() => setShowBillingForm(false)}
                          className="text-xs text-[#fbbf24] hover:underline font-bold"
                        >
                          Show Previews
                        </button>
                      </div>

                      {payConfig?.isConfigured ? (
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl text-[10px] text-emerald-400 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                          <span>Cashfree Payments Connected (Live Active)</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 bg-amber-500/15 border border-amber-500/20 px-3 py-2.5 rounded-xl text-[10px] text-amber-300 font-mono leading-relaxed">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            <span>Sandbox/Demo Mode Active</span>
                          </div>
                          <span className="text-[9px] text-gray-400 font-sans leading-normal">
                            Set your Cashfree Credentials (<code>VITE_CASHFREE_APP_ID</code> and <code>CASHFREE_SECRET_KEY</code>) in AI Studio Settings (Secrets panel) to start accepting real payments.
                          </span>
                        </div>
                      )}

                      <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#fbbf24]" />
                            <span>Full Name</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ashish Shinde"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all placeholder-gray-700"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-[#fbbf24]" />
                            <span>Email (For Link Delivery)</span>
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. user@gmail.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all placeholder-gray-700"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#fbbf24]" />
                            <span>WhatsApp Number</span>
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. +91 9623508876"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all placeholder-gray-700"
                          />
                        </div>

                        <div className="text-[10px] text-gray-400 flex items-start gap-2 bg-[#0a0708] p-2.5 rounded-xl border border-[#231a1c] leading-relaxed">
                          <ShieldCheck className="w-4 h-4 text-[#fbbf24] shrink-0 mt-0.5" />
                          <span>Google Drive lifetime cloud link will deliver automatically to this email/number.</span>
                        </div>

                        <div className="flex flex-col gap-2 pt-1">
                          <button
                            type="submit"
                            className="w-full py-3.5 bg-[#fbbf24] hover:bg-white text-black font-extrabold text-xs rounded-xl tracking-wider uppercase transition-all shadow-xl active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                          >
                            <span>Confirm and Pay ₹{product.price}</span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5px]" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowBillingForm(false)}
                            className="text-[11px] text-gray-500 hover:text-white transition-colors text-center py-1 bg-transparent hover:bg-white/5 rounded-lg border border-transparent font-sans"
                          >
                            ← Back to Demo Previews
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Footer info line */}
        <div className="border-t border-[#231a1c] py-4 px-6 bg-[#140f10] text-center text-[10px] text-gray-600 font-mono">
          Secure Sandbox • Order Token ID: #525237 • Instant Sync
        </div>

      </div>
    </div>
  );
}
