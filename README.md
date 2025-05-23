## 🛍️ Market Clothes

### 🗂️ Database Diagram

Diagram berikut menggambarkan struktur database yang digunakan dalam proyek ini.  
Lihat diagram lengkapnya di [database.puml](https://github.com/ren-zi-fa/market-cloths/blob/main/diagram/database.puml).

![Database Diagram](https://github.com/ren-zi-fa/market-cloths/blob/main/out/diagram/database/market_cloths.png)

---

### ✨ Fitur

- ✅ Token-based authentication
- 📁 CRUD kategori produk
- 🛒 CRUD produk

> ⚠️ **Catatan:**  
> Semua endpoint **kecuali Auth** tidak memerlukan token akses.  
> Anda tetap bisa mengaksesnya secara lokal tanpa login.  
> API ini **tidak ditujukan untuk produksi**.

---

### 🌐 CORS Policy

REST API ini hanya menerima permintaan dari domain berikut:

- `http://localhost:3000`
- `http://localhost:5173`
- `https://market-cloths.vercel.app/`

Pastikan frontend Anda berjalan dari salah satu domain tersebut agar dapat mengakses API dengan sukses.

---

### 🔌 Contoh Penggunaan

Frontend dapat ditemukan di:  
🔗 [cloth-ecommerce-xi.vercel.app](https://cloth-ecommerce-xi.vercel.app/)

---

### 🖼️ Demo Aplikasi

| Tampilan 1 | Tampilan 2 |
|------------|------------|
| ![Screenshot 1](https://github.com/ren-zi-fa/market-cloths/blob/main/images/image1.png) | ![Screenshot 2](https://github.com/ren-zi-fa/market-cloths/blob/main/images/image2.png) |
