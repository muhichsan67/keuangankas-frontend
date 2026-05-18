# KeluargaKas — Frontend

> Aplikasi manajemen keuangan keluarga — Mobile-First SPA dibangun dengan **Vue 3** + **Vite** + **Tailwind CSS**

---

## 🚀 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Vue 3 (Composition API · `<script setup>`) |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 (custom design tokens) |
| HTTP Client | Axios (Bearer Token + global error handler) |
| Routing | Vue Router 4 (auth guard bawaan) |
| Font | Inter (UI) · Ubuntu Mono (data keuangan) |

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone <repo-url> keluargakas/frontend
cd keluargakas/frontend
npm install
```

### 2. Konfigurasi Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000   # URL backend Laravel
VITE_APP_NAME=KeluargaKas
```

### 3. Jalankan Backend

Pastikan backend Laravel sudah berjalan di port sesuai `VITE_API_BASE_URL`:

```bash
# Di direktori backend
php artisan serve --port=8000
```

### 4. Jalankan Frontend Dev Server

```bash
npm run dev
# → http://localhost:5173
```

---

## 🔧 Environment Variables

Semua variabel **wajib diawali `VITE_`** agar dapat diakses oleh kode Vue via `import.meta.env`.

| Variabel | Default | Keterangan |
|----------|---------|------------|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Base URL backend Laravel (tanpa `/api`) |
| `VITE_APP_NAME` | `KeluargaKas` | Nama aplikasi |

> **Catatan:** Vite dev server secara otomatis mem-*proxy* request `/api`, `/sanctum`, dan `/storage` ke `VITE_API_BASE_URL` — sehingga tidak ada masalah CORS saat development.

---

## 🗂️ Struktur Folder

```
src/
├── main.js                   # Entry point — mount Vue app
├── App.vue                   # Root shell (max-w-app, page transition, BottomNav)
├── style.css                 # Global CSS (Tailwind + component classes)
│
├── router/
│   └── index.js              # Routes + navigation guard (auth / guest)
│
├── utils/
│   ├── api.js                # Axios instance (Bearer token, 401/403 handler)
│   └── currency.js           # formatRupiah, parseRupiah, formatDate, formatRelative
│
├── components/
│   └── BottomNav.vue         # Sticky bottom navigation (Jurnal · Catat · Hutang)
│
└── views/
    ├── Login.vue             # Halaman login (email/password + Google OAuth UI)
    ├── Dashboard.vue         # Jurnal kas harian + saldo bulan berjalan
    ├── DebtList.vue          # Daftar cicilan + progress bar hutang
    └── AddTransaction.vue    # Form tambah transaksi + upload nota kuitansi
```

---

## 🎨 Design System

### Palet Warna

| Token | Hex | Penggunaan |
|-------|-----|------------|
| `navy` | `#1A3263` | Teks utama, judul, background card |
| `steel` | `#547792` | Teks sekunder, placeholder, border |
| `cream` | `#EFD2B0` | Background luar aplikasi |
| `warmOrange` | `#FFC570` | Tombol aktif, aksen, border focus |

### Typography

- **Inter** — Font UI umum (label, deskripsi, navigasi)
- **Ubuntu Mono** — Semua data keuangan: angka Rupiah, list transaksi, form input nominal

### Layout

- Desktop: `max-w-[420px]` centered dengan subtle shadow, background cream
- Mobile: Full screen `w-full min-h-screen`

---

## 🔒 Auth Flow

1. User login via `POST /api/login` → token disimpan di `localStorage` (`auth_token`)
2. Setiap request API otomatis menyertakan `Authorization: Bearer {token}`
3. Jika backend mengembalikan `401` atau `403` → localStorage dibersihkan, redirect ke `/login`
4. Vue Router guard mencegah akses ke halaman protected tanpa token

---

## 🌐 API Endpoints yang Digunakan

| Method | Endpoint | View |
|--------|----------|------|
| `POST` | `/api/login` | `Login.vue` |
| `GET` | `/api/transactions` | `Dashboard.vue` |
| `DELETE` | `/api/transactions/{id}` | `Dashboard.vue` |
| `GET` | `/api/debts` | `DebtList.vue`, `AddTransaction.vue` |
| `DELETE` | `/api/debts/{id}` | `DebtList.vue` |
| `POST` | `/api/transactions` | `AddTransaction.vue` (FormData + file) |

---

## 📦 Scripts

```bash
npm run dev      # Development server (HMR aktif)
npm run build    # Build production ke dist/
npm run preview  # Preview hasil build
```

---

## 📝 Lisensi

Proyek ini untuk kegunaan pribadi / internal keluarga.
