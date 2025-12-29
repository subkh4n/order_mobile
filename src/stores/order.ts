import { atom } from "nanostores";
import { submitOrder, type Order, type OrderItem } from "@/lib/api";

// Order state
export const customerName = atom("");
export const tableNumber = atom("");
export const phoneNumber = atom("");
export const orderNotes = atom("");
export const isSubmitting = atom(false);
export const orderSuccess = atom(false);
export const orderId = atom<string | null>(null);
export const orderError = atom<string | null>(null);

// Checkout modal state
export const isCheckoutOpen = atom(false);

// Actions
export function openCheckout() {
  isCheckoutOpen.set(true);
  orderError.set(null);
}

export function closeCheckout() {
  isCheckoutOpen.set(false);
}

export function resetOrder() {
  customerName.set("");
  tableNumber.set("");
  phoneNumber.set("");
  orderNotes.set("");
  orderSuccess.set(false);
  orderId.set(null);
  orderError.set(null);
  isCheckoutOpen.set(false);
}

export async function processOrder(items: OrderItem[], total: number) {
  const name = customerName.get();
  const table = tableNumber.get();
  const phone = phoneNumber.get();
  const notes = orderNotes.get();

  if (!name.trim()) {
    orderError.set("Nama pelanggan harus diisi");
    return false;
  }

  if (!phone.trim() && !table.trim()) {
    orderError.set("No. HP atau No. Meja harus diisi");
    return false;
  }

  isSubmitting.set(true);
  orderError.set(null);

  try {
    const order: Order = {
      customerName: name,
      tableNumber: table || undefined,
      phoneNumber: phone || undefined,
      items,
      total,
      notes: notes || undefined,
    };

    const result = await submitOrder(order);

    if (result.success) {
      orderSuccess.set(true);
      orderId.set(result.orderId || null);
      return true;
    } else {
      orderError.set(result.message);
      return false;
    }
  } catch (err) {
    orderError.set(
      err instanceof Error ? err.message : "Gagal memproses pesanan"
    );
    return false;
  } finally {
    isSubmitting.set(false);
  }
}
