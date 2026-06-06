import React, { useState } from "react";
import { Product } from "../types";
import { 
  Lock, Key, Shield, Layout, ShoppingBag, 
  Video, Image, ListOrdered, UserCheck, Settings, 
  LogOut, Plus, Trash2, Edit, Eye, EyeOff, 
  ExternalLink, Search, Mail, Phone, Download, X, 
  CheckCircle, RefreshCw, AlertCircle, Sparkles, HelpCircle, Users
} from "lucide-react";

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetProducts: () => void;
  onClose: () => void;
  orders: any[];
  onAddOrder?: (order: any) => void;
  userAccesses: any[];
  onAddUserAccess?: (access: any) => void;
  onDeleteUserAccess?: (id: string) => void;
  settings: any;
  onUpdateSettings: (newSettings: any) => void;
}

export default function AdminPanel({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetProducts,
  onClose,
  orders,
  userAccesses,
  onAddUserAccess,
  onDeleteUserAccess,
  settings,
  onUpdateSettings,
}: AdminPanelProps) {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Tabs: 'dashboard', 'products', 'demoVideos', 'banner', 'orders', 'userAccess', 'settings', 'gallery'
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "products" | "demoVideos" | "banner" | "orders" | "userAccess" | "settings" | "gallery"
  >("dashboard");

  // Gallery list state
  const [gallery, setGallery] = useState<{ url: string; label: string }[]>(() => {
    try {
      const stored = localStorage.getItem("admin_gallery_images");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      { url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80", label: "Elite Fitness" },
      { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop&q=80", label: "Pure Yoga" },
      { url: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=500&auto=format&fit=crop&q=80", label: "Premium Bundle" },
      { url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&auto=format&fit=crop&q=80", label: "Active Wellness" },
      { url: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=500&auto=format&fit=crop&q=80", label: "Dumbbell Set" },
      { url: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500&auto=format&fit=crop&q=80", label: "Fitness Gear" }
    ];
  });

  const [galleryNewUrl, setGalleryNewUrl] = useState("");
  const [galleryNewLabel, setGalleryNewLabel] = useState("");

  const handleAddToGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryNewUrl.trim()) return;
    const itemLabel = galleryNewLabel.trim() || `Photo Model ${gallery.length + 1}`;
    const updated = [...gallery, { url: galleryNewUrl.trim(), label: itemLabel }];
    setGallery(updated);
    try {
      localStorage.setItem("admin_gallery_images", JSON.stringify(updated));
    } catch (err) {}
    setGalleryNewUrl("");
    setGalleryNewLabel("");
  };

  const handleDeleteFromGallery = (indexToDelete: number) => {
    const updated = gallery.filter((_, idx) => idx !== indexToDelete);
    setGallery(updated);
    try {
      localStorage.setItem("admin_gallery_images", JSON.stringify(updated));
    } catch (err) {}
  };

  // Local Action States
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Search filter for Orders
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  // Product Form Input States
  const [prodTitle, setProdTitle] = useState("");
  const [prodPrice, setProdPrice] = useState(49);
  const [prodOriginalPrice, setProdOriginalPrice] = useState(149);
  const [prodDiscountTag, setProdDiscountTag] = useState("-67%");
  const [prodDiscountText, setProdDiscountText] = useState("120+ Viral Templates");
  const [prodDescription, setProdDescription] = useState("");
  const [prodCategory, setProdCategory] = useState("Health Reels");
  const [prodFeaturesInput, setProdFeaturesInput] = useState("");
  const [prodImage, setProdImage] = useState("");
  const [prodDriveLink, setProdDriveLink] = useState("");
  const [prodDemoVideo1, setProdDemoVideo1] = useState("");
  const [prodDemoVideo2, setProdDemoVideo2] = useState("");
  const [prodDemoVideo3, setProdDemoVideo3] = useState("");
  const [prodDemoVideo4, setProdDemoVideo4] = useState("");

  // User Access Form State
  const [accessUserId, setAccessUserId] = useState("");
  const [accessProduct, setAccessProduct] = useState("All products (full access)");
  const [accessNote, setAccessNote] = useState("");
  const [accessMessage, setAccessMessage] = useState("");

  // Settings Temp States
  const [logoText, setLogoText] = useState(settings.logoText || "Digital Hub");
  const [logoImage, setLogoImage] = useState(settings.logoImage || "https://ibb.co/N6MFf1N");
  const [footerText, setFooterText] = useState(settings.footerText || "© 2026 Health Reels. All rights reserved.");
  const [paymentLink, setPaymentLink] = useState(settings.paymentLink || "https://reelsbazaar.com/");
  const [contactEmail, setContactEmail] = useState(settings.email || "ashishrshinde15@gmail.com");
  const [contactPhone, setContactPhone] = useState(settings.phone || "+919623508876");
  const [video1, setVideo1] = useState(settings.video1 || "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c022f73bcf7407d60f04e22596ab5933&profile_id=165&oauth2_token_id=57447761");
  const [video2, setVideo2] = useState(settings.video2 || "https://player.vimeo.com/external/434045526.sd.mp4?s=c27db11cf4ca9aa14704e6c310fb4e067fd4b39b&profile_id=165&oauth2_token_id=57447761");
  const [video3, setVideo3] = useState(settings.video3 || "https://player.vimeo.com/external/403842104.sd.mp4?s=d7fb47da2f1464b5849dfb0c95a2879f91a5ad56&profile_id=165&oauth2_token_id=57447761");
  const [video4, setVideo4] = useState(settings.video4 || "https://player.vimeo.com/external/434045546.sd.mp4?s=6761014cc6efc8e874f676be980b18f77eb513e9&profile_id=165&oauth2_token_id=57447761");

  // Handle Sign-in Verification
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "ashishrshinde15@gmail.com" && password === "Ashish12@@") {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Incorrect authorized ID or Password. Try again!");
    }
  };

  // Handle Product Form Submits (Adding/Editing)
  const openNewProductForm = () => {
    setEditingProduct(null);
    setProdTitle("");
    setProdPrice(99);
    setProdOriginalPrice(199);
    setProdDiscountTag("");
    setProdDiscountText("100+ Health Reels Bundle");
    setProdCategory("Health & Fitness");
    setProdDescription("");
    setProdFeaturesInput("");
    setProdImage("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80");
    setProdDriveLink("");
    setProdDemoVideo1("");
    setProdDemoVideo2("");
    setProdDemoVideo3("");
    setProdDemoVideo4("");
    setIsProductFormOpen(true);
  };

  const openEditProductForm = (product: Product) => {
    setEditingProduct(product);
    setProdTitle(product.title);
    setProdPrice(product.price);
    setProdOriginalPrice(product.originalPrice);
    setProdDiscountTag(product.discountTag);
    setProdDiscountText(product.discountText);
    setProdCategory(product.category);
    setProdDescription(product.description);
    setProdFeaturesInput(product.features.join("\n"));
    setProdImage(product.image);
    setProdDriveLink(product.driveLink || "");
    setProdDemoVideo1(product.demoVideo1 || "");
    setProdDemoVideo2(product.demoVideo2 || "");
    setProdDemoVideo3(product.demoVideo3 || "");
    setProdDemoVideo4(product.demoVideo4 || "");
    setIsProductFormOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim()) return;

    const featuresArray = prodFeaturesInput
      ? prodFeaturesInput.split("\n").map((f) => f.trim()).filter(Boolean)
      : ["Premium vertical clips", "Lifetime Access Included", "HD Video files directly in Drive"];

    if (editingProduct) {
      // Update
      const updated: Product = {
        ...editingProduct,
        title: prodTitle,
        price: Number(prodPrice),
        originalPrice: Number(prodOriginalPrice),
        discountTag: prodDiscountTag,
        discountText: prodDiscountText,
        image: prodImage || editingProduct.image,
        category: prodCategory,
        description: prodDescription.trim(),
        features: featuresArray,
        driveLink: prodDriveLink.trim() || undefined,
        demoVideo1: prodDemoVideo1.trim() || undefined,
        demoVideo2: prodDemoVideo2.trim() || undefined,
        demoVideo3: prodDemoVideo3.trim() || undefined,
        demoVideo4: prodDemoVideo4.trim() || undefined,
      };
      onUpdateProduct(updated);
    } else {
      // Create new
      const created: Product = {
        id: `prod-${Date.now()}`,
        title: prodTitle,
        price: Number(prodPrice),
        originalPrice: Number(prodOriginalPrice),
        discountTag: prodDiscountTag,
        discountText: prodDiscountText,
        image: prodImage || "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=500&auto=format&fit=crop&q=80",
        category: prodCategory,
        rating: 4.9,
        buyersCount: 1,
        description: prodDescription.trim() || "Premium custom catalog bundle updated.",
        features: featuresArray,
        driveLink: prodDriveLink.trim() || undefined,
        demoVideo1: prodDemoVideo1.trim() || undefined,
        demoVideo2: prodDemoVideo2.trim() || undefined,
        demoVideo3: prodDemoVideo3.trim() || undefined,
        demoVideo4: prodDemoVideo4.trim() || undefined,
      };
      onAddProduct(created);
    }

    setIsProductFormOpen(false);
    setEditingProduct(null);
  };

  // Toggle Publish/Hidden for Products
  const togglePublishStatus = (product: Product) => {
    onUpdateProduct({
      ...product,
      isHidden: !product.isHidden,
    });
  };

  // Trigger export orders as real CSV
  const handleExportCSV = () => {
    const headers = "ID,Customer,Email,WhatsApp,Product,Amount,Date\n";
    const rows = orders
      .map(
        (o) =>
          `"${o.id}","${o.customerName}","${o.email}","${o.phone}","${o.productName}",${o.amount},"${o.date}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `storefront_orders_${Date.now()}.csv`);
    a.click();
  };

  // Grant User Access Action
  const handleGrantAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessUserId.trim() || accessUserId.length !== 6) {
      setAccessMessage("User ID must be exactly a 6-digit number.");
      return;
    }

    if (onAddUserAccess) {
      onAddUserAccess({
        userId: accessUserId.trim(),
        productName: accessProduct,
        note: accessNote.trim() || "Granted by Owner Desk",
        date: new Date().toLocaleDateString(),
      });
      setAccessUserId("");
      setAccessNote("");
      setAccessMessage("Access granted successfully!");
      setTimeout(() => setAccessMessage(""), 4000);
    }
  };

  // Save Settings State globally
  const handleSaveSettings = () => {
    onUpdateSettings({
      logoText,
      logoImage,
      footerText,
      paymentLink,
      email: contactEmail,
      phone: contactPhone,
    });
    alert("Branding and payment gateway links updated successfully!");
  };

  // Calculate stats based on orders list
  const totalOrdersCount = orders.length;
  const paidOrdersCount = orders.length; // assuming checkout in our applet means paid state
  const totalRevenueSum = orders.reduce((acc, curr) => acc + curr.amount, 0);
  const uniqueEmails = Array.from(new Set(orders.map((o) => o.email.toLowerCase()))).length;

  // Filtered orders list for table query
  const filteredOrders = orders.filter((o) => {
    const query = orderSearchQuery.toLowerCase();
    return (
      o.customerName.toLowerCase().includes(query) ||
      o.email.toLowerCase().includes(query) ||
      o.phone.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full bg-[#0a0708] border border-[#231a1c] rounded-3xl overflow-hidden selection:bg-[#fbbf24] selection:text-black">
      {!isLoggedIn ? (
        /* ==================== 1. ADMIN AUTHORIZED SIGN IN CARD ==================== */
        <div className="py-24 px-6 flex flex-col items-center justify-center min-h-[550px]">
          <div className="bg-[#140f10] border border-[#231a1c] rounded-[2rem] p-8 sm:p-10 w-full max-w-sm space-y-6 relative shadow-2xl">
            {/* Lock Header */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="flex items-center gap-1.5 bg-[#fbbf24]/10 text-[#fbbf24] px-4 py-1.5 rounded-full font-sans text-xs font-bold ring-1 ring-amber-500/20">
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Access</span>
              </div>
              <h1 className="text-3xl font-display font-black text-white tracking-tight mt-2">
                Sign in
              </h1>
              <p className="text-xs text-gray-500">Restricted to authorized admin only.</p>
            </div>

            {/* Login form fields */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 font-sans tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ashishrshinde15@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder-gray-700 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 font-sans tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder-gray-700 font-sans"
                />
              </div>

              {loginError && (
                <div className="text-xs text-red-400 flex items-center gap-1.5 bg-red-500/5 border border-red-500/20 py-2.5 px-3 rounded-lg font-sans">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#fbbf24] hover:bg-white text-black font-extrabold text-xs rounded-xl tracking-wider uppercase transition-all shadow-md active:scale-98 cursor-pointer mt-1 font-sans flex items-center justify-center gap-1.5"
              >
                <span>SIGN IN</span>
              </button>
            </form>

            {/* Back indicator */}
            <div className="text-center pt-2">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors text-xs font-sans"
              >
                ← Back to site
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== 2. ADMIN PORTAL LOGGED IN VIEWS ==================== */
        <div className="flex flex-col min-h-[650px] bg-[#0a0708]">
          {/* Dashboard Header Bar */}
          <header className="border-b border-[#231a1c] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0e0a0b]">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl tracking-tight text-[#fbbf24]">
                Admin <span className="text-white">Panel</span>
              </span>
              <div className="text-[10px] bg-amber-400/10 text-[#fbbf24] px-2 py-0.5 rounded-full font-mono border border-amber-400/20">
                PRO-DESK
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 px-3 py-1.5 bg-[#140f10] border border-[#231a1c] rounded-lg hover:border-gray-500 transition-all font-sans"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View site</span>
              </button>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 px-3 py-1.5 bg-rose-950/10 border border-rose-900/20 rounded-lg hover:border-rose-500/30 transition-all font-sans"
                title="Disconnect Administrator"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign out</span>
              </button>
            </div>
          </header>

          {/* Sub Navigation Bar - Horizontal Track */}
          <nav className="border-b border-[#231a1c] bg-[#140f10] px-4 py-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none select-none">
            <button
              onClick={() => { setActiveTab("dashboard"); setIsProductFormOpen(false); }}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "dashboard"
                  ? "bg-[#fbbf24] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab("products"); setIsProductFormOpen(false); }}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "products"
                  ? "bg-[#fbbf24] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Products</span>
            </button>

            <button
              onClick={() => { setActiveTab("demoVideos"); setIsProductFormOpen(false); }}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "demoVideos"
                  ? "bg-[#fbbf24] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Demo Videos</span>
            </button>

            <button
              onClick={() => { setActiveTab("banner"); setIsProductFormOpen(false); }}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "banner"
                  ? "bg-[#fbbf24] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Image className="w-3.5 h-3.5" />
              <span>Banner</span>
            </button>

            <button
              onClick={() => { setActiveTab("orders"); setIsProductFormOpen(false); }}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "orders"
                  ? "bg-[#fbbf24] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Orders</span>
            </button>

            <button
              onClick={() => { setActiveTab("userAccess"); setIsProductFormOpen(false); }}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "userAccess"
                  ? "bg-[#fbbf24] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>User Access</span>
            </button>

            <button
              onClick={() => { setActiveTab("settings"); setIsProductFormOpen(false); }}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "settings"
                  ? "bg-[#fbbf24] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => { setActiveTab("gallery"); setIsProductFormOpen(false); }}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "gallery"
                  ? "bg-[#fbbf24] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Photo Gallery</span>
            </button>
          </nav>

          {/* Core Tab Canvas Wrapper */}
          <div className="p-6 flex-grow">
            
            {/* -------------------- VIEW A: DASHBOARD TAB -------------------- */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-display font-black text-white">Dashboard</h2>
                  <p className="text-xs text-gray-500">Overview of your sales</p>
                </div>

                {/* Grid stats layout matches layout of Screenshot 2 perfectly */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Total Orders Card */}
                  <div className="bg-[#140f10] border border-[#231a1c] rounded-2xl p-5 relative overflow-hidden group">
                    <ShoppingBag className="w-4 h-4 text-[#fbbf24] absolute top-5 right-5" />
                    <span className="text-[10px] uppercase font-bold text-gray-500 font-sans tracking-widest block">
                      TOTAL ORDERS
                    </span>
                    <span className="text-4xl font-display font-black text-[#fbbf24] block mt-4 select-none">
                      {totalOrdersCount}
                    </span>
                  </div>

                  {/* Paid Orders Card */}
                  <div className="bg-[#140f10] border border-[#231a1c] rounded-2xl p-5 relative overflow-hidden group">
                    <CheckCircle className="w-4 h-4 text-[#fbbf24] absolute top-5 right-5" />
                    <span className="text-[10px] uppercase font-bold text-gray-500 font-sans tracking-widest block font-medium">
                      PAID ORDERS
                    </span>
                    <span className="text-4xl font-display font-black text-[#fbbf24] block mt-4 select-none">
                      {paidOrdersCount}
                    </span>
                  </div>

                  {/* Revenue Card */}
                  <div className="bg-[#140f10] border border-[#231a1c] rounded-2xl p-5 relative overflow-hidden group">
                    <span className="text-lg font-bold text-[#fbbf24] absolute top-4 right-5 select-none font-sans">
                      ₹
                    </span>
                    <span className="text-[10px] uppercase font-bold text-gray-500 font-sans tracking-widest block font-medium">
                      TOTAL REVENUE
                    </span>
                    <span className="text-4xl font-display font-black text-[#fbbf24] block mt-4 select-none">
                      ₹{totalRevenueSum}
                    </span>
                  </div>

                  {/* Customers Card */}
                  <div className="bg-[#140f10] border border-[#231a1c] rounded-2xl p-5 relative overflow-hidden group">
                    <Users className="w-4 h-4 text-[#fbbf24] absolute top-5 right-5" />
                    <span className="text-[10px] uppercase font-bold text-gray-500 font-sans tracking-widest block font-medium">
                      CUSTOMERS
                    </span>
                    <span className="text-4xl font-display font-black text-[#fbbf24] block mt-4 select-none">
                      {uniqueEmails}
                    </span>
                  </div>
                </div>

                {/* Recent Orders table Box styled exactly like Screenshot 2 */}
                <div className="bg-[#140f10] border border-[#231a1c] rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-[#231a1c]">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                      Recent Orders
                    </h3>
                  </div>
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-xs font-sans text-gray-300">
                      <thead>
                        <tr className="bg-[#0e0a0b] text-[10px] font-bold text-gray-400 tracking-wider uppercase border-b border-[#231a1c]">
                          <th className="px-5 py-3">Customer</th>
                          <th className="px-5 py-3">Email</th>
                          <th className="px-5 py-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#231a1c]">
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="px-5 py-3.5 font-bold text-gray-200">{o.customerName}</td>
                            <td className="px-5 py-3.5 text-gray-400">{o.email}</td>
                            <td className="px-5 py-3.5 text-right font-black text-[#fbbf24] text-xs">
                              ₹{o.amount}
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan={3} className="px-5 py-8 text-center text-gray-600">
                              No orders logged yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------- VIEW B: PRODUCTS CATALOG TAB -------------------- */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-display font-black text-white">Products</h2>
                    <p className="text-xs text-gray-500">Manage your storefront catalog</p>
                  </div>
                  {!isProductFormOpen && (
                    <button
                      onClick={openNewProductForm}
                      className="py-2.5 px-4 bg-[#fbbf24] hover:bg-white text-black font-extrabold text-xs rounded-xl tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 font-sans cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-black stroke-[2.5px]" />
                      <span>NEW PRODUCT</span>
                    </button>
                  )}
                </div>

                {isProductFormOpen ? (
                  /* Create / Edit Inline Sub-Form */
                  <div className="bg-[#140f10] border border-[#231a1c] p-6 rounded-2xl space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between border-b border-[#231a1c] pb-3">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-sans">
                        <Sparkles className="w-4 h-4 text-[#fbbf24]" />
                        <span>{editingProduct ? "Modify Product Details" : "Publish new release"}</span>
                      </h3>
                      <button
                        onClick={() => setIsProductFormOpen(false)}
                        className="text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleProductSubmit} className="space-y-4 font-sans text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-gray-400 font-bold">Bundle Offer Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Get the Custom Gym Reels package"
                            value={prodTitle}
                            onChange={(e) => setProdTitle(e.target.value)}
                            className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-2 text-white outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-gray-400 font-bold">Category Line</label>
                          <input
                            type="text"
                            placeholder="e.g. Ultimate Master Pack"
                            value={prodCategory}
                            onChange={(e) => setProdCategory(e.target.value)}
                            className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-2 text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <label className="text-gray-400 font-bold">Sale Price (₹)</label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={prodPrice}
                            onChange={(e) => setProdPrice(Number(e.target.value))}
                            className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-2 text-white outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-gray-400 font-bold">Original Price (₹)</label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={prodOriginalPrice}
                            onChange={(e) => setProdOriginalPrice(Number(e.target.value))}
                            className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-2 text-white outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-gray-400 font-bold">Discount Tag</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. -97%"
                            value={prodDiscountTag}
                            onChange={(e) => setProdDiscountTag(e.target.value)}
                            className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-2 text-white outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-gray-400 font-bold">Offer Banner overlay text</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 100+ Health Reels Bundle"
                            value={prodDiscountText}
                            onChange={(e) => setProdDiscountText(e.target.value)}
                            className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-2 text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-gray-400 font-bold">Product Description Overview</label>
                        <textarea
                          rows={2}
                          required
                          value={prodDescription}
                          onChange={(e) => setProdDescription(e.target.value)}
                          className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-2 text-white outline-none resize-none"
                          placeholder="Provide a convincing summary for clients layout..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-gray-400 font-bold">
                          Deliverable Highlights (Paste individual lines to render list items)
                        </label>
                        <textarea
                          rows={2}
                          value={prodFeaturesInput}
                          onChange={(e) => setProdFeaturesInput(e.target.value)}
                          className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-2 text-white outline-none resize-none font-mono text-[11px]"
                          placeholder="Premium 9:16 portrait video files without logo&#10;Fully organized Starred Google Drive link folder"
                        />
                      </div>

                      {/* Product Image Selection & Input */}
                      <div className="space-y-2 bg-[#0a0708] p-4 rounded-xl border border-[#231a1c]">
                        <span className="text-gray-400 font-bold block mb-1">Product Cover Image (Photo)</span>
                        <div className="space-y-3">
                          <input
                            type="text"
                            required
                            placeholder="Paste custom image URL here"
                            value={prodImage}
                            onChange={(e) => setProdImage(e.target.value)}
                            className="w-full bg-[#140f10] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-2 text-white outline-none font-mono"
                          />
                          <span className="text-[10px] text-gray-500 block">Or select an aesthetic cover from the premium design gallery below:</span>
                          
                           {/* Aesthetic Design Gallery Picker */}
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1.5">
                            {gallery.map((galleryItem, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setProdImage(galleryItem.url)}
                                className={`group relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all active:scale-95 ${
                                  prodImage === galleryItem.url ? "border-amber-400 font-extrabold shadow-lg shadow-amber-500/10" : "border-[#231a1c] hover:border-gray-500"
                                }`}
                              >
                                <img
                                  src={galleryItem.url}
                                  alt={galleryItem.label}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-[8px] text-white font-sans bg-black/85 px-1 py-0.5 rounded-sm truncate max-w-full">
                                    {galleryItem.label}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Product Delivery Google Drive Link */}
                      <div className="space-y-2 bg-[#0a0708] p-4 rounded-xl border border-[#231a1c]">
                        <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Secure Google Drive Delivery Link</label>
                        <span className="text-[10px] text-gray-500 block leading-normal">
                          Paste the exact Google Drive folder URL containing the deliverables. Buyers will receive instant secure click access to this link inside their receipt upon successful payment completion.
                        </span>
                        <input
                          type="url"
                          placeholder="e.g. https://drive.google.com/drive/folders/..."
                          value={prodDriveLink}
                          onChange={(e) => setProdDriveLink(e.target.value)}
                          className="w-full bg-[#140f10] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-2 text-white font-mono text-[11px] outline-none mt-1"
                        />
                      </div>

                      {/* Product Demo Videos (Optional) */}
                      <div className="space-y-3 bg-[#0a0708] p-4 rounded-xl border border-[#231a1c]">
                        <div>
                          <span className="text-gray-400 font-bold block">Product Demo Previews (Optional .mp4 URLs)</span>
                          <span className="text-[10px] text-gray-500 block leading-normal">
                            Configure up to 4 portrait short clips (9:16) specific to this product. If left blank, they will automatically default to globally configured videos from settings.
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Demo Video 1 (.mp4 link)</label>
                            <input
                              type="url"
                              placeholder="e.g. https://player.vimeo.com/external/..."
                              value={prodDemoVideo1}
                              onChange={(e) => setProdDemoVideo1(e.target.value)}
                              className="w-full bg-[#140f10] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-1.5 text-white font-mono text-[11px] outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Demo Video 2 (.mp4 link)</label>
                            <input
                              type="url"
                              placeholder="e.g. https://player.vimeo.com/external/..."
                              value={prodDemoVideo2}
                              onChange={(e) => setProdDemoVideo2(e.target.value)}
                              className="w-full bg-[#140f10] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-1.5 text-white font-mono text-[11px] outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Demo Video 3 (.mp4 link)</label>
                            <input
                              type="url"
                              placeholder="e.g. https://player.vimeo.com/external/..."
                              value={prodDemoVideo3}
                              onChange={(e) => setProdDemoVideo3(e.target.value)}
                              className="w-full bg-[#140f10] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-1.5 text-white font-mono text-[11px] outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Demo Video 4 (.mp4 link)</label>
                            <input
                              type="url"
                              placeholder="e.g. https://player.vimeo.com/external/..."
                              value={prodDemoVideo4}
                              onChange={(e) => setProdDemoVideo4(e.target.value)}
                              className="w-full bg-[#140f10] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-1.5 text-white font-mono text-[11px] outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="py-2.5 px-6 bg-[#fbbf24] hover:bg-white text-black font-extrabold rounded-lg tracking-wide hover:shadow-lg transition-all"
                        >
                          {editingProduct ? "Apply Modifications" : "Launch In Storefront"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsProductFormOpen(false)}
                          className="py-2.5 px-6 bg-[#231a1c] hover:bg-[#231a1c]/80 text-white font-bold rounded-lg transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Matches product listings of Screenshot 3 */
                  <div className="space-y-3">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="bg-[#140f10] border border-[#231a1c] p-4 rounded-2xl flex items-center justify-between gap-4 transition-all hover:border-gray-800"
                      >
                        {/* Avatar & text details exactly like Screenshot 3 */}
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-[#231a1c] shrink-0">
                            <img
                              src={p.image}
                              alt={p.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-white font-sans max-w-[200px] sm:max-w-xs md:max-w-lg truncate leading-tight">
                              {p.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-extrabold text-[#fbbf24]">₹{p.price}</span>
                              <span className="text-gray-600 line-through">₹{p.originalPrice}</span>
                              <span>•</span>
                              {p.isHidden ? (
                                <span className="text-rose-400 bg-rose-500/5 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border border-rose-500/10">
                                  Hidden
                                </span>
                              ) : (
                                <span className="text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border border-emerald-500/10">
                                  Published
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Screenshot 3 actions triggers on right */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Eye / Toggle hide link */}
                          <button
                            onClick={() => togglePublishStatus(p)}
                            className={`p-2 rounded-xl border transition-colors ${
                              p.isHidden
                                ? "bg-[#231a1c]/40 border-rose-500/20 text-rose-400 hover:bg-[#231a1c]"
                                : "bg-[#140f10] border-[#231a1c] text-gray-400 hover:text-white hover:border-gray-500"
                            }`}
                            title={p.isHidden ? "Publish product to public view" : "Hide product from public view"}
                          >
                            {p.isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>

                          {/* Pencil Edit button */}
                          <button
                            onClick={() => openEditProductForm(p)}
                            className="p-2 bg-[#140f10] border border-[#231a1c] rounded-xl text-gray-400 hover:text-[#fbbf24] hover:border-amber-400/20 transition-colors"
                            title="Edit product parameters"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Trash Delete button */}
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            className="p-2 bg-[#140f10] border border-rose-950 text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/5 hover:border-rose-500/30 transition-colors"
                            title="Remove catalog product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* -------------------- VIEW C: DEMO VIDEOS TAB -------------------- */}
            {activeTab === "demoVideos" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-display font-black text-white">Demo Videos</h2>
                  <p className="text-xs text-gray-500">Manage promotional preview trailers</p>
                </div>

                <div className="bg-[#140f10] border border-[#231a1c] p-6 rounded-2xl space-y-4">
                  <span className="text-xs tracking-wider font-bold uppercase text-[#fbbf24] block">Featured Preview Reels Channel</span>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-xl">
                    These are 4 video shorts pre-loaded into client views to allow users to verify the resolution, aesthetic filters, and neon frames of the health compilation bundle immediately before they purchase.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#0a0708] border border-[#231a1c] p-4 rounded-xl space-y-2">
                      <h5 className="text-xs font-bold text-gray-300">Fitness Demo Clip 1 (Portrait URL)</h5>
                      <input
                        type="text"
                        value={video1}
                        onChange={(e) => setVideo1(e.target.value)}
                        className="w-full bg-[#140f10] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 outline-none"
                      />
                    </div>
                    <div className="bg-[#0a0708] border border-[#231a1c] p-4 rounded-xl space-y-2">
                      <h5 className="text-xs font-bold text-gray-300">Workout Demo Clip 2 (Portrait URL)</h5>
                      <input
                        type="text"
                        value={video2}
                        onChange={(e) => setVideo2(e.target.value)}
                        className="w-full bg-[#140f10] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 outline-none"
                      />
                    </div>
                    <div className="bg-[#0a0708] border border-[#231a1c] p-4 rounded-xl space-y-2">
                      <h5 className="text-xs font-bold text-gray-300">Yoga Demo Clip 3 (Portrait URL)</h5>
                      <input
                        type="text"
                        value={video3}
                        onChange={(e) => setVideo3(e.target.value)}
                        className="w-full bg-[#140f10] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 outline-none"
                      />
                    </div>
                    <div className="bg-[#0a0708] border border-[#231a1c] p-4 rounded-xl space-y-2">
                      <h5 className="text-xs font-bold text-gray-300">Running Demo Clip 4 (Portrait URL)</h5>
                      <input
                        type="text"
                        value={video4}
                        onChange={(e) => setVideo4(e.target.value)}
                        className="w-full bg-[#140f10] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onUpdateSettings({
                        ...settings,
                        video1,
                        video2,
                        video3,
                        video4,
                      });
                      alert("All 4 demo preview video links updated successfully!");
                    }}
                    className="py-2.5 px-6 bg-[#fbbf24] text-black font-extrabold text-xs rounded-xl hover:bg-white transition-all font-sans cursor-pointer font-sans"
                  >
                    Save Videos Settings
                  </button>
                </div>
              </div>
            )}

            {/* -------------------- VIEW D: BANNER FLASH SETTINGS TAB -------------------- */}
            {activeTab === "banner" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-display font-black text-white">Banner Settings</h2>
                  <p className="text-xs text-gray-500">Modify visual banners & alert notice slogans</p>
                </div>

                <div className="bg-[#140f10] border border-[#231a1c] p-6 rounded-2xl space-y-4">
                  <span className="text-xs tracking-wider font-bold uppercase text-[#fbbf24] block">Global Alert Ribbon Slogan</span>
                  <div className="space-y-4 max-w-xl font-sans text-xs">
                    <div className="space-y-1.5">
                      <label className="text-gray-400 font-semibold">Limited Offer Slogan (Displays as top alert badge)</label>
                      <input
                        type="text"
                        required
                        value={logoText}
                        onChange={(e) => setLogoText(e.target.value)}
                        className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-4 py-2.5 text-white"
                        placeholder="e.g. Digital Hub storefront"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-400 font-semibold">Hero Heading Focus</label>
                      <input
                        type="text"
                        required
                        value={footerText}
                        onChange={(e) => setFooterText(e.target.value)}
                        className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-4 py-2.5 text-white"
                        placeholder="e.g. Health Reels storefront"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onUpdateSettings({
                        ...settings,
                        logoText,
                        footerText,
                      });
                      alert("Main banner slogans modified successfully!");
                    }}
                    className="py-2.5 px-6 bg-[#fbbf24] text-black font-extrabold text-xs rounded-xl hover:bg-white transition-all font-sans cursor-pointer"
                  >
                    Save Slogans
                  </button>
                </div>
              </div>
            )}

            {/* -------------------- VIEW E: DETAILED ORDERS LIST (Screenshot 4) -------------------- */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-display font-black text-white">Orders & Customers</h2>
                    <p className="text-xs text-gray-500">Record of secure payment logs</p>
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="py-2.5 px-4 bg-[#fbbf24] hover:bg-white text-black font-extrabold text-xs rounded-xl tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 font-sans cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-black stroke-[2.5px]" />
                    <span>EXPORT CSV</span>
                  </button>
                </div>

                {/* Search Input bar exactly styled like Screenshot 4 */}
                <div className="relative font-sans text-xs max-w-lg">
                  <Search className="w-4 h-4 text-gray-600 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, email, mobile..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full bg-[#140f10] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-11 py-3 text-white outline-none placeholder-gray-600"
                  />
                </div>

                {/* Detailed Table matching Screenshot 4 */}
                <div className="bg-[#140f10] border border-[#231a1c] rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-xs font-sans text-gray-300">
                      <thead>
                        <tr className="bg-[#0e0a0b] text-[10px] font-bold text-gray-400 tracking-wider uppercase border-b border-[#231a1c]">
                          <th className="px-5 py-3">Name</th>
                          <th className="px-5 py-3">Email</th>
                          <th className="px-5 py-3">Mobile</th>
                          <th className="px-5 py-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#231a1c]">
                        {filteredOrders.map((o) => (
                          <tr key={o.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="px-5 py-4 font-bold text-gray-200 uppercase">{o.customerName}</td>
                            <td className="px-5 py-4 text-gray-400 font-mono text-[11px]">{o.email}</td>
                            <td className="px-5 py-4 text-gray-400 font-mono">{o.phone}</td>
                            <td className="px-5 py-4 text-right font-black text-[#fbbf24] text-xs">
                              ₹{o.amount}
                            </td>
                          </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-5 py-8 text-center text-gray-600">
                              No matching purchase orders found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------- VIEW F: USER ACCESS GRANT TAB (Screenshot 5) -------------------- */}
            {activeTab === "userAccess" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-display font-black text-white">User Access</h2>
                  <p className="text-xs text-gray-500">Grant free access by User ID (6 digits).</p>
                </div>

                {/* Form matches Screenshot 5 exactly */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="bg-[#140f10] border border-[#231a1c] p-6 rounded-2xl space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans border-b border-[#231a1c] pb-2">
                      Grant New Access
                    </h3>

                    <form onSubmit={handleGrantAccess} className="space-y-4 font-sans text-xs">
                      {/* User ID Field */}
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="User ID (6 digits)"
                          value={accessUserId}
                          onChange={(e) => setAccessUserId(e.target.value.replace(/\D/g, ""))}
                          className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-4 py-3 text-white outline-none transition-all placeholder-gray-600"
                        />
                      </div>

                      {/* Dropdown Select Field */}
                      <div className="space-y-1.5">
                        <select
                          value={accessProduct}
                          onChange={(e) => setAccessProduct(e.target.value)}
                          className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-4 py-3 text-white outline-none cursor-pointer"
                        >
                          <option value="All products (full access)">All products (full access)</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.title}>
                              {p.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Note Field */}
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          placeholder="Note (optional)"
                          value={accessNote}
                          onChange={(e) => setAccessNote(e.target.value)}
                          className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-4 py-3 text-white outline-none transition-all placeholder-gray-600"
                        />
                      </div>

                      {accessMessage && (
                        <div className="text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-3.5 py-2.5 rounded-xl font-bold">
                          {accessMessage}
                        </div>
                      )}

                      {/* Grant button matching Yellow style of Screenshot 5 */}
                      <button
                        type="submit"
                        className="py-3 px-5 bg-[#fbbf24] font-black text-black rounded-xl hover:bg-white tracking-wide uppercase transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5px]" />
                        <span>GRANT ACCESS</span>
                      </button>
                    </form>
                  </div>

                  {/* Active Grants List */}
                  <div className="bg-[#140f10] border border-[#231a1c] rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans border-b border-[#231a1c] pb-2">
                      Active Access Passes
                    </h3>

                    <div className="space-y-3 font-sans max-h-[300px] overflow-y-auto">
                      {userAccesses.map((ua) => (
                        <div
                          key={ua.id || ua.userId}
                          className="bg-[#0a0708] border border-[#231a1c] p-3.5 rounded-xl flex items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-yellow-400 tracking-widest text-xs bg-yellow-400/5 px-2 py-0.5 rounded border border-yellow-400/10">
                                ID: {ua.userId}
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono">{ua.date}</span>
                            </div>
                            <p className="text-[11px] text-gray-300 font-bold max-w-[180px] sm:max-w-xs truncate">
                              {ua.productName}
                            </p>
                            {ua.note && <p className="text-[10px] text-gray-600 leading-none">Note: {ua.note}</p>}
                          </div>

                          {onDeleteUserAccess && (
                            <button
                              onClick={() => {
                                if (confirm(`Revoke free access token for user ${ua.userId}?`)) {
                                  onDeleteUserAccess(ua.id || ua.userId);
                                }
                              }}
                              className="p-1 px-2 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 text-rose-400 text-[10px] font-bold rounded-lg transition-colors shrink-0"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      ))}
                      {userAccesses.length === 0 && (
                        <div className="text-center py-6 text-gray-600 text-xs">
                          No active complimentary access passes.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------- VIEW G: WEBSITE SETTINGS TAB (Screenshot 6/7) -------------------- */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-display font-black text-white">Website Settings</h2>
                  <p className="text-xs text-gray-500">Configure parameters instantly propagated on site</p>
                </div>

                {/* Configuration cards layout from Screenshot 6/7 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start font-sans text-xs">
                  
                  {/* Left Column Settings cards */}
                  <div className="space-y-6">
                    {/* Branding Info block */}
                    <div className="bg-[#140f10] border border-[#231a1c] p-6 rounded-2xl space-y-4">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#231a1c] pb-2">
                        Branding
                      </h3>

                      <div className="space-y-3.5">
                        <div className="space-y-1">
                          <label className="text-gray-400 font-semibold">Logo Text</label>
                          <input
                            type="text"
                            value={logoText}
                            onChange={(e) => setLogoText(e.target.value)}
                            className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-4 py-2.5 text-white outline-none transition-all"
                            placeholder="Digital Hub"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-gray-400 font-semibold">Logo Image URL (optional)</label>
                          <input
                            type="text"
                            value={logoImage}
                            onChange={(e) => setLogoImage(e.target.value)}
                            className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-4 py-2.5 text-white outline-none transition-all"
                            placeholder="https://..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-gray-400 font-semibold">Footer Text</label>
                          <textarea
                            rows={2}
                            value={footerText}
                            onChange={(e) => setFooterText(e.target.value)}
                            className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-4 py-2.5 text-white outline-none transition-all resize-none"
                            placeholder="© 2026 Health Reels. All rights reserved."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions Reset Panel */}
                    <div className="bg-[#140f10] border border-[#231a1c] p-6 rounded-2xl space-y-3">
                      <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        <span>Factory reset system</span>
                      </h3>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Restore initial default 3 catalog cards and orders to match standard starting blueprint design requested by Ashish Shinde instantly.
                      </p>
                      <button
                        onClick={() => {
                          onResetProducts();
                          alert("All databases successfully restored back to custom storefront default setup!");
                        }}
                        className="py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/15 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Standardize Default Settings Vault</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column Settings Cards */}
                  <div className="space-y-6">
                    {/* Payment Info block */}
                    <div className="bg-[#140f10] border border-[#231a1c] p-6 rounded-2xl space-y-4">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#231a1c] pb-2">
                        Payment
                      </h3>

                      <div className="space-y-1">
                        <label className="text-gray-400 font-semibold">Payment Link (Super Profile / Razorpay / UPI)</label>
                        <input
                          type="text"
                          value={paymentLink}
                          onChange={(e) => setPaymentLink(e.target.value)}
                          className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-4 py-2.5 text-white outline-none transition-all"
                          placeholder="https://reelsbazaar.com/"
                        />
                        <span className="text-[10px] text-gray-500 block leading-tight pt-1">
                          Customers will be redirected to this link to complete payment.
                        </span>
                      </div>
                    </div>

                    {/* Contact Info block */}
                    <div className="bg-[#140f10] border border-[#231a1c] p-6 rounded-2xl space-y-4">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#231a1c] pb-2">
                        Contact
                      </h3>

                      <div className="space-y-3.5">
                        <div className="space-y-1">
                          <label className="text-gray-400 font-semibold">Email</label>
                          <input
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-4 py-2.5 text-white outline-none transition-all"
                            placeholder="ashishrshinde15@gmail.com"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-gray-400 font-semibold">Phone</label>
                          <input
                            type="text"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-4 py-2.5 text-white outline-none transition-all"
                            placeholder="+919623508876"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Global Save Button block */}
                    <button
                      onClick={handleSaveSettings}
                      className="w-full py-4 bg-[#fbbf24] hover:bg-white text-black font-extrabold text-xs rounded-xl uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>SAVE CHANGES</span>
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* -------------------- VIEW H: DYNAMIC PHOTO GALLERY MANAGER -------------------- */}
            {activeTab === "gallery" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-display font-black text-white">Product Photo Gallery</h2>
                  <p className="text-xs text-gray-500">Add or manage photos used as catalog cover designs</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start font-sans text-xs">
                  {/* Left Column: Form to add image to gallery */}
                  <div className="bg-[#140f10] border border-[#231a1c] p-6 rounded-2xl space-y-4 md:col-span-1">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#231a1c] pb-2">
                      Add New Photo
                    </h3>

                    <form onSubmit={handleAddToGallery} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-gray-400 font-semibold">Image Label (Title)</label>
                        <input
                          type="text"
                          required
                          value={galleryNewLabel}
                          onChange={(e) => setGalleryNewLabel(e.target.value)}
                          className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-4 py-2.5 text-white outline-none transition-all text-xs"
                          placeholder="e.g. Health & Gym Bundle"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-gray-400 font-semibold">Image Direct URL</label>
                        <input
                          type="url"
                          required
                          value={galleryNewUrl}
                          onChange={(e) => setGalleryNewUrl(e.target.value)}
                          className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-[#fbbf24]/50 rounded-xl px-4 py-2.5 text-white outline-none transition-all text-xs font-mono"
                          placeholder="e.g. https://images.unsplash.com/photo-..."
                        />
                        <span className="text-[10px] text-gray-500 block leading-normal pt-1">
                          Paste a valid, direct image link (JPEG, PNG, or Unsplash source link).
                        </span>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#fbbf24] hover:bg-white text-black font-extrabold text-xs rounded-xl uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5px]" />
                        <span>Add To Gallery</span>
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Listing and deleting existing gallery images */}
                  <div className="bg-[#140f10] border border-[#231a1c] p-6 rounded-2xl space-y-4 md:col-span-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#231a1c] pb-2">
                      Manage Gallery Assets ({gallery.length})
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {gallery.map((item, index) => (
                        <div 
                          key={index}
                          className="group relative bg-[#0a0708] border border-[#231a1c] rounded-xl overflow-hidden flex flex-col justify-between h-44"
                        >
                          <div className="aspect-[4/3] w-full overflow-hidden relative bg-black/40">
                            <img 
                              src={item.url} 
                              alt={item.label}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>

                          <div className="p-2 space-y-1.5 flex-grow flex flex-col justify-between bg-[#0e0a0b] border-t border-[#1a1314]">
                            <div className="text-[10px] font-bold text-gray-200 truncate leading-tight">
                              {item.label}
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Are you sure you want to remove "${item.label}" from the gallery?`)) {
                                  handleDeleteFromGallery(index);
                                }
                              }}
                              className="w-full py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[9px] font-bold rounded border border-rose-500/10 flex items-center justify-center gap-1 transition-colors self-end mt-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      ))}

                      {gallery.length === 0 && (
                        <div className="col-span-full py-12 text-center text-xs text-gray-600">
                          Your custom Photo Gallery is empty. Add photo links using the form on the left.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
