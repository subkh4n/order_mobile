// =========================================
// Cart Store - Shopping Cart Management
// =========================================

import { atom, map, computed } from "nanostores";

// ===== Types =====

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  note?: string;
}

// ===== State =====

export const isCartOpen = atom(false);
export const cartItems = map<Record<string, CartItem>>({});

// ===== Computed =====

export const cartItemsArray = computed(cartItems, (items) =>
  Object.values(items)
);

export const cartTotal = computed(cartItems, (items) =>
  Object.values(items).reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
);

export const cartItemCount = computed(cartItems, (items) =>
  Object.values(items).reduce((count, item) => count + item.quantity, 0)
);

// ===== Actions =====

export function addToCart(item: Omit<CartItem, "quantity">) {
  const existingItem = cartItems.get()[item.id];

  if (existingItem) {
    cartItems.setKey(item.id, {
      ...existingItem,
      quantity: existingItem.quantity + 1,
    });
  } else {
    cartItems.setKey(item.id, {
      ...item,
      quantity: 1,
    });
  }
}

export function removeFromCart(id: string) {
  const existingItem = cartItems.get()[id];

  if (existingItem && existingItem.quantity > 1) {
    cartItems.setKey(id, {
      ...existingItem,
      quantity: existingItem.quantity - 1,
    });
  } else {
    const items = { ...cartItems.get() };
    delete items[id];
    cartItems.set(items);
  }
}

export function updateItemNote(id: string, note: string) {
  const existingItem = cartItems.get()[id];
  if (existingItem) {
    cartItems.setKey(id, {
      ...existingItem,
      note,
    });
  }
}

export function setItemQuantity(id: string, quantity: number) {
  if (quantity <= 0) {
    const items = { ...cartItems.get() };
    delete items[id];
    cartItems.set(items);
  } else {
    const existingItem = cartItems.get()[id];
    if (existingItem) {
      cartItems.setKey(id, {
        ...existingItem,
        quantity,
      });
    }
  }
}

export function clearCart() {
  cartItems.set({});
}

// Legacy functions for backward compatibility
export function getCartTotal(): number {
  return cartTotal.get();
}

export function getCartItemCount(): number {
  return cartItemCount.get();
}
