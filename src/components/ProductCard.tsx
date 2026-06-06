import React, { useState } from "react";
import { Product } from "../types";
import { Edit2, Eye, ShieldCheck, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  key?: string;
  product: Product;
  onSelect: (product: Product) => void;
  isEditMode: boolean;
  onUpdateProduct: (updated: Product) => void;
}

export default function ProductCard({ product, onSelect, isEditMode, onUpdateProduct }: ProductCardProps) {
  const [isEditingInPlace, setIsEditingInPlace] = useState(false);
  const [tempTitle, setTempTitle] = useState(product.title);
  const [tempPrice, setTempPrice] = useState(product.price);
  const [tempOriginalPrice, setTempOriginalPrice] = useState(product.originalPrice);
  const [tempDiscountTag, setTempDiscountTag] = useState(product.discountTag);
  const [tempDiscountText, setTempDiscountText] = useState(product.discountText);

  const handleSaveInPlace = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProduct({
      ...product,
      title: tempTitle,
      price: Number(tempPrice),
      originalPrice: Number(tempOriginalPrice),
      discountTag: tempDiscountTag,
      discountText: tempDiscountText
    });
    setIsEditingInPlace(false);
  };

  return (
    <div 
      className="group bg-[#140f10] border border-[#231a1c] hover:border-amber-400/40 rounded-2xl sm:rounded-[2rem] p-2.5 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-amber-400/5 cursor-pointer relative h-full"
      onClick={() => !isEditingInPlace && onSelect(product)}
      id={`product-card-${product.id}`}
    >
      {/* Top Section: Image segment */}
      <div className="relative aspect-[16/9] rounded-xl sm:rounded-[1.5rem] overflow-hidden bg-black/40">
        <img
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Subtle black overlay to make content readable */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
 
        {/* Quick action overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-xs transition-opacity duration-300">
          <div className="bg-[#fbbf24] hover:bg-white text-black font-extrabold text-xs sm:text-sm px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Eye className="w-3.5 h-3.5" />
            <span>View Info</span>
          </div>
        </div>
      </div>
 
      {/* Bottom Section: Details */}
      <div className="mt-3 sm:mt-5 px-0.5 sm:px-1 pb-1 sm:pb-2 flex-grow flex flex-col justify-between">
        {isEditingInPlace ? (
          <form onClick={(e) => e.stopPropagation()} onSubmit={handleSaveInPlace} className="space-y-3 bg-[#0a0708] p-3 rounded-xl border border-amber-400">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider font-sans">Quick Edit Product</div>
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="w-full bg-[#140f10] text-white text-sm p-1.5 rounded border border-[#231a1c]"
              placeholder="Product Title"
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={tempPrice}
                onChange={(e) => setTempPrice(Number(e.target.value))}
                className="w-full bg-[#140f10] text-white text-xs p-1.5 rounded border border-[#231a1c]"
                placeholder="Price"
                required
              />
              <input
                type="number"
                value={tempOriginalPrice}
                onChange={(e) => setTempOriginalPrice(Number(e.target.value))}
                className="w-full bg-[#140f10] text-white text-xs p-1.5 rounded border border-[#231a1c]"
                placeholder="Original"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={tempDiscountTag}
                onChange={(e) => setTempDiscountTag(e.target.value)}
                className="w-full bg-[#140f10] text-white text-xs p-1.5 rounded border border-[#231a1c]"
                placeholder="-50%"
                required
              />
              <input
                type="text"
                value={tempDiscountText}
                onChange={(e) => setTempDiscountText(e.target.value)}
                className="w-full bg-[#140f10] text-white text-xs p-1.5 rounded border border-[#231a1c]"
                placeholder="Label"
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-1 bg-emerald-500 text-black font-bold text-xs rounded">Save</button>
              <button type="button" onClick={() => setIsEditingInPlace(false)} className="flex-1 py-1 bg-[#231a1c] text-white text-xs rounded">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col justify-between h-full flex-grow">
            {/* Title */}
            <h3 className="text-xs sm:text-base md:text-[20px] font-display font-medium text-white leading-tight sm:leading-snug group-hover:text-amber-300 transition-colors line-clamp-2 min-h-[2.4rem] sm:min-h-[2.8rem]">
              {product.title}
            </h3>
 
            {/* Price section with glowing animated Buy Now button next to it */}
            <div className="mt-2 sm:mt-4 flex items-center justify-between gap-1.5 select-none">
              <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-sm sm:text-2xl font-black text-[#fbbf24]">
                  ₹{product.price}
                </span>
                <span className="text-[10px] sm:text-sm font-medium text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
                {product.discountTag && (
                  <span className="bg-amber-400/10 text-[#fbbf24] border border-amber-400/20 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {product.discountTag} OFF
                  </span>
                )}
              </div>

              {/* Glowing Animated Buy Now badge overlay */}
              <div className="bg-[#fbbf24] text-black font-sans font-black text-[10px] sm:text-xs px-2.5 sm:px-3.5 py-1 px-3 sm:py-1.5 rounded-xl sm:rounded-full shadow-[0_0_15px_rgba(251,191,36,0.85)] animate-pulse flex items-center gap-1 shrink-0">
                <span>Buy Now</span>
                <span className="text-[10px] sm:text-xs">⚡</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Trigger for Admin Panel */}
      {isEditMode && !isEditingInPlace && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditingInPlace(true);
          }}
          className="absolute bottom-4 right-4 p-2 bg-[#2a1f21] border border-[#3d2f32] text-amber-400 rounded-full hover:bg-amber-400 hover:text-black transition-all shadow-lg"
          title="Quick Edit Info"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
