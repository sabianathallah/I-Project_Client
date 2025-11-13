# 🎟️ Order Feature - API v2.0 Update

## 📋 Summary

✅ **Berhasil mengupdate fitur order sesuai dengan API Documentation v2.0**

### Breaking Changes yang Diimplementasikan:

1. **Fixed Ticket Price**: Rp 20,000 per tiket (enforced by backend)
2. **Request Body Simplified**: Tidak perlu mengirim `price_amount` lagi
3. **Ticket Code**: Otomatis digenerate setelah pembayaran sukses

---

## 🔄 Changes Made

### 1. **orderService.js** ✅
**Lokasi**: `src/services/orderService.js`

**Perubahan:**
- ✅ Export konstanta `TICKET_PRICE = 20000`
- ✅ Hapus `price_amount` dari request body
- ✅ Hanya kirim `ticketQuantity`, `museumName`, dan `visitDate`
- ✅ Backend yang menghitung total harga

**Before:**
```javascript
const orderData = {
  price_amount: 50000,
  ticketQuantity: 2,
  museumName: "Museum",
  visitDate: "2025-12-01"
};
```

**After:**
```javascript
const orderData = {
  ticketQuantity: 2,
  museumName: "Museum",
  visitDate: "2025-12-01"
};
// price_amount calculated by backend: 20000 × 2 = 40000
```

---

### 2. **TicketOrderModal.jsx** ✅
**Lokasi**: `src/component/TicketOrderModal.jsx`

**Perubahan:**
- ✅ Import `TICKET_PRICE` dari orderService
- ✅ Hapus field `pricePerTicket` dari state
- ✅ Gunakan `TICKET_PRICE` untuk kalkulasi di frontend
- ✅ Tambah info "Harga tetap Rp 20.000 per tiket"
- ✅ Tidak kirim `price_amount` ke backend

**UI Changes:**
```jsx
<div className="form-group">
  <label>Harga per Tiket</label>
  <div className="price-display">Rp 20.000</div>
  <p className="price-info">
    💡 Harga tetap Rp 20.000 per tiket
  </p>
</div>
```

---

### 3. **OrderStatusModal.jsx** ✅
**Lokasi**: `src/component/OrderStatusModal.jsx`

**Perubahan:**
- ✅ Tambah display **Kode Tiket** jika sudah dibayar
- ✅ Styling khusus untuk ticket code (golden badge dengan border dashed)
- ✅ Show ticket code setelah payment berhasil

**Ticket Code Display:**
```
╔══════════════════════════════════╗
║ Kode Tiket: TIX-MHX6REEH-Z1EZ1D ║
╚══════════════════════════════════╝
```

---

### 4. **OrderStatusModal.css** ✅
**Lokasi**: `src/component/OrderStatusModal.css`

**Perubahan:**
- ✅ Style baru `.ticket-code-row` dengan golden gradient background
- ✅ Monospace font untuk ticket code
- ✅ Dashed border untuk tampilan seperti tiket fisik

---

### 5. **TicketOrderModal.css** ✅
**Lokasi**: `src/component/TicketOrderModal.css`

**Perubahan:**
- ✅ Style baru `.price-info` untuk info message
- ✅ Blue info box dengan icon

---

## 🎯 Fitur yang Siap Digunakan

### A. **Beli Tiket** 🎫

**Flow:**
1. User klik "Beli Tiket" di navbar/homepage
2. Modal muncul dengan form:
   - Museum: Museum Sejarah Soeharto (default)
   - Tanggal Kunjungan: [pilih tanggal]
   - Jumlah Tiket: 1-10
   - **Harga: Rp 20.000 per tiket (tetap)**
3. Total otomatis dihitung: `20.000 × quantity`
4. Klik "Lanjut ke Pembayaran"
5. Redirect ke Midtrans payment page
6. Setelah order dibuat, modal status muncul otomatis

**Validasi:**
- ✅ User harus login
- ✅ Tanggal kunjungan harus di masa depan
- ✅ Minimum 1 tiket, maksimum 10 tiket

---

### B. **Cek Status Order** 🔍

**Flow:**
1. Login → Klik avatar → "Cek Pesanan"
2. Input Order ID
3. Modal menampilkan:
   - Status order (pending/paid/cancelled/expired/used)
   - **Kode Tiket** (jika sudah paid) ⭐ NEW
   - Detail pesanan
   - Info pembayaran Midtrans
   - Tanggal-tanggal penting

**Status Order:**
- 🟡 **pending**: Menunggu pembayaran
- 🟢 **paid**: Sudah dibayar (+ kode tiket)
- 🔴 **cancelled**: Dibatalkan
- ⚫ **expired**: Kadaluarsa
- 🔵 **used**: Sudah digunakan

---

## 🔧 Technical Details

### API Endpoint Changes

