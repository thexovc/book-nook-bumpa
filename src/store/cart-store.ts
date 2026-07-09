import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book, CartItem } from '@/types/book';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartState {
  items: CartItem[];
  addItem: (book: Book) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (book: Book) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.book.id === book.id
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + 1,
            };
            return { items: newItems };
          }

          return { items: [...state.items, { book, quantity: 1 }] };
        }),

      removeItem: (bookId: string) =>
        set((state) => ({
          items: state.items.filter((item) => item.book.id !== bookId),
        })),

      updateQuantity: (bookId: string, quantity: number) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.book.id !== bookId) };
          }

          return {
            items: state.items.map((item) =>
              item.book.id === bookId ? { ...item, quantity } : item
            ),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'book-nook-cart',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Atomic selectors to prevent unnecessary re-renders
export const selectItems = (state: CartState) => state.items;
export const selectAddItem = (state: CartState) => state.addItem;
export const selectRemoveItem = (state: CartState) => state.removeItem;
export const selectUpdateQuantity = (state: CartState) => state.updateQuantity;
export const selectClearCart = (state: CartState) => state.clearCart;

export const selectTotalItems = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);

export const selectTotalPrice = (state: CartState) =>
  state.items.reduce((total, item) => total + item.book.price * item.quantity, 0);

export const selectItemQuantity = (bookId: string) => (state: CartState) => {
  const item = state.items.find((i) => i.book.id === bookId);
  return item ? item.quantity : 0;
};
