import React from "react";
import { useStore } from "@nanostores/react";
import { Button } from "@/components/ui/button";
import {
  cartItems,
  isCartOpen,
  addToCart,
  removeFromCart,
  clearCart,
  getCartTotal,
} from "@/stores/cart";
import {
  isCheckoutOpen,
  customerName,
  tableNumber,
  phoneNumber,
  orderNotes,
  isSubmitting,
  orderSuccess,
  orderId,
  orderError,
  openCheckout,
  closeCheckout,
  processOrder,
  resetOrder,
} from "@/stores/order";

export default function Cart() {
  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);
  const $isCheckoutOpen = useStore(isCheckoutOpen);
  const $customerName = useStore(customerName);
  const $tableNumber = useStore(tableNumber);
  const $phoneNumber = useStore(phoneNumber);
  const $orderNotes = useStore(orderNotes);
  const $isSubmitting = useStore(isSubmitting);
  const $orderSuccess = useStore(orderSuccess);
  const $orderId = useStore(orderId);
  const $orderError = useStore(orderError);

  const items = Object.values($cartItems);
  const total = getCartTotal();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleCheckout = async () => {
    const orderItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.quantity,
    }));

    const success = await processOrder(orderItems, total);
    if (success) {
      clearCart();
    }
  };

  const handleNewOrder = () => {
    resetOrder();
    isCartOpen.set(false);
  };

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => isCartOpen.set(!$isCartOpen)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110"
        aria-label="Shopping Cart"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            {itemCount}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          $isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-600 to-green-700">
            <h2 className="text-xl font-bold text-white">🛒 Keranjang</h2>
            <button
              onClick={() => isCartOpen.set(false)}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {$orderSuccess ? (
              /* Order Success View */
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Pesanan Berhasil! 🎉
                </h3>
                {$orderId && (
                  <p className="text-gray-600 mb-2">
                    No. Pesanan:{" "}
                    <span className="font-semibold">{$orderId}</span>
                  </p>
                )}
                <p className="text-gray-500 text-sm mb-6">
                  Pesananmu sedang diproses. Mohon tunggu ya!
                </p>
                <Button
                  onClick={handleNewOrder}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
                >
                  Pesan Lagi
                </Button>
              </div>
            ) : $isCheckoutOpen ? (
              /* Checkout Form */
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Data Pemesan
                </h3>

                {$orderError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {$orderError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={$customerName}
                    onChange={(e) => customerName.set(e.target.value)}
                    placeholder="Masukkan nama"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. Meja
                  </label>
                  <input
                    type="text"
                    value={$tableNumber}
                    onChange={(e) => tableNumber.set(e.target.value)}
                    placeholder="Contoh: 5"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. HP (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={$phoneNumber}
                    onChange={(e) => phoneNumber.set(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catatan
                  </label>
                  <textarea
                    value={$orderNotes}
                    onChange={(e) => orderNotes.set(e.target.value)}
                    placeholder="Tambahkan catatan khusus..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Total Pembayaran</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatRupiah(total)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={closeCheckout}
                      variant="outline"
                      className="flex-1 py-6 rounded-xl"
                      disabled={$isSubmitting}
                    >
                      Kembali
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-6 rounded-xl"
                      disabled={$isSubmitting}
                    >
                      {$isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            ></path>
                          </svg>
                          Memproses...
                        </span>
                      ) : (
                        "Kirim Pesanan"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : items.length === 0 ? (
              /* Empty Cart */
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <span className="text-6xl mb-4">🛒</span>
                <p className="text-lg">Keranjang kosong</p>
                <p className="text-sm">Yuk tambahkan menu favoritmu!</p>
              </div>
            ) : (
              /* Cart Items */
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-green-100 flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🍽️
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 truncate">
                        {item.name}
                      </h4>
                      <p className="text-green-600 font-semibold">
                        {formatRupiah(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600 flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 text-green-600 flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && !$isCheckoutOpen && !$orderSuccess && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Total</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatRupiah(total)}
                </span>
              </div>
              <Button
                onClick={openCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 rounded-xl text-lg"
              >
                Checkout
              </Button>
              <button
                onClick={() => clearCart()}
                className="w-full mt-2 text-red-500 hover:text-red-700 text-sm py-2 transition-colors"
              >
                Kosongkan Keranjang
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {$isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => isCartOpen.set(false)}
        />
      )}
    </>
  );
}
