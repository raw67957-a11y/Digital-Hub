export interface Product {
  id: string;
  title: string;
  originalPrice: number;
  price: number;
  discountTag: string;
  discountText: string;
  image: string;
  checkoutImage?: string;
  mainVideo?: string;
  category: string;
  rating: number;
  buyersCount: number;
  features: string[];
  description: string;
  isHidden?: boolean;
  driveLink?: string;
  demoVideo1?: string;
  demoVideo2?: string;
  demoVideo3?: string;
  demoVideo4?: string;
  directLink?: string;
  bypassPayment?: boolean;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface OrderForm {
  name: string;
  email: string;
  phone: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: "flat" | "percentage";
  value: number;
}

