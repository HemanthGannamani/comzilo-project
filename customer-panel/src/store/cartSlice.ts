import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discountAmount: number;
}

const initialItems = localStorage.getItem('customer_cart')
  ? JSON.parse(localStorage.getItem('customer_cart')!)
  : [];

const initialState: CartState = {
  items: initialItems,
  couponCode: null,
  discountAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity || 1;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem('customer_cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ id: number | string; quantity: number }>) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity = Math.max(1, action.payload.quantity);
      }
      localStorage.setItem('customer_cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<number | string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem('customer_cart', JSON.stringify(state.items));
    },
    applyCoupon: (state, action: PayloadAction<{ code: string; discount: number }>) => {
      state.couponCode = action.payload.code;
      state.discountAmount = action.payload.discount;
    },
    clearCart: (state) => {
      state.items = [];
      state.couponCode = null;
      state.discountAmount = 0;
      localStorage.removeItem('customer_cart');
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, applyCoupon, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
