<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../utils/api'
import { formatRupiah, formatDate } from '../utils/currency'

// ── State ─────────────────────────────────────────────────────────────
const debts = ref([])
const isLoading = ref(true)
const errorMsg = ref('')
const deletingId = ref(null)

// ── Computed ──────────────────────────────────────────────────────────
const totalDebt = computed(() =>
  debts.value.reduce((sum, d) => sum + Number(d.total_amount ?? 0), 0)
)
const totalPaid = computed(() =>
  debts.value.reduce((sum, d) => sum + Number(d.paid_amount ?? 0), 0)
)
const totalRemaining = computed(() => totalDebt.value - totalPaid.value)
const overallProgress = computed(() =>
  totalDebt.value > 0 ? Math.round((totalPaid.value / totalDebt.value) * 100) : 0
)

// ── Lifecycle ─────────────────────────────────────────────────────────
onMounted(fetchDebts)

// ── Methods ───────────────────────────────────────────────────────────
async function fetchDebts() {
  isLoading.value = true
  errorMsg.value = ''
  try {
    const { data } = await api.get('/debts')
    debts.value = data.data ?? data
  } catch {
    errorMsg.value = 'Gagal memuat data hutang.'
  } finally {
    isLoading.value = false
  }
}

async function deleteDebt(id) {
  if (deletingId.value === id) return
  deletingId.value = id
  try {
    await api.delete(`/debts/${id}`)
    debts.value = debts.value.filter(d => d.id !== id)
  } catch {
    errorMsg.value = 'Gagal menghapus hutang.'
  } finally {
    deletingId.value = null
  }
}

function debtProgress(debt) {
  const total = Number(debt.total_amount) || 0
  const paid = Number(debt.paid_amount) || 0
  if (total === 0) return 0
  return Math.min(100, Math.round((paid / total) * 100))
}

function isOverdue(debt) {
  if (!debt.due_date) return false
  return new Date(debt.due_date) < new Date()
}
</script>

