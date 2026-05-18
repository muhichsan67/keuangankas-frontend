# AI Context: KeluargaKas Frontend (Vue.js 3 Mobile-First SPA)

## 1. Spesifikasi Proyek & UI Layout
- **Framework:** Vue.js 3 (Composition API dengan `<script setup>`).
- **Styling:** Tailwind CSS.
- **Komunikasi:** Axios menuju REST API Laravel (Gunakan Bearer Token dari localStorage).
- **Pendekatan Desain:** **Mobile-First**. Pada desktop view, batasi container utama dengan `max-w-md` (sekitar 420px) dan posisikan di tengah layar (`mx-auto` / centered layout). Pada mobile view, buat memenuhi layar penuh (`w-full min-h-screen`).

## 2. Aturan Tipografi & Sistem Warna (Wajib Patuh)
- **Font Utama:** `Ubuntu Mono` (Monospace) harus digunakan pada semua teks data keuangan, angka nominal, form input, dan list hutang agar data terlihat presisi.
- **Sistem Warna Tailwind (Hex Kustom):**
  - `#1A3263` (Dark Navy Blue) -> Warna teks utama, judul besar, dan teks tombol aktif.
  - `#547792` (Muted Steel Blue) -> Teks sekunder, placeholder input, border default, dan link.
  - `#EFD2B0` (Soft Cream/Beige) -> Background layar luar/dasar aplikasi.
  - `#FFC570` (Warm Pastel Orange) -> **Aksen Utama**. Untuk tombol aksi aktif, indikator bayar, dan border input saat `:focus`.

## 3. Logika Komponen Keuangan
- Tombol aksi (Submit/Lanjut) harus memiliki state *disabled* (bg-gray-200) saat data form kosong/tidak valid, dan berubah menjadi warna aksen `#FFC570` dengan teks `#1A3263` saat form siap.