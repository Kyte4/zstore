export interface User {
  username: string;
  email: string;
  avatar_url?: string;
  cart: CartItem[];
}

export interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  image?: string;
}

export interface Notification {
  message: string;
  visible: boolean;
}

export type AuthMode = 'none' | 'login' | 'register';