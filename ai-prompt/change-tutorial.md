# 🛠️ KeluargaKas Frontend — Panduan Enhance & Create Fitur

Dokumen ini adalah **peta navigasi file** untuk developer yang ingin menambahkan atau memodifikasi fitur pada frontend KeluargaKas. Ikuti checklist di setiap skenario agar tidak ada file yang terlewat.

---

## 📁 Peta File Penting

```
src/
├── router/index.js          ← Daftarkan route baru di sini
├── utils/api.js             ← Konfigurasi Axios (baseURL, interceptor)
├── utils/currency.js        ← Helper format Rupiah / tanggal
├── components/
│   └── BottomNav.vue        ← Tambah item navigasi baru di sini
└── views/
    ├── Login.vue
    ├── Dashboard.vue
    ├── DebtList.vue
    └── AddTransaction.vue
```

---

## 🆕 SKENARIO 1: Membuat Halaman / Fitur Baru

### ✅ Checklist File yang WAJIB diupdate:

| # | File | Aksi |
|---|------|------|
| 1 | `src/views/NamaHalaman.vue` | **BUAT** file view baru |
| 2 | `src/router/index.js` | **TAMBAH** entry route baru ke array `routes` |
| 3 | `src/components/BottomNav.vue` | **TAMBAH** tombol navigasi (jika halaman perlu diakses dari nav bar) |

### Contoh: Menambahkan halaman Profil (`/profile`)

**Langkah 1 — Buat view baru:**
```
src/views/Profile.vue
```

**Langkah 2 — Daftarkan di `src/router/index.js`:**
```js
{
  path: '/profile',
  name: 'Profile',
  component: () => import('../views/Profile.vue'),
  meta: { requiresAuth: true },
}
```

**Langkah 3 — Tambah ke `src/components/BottomNav.vue`** (jika perlu):
```html
<button @click="router.push({ name: 'Profile' })">
  <!-- icon + label -->
</button>
```

---

## 🔗 SKENARIO 2: Menambahkan Endpoint API Baru

### ✅ Checklist File yang WAJIB diupdate:

| # | File | Aksi |
|---|------|------|
| 1 | `.env` | Pastikan `VITE_API_BASE_URL` sudah benar |
| 2 | `src/utils/api.js` | Tidak perlu diubah — gunakan saja instance `api` yang sudah ada |
| 3 | View yang relevan (`src/views/*.vue`) | **TAMBAH** fungsi `api.get()` / `api.post()` / dll. |

### Contoh: Fetch data notifikasi dari `GET /api/notifications`

```js
// Di dalam view yang membutuhkan
import api from '../utils/api'

const notifications = ref([])

async function fetchNotifications() {
  const { data } = await api.get('/notifications')
  notifications.value = data.data ?? data
}
```

> ⚠️ **Jangan** tambahkan baseURL manual. `api.js` sudah otomatis membaca dari `.env`.

---

## 🧩 SKENARIO 3: Menambahkan Komponen Reusable Baru

### ✅ Checklist File yang WAJIB diupdate:

| # | File | Aksi |
|---|------|------|
| 1 | `src/components/NamaKomponen.vue` | **BUAT** file komponen baru |
| 2 | View yang menggunakannya | **IMPORT & PAKAI** komponen |
| 3 | `src/style.css` | **TAMBAH** class CSS baru ke `@layer components` jika diperlukan |

### Contoh: Komponen `TransactionItem.vue` (extracted dari Dashboard)

```
src/components/TransactionItem.vue   ← buat di sini
src/views/Dashboard.vue              ← import dan pakai
```

---

## 💄 SKENARIO 4: Mengubah Desain / Styling

### ✅ Checklist File yang WAJIB diupdate:

| # | File | Aksi | Kapan |
|---|------|------|-------|
| 1 | `tailwind.config.js` | Ubah / tambah **design token** (warna, font, shadow) | Ubah warna global atau font |
| 2 | `src/style.css` | Ubah / tambah **component class** (`@layer components`) | Ubah style `.btn-primary`, `.card`, `.input-field`, dll. |
| 3 | View / komponen terkait | Ubah class Tailwind langsung di template | Ubah tampilan satu elemen spesifik |

### Token warna yang ada:

```js
// tailwind.config.js → theme.extend.colors
navy:       '#1A3263'   // teks utama, judul
steel:      '#547792'   // teks sekunder, border
cream:      '#EFD2B0'   // background luar
warmOrange: '#FFC570'   // aksen, tombol aktif, focus border
```

---

## 🔐 SKENARIO 5: Mengubah Logika Autentikasi

### ✅ Checklist File yang WAJIB diupdate:

| # | File | Aksi |
|---|------|------|
| 1 | `src/utils/api.js` | Ubah interceptor (token key, storage strategy, error handling) |
| 2 | `src/router/index.js` | Ubah kondisi guard `beforeEach` (cek token / role) |
| 3 | `src/views/Login.vue` | Ubah form login, endpoint, atau cara simpan token |

### Contoh: Menambahkan proteksi halaman untuk role `admin` saja

**Di `src/router/index.js`:**
```js
// Tambah meta.requiresAdmin
{ path: '/admin', name: 'Admin', meta: { requiresAuth: true, requiresAdmin: true } }

// Di beforeEach:
if (to.meta.requiresAdmin) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user.role !== 'admin') return next({ name: 'Dashboard' })
}
```

---

## 🔄 SKENARIO 6: Mengubah Format Data / Utility

### ✅ File yang WAJIB diupdate:

| # | File | Aksi |
|---|------|------|
| 1 | `src/utils/currency.js` | Ubah/tambah fungsi `formatRupiah`, `formatDate`, dll. |
| 2 | Semua view yang memakai fungsi tersebut | Update import jika nama fungsi berubah |

---

## 🧭 SKENARIO 7: Mengganti URL Backend (Deployment / Staging)

### ✅ File yang WAJIB diupdate:

| # | File | Aksi |
|---|------|------|
| 1 | `.env` | Ubah `VITE_API_BASE_URL` ke URL production |
| 2 | *(tidak ada file lain)* | Proxy & baseURL sudah otomatis ikut `.env` |

```env
# Production
VITE_API_BASE_URL=https://api.keluargakas.app
```

> ✅ Tidak perlu sentuh `vite.config.js` atau `api.js` — semuanya sudah dinamis.

---

## 📋 Quick Reference — File by Concern

| Concern | File Utama |
|---------|------------|
| Tambah halaman baru | `src/views/` + `src/router/index.js` |
| Tambah menu navigasi | `src/components/BottomNav.vue` |
| Panggil API baru | `src/views/*.vue` (import `api` dari `utils/api.js`) |
| Ubah warna / font global | `tailwind.config.js` |
| Ubah style component class | `src/style.css` |
| Ubah logika auth | `src/utils/api.js` + `src/router/index.js` |
| Ubah format Rupiah / tanggal | `src/utils/currency.js` |
| Ubah URL backend | `.env` → `VITE_API_BASE_URL` |
| Komponen reusable baru | `src/components/` |
