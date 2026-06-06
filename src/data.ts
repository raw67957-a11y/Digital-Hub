import { Product, Review } from "./types";
import healthReelsBundleNoDiscount from "./assets/images/health_reels_bundle_no_discount_1780747068894.png";

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    title: "New Product (Health Reels)",
    originalPrice: 199,
    price: 99,
    discountTag: "",
    discountText: "100+ Health Reels Bundle",
    image: healthReelsBundleNoDiscount,
    category: "Health & Fitness",
    rating: 4.8,
    buyersCount: 1420,
    description: "Get premium, high-converting vertical video clips optimized for Instagram Reels, YouTube Shorts, and TikTok. Boost your social media page immediately with professional workout guidance, fitness motivation, and dietary content.",
    features: [
      "100+ Premium HD vertical videos without any watermark",
      "Ready-to-upload files (9:16 portrait ratio, highly engaging)",
      "High-energy background audio & professional voiceovers included",
      "Ready subtitles / captions to maximize engagement metrics",
      "Fully organized in a central, high-speed Google Drive link",
      "Lifetime updates: get new health videos added monthly for free",
      "No copyright strikes: fully cleared for personal and commercial use"
    ]
  },
  {
    id: "prod-2",
    title: "New Product (Yoga & Wellness)",
    originalPrice: 199,
    price: 99,
    discountTag: "",
    discountText: "100+ Health Reels Bundle",
    image: healthReelsBundleNoDiscount,
    category: "Mindfulness & Yoga",
    rating: 4.9,
    buyersCount: 980,
    description: "Deepen your community engagement with ready-made meditation, breathing, and stretching clips. Complete with slow-cinematic aesthetic visuals, relaxing lo-fi background tracks, and motivational quote overlays.",
    features: [
      "100+ Ambient and relaxing 4K vertical clips",
      "Ready-to-post stretching tutorials and daily meditation cues",
      "Perfect for coaches, yoga studios, and wellness bloggers",
      "Easily add your logo using Canva or CapCut (templates included)",
      "Instant access link delivered straight to your email",
      "Commercial rights included: build or monetize your page safely",
      "Premium aesthetic typography overlays pre-baked on videos"
    ]
  },
  {
    id: "prod-3",
    title: "Get The Ultimate Health Reels Bundle",
    originalPrice: 599,
    price: 15,
    discountTag: "-97%",
    discountText: "100+ Health Reels Bundle",
    image: healthReelsBundleNoDiscount,
    category: "Ultimate Master Pack",
    rating: 5.0,
    buyersCount: 8430,
    description: "Our massive, complete health & fitness video empire collection. Contains every single health reel we've ever designed — from nutrition tips, muscle building, yoga routines, to mental wellness guides. At a massive 97% discount for a limited time!",
    features: [
      "Full digital library vault: 500+ premium viral video files",
      "Detailed diet plan charts & nutritional guides (PDF + Canva links)",
      "Includes editable high-converting thumbnail templates",
      "Secret viral hashtags list to rank #1 on Instagram Explore page",
      "Step-by-step master PDF on how to schedule and automate reels",
      "Instant premium file server delivery — no slow downloads",
      "Lifetime VIP Support & priority update alerts via email"
    ]
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Aman Shinde",
    rating: 5,
    comment: "Bhai maza aa gaya! Best pricing and superb video quality. Instantly downloaded the Google Drive link after payment.",
    date: "A day ago"
  },
  {
    id: "rev-2",
    name: "Rohan Patel",
    rating: 5,
    comment: "Used the ultimate bundle to grow my fitness page from 100 followers to 15k followers in less than 3 weeks! Outstanding resource.",
    date: "3 days ago"
  },
  {
    id: "rev-3",
    name: "Pooja Mehta",
    rating: 4,
    comment: "The health tips videos and nutritional guides are highly informative. Excellent value for only ₹15!",
    date: "1 week ago"
  }
];
