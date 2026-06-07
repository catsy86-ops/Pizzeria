export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  toppings: Topping[];
  isCustom?: boolean;
}

export interface CartItem {
  id: string;
  pizza: Pizza;
  quantity: number;
}

export type OrderStatus = 'Received' | 'Preparing' | 'Baking' | 'Quality Check' | 'Out for Delivery' | 'Delivered';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}
