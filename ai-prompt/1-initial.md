Bertindaklah sebagai Senior Frontend Engineer & UI/UX Designer Vue.js. Berdasarkan aturan pengembangan di `ai-frontend-context.md` dan spesifikasi backend di `backend-context.md`, buatkan seluruh arsitektur folder frontend, setup state management, utilitas Axios, serta komponen halaman utama untuk aplikasi **"KeluargaKas"** secara utuh dan terintegrasi.

Jangan gunakan placeholder atau komentar kosong. Tuliskan seluruh kode komponen secara penuh menggunakan **Vue 3 Composition API** dengan `<script setup>` dan **Tailwind CSS** untuk komponen-komponen berikut:

---

### 1. LAYOUT & DESIGN SYSTEM ENGINE (Mobile-First Setup)
- **Pembatas Ketat Layout:** Di layar desktop, aplikasi wajib berada di tengah-tengah layar (`mx-auto min-h-screen dynamic flex flex-col`) dengan lebar maksimal `max-w-md` (420px), memiliki bayangan card halus (*subtle shadow*), dan dikelilingi oleh background dasar aplikasi berwarna krem `#EFD2B0`. Di layar mobile, otomatis memenuhi layar penuh.
- **Typography:** Pastikan font `Ubuntu Mono` terpasang secara global pada seluruh teks data nominal angka (Rupiah), list jurnal transaksi, detail cicilan, dan form input agar data keuangan keluarga terlihat presisi dan terstruktur.

---

### 2. CORE UTILITIES & AUTH STATE (Axios & Sanctum Integration)
Buat file `src/utils/api.js` untuk konfigurasi Axios yang terintegrasi dengan **Laravel Sanctum**:
- **Axios Instance:** Setup `axios.create()` dengan Base URL mengarah ke `/api` backend Laravel 13.
- **Request Interceptor:** Otomatis menyisipkan header `Authorization: Bearer [token]` yang diambil dari `localStorage` pada setiap request data keuangan.
- **Global Error Handling:** Tangani error HTTP `401` (Unauthorized) atau `403` (Forbidden) secara global. Jika token kedaluwarsa atau terdeteksi aktivitas mencurigakan (`SUSPICIOUS_ACTIVITY` log di backend), otomatis bersihkan `localStorage` dan arahkan pengguna kembali ke halaman Login.

---

### 3. KOMPONEN HALAMAN LOGIN (`Login.vue`)
Buat halaman login mobile-first yang selaras dengan akun default backend (menggunakan **Email**, bukan nomor ponsel):
- **Header:** Judul besar "Log in" menggunakan font `Ubuntu Mono` dengan warna navy `#1A3263`.
- **OAuth Alternatif:** Tombol "Sign in with Google" dengan border tipis `#547792`, ikon Google, dan teks navy `#1A3263`, dipisah oleh divider garis horizontal dengan teks "atau" di tengahnya.
- **Input Email:** Menggunakan input tipe `email` (sesuai credential seeder backend: `admin@keluargakas.app` / `ichsan@keluargakas.app`). Wrapper input dilengkapi ikon atau teks petunjuk bersih dengan placeholder berwarna steel blue `#547792`.
- **Input Kata Sandi:** Dilengkapi dengan tombol toggle ikon mata untuk show/hide password, serta link teks "Lupa kata sandi?" di bawah kanan input dengan warna `#547792`.
- **Efek Fokus:** Setiap kolom input jika dalam kondisi `:focus` wajib mengubah border-nya secara halus menjadi warna orange hangat `#FFC570` dengan efek `outline-none`.
- **Tombol Lanjut (Submit):** Harus reaktif. Jika field email (valid format) dan password belum diisi, tombol berstatus *disabled* dengan background abu-abu redup. Begitu terisi lengkap, tombol aktif berubah menjadi warna orange hangat `#FFC570` dengan teks navy `#1A3263`.

---

### 4. KOMPONEN UTAMA JURNAL KAS & DASHBOARD (`Dashboard.vue`)
Buat tampilan ringkasan keuangan harian keluarga yang terhubung ke endpoint `/api/transactions`:
- **Widget Ringkasan Atas:** Tampilkan card kas harian dengan teks kontras menggunakan warna navy `#1A3263`, menampilkan data Uang Masuk (Income) dan Uang Keluar (Expense) bulan berjalan.
- **List Transaksi Jurnal:** Tampilkan riwayat pengeluaran/pemasukan dalam bentuk list vertikal yang mengambil data dari `GET /api/transactions`. Teks angka nominal rupiah wajib menggunakan font monospace `Ubuntu Mono`.
- **Dynamic Receipt Badge:** Jika field kuitansi pada data transaksi tidak bernilai `null` (di-generate otomatis oleh `TransactionResource` backend dari disk aktif seperti local/Supabase), tampilkan badge kecil "Lihat Nota" yang interaktif dan mengarah ke URL file gambar tersebut.
- **Fitur Soft Delete:** Sediakan tombol hapus cepat pada item transaksi yang akan memicu `DELETE /api/transactions/{id}` (sesuai fitur SoftDeletes backend).

---

### 5. KOMPONEN MODUL MANAJEMEN HUTANG (`DebtList.vue`)
Buat komponen untuk melacak daftar cicilan yang datanya bersumber dari endpoint `GET /api/debts`:
- **Struktur Item Hutang:** Tampilkan list hutang yang berisi Nama Kreditor, Besaran Cicilan, Tenggat Jatuh Tempo, dan Sisa Tenor.
- **Progress Tracker:** Tampilkan visual progress bar atau informasi teks yang membandingkan "Total Nilai Hutang" dengan "Total yang Sudah Dibayarkan" (menggunakan data agregat DB `withSum` dari API). Angka nominal pembayaran ini wajib berwarna orange hangat `#FFC570` untuk membedakannya dengan teks sekunder steel blue `#547792`.

---

### 6. FORM TRANSACTION + FILE UPLOAD (`AddTransaction.vue`)
Buat form entry untuk mencatat uang keluar/masuk yang mendukung upload gambar bukti kuitansi dan fitur **Anti-IDOR**:
- **Form Field:** Tipe Transaksi (`In`/`Out`), Nominal Angka (Rupiah), Kategori, Tanggal, dan Deskripsi.
- **Input Dropdown Dinamis (Anti-IDOR Validation):** Jika tipe transaksi adalah "Out" (Uang Keluar), munculkan dropdown opsional bertuliskan "Hubungkan ke Cicilan Hutang" yang datanya di-fetch dari `/api/debts`. Jika dipilih, form wajib mengirimkan parameter `debt_id` yang valid milik user tersebut agar lolos enkapsulasi `StoreTransactionRequest` di backend.
- **Input Upload Nota:** Slot input file untuk mengunggah gambar bukti kuitansi (`RECEIPT_DISK`). Tampilkan preview gambar kecil (thumbnail) di bawah input jika user berhasil memilih gambar sebelum disubmit menggunakan format **`FormData`** ke `POST /api/transactions`.