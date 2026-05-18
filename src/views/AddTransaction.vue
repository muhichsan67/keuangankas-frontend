<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/api'
import { formatRupiah, parseRupiah } from '../utils/currency'

const router = useRouter()

// ── State ─────────────────────────────────────────────────────────────
const type = ref('out')        // 'in' | 'out'
const amountDisplay = ref('')  // formatted display string
const category = ref('')
const date = ref(new Date().toISOString().substring(0, 10))
const description = ref('')
const debtId = ref('')

const debts = ref([])
const receiptFile = ref(null)
const receiptPreview = ref(null)

const isLoading = ref(false)
const isLoadingDebts = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const fileInputRef = ref(null)

// ── Computed ──────────────────────────────────────────────────────────
const amountRaw = computed(() => parseRupiah(amountDisplay.value))

const isFormReady = computed(() =>
  amountRaw.value > 0 &&
  category.value.trim() !== '' &&
  date.value !== ''
)

const showDebtDropdown = computed(() => type.value === 'out' && debts.value.length > 0)

// ── Categories ────────────────────────────────────────────────────────
const categoriesIn  = ['Gaji', 'Bonus', 'Transfer Masuk', 'Penjualan', 'Lain-lain']
const categoriesOut = ['Makanan', 'Transportasi', 'Tagihan', 'Belanja', 'Cicilan', 'Kesehatan', 'Lain-lain']
const activeCategories = computed(() => type.value === 'in' ? categoriesIn : categoriesOut)

// ── Watch ─────────────────────────────────────────────────────────────
watch(type, () => {
  category.value = ''
  debtId.value = ''
  if (type.value === 'out') fetchDebts()
})

// ── Lifecycle ─────────────────────────────────────────────────────────
onMounted(() => {
  if (type.value === 'out') fetchDebts()
})

// ── Methods ───────────────────────────────────────────────────────────
function formatAmountInput(e) {
  const raw = e.target.value.replace(/[^\d]/g, '')
  const num = Number(raw)
  if (!raw) {
    amountDisplay.value = ''
    return
  }
  amountDisplay.value = num.toLocaleString('id-ID')
}

async function fetchDebts() {
  isLoadingDebts.value = true
  try {
    const { data } = await api.get('/debts')
    debts.value = data.data ?? data
  } catch {
    debts.value = []
  } finally {
    isLoadingDebts.value = false
  }
}

function handleFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    errorMsg.value = 'Hanya file gambar yang diizinkan.'
    return
  }
  receiptFile.value = file
  receiptPreview.value = URL.createObjectURL(file)
  errorMsg.value = ''
}

