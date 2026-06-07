import React, { useState } from "react";
import { Product, DiscountCode } from "../types";
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
  discountCodes?: DiscountCode[];
  onUpdateDiscountCodes?: (codes: DiscountCode[]) => void;
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
  discountCodes = [],
  onUpdateDiscountCodes,
}: AdminPanelProps) {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Tabs: 'dashboard', 'products', 'orders', 'settings'
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "products" | "orders" | "settings"
  >("dashboard");

  // Local Action States
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Search filter for Orders
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  // Product Form Input States
  const [prodTitle, setProdTitle] = useState("");
  const [prodPrice, setProdPrice] = useState(49);
  const [prodOriginalPrice, setProdOriginalPrice] = useState(149);
  const [prodDiscountText, setProdDiscountText] = useState("120+ Viral Templates");
  const [prodDescription, setProdDescription] = useState("");
  const [prodFeaturesInput, setProdFeaturesInput] = useState("");
  const [prodImage, setProdImage] = useState("");
  const [prodCheckoutImage, setProdCheckoutImage] = useState("");
  const [prodMainVideo, setProdMainVideo] = useState("");
  const [prodDriveLink, setProdDriveLink] = useState("");
  const [prodDirectLink, setProdDirectLink] = useState("");

  // Settings Temp States
  const [logoText, setLogoText] = useState(settings.logoText || "Digital Hub");
  const [logoImage, setLogoImage] = useState(settings.logoImage || "https://ibb.co/N6MFf1N");
  const [footerText, setFooterText] = useState(settings.footerText || "© 2026 Health Reels. All rights reserved.");
  const [paymentLink, setPaymentLink] = useState(settings.paymentLink || "https://reelsbazaar.com/");
  const [contactEmail, setContactEmail] = useState(settings.email || "ashishrshinde15@gmail.com");
  const [contactPhone, setContactPhone] = useState(settings.phone || "+91 96235 08876");

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
    setProdDiscountText("100+ Health Reels Bundle");
    setProdDescription("");
    setProdFeaturesInput("");
    setProdImage("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80");
    setProdCheckoutImage("");
    setProdMainVideo("");
    setProdDriveLink("");
    setProdDirectLink("");
    setIsProductFormOpen(true);
  };

  const openEditProductForm = (product: Product) => {
    setEditingProduct(product);
    setProdTitle(product.title);
    setProdPrice(product.price);
    setProdOriginalPrice(product.originalPrice);
    setProdDiscountText(product.discountText);
    setProdDescription(product.description);
    setProdFeaturesInput(product.features.join("\n"));
    setProdImage(product.image);
    setProdCheckoutImage(product.checkoutImage || "");
    setProdMainVideo(product.mainVideo || "");
    setProdDriveLink(product.driveLink || "");
    setProdDirectLink(product.directLink || "");
    setIsProductFormOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim()) return;

    const featuresArray = prodFeaturesInput
      ? prodFeaturesInput.split("\n").map((f) => f.trim()).filter(Boolean)
      : ["Premium vertical clips", "Lifetime Access Included", "HD Video files directly in Drive"];

    const calculatedDiscountTag = `-${Math.round(((Number(prodOriginalPrice) - Number(prodPrice)) / Number(prodOriginalPrice)) * 100)}%`;

    if (editingProduct) {
      // Update
      const updated: Product = {
        ...editingProduct,
        title: prodTitle,
        price: Number(prodPrice),
        originalPrice: Number(prodOriginalPrice),
        discountTag: calculatedDiscountTag,
        discountText: prodDiscountText,
        image: prodImage || editingProduct.image,
        checkoutImage: prodCheckoutImage || undefined,
        mainVideo: prodMainVideo || undefined,
        description: prodDescription.trim(),
        features: featuresArray,
        driveLink: prodDriveLink.trim() || undefined,
        directLink: prodDirectLink.trim() || undefined,
      };
      onUpdateProduct(updated);
    } else {
      // Create new
      const created: Product = {
        id: `prod-${Date.now()}`,
        title: prodTitle,
        price: Number(prodPrice),
        originalPrice: Number(prodOriginalPrice),
        discountTag: calculatedDiscountTag,
        discountText: prodDiscountText,
        image: prodImage || "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=500&auto=format&fit=crop&q=80",
        checkoutImage: prodCheckoutImage || undefined,
        mainVideo: prodMainVideo || undefined,
        category: "Bundles",
        rating: 4.9,
        buyersCount: 1,
        description: prodDescription.trim() || "Premium custom catalog bundle updated.",
        features: featuresArray,
        driveLink: prodDriveLink.trim() || undefined,
        directLink: prodDirectLink.trim() || undefined,
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
  const validOrders = orders.filter((o) => (o as any).status !== "Cancel");
  const totalOrdersCount = orders.length;
  const paidOrdersCount = validOrders.length;
  const totalRevenueSum = validOrders.reduce((acc, curr) => acc + curr.amount, 0);
  const uniqueEmails = Array.from(new Set(validOrders.map((o) => o.email.toLowerCase()))).length;

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

                {/* Highly Informative Direct Payment Link Setup Guide Container */}
                <div className="bg-[#140f10] border border-amber-500/20 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-wider">
                        Direct Payment Flow Guide (How to give Access Automatically)
                      </h4>
                      <p className="text-[10px] text-[#fbbf24] font-bold mt-0.5">
                        Bypass checkout settings operational guide for Cashfree / Coseller link setup
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    Jab aap <strong>Cashfree / Coseller / Instamojo</strong> ka direct check-out link lagate hain, toh transaction successful hone ke baad customer ko automatically <strong>Google Drive Links (Access Folder)</strong> dene ke <strong>2 sabse genuine and trusted automatic tareeqe</strong> hain:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="bg-black/50 border border-[#231a1c] p-4 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-amber-400 text-black font-black px-1.5 py-0.5 rounded">METHOD 1</span>
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">Auto-Redirect (Return URL)</h5>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        Apne <strong>Cashfree or Coseller Merchant Dashboard</strong> mein jayein aur us payment link/product settings ko edit karein. Wahan par <strong>"Return URL" / "Redirect URL after Payment"</strong> ka option hoga. Us safety field mein us specific product ka <strong>Google Drive / Delivery link</strong> daal dein. Payment complete hote hi user drive link par redirect ho jayega!
                      </p>
                    </div>

                    <div className="bg-black/50 border border-[#231a1c] p-4 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-amber-400 text-black font-black px-1.5 py-0.5 rounded">METHOD 2</span>
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">Success Page Message / Note</h5>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        Cashfree Link settings web form mein click karke click-action customized confirmation screen edit karein. Wahan <strong>"Thank You Message" / "Show Custom Message after payment"</strong> setup enable karein aura likhein: <em>"Aapki payment safal rahi! Ultimate Reels Bundle folder access karne ke liye yahan click karein: [Paste Google Drive Link]"</em>.
                      </p>
                    </div>
                  </div>

                  <div className="text-[10px] text-gray-500 pt-1 font-mono flex items-center gap-1.5 justify-center sm:justify-start">
                    <span>⚡ No manual verification needed • 100% Automated Customer Access</span>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                        <label className="text-gray-400 font-bold">Product Description</label>
                        <textarea
                          rows={6}
                          required
                          value={prodDescription}
                          onChange={(e) => setProdDescription(e.target.value)}
                          className="w-full bg-[#0a0708] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-2 text-white outline-none resize-y"
                          placeholder="Provide a complete description for your product. You can write multiple lines here..."
                        />
                      </div>

                       {/* Product Image Selection & Input */}
                      <div className="space-y-4 bg-[#0a0708] p-4 rounded-xl border border-[#231a1c]">
                        <div className="flex items-center justify-between">
                          <span className="text-[#fbbf24] font-extrabold text-xs uppercase tracking-wider block">Product Cover Image (Photo)</span>
                          <span className="text-[10px] text-gray-500 font-bold">Recommended: 16:9 ratio</span>
                        </div>
                        
                        {/* Live Cover Preview */}
                        {prodImage && (
                          <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-[#231a1c] bg-black/40">
                            <img 
                              src={prodImage} 
                              alt="Cover Preview" 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-2 flex justify-between items-center">
                              <span className="text-[9px] text-emerald-400 font-bold bg-[#0a0708]/90 px-1.5 py-0.5 rounded border border-emerald-500/20">PREVIEW LIVE</span>
                              <button 
                                type="button" 
                                onClick={() => setProdImage("")}
                                className="text-[9px] text-red-400 font-bold bg-[#0a0708]/90 px-1.5 py-0.5 rounded border border-red-500/20 hover:bg-red-500/10 transition-colors"
                              >
                                Clear Image ✕
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Option A: Direct Gallery Upload 📁</label>
                              <div className="relative group flex items-center justify-center bg-[#140f10] hover:bg-[#1a1415] border border-dashed border-[#231a1c] hover:border-amber-400/50 rounded-lg px-3 py-2.5 transition-all cursor-pointer text-center min-h-[46px]">
                                <span className="text-[11px] text-amber-400 group-hover:text-amber-300 font-black flex items-center gap-1">
                                  <span>📁 Select Photo from Gallery</span>
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        if (typeof reader.result === "string") {
                                          setProdImage(reader.result);
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Option B: Image URL (Link)</label>
                              <input
                                type="text"
                                placeholder="Paste custom web image URL here"
                                value={prodImage.startsWith("data:") ? "" : prodImage}
                                onChange={(e) => setProdImage(e.target.value)}
                                className="w-full bg-[#140f10] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-2 text-white outline-none font-mono text-xs min-h-[46px]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Checkout Page Image Override */}
                      <div className="space-y-4 bg-[#0a0708] p-4 rounded-xl border border-[#231a1c]">
                        <div className="flex items-center justify-between">
                          <span className="text-[#fbbf24] font-extrabold text-xs uppercase tracking-wider block">Digital Product Main Photo</span>
                          <span className="text-[10px] text-gray-500 font-bold">Checkout Modal Cover</span>
                        </div>
                        
                        {/* Live Checkout Cover Preview */}
                        {prodCheckoutImage && (
                          <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-[#231a1c] bg-black/40">
                            <img 
                              src={prodCheckoutImage} 
                              alt="Checkout Preview" 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-2 flex justify-between items-center">
                              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/60 text-amber-400 border border-amber-500/20 backdrop-blur-md">
                                Preview
                              </span>
                              <button
                                type="button"
                                onClick={() => setProdCheckoutImage("")}
                                className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-md hover:bg-red-500/40 font-bold backdrop-blur-md cursor-pointer transition-colors"
                              >
                                Discard
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Option A: Direct Gallery Upload 📁</label>
                              <div className="relative group flex items-center justify-center bg-[#140f10] hover:bg-[#1a1415] border border-dashed border-[#231a1c] hover:border-amber-400/50 rounded-lg px-3 py-2.5 transition-all cursor-pointer text-center min-h-[46px]">
                                <span className="text-[11px] text-amber-400 group-hover:text-amber-300 font-black flex items-center gap-1">
                                  <span>📁 Select Photo from Gallery</span>
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        if (typeof reader.result === "string") {
                                          setProdCheckoutImage(reader.result);
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Option B: Image URL (Link)</label>
                              <input
                                type="text"
                                placeholder="Paste custom web image URL here"
                                value={prodCheckoutImage.startsWith("data:") ? "" : prodCheckoutImage}
                                onChange={(e) => setProdCheckoutImage(e.target.value)}
                                className="w-full bg-[#140f10] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-2 text-white outline-none font-mono text-xs min-h-[46px]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Main Video Optional Input */}
                      <div className="space-y-4 bg-[#0a0708] p-4 rounded-xl border border-[#231a1c]">
                        <div className="flex items-center justify-between">
                          <span className="text-[#fbbf24] font-extrabold text-xs uppercase tracking-wider block">Main Video Link</span>
                          <span className="text-[10px] text-gray-500 font-bold">Extra Main Video Option</span>
                        </div>
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Video URL (e.g. mp4)</label>
                              <input
                                type="text"
                                placeholder="Paste video link here"
                                value={prodMainVideo}
                                onChange={(e) => setProdMainVideo(e.target.value)}
                                className="w-full bg-[#140f10] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-2 text-white outline-none font-mono text-xs"
                              />
                            </div>
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

                      {/* Product Direct Link Payment Page URL Option */}
                      <div className="space-y-3 bg-[#0a0708] p-4 rounded-xl border border-[#231a1c]">
                        <div>
                          <label className="text-xs text-amber-400 font-bold uppercase tracking-wider block">Direct Payment / Checkout Link (URL)</label>
                          <span className="text-[10px] text-gray-400 block leading-normal mt-0.5">
                            Provide the direct payment or checkout gateway URL for this product specifically (e.g. Coseller, Cashfree, or Instamojo). Clicking "Access Now" will immediately send visitors to this URL to complete payment.
                          </span>
                        </div>
                        <input
                          type="url"
                          placeholder="e.g. https://coseller.co/buy/your-reels-bundle-package"
                          value={prodDirectLink}
                          onChange={(e) => setProdDirectLink(e.target.value)}
                          className="w-full bg-[#140f10] border border-[#231a1c] focus:border-amber-400/50 rounded-lg px-3 py-2 text-white font-mono text-[11px] outline-none"
                        />
                        <p className="text-[9px] text-gray-500 font-sans">
                          If left empty, users will automatically fall back to the global store link configured in global settings.
                        </p>
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
                              {p.directLink ? (
                                <span className="text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border border-amber-500/10" title={p.directLink}>
                                  🔗 Custom Link
                                </span>
                              ) : (
                                <span className="text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border border-blue-500/10">
                                  🌐 Default Link
                                </span>
                              )}
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
                          <th className="px-5 py-3 text-right">Status</th>
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
                            <td className="px-5 py-4 text-right text-xs">
                              <span className={`px-2 py-0.5 rounded-full font-bold ${
                                (o as any).status === "Cancel" ? "text-red-400 bg-red-500/10 border border-red-500/20" : "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                              }`}>
                                {(o as any).status === "Cancel" ? "Cancel" : "Success"}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-5 py-8 text-center text-gray-600">
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
                            placeholder="+91 96235 08876"
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

          </div>
        </div>
      )}
    </div>
  );
}
