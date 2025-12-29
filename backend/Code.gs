/**
 * ORDER_MOBILE - Google Apps Script Backend
 *
 * SETUP:
 * 1. Buat Google Spreadsheet baru
 * 2. Buka Extensions > Apps Script
 * 3. Copy-paste seluruh kode ini
 * 4. Buat sheet "Products" dengan kolom: ID, Nama, Harga, Kategori, Deskripsi, Gambar
 * 5. Buat sheet "Categories" dengan kolom: ID, Nama
 * 6. Buat sheet "Orders" dengan kolom: OrderID, Timestamp, CustomerName, TableNumber, PhoneNumber, Items, Total, Notes, Status
 * 7. Deploy > New Deployment > Web App
 * 8. Atur akses "Anyone" dan deploy
 * 9. Copy URL dan update di api.ts
 */

// Konfigurasi nama sheet
const SHEETS = {
  PRODUCTS: "Products",
  CATEGORIES: "Categories",
  ORDERS: "Orders",
};

// Handler untuk GET request
function doGet(e) {
  const action = e.parameter.action;

  try {
    switch (action) {
      case "getProducts":
        return jsonResponse(getProducts());
      case "getCategories":
        return jsonResponse(getCategories());
      case "getOrderStatus":
        return jsonResponse(getOrderStatus(e.parameter.orderId));
      default:
        return jsonResponse({ status: "error", message: "Invalid action" });
    }
  } catch (error) {
    return jsonResponse({ status: "error", message: error.message });
  }
}

// Handler untuk POST request
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    switch (action) {
      case "createOrder":
        return jsonResponse(createOrder(data));
      default:
        return jsonResponse({ status: "error", message: "Invalid action" });
    }
  } catch (error) {
    return jsonResponse({ status: "error", message: error.message });
  }
}

// Helper: Response JSON
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// GET: Ambil semua produk
function getProducts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    SHEETS.PRODUCTS
  );
  if (!sheet)
    return { status: "error", message: "Sheet Products tidak ditemukan" };

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const products = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0]) {
      // Ada ID
      products.push({
        id: String(row[0]),
        nama: row[1] || "",
        harga: Number(row[2]) || 0,
        kategori: row[3] || "",
        deskripsi: row[4] || "",
        gambar: row[5] || "",
      });
    }
  }

  return { status: "success", data: products };
}

// GET: Ambil semua kategori
function getCategories() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    SHEETS.CATEGORIES
  );
  if (!sheet)
    return { status: "error", message: "Sheet Categories tidak ditemukan" };

  const data = sheet.getDataRange().getValues();
  const categories = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0]) {
      // Ada ID
      categories.push({
        id: String(row[0]),
        nama: row[1] || "",
      });
    }
  }

  return { status: "success", data: categories };
}

// POST: Buat pesanan baru
function createOrder(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    SHEETS.ORDERS
  );
  if (!sheet)
    return { status: "error", message: "Sheet Orders tidak ditemukan" };

  const orderId = "ORD-" + Date.now();
  const timestamp = new Date().toISOString();

  sheet.appendRow([
    orderId,
    timestamp,
    data.customerName || "",
    data.tableNumber || "",
    data.phoneNumber || "",
    JSON.stringify(data.items || []),
    data.total || 0,
    data.notes || "",
    "PENDING",
  ]);

  return { status: "success", data: { orderId: orderId } };
}

// GET: Cek status pesanan
function getOrderStatus(orderId) {
  if (!orderId) return { status: "error", message: "Order ID diperlukan" };

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    SHEETS.ORDERS
  );
  if (!sheet)
    return { status: "error", message: "Sheet Orders tidak ditemukan" };

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === orderId) {
      return {
        status: "success",
        data: {
          orderId: data[i][0],
          timestamp: data[i][1],
          customerName: data[i][2],
          status: data[i][8] || "UNKNOWN",
        },
      };
    }
  }

  return { status: "error", message: "Pesanan tidak ditemukan" };
}
