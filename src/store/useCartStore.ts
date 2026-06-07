import { create } from 'zustand';
import type { CartItem, Pizza } from '../types';

interface CartState {
  items: CartItem[];
  paymentMethod: 'CARD' | 'CASH' | 'APPLE_PAY' | null;
  deliveryAddress: string;
  orderNotes: string;
  addItem: (pizza: Pizza) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setPaymentMethod: (method: 'CARD' | 'CASH' | 'APPLE_PAY') => void;
  setAddress: (address: string) => void;
  setNotes: (notes: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  paymentMethod: 'CARD',
  deliveryAddress: 'ul. Pixelowa 123, Cyfrowe Miasto',
  orderNotes: '',
  
  addItem: (pizza: Pizza) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.pizza.id === pizza.id && !item.pizza.isCustom);
      if (existingItem && !pizza.isCustom) {
        return {
          items: state.items.map((item) =>
            item.pizza.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return {
        items: [...state.items, { id: Math.random().toString(36).substr(2, 9), pizza, quantity: 1 }],
      };
    });
  },

  removeItem: (itemId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  updateQuantity: (itemId: string, quantity: number) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0),
    }));
  },

  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setAddress: (deliveryAddress) => set({ deliveryAddress }),
  setNotes: (orderNotes) => set({ orderNotes }),
  
  clearCart: () => set({ items: [] }),
  
  getTotal: () => {
    return get().items.reduce((total, item) => total + item.pizza.price * item.quantity, 0);
  },
}));
