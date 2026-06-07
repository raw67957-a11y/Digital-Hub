import React, { useState } from "react";
import { PRODUCTS, REVIEWS } from "./data";
import { Product, Review, DiscountCode } from "./types";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import CheckoutModal from "./components/CheckoutModal";
import AdminPanel from "./components/AdminPanel";
import PaymentSuccessModal from "./components/PaymentSuccessModal";
import DownloadCenterModal from "./components/DownloadCenterModal";
import { 
  Sparkles, ShieldCheck, Heart, Share2, MessageCircle, 
  HelpCircle, Star, Flame, Download, Check 
} from "lucide-react";

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem("app_products");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return PRODUCTS;
  });

  React.useEffect(() => {
    try {
      localStorage.setItem("app_products", JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  const [reviewsMap, setReviewsMap] = useState<Record<string, Review[]>>({
    "prod-1": REVIEWS,
    "prod-2": [
      { id: "r-2-1", name: "Karan Singh", rating: 5, comment: "Peaceful ambient videos, perfect to edit and post directly. Thanks for the quick support!", date: "2 days ago" }
    ],
    "prod-3": [
      { id: "r-3-1", name: "Siddharth", rating: 5, comment: "Are public link working? Yes, downloaded in 10 secs. Unreal price ₹15!", date: "Just now" }
    ]
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [contactClicks, setContactClicks] = useState(0);

  // Monitor location hash to toggle admin page state cleanly
  React.useEffect(() => {
    const handleCheckHash = () => {
      if (window.location.hash === "#admin" || window.location.hash === "admin") {
        const isUnlocked = localStorage.getItem("is_owner_secret_unlocked") === "true";
        if (isUnlocked) {
          setIsAdminOpen(true);
        } else {
          // If not unlocked, secure landing page default: clear hash and hide admin panel
          window.location.hash = "";
          setIsAdminOpen(false);
        }
      } else {
        setIsAdminOpen(false);
      }
    };
    handleCheckHash();
    window.addEventListener("hashchange", handleCheckHash);
    return () => window.removeEventListener("hashchange", handleCheckHash);
  }, []);

  const handleContactClick = () => {
    setContactClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        try {
          localStorage.setItem("is_owner_secret_unlocked", "true");
        } catch (e) {}
        window.location.hash = "admin";
        setIsAdminOpen(true);
        return 0;
      }
      return next;
    });
  };

  const handleOpenAdminToggle = () => {
    if (isAdminOpen) {
      window.location.hash = "";
      setIsAdminOpen(false);
    } else {
      window.location.hash = "admin";
      setIsAdminOpen(true);
    }
  };
  
  // Browsing filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Dynamic global branding and payment gateway configurations
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem("app_settings");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      logoText: "Digital Hub",
      logoImage: "https://ibb.co/N6MFf1N",
      footerText: "© 2026 Health Reels. All rights reserved.",
      paymentLink: "https://reelsbazaar.com/",
      email: "ashishrshinde15@gmail.com",
      phone: "+919623508876",
      video1: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c022f73bcf7407d60f04e22596ab5933&profile_id=165&oauth2_token_id=57447761",
      video2: "https://player.vimeo.com/external/434045526.sd.mp4?s=c27db11cf4ca9aa14704e6c310fb4e067fd4b39b&profile_id=165&oauth2_token_id=57447761",
      video3: "https://player.vimeo.com/external/403842104.sd.mp4?s=d7fb47da2f1464b5849dfb0c95a2879f91a5ad56&profile_id=165&oauth2_token_id=57447761"
    };
  });

  React.useEffect(() => {
    try {
      localStorage.setItem("app_settings", JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  // Dynamic order bookings - Saved locally to persist organic & redirect payment statistics!
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem("app_orders");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: "ord-1",
        customerName: "ASHX GROW",
        email: "ashxgrowofficial@gmail.com",
        phone: "9623508876",
        productName: "Get The Ultimate Health Reels Bundle",
        amount: 15,
        date: "06-06-2026 10:48"
      },
      {
        id: "ord-2",
        customerName: "ASHX GROW",
        email: "ashxgrowofficial@gmail.com",
        phone: "9623508876",
        productName: "New Product (Health Reels)",
        amount: 99,
        date: "06-06-2026 10:35"
      },
      {
        id: "ord-3",
        customerName: "ASHX GROW",
        email: "ashxgrowofficial@gmail.com",
        phone: "9623508876",
        productName: "Get The Ultimate Health Reels Bundle",
        amount: 15,
        date: "06-06-2026 10:10"
      }
    ];
  });

  React.useEffect(() => {
    try {
      localStorage.setItem("app_orders", JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  // Dynamic complimentary admin user access passes
  const [userAccesses, setUserAccesses] = useState(() => {
    try {
      const stored = localStorage.getItem("app_user_accesses");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: "ua-1",
        userId: "525237",
        productName: "All products (full access)",
        note: "Primary client access badge",
        date: "06-06-2026"
      }
    ];
  });

  React.useEffect(() => {
    try {
      localStorage.setItem("app_user_accesses", JSON.stringify(userAccesses));
    } catch (e) {}
  }, [userAccesses]);

  // Automated Payment Success Redirection Capture & Download Center Overlay States
  const [successPaymentData, setSuccessPaymentData] = useState<{
    product: Product;
    name: string;
    email: string;
    phone: string;
  } | null>(null);

  const [isDownloadCenterOpen, setIsDownloadCenterOpen] = useState(false);

  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(() => {
    try {
      const stored = localStorage.getItem("app_discount_codes");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      { id: "dc-1", code: "SAVE10", type: "flat", value: 10 },
      { id: "dc-2", code: "SPECIAL50", type: "percentage", value: 50 },
      { id: "dc-3", code: "ASHX50", type: "percentage", value: 50 }
    ];
  });

  const handleUpdateDiscountCodes = (codes: DiscountCode[]) => {
    setDiscountCodes(codes);
    try {
      localStorage.setItem("app_discount_codes", JSON.stringify(codes));
    } catch (e) {}
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    setReviewsMap((prev) => ({
      ...prev,
      [newProd.id]: []
    }));
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts((prev) => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter(p => p.id !== productId));
  };

  const handleResetProducts = () => {
    setProducts(PRODUCTS);
  };

  const handleAddReview = (prodId: string, newReview: Review) => {
    setReviewsMap((prev) => ({
      ...prev,
      [prodId]: [newReview, ...(prev[prodId] || [])]
    }));
  };

  // Add order booking dynamically when client purchases in modal
  const handleAddOrder = (newOrder: { customerName: string; email: string; phone: string; productName: string; amount: number }) => {
    setOrders((prev) => [
      {
        id: `ord-${Date.now()}`,
        ...newOrder,
        date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);
  };

  const handleAddUserAccess = (newAccess: any) => {
    setUserAccesses((prev) => [
      { id: `ua-${Date.now()}`, ...newAccess },
      ...prev
    ]);
  };

  const handleDeleteUserAccess = (id: string) => {
    setUserAccesses((prev) => prev.filter((ua) => (ua.id !== id && ua.userId !== id)));
  };

  // Automatic Payment Gateway Redirection Query Parameter Scanner
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const isSuccess = params.get("payment_success") === "true";
      const productId = params.get("prod_id");

      if (isSuccess && productId) {
        // Match product by ID
        const matched = products.find(p => p.id === productId);
        if (matched) {
          const customerName = params.get("name") || "Valued Customer";
          const customerEmail = params.get("email") || "purchaser@reels.com";
          const customerPhone = params.get("phone") || "";
          const customerAmount = Number(params.get("amount") || matched.price);

          setSuccessPaymentData({
            product: matched,
            name: customerName,
            email: customerEmail,
            phone: customerPhone
          });

          // Check if this order has already been logged locally to avoid duplicates
          const alreadyLogged = orders.some(o => 
            (o.email || "").toString().toLowerCase() === customerEmail.toLowerCase() && 
            (o.productName || "").toString().toLowerCase() === matched.title.toLowerCase()
          );

          if (!alreadyLogged) {
            handleAddOrder({
              customerName,
              email: customerEmail,
              phone: customerPhone,
              productName: matched.title,
              amount: customerAmount
            });
          }

          // Clean state parameters from browser URL bar cleanly without refreshing
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, newUrl);
        }
      }
    } catch (e) {
      console.warn("Auto-Redirect check encountered query parameter parsing details: ", e);
    }
  }, [products, orders]);

  // Get active lists
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    // Hide product from main storefront page if set to hidden/unpublished
    if (p.isHidden) return false;
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.discountText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isAdminOpen) {
    return (
      <div className="min-h-screen bg-[#0a0708] text-white selection:bg-[#fbbf24] selection:text-black animate-in fade-in duration-300">
        <AdminPanel 
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onResetProducts={handleResetProducts}
          onClose={() => {
            setIsAdminOpen(false);
            window.location.hash = "";
          }}
          orders={orders}
          userAccesses={userAccesses}
          onAddUserAccess={handleAddUserAccess}
          onDeleteUserAccess={handleDeleteUserAccess}
          settings={settings}
          onUpdateSettings={setSettings}
          discountCodes={discountCodes}
          onUpdateDiscountCodes={handleUpdateDiscountCodes}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0708] text-white flex flex-col justify-between selection:bg-[#fbbf24] selection:text-black">
      
      {/* Dynamic Header */}
      <Navbar 
        onOpenAdmin={handleOpenAdminToggle} 
        isAdminOpen={isAdminOpen} 
        logoText={settings.logoText}
        onOpenDownloadCenter={() => setIsDownloadCenterOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 flex-grow space-y-12">

        {/* Hero Headline Section exactly replicating original screenshot accent banner */}
        <div className="text-center space-y-3 max-w-3xl mx-auto py-2">
          {/* Decorative tag */}
          <div className="inline-flex items-center gap-1.5 bg-[#140f10] border border-[#231a1c] px-3.5 py-1 rounded-full text-xs text-gray-400 font-semibold mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
            <span>Limited Offer: Instant Cloud Access</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight leading-none text-white select-none">
            Premium <span className="text-[#fbbf24]">Digital Products</span>
          </h1>
          
          <p className="text-sm sm:text-base font-normal tracking-wide text-gray-500">
            Lifetime · Instant · Risk-Free
          </p>
        </div>

        {/* Dynamic Grid replicating exact card columns from requested image */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 pt-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
              isEditMode={isAdminOpen}
              onUpdateProduct={handleUpdateProduct}
            />
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center space-y-3 bg-[#140f10] rounded-3xl border border-[#231a1c]">
              <div className="text-gray-600 text-sm">No digital products match your filter search.</div>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="text-xs text-[#fbbf24] hover:underline font-bold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

      </main>

      {/* Slide-Over / Popup modal for details & checkout simulation */}
      {selectedProduct && (
        <CheckoutModal
          product={selectedProduct}
          reviews={reviewsMap[selectedProduct.id] || []}
          onClose={() => setSelectedProduct(null)}
          onAddReview={handleAddReview}
          onAddOrder={handleAddOrder}
          settings={settings}
          discountCodes={discountCodes}
        />
      )}

      {/* Automated Payment Successful Instant Access Popup */}
      {successPaymentData && (
        <PaymentSuccessModal
          product={successPaymentData.product}
          customerName={successPaymentData.name}
          customerEmail={successPaymentData.email}
          customerPhone={successPaymentData.phone}
          onClose={() => setSuccessPaymentData(null)}
        />
      )}

      {/* Self-Service Digital Files Claim / Download Verification Center */}
      {isDownloadCenterOpen && (
        <DownloadCenterModal
          products={products}
          orders={orders}
          userAccesses={userAccesses}
          onClose={() => setIsDownloadCenterOpen(false)}
        />
      )}

      {/* High-Fidelity Exact Footer matching the requested 3rd image layout */}
      <footer id="about-section" className="bg-[#0a0708] border-t border-[#231a1c] pt-12 pb-8 px-6 sm:px-12 md:px-16 text-left selection:bg-[#fbbf24] selection:text-black">
        <div className="max-w-4xl space-y-8">
          
          {/* Header text exactly from screenshot */}
          <div className="space-y-2">
            <h2 className="text-[28px] font-display font-black text-[#fbbf24] tracking-tight leading-none flex items-center gap-2">
              {settings.logoText}
            </h2>
            <p className="text-sm text-gray-400 font-sans leading-relaxed max-w-xl">
              Premium digital product. Lifetime access. Instant delivery on your email.
            </p>
          </div>

          {/* Contact section exactly from user requirements */}
          <div className="space-y-3">
            <h3 
              onClick={handleContactClick}
              className="text-base font-bold text-white tracking-wide cursor-pointer select-none active:scale-[0.98] transition-transform"
              title="Click 5 times to activate admin panel"
            >
              Contact me
            </h3>
            <div className="flex flex-col space-y-1 font-sans text-sm text-[#9ca3af]">
              <a 
                href="mailto:ashishrshinde15@gmail.com" 
                className="hover:text-white transition-colors"
                referrerPolicy="no-referrer"
              >
                ashishrshinde15@gmail.com
              </a>
              <a 
                href="tel:9623508876" 
                className="hover:text-white transition-colors"
              >
                9623508876
              </a>
            </div>
          </div>

        </div>

        {/* Divider exactly from screenshot */}
        <div className="border-t border-[#231a1c] w-full my-8" />

        {/* Copyright notice exactly from screenshot */}
        <div className="text-xs text-gray-500 font-sans">
          {settings.footerText}
        </div>
      </footer>
    </div>
  );
}
