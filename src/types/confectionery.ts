export type CategoryKey = 
  | 'all'
  | 'dark-chocolates'
  | 'royal-sweets'
  | 'gourmet-candies'
  | 'bakery-cookies'
  | 'gift-hampers'
  | 'sugar-free';

export interface WeightOption {
  weight: string; // e.g. '250g', '500g', '1kg'
  price: number;
  mrp: number;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryKey;
  categoryName: string;
  description: string;
  tagline: string;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: 'Amazon Choice' | 'Best Seller' | 'Deal of the Day' | 'Festive Special';
  discountPercent: number;
  isVeg: boolean;
  isSugarFree: boolean;
  cocoaPercent?: number; // e.g. 70, 85
  shelfLife: string; // e.g. '45 Days'
  ingredients: string[];
  allergens: string;
  origin: string; // e.g., 'Single Origin Belgium', 'Pure Rajasthan Desi Ghee'
  weightOptions: WeightOption[];
  defaultWeight: string;
  inStock: boolean;
  stockCount: number;
  deliveryPromise: string; // e.g. 'Get it by Today, 8 PM'
  isDealOfTheDay?: boolean;
  claimedPercent?: number; // for deals
}

export interface CartItem {
  product: Product;
  selectedWeight: string;
  unitPrice: number;
  quantity: number;
}

export interface UserAddress {
  id: string;
  name: string;
  email?: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  type: 'Home' | 'Office' | 'Gift';
  isDefault?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  password?: string; // 5-digit password
  street: string;
  city: string; // 'Chandpur' (fixed)
  state: string; // 'Uttar Pradesh'
  pincode: string; // '246725' (fixed)
  isLoggedIn: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  weight: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'Order Confirmed' | 'Preparing Fresh Batch' | 'Out for Delivery' | 'Delivered';
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  address: UserAddress;
  paymentMethod: 'Cash on Delivery (COD)' | 'UPI / GPay / PhonePe' | 'Credit/Debit Card' | 'Sweet Coins';
  deliveryDate: string;
}

export interface CategoryItem {
  key: CategoryKey;
  name: string;
  hindiName: string;
  description: string;
  icon: string;
  image: string;
  itemCount: number;
  color: string;
}

export interface Testimonial {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  productName: string;
  helpfulCount: number;
}
