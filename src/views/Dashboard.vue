<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/api'
import { formatRupiah, formatRelative } from '../utils/currency'

const router = useRouter()

// ── State ─────────────────────────────────────────────────────────────
const transactions = ref([])
const isLoading = ref(true)
const isDeleting = ref(null)
const errorMsg = ref('')
const currentMonth = ref(new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }))

const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))

// ── Computed ──────────────────────────────────────────────────────────
const totalIncome = computed(() =>
  transactions.value
    .filter(t => t.type === 'in')
    .reduce((sum, t) => sum + Number(t.amount), 0)
)

const totalExpense = computed(() =>
  transactions.value
    .filter(t => t.type === 'out')
    .reduce((sum, t) => sum + Number(t.amount), 0)
)

const balance = computed(() => totalIncome.value - totalExpense.value)
const balanceIsPositive = computed(() => balance.value >= 0)

// ── Lifecycle ─────────────────────────────────────────────────────────
onMounted(fetchTransactions)

// ── Methods ───────────────────────────────────────────────────────────
async function fetchTransactions() {
  isLoading.value = true
  errorMsg.value = ''
  try {
    const { data } = await api.get('/transactions')
    transactions.value = data.data ?? data
  } catch (err) {
    errorMsg.value = 'Gagal memuat transaksi.'
  } finally {
    isLoading.value = false
  }
}

async function deleteTransaction(id) {
  if (isDeleting.value === id) return
  isDeleting.value = id
  try {
    await api.delete(`/transactions/${id}`)
    transactions.value = transactions.value.filter(t => t.id !== id)
  } catch {
    errorMsg.value = 'Gagal menghapus transaksi.'
  } finally {
    isDeleting.value = null
  }
}

function logout() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="flex flex-col flex-1 pb-2">
    <!-- Top bar -->
    <header class="px-5 pt-8 pb-4 flex items-center justify-between">
      <div>
        <p class="text-xs text-steel font-mono">Selamat datang,</p>
        <h1 class="text-lg font-bold text-navy font-mono leading-tight">
          {{ user.name || 'Pengguna' }} 👋
        </h1>
      </div>
      <button
        id="btn-logout"
        @click="logout"
        class="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-steel hover:bg-cream-dark transition-colors"
      >
        <svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </header>

    <!-- Balance Summary Card -->
    <div class="mx-5 mb-5">
      <div class="rounded-2xl bg-navy p-5 relative overflow-hidden shadow-lg shadow-navy/20">
        <!-- Decorative circles -->
        <div class="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
        <div class="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5" />

        <p class="text-cream/70 text-xs font-mono mb-1">Saldo {{ currentMonth }}</p>
        <p class="text-white font-mono font-bold text-3xl tracking-tight leading-none mb-5">
          {{ formatRupiah(balance) }}
        </p>

        <div class="flex gap-4">
          <!-- Income -->
          <div class="flex-1 bg-white/10 rounded-xl p-3">
            <div class="flex items-center gap-1.5 mb-1">
              <span class="w-3 h-3 rounded-full bg-emerald-400" />
              <p class="text-cream/70 text-[10px] font-mono uppercase tracking-wide">Masuk</p>
            </div>
            <p class="text-white font-mono font-semibold text-sm">{{ formatRupiah(totalIncome) }}</p>
          </div>
          <!-- Expense -->
          <div class="flex-1 bg-white/10 rounded-xl p-3">
            <div class="flex items-center gap-1.5 mb-1">
              <span class="w-3 h-3 rounded-full bg-rose-400" />
              <p class="text-cream/70 text-[10px] font-mono uppercase tracking-wide">Keluar</p>
            </div>
            <p class="text-white font-mono font-semibold text-sm">{{ formatRupiah(totalExpense) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section header -->
    <div class="flex items-center justify-between px-5 mb-3">
      <h2 class="text-sm font-bold text-navy font-mono">Jurnal Transaksi</h2>
      <button
        id="btn-refresh"
        @click="fetchTransactions"
        class="text-steel hover:text-navy transition-colors"
        :class="{ 'animate-spin': isLoading }"
      >
        <svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.5 2v6h-6M2.5 22v-6h6"/>
          <path d="M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
        </svg>
      </button>
    </div>

    <!-- Error banner -->
    <transition name="slide-up">
      <div v-if="errorMsg" class="mx-5 mb-3 px-4 py-2.5 bg-rose-50 border border-rose-100 rounded-xl">
        <p class="text-rose-500 text-xs font-mono">{{ errorMsg }}</p>
      </div>
    </transition>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="px-5 flex flex-col gap-3">
      <div v-for="n in 4" :key="n"
        class="h-16 rounded-2xl bg-gray-100 animate-pulse" />
    </div>

    <!-- Empty state -->
    <div v-else-if="!transactions.length" class="flex flex-col items-center justify-center py-20 px-5 gap-3">
      <div class="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center">
        <svg class="w-7 h-7 stroke-steel/50" viewBox="0 0 24 24" fill="none"
          stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      </div>
      <p class="text-steel text-sm font-mono text-center">Belum ada transaksi.<br/>Catat uang masuk atau keluar.</p>
    </div>

    <!-- Transaction List -->
    <div v-else class="px-5 flex flex-col gap-2.5 pb-4">
      <transition-group name="slide-up" tag="div" class="flex flex-col gap-2.5">
        <article
          v-for="trx in transactions"
          :key="trx.id"
          class="card flex items-center gap-3"
        >
          <!-- Type indicator -->
          <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            :class="trx.type === 'in' ? 'bg-emerald-50' : 'bg-rose-50'">
            <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              :class="trx.type === 'in' ? 'stroke-emerald-600' : 'stroke-rose-500'">
              <path v-if="trx.type === 'in'" d="M12 19V5M5 12l7-7 7 7"/>
              <path v-else d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </div>

          <!-- Details -->
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-navy truncate font-mono">
              {{ trx.description || trx.category || 'Transaksi' }}
            </p>
            <p class="text-[10px] text-steel font-mono mt-0.5">{{ formatRelative(trx.created_at) }}</p>
          </div>

          <!-- Receipt badge -->
          <a
            v-if="trx.receipt_url"
            :href="trx.receipt_url"
            target="_blank"
            rel="noopener"
            id="link-receipt"
            class="badge bg-warmOrange/10 text-warmOrange-dark flex-shrink-0 hover:bg-warmOrange/20 transition-colors"
          >
            <svg class="w-3 h-3 stroke-current" viewBox="0 0 24 24" fill="none"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span>Nota</span>
          </a>

          <!-- Amount -->
          <div class="text-right flex-shrink-0 ml-1">
            <p class="text-financial text-sm font-bold"
              :class="trx.type === 'in' ? 'text-emerald-600' : 'text-rose-500'">
              {{ trx.type === 'in' ? '+' : '-' }}{{ formatRupiah(trx.amount) }}
            </p>
            <!-- Delete button -->
            <button
              :id="`btn-delete-trx-${trx.id}`"
              @click="deleteTransaction(trx.id)"
              class="text-[10px] text-steel/50 hover:text-rose-400 transition-colors font-mono mt-0.5"
              :class="{ 'opacity-50': isDeleting === trx.id }"
            >
              {{ isDeleting === trx.id ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </article>
      </transition-group>
    </div>
  </div>
</template>