function removeReceipt() {
  receiptFile.value = null
  receiptPreview.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

async function handleSubmit() {
  if (!isFormReady.value || isLoading.value) return
  isLoading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const formData = new FormData()
    formData.append('type', type.value)
    formData.append('amount', amountRaw.value)
    formData.append('category', category.value)
    formData.append('date', date.value)
    formData.append('description', description.value)
    if (type.value === 'out' && debtId.value) {
      formData.append('debt_id', debtId.value)
    }
    if (receiptFile.value) {
      formData.append('receipt', receiptFile.value)
    }

    await api.post('/transactions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    successMsg.value = 'Transaksi berhasil dicatat!'
    // Reset form
    type.value = 'out'
    amountDisplay.value = ''
    category.value = ''
    date.value = new Date().toISOString().substring(0, 10)
    description.value = ''
    debtId.value = ''
    removeReceipt()

    // Navigate back after short delay
    setTimeout(() => router.push({ name: 'Dashboard' }), 1000)
  } catch (err) {
    const errors = err.response?.data?.errors
    if (errors) {
      errorMsg.value = Object.values(errors).flat().join(' ')
    } else {
      errorMsg.value = err.response?.data?.message || 'Gagal menyimpan transaksi.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col flex-1 pb-4">
    <!-- Header -->
    <header class="px-5 pt-8 pb-5 flex items-center gap-3">
      <button id="btn-back" @click="router.back()"
        class="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-steel hover:bg-cream-dark transition-colors">
        <svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <div>
        <p class="text-xs text-steel font-mono uppercase tracking-wider">Catat</p>
        <h1 class="text-xl font-bold text-navy font-mono leading-tight">Transaksi Baru</h1>
      </div>
    </header>

    <form id="form-add-transaction" @submit.prevent="handleSubmit" class="px-5 flex flex-col gap-4">

      <!-- Type Toggle -->
      <div class="flex rounded-xl bg-cream p-1 gap-1">
        <button
          type="button"
          id="btn-type-out"
          @click="type = 'out'"
          class="flex-1 py-2.5 rounded-lg text-sm font-mono font-semibold transition-all duration-200"
          :class="type === 'out' ? 'bg-navy text-white shadow-sm' : 'text-steel hover:text-navy'"
        >
          💸 Keluar
        </button>
        <button
          type="button"
          id="btn-type-in"
          @click="type = 'in'"
          class="flex-1 py-2.5 rounded-lg text-sm font-mono font-semibold transition-all duration-200"
          :class="type === 'in' ? 'bg-emerald-500 text-white shadow-sm' : 'text-steel hover:text-navy'"
        >
          💰 Masuk
        </button>
      </div>

      <!-- Amount Input -->
      <div class="flex flex-col gap-1.5">
        <label for="input-amount" class="text-xs font-medium text-navy/70">Nominal (Rupiah)</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none
                       font-mono text-steel/70 text-sm font-bold">Rp</span>
          <input
            id="input-amount"
            :value="amountDisplay"
            @input="formatAmountInput"
            type="text"
            inputmode="numeric"
            placeholder="0"
            class="input-field financial pl-11 text-lg font-bold"
          />
        </div>
      </div>

      <!-- Category -->
      <div class="flex flex-col gap-1.5">
        <label for="select-category" class="text-xs font-medium text-navy/70">Kategori</label>
        <select
          id="select-category"
          v-model="category"
          class="input-field appearance-none"
        >
          <option value="" disabled>Pilih kategori...</option>
          <option v-for="cat in activeCategories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>

      <!-- Date -->
      <div class="flex flex-col gap-1.5">
        <label for="input-date" class="text-xs font-medium text-navy/70">Tanggal</label>
        <input
          id="input-date"
          v-model="date"
          type="date"
          class="input-field font-mono"
        />
      </div>

      <!-- Description -->
      <div class="flex flex-col gap-1.5">
        <label for="input-description" class="text-xs font-medium text-navy/70">Deskripsi <span class="text-steel/50">(opsional)</span></label>
        <textarea
          id="input-description"
          v-model="description"
          placeholder="Contoh: Bayar listrik bulan Mei..."
          rows="2"
          class="input-field resize-none"
        />
      </div>

      <!-- Debt dropdown (Anti-IDOR: only shows debts owned by logged-in user) -->
      <transition name="slide-up">
        <div v-if="showDebtDropdown" class="flex flex-col gap-1.5">
          <label for="select-debt" class="text-xs font-medium text-navy/70">
            Hubungkan ke Cicilan Hutang
            <span class="text-steel/50">(opsional)</span>
          </label>
          <select
            id="select-debt"
            v-model="debtId"
            class="input-field appearance-none"
            :disabled="isLoadingDebts"
          >
            <option value="">— Tidak terhubung —</option>
            <option v-for="debt in debts" :key="debt.id" :value="debt.id">
              {{ debt.creditor_name }} — {{ formatRupiah(debt.installment_amount) }}/bln
            </option>
          </select>
          <p class="text-[10px] text-steel font-mono px-1">
            Hanya hutang milik akun Anda yang ditampilkan.
          </p>
        </div>
      </transition>

      <!-- Receipt Upload -->
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-medium text-navy/70">Nota / Kuitansi <span class="text-steel/50">(opsional)</span></label>

        <!-- Preview -->
        <transition name="fade">
          <div v-if="receiptPreview" class="relative">
            <img
              :src="receiptPreview"
              alt="Preview nota"
              class="w-full h-40 object-cover rounded-xl border border-cream-dark"
            />
            <button
              type="button"
              id="btn-remove-receipt"
              @click="removeReceipt"
              class="absolute top-2 right-2 w-7 h-7 rounded-full bg-navy/80 text-white
                     flex items-center justify-center hover:bg-rose-500 transition-colors"
            >
              <svg class="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none"
                stroke-width="2.5" stroke-linecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </transition>

        <!-- Upload button -->
        <button
          v-if="!receiptPreview"
          type="button"
          id="btn-upload-receipt"
          @click="fileInputRef?.click()"
          class="w-full border-2 border-dashed border-steel/30 rounded-xl py-6
                 flex flex-col items-center gap-2 text-steel
                 hover:border-warmOrange hover:text-warmOrange transition-colors"
        >
          <svg class="w-6 h-6 stroke-current" viewBox="0 0 24 24" fill="none"
            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <span class="text-xs font-mono">Unggah foto nota</span>
        </button>

        <input
          ref="fileInputRef"
          id="input-receipt-file"
          type="file"
          accept="image/*"
          capture="environment"
          class="hidden"
          @change="handleFileChange"
        />
      </div>

      <!-- Success message -->
      <transition name="slide-up">
        <div v-if="successMsg" class="px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl">
          <p class="text-emerald-600 text-xs font-mono">✓ {{ successMsg }}</p>
        </div>
      </transition>

      <!-- Error message -->
      <transition name="slide-up">
        <div v-if="errorMsg" class="px-4 py-3 bg-rose-50 border border-rose-100 rounded-xl">
          <p class="text-rose-500 text-xs font-mono">{{ errorMsg }}</p>
        </div>
      </transition>

      <!-- Submit -->
      <button
        id="btn-submit-transaction"
        type="submit"
        :disabled="!isFormReady || isLoading"
        class="btn-primary flex items-center justify-center gap-2 mt-1"
        :class="isFormReady ? 'bg-warmOrange text-navy' : 'bg-gray-200 text-gray-400'"
      >
        <svg v-if="isLoading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <span>{{ isLoading ? 'Menyimpan...' : 'Simpan Transaksi' }}</span>
      </button>
    </form>
  </div>
</template>