<template>
  <div class="flex flex-col flex-1 pb-2">
    <!-- Header -->
    <header class="px-5 pt-8 pb-5">
      <p class="text-xs text-steel font-mono uppercase tracking-wider mb-1">Manajemen</p>
      <h1 class="text-2xl font-bold text-navy font-mono">Cicilan & Hutang</h1>
    </header>

    <!-- Aggregate summary -->
    <div class="mx-5 mb-5 grid grid-cols-2 gap-3">
      <div class="card flex flex-col gap-1 col-span-2">
        <p class="text-xs text-steel font-mono">Total Hutang Keseluruhan</p>
        <p class="text-financial text-2xl font-bold text-navy">{{ formatRupiah(totalDebt) }}</p>

        <!-- Overall progress bar -->
        <div class="w-full bg-gray-100 rounded-full h-2 mt-2 overflow-hidden">
          <div
            class="h-full rounded-full bg-gradient-to-r from-warmOrange to-warmOrange-dark transition-all duration-700"
            :style="{ width: overallProgress + '%' }"
          />
        </div>
        <div class="flex justify-between text-[10px] font-mono mt-0.5">
          <span class="text-steel">0%</span>
          <span class="text-navy font-bold">{{ overallProgress }}% terbayar</span>
          <span class="text-steel">100%</span>
        </div>
      </div>

      <div class="card flex flex-col gap-1">
        <p class="text-[10px] text-steel font-mono uppercase tracking-wide">Terbayar</p>
        <p class="text-financial text-lg font-bold text-warmOrange">{{ formatRupiah(totalPaid) }}</p>
      </div>
      <div class="card flex flex-col gap-1">
        <p class="text-[10px] text-steel font-mono uppercase tracking-wide">Sisa</p>
        <p class="text-financial text-lg font-bold text-navy">{{ formatRupiah(totalRemaining) }}</p>
      </div>
    </div>

    <!-- Section header -->
    <div class="flex items-center justify-between px-5 mb-3">
      <h2 class="text-sm font-bold text-navy font-mono">Daftar Hutang</h2>
      <button id="btn-refresh-debts" @click="fetchDebts"
        class="text-steel hover:text-navy transition-colors">
        <svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.5 2v6h-6M2.5 22v-6h6"/>
          <path d="M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
        </svg>
      </button>
    </div>

    <!-- Error -->
    <transition name="slide-up">
      <div v-if="errorMsg" class="mx-5 mb-3 px-4 py-2.5 bg-rose-50 border border-rose-100 rounded-xl">
        <p class="text-rose-500 text-xs font-mono">{{ errorMsg }}</p>
      </div>
    </transition>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="px-5 flex flex-col gap-3">
      <div v-for="n in 3" :key="n" class="h-28 rounded-2xl bg-gray-100 animate-pulse" />
    </div>

    <!-- Empty state -->
    <div v-else-if="!debts.length" class="flex flex-col items-center justify-center py-16 px-5 gap-3">
      <div class="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center">
        <svg class="w-7 h-7 stroke-steel/50" viewBox="0 0 24 24" fill="none"
          stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2"/>
          <path d="M2 10h20M6 15h4"/>
        </svg>
      </div>
      <p class="text-steel text-sm font-mono text-center">Belum ada cicilan hutang.</p>
    </div>

    <!-- Debt cards -->
    <div v-else class="px-5 flex flex-col gap-3 pb-4">
      <transition-group name="slide-up" tag="div" class="flex flex-col gap-3">
        <article
          v-for="debt in debts"
          :key="debt.id"
          :id="`debt-card-${debt.id}`"
          class="card flex flex-col gap-3"
        >
          <!-- Top row -->
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <p class="font-mono font-bold text-sm text-navy truncate">{{ debt.creditor_name }}</p>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[10px] font-mono text-steel">
                  Cicilan: <span class="text-financial text-warmOrange font-bold">{{ formatRupiah(debt.installment_amount) }}</span>/bln
                </span>
              </div>
            </div>

            <!-- Overdue badge or delete -->
            <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span v-if="isOverdue(debt)"
                class="badge bg-rose-50 text-rose-500 text-[10px]">
                Jatuh tempo
              </span>
              <button
                :id="`btn-delete-debt-${debt.id}`"
                @click="deleteDebt(debt.id)"
                class="text-[10px] font-mono text-steel/40 hover:text-rose-400 transition-colors"
                :class="{ 'opacity-50': deletingId === debt.id }"
              >
                {{ deletingId === debt.id ? 'Menghapus...' : 'Hapus' }}
              </button>
            </div>
          </div>

          <!-- Progress bar -->
          <div>
            <div class="flex justify-between text-[10px] font-mono mb-1.5">
              <span class="text-steel">Terbayar</span>
              <span class="text-navy font-bold">{{ debtProgress(debt) }}%</span>
            </div>
            <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-700"
                :class="debtProgress(debt) === 100 ? 'bg-emerald-400' : 'bg-gradient-to-r from-warmOrange to-warmOrange-dark'"
                :style="{ width: debtProgress(debt) + '%' }"
              />
            </div>
          </div>

          <!-- Bottom row info -->
          <div class="flex items-center justify-between text-[10px] font-mono">
            <div class="flex flex-col gap-0.5">
              <span class="text-steel">Total Hutang</span>
              <span class="text-financial font-bold text-navy text-xs">{{ formatRupiah(debt.total_amount) }}</span>
            </div>
            <div class="flex flex-col gap-0.5 items-center">
              <span class="text-steel">Sisa Tenor</span>
              <span class="font-bold text-navy text-xs">
                {{ debt.remaining_tenor ?? '-' }} bln
              </span>
            </div>
            <div class="flex flex-col gap-0.5 items-end">
              <span class="text-steel">Jatuh Tempo</span>
              <span class="font-bold text-navy text-xs">{{ formatDate(debt.due_date) }}</span>
            </div>
          </div>
        </article>
      </transition-group>
    </div>
  </div>
</template>
