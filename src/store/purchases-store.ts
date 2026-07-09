import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '@/types/book';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface PurchaseOrder {
  orderId: string;
  date: string;
  items: CartItem[];
  totalPrice: number;
}

interface PurchasesState {
  orders: PurchaseOrder[];
  addOrder: (order: PurchaseOrder) => void;
  clearPurchases: () => void;
}

export const usePurchasesStore = create<PurchasesState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order: PurchaseOrder) =>
        set((state) => ({ orders: [order, ...state.orders] })),
      clearPurchases: () => set({ orders: [] }),
    }),
    {
      name: 'book-nook-purchases',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const selectOrders = (state: PurchasesState) => state.orders;
export const selectAddOrder = (state: PurchasesState) => state.addOrder;
export const selectClearPurchases = (state: PurchasesState) => state.clearPurchases;