**POST /orders**
```json
// Request (v2.0)
{
  "ticketQuantity": 2,
  "museumName": "Museum Sejarah Soeharto",
  "visitDate": "2025-12-01"
}

// Response
{
  "message": "Order created, Midtrans transaction created",
  "order": {
    "id": 1,
    "price_amount": 40000,  // Backend calculated: 20000 × 2
    "ticketQuantity": 2,
    "status": "pending",
    "ticketCode": null  // Will be generated after payment
  },
  "ticketPrice": 20000,  // Fixed price per ticket
  "totalPrice": 40000,
  "midtrans": {
    "token": "...",
    "redirect_url": "..."
  }
}
```

**GET /orders/:id/status**
```json
// Response after payment success
{
  "order": {
    "id": 1,
    "status": "paid",
    "ticketCode": "TIX-MHX6REEH-Z1EZ1D",  // ⭐ Auto-generated
    "paidAt": "2025-11-13T10:00:00.000Z",
    "price_amount": 40000
  }
}
```

---

## 🚀 How to Test

### 1. Start Development Server
```bash
cd I-Project_Public
npm run dev
```
Server akan berjalan di: **http://localhost:5174/**

### 2. Test Order Flow

**Step 1: Login**
- Buka http://localhost:5174/login
- Login dengan akun yang ada

**Step 2: Buat Order**
- Klik "Beli Tiket" di navbar
- Isi form:
  - Tanggal kunjungan: besok/lusa
  - Jumlah tiket: 2
- Perhatikan total: **Rp 40.000** (20.000 × 2)
- Klik "Lanjut ke Pembayaran"

**Step 3: Simulasi Pembayaran Midtrans (Sandbox)**
- Tab baru akan terbuka ke Midtrans
- Gunakan test card untuk simulasi:
  - Card: `4811 1111 1111 1114`
  - Exp: `01/25`
  - CVV: `123`

**Step 4: Cek Status**
- Kembali ke aplikasi
- Klik avatar → "Cek Pesanan"
- Input Order ID (dari response)
- Lihat **Kode Tiket** jika payment sukses

---

## 💡 Key Features

### ✅ Security Improvements
- Price manipulation prevention (backend enforces fixed price)
- User cannot modify ticket price from frontend
- Fixed Rp 20.000 per ticket

### ✅ Better UX
- Clear price information upfront
- Automatic price calculation
- Ticket code display after successful payment
- Visual ticket code styling (looks like real ticket)

### ✅ Webhook Integration Ready
- Automatic status updates from Midtrans
- Real-time ticket code generation
- No manual intervention needed

---

## 📊 Price Calculation

```javascript
// Frontend (for display only)
const TICKET_PRICE = 20000;
const quantity = 2;
const totalPrice = TICKET_PRICE × quantity; // 40000

// Backend (enforced)
price_amount = 20000 × ticketQuantity;
```

---

## 🎨 UI Enhancements

### Ticket Code Display
Ketika payment berhasil, kode tiket ditampilkan dengan styling khusus:

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  Kode Tiket                     ┃
┃  TIX-MHX6REEH-Z1EZ1D           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

- Golden gradient background
- Dashed border (tampilan tiket fisik)
- Monospace font untuk kode
- Easy to copy

---

## 🔒 Authentication Flow

```
User clicks "Beli Tiket"
  ↓
Check isAuthenticated()
  ↓
If NOT authenticated → Redirect to /login
  ↓
If authenticated → Open TicketOrderModal
  ↓
Submit order with JWT token
  ↓
Backend validates token + calculates price
  ↓
Create Midtrans transaction
  ↓
Return redirect URL + order data
```

---

## ✨ What's New in v2.0

| Feature | Before (v1.0) | After (v2.0) |
|---------|---------------|--------------|
| **Ticket Price** | Variable (sent from frontend) | Fixed Rp 20.000 (backend) |
| **Request Body** | `price_amount` + `ticketQuantity` | `ticketQuantity` only |
| **Price Calculation** | Frontend calculates | Backend calculates |
| **Ticket Code** | Not available | Auto-generated after payment |
| **Security** | Price can be manipulated | Price cannot be modified |

---

## 📝 Files Modified

```
✅ src/services/orderService.js
✅ src/component/TicketOrderModal.jsx
✅ src/component/TicketOrderModal.css
✅ src/component/OrderStatusModal.jsx
✅ src/component/OrderStatusModal.css
```

---

## 🎉 Ready to Use!

Fitur beli tiket sudah **siap digunakan** dengan:
- ✅ Fixed price Rp 20.000 per tiket
- ✅ Security improvements
- ✅ Ticket code generation
- ✅ Webhook integration ready
- ✅ Better UX with clear pricing

**Server Running**: http://localhost:5174/
**Backend API**: http://localhost:3000/

---

## 🐛 Troubleshooting

**Q: Order gagal dibuat?**
- Pastikan user sudah login
- Cek console untuk error message
- Verify JWT token valid

**Q: Ticket code tidak muncul?**
- Ticket code hanya muncul setelah payment status `paid`
- Webhook dari Midtrans harus aktif
- Check order status dengan refresh

**Q: Price berbeda?**
- Price fixed di Rp 20.000 per tiket
- Total = 20.000 × quantity
- Backend yang enforce price

---

*Last Updated: November 13, 2025*
*API Version: v2.0*
