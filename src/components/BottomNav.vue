<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isActive = (name) => route.name === name
</script>

<template>
  <nav class="sticky bottom-0 z-50 bg-white border-t border-cream-dark/50 px-2 pb-safe">
    <div class="flex items-center justify-around h-16">
      <!-- Dashboard -->
      <button
        id="nav-dashboard"
        @click="router.push({ name: 'Dashboard' })"
        class="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 group"
        :class="isActive('Dashboard') ? 'text-navy' : 'text-steel/60'"
      >
        <span class="relative">
          <!-- Home icon -->
          <svg class="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
            :class="isActive('Dashboard') ? 'stroke-navy' : 'stroke-steel/60'"
            viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
            <path d="M9 21V12h6v9"/>
          </svg>
          <span v-if="isActive('Dashboard')"
            class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-warmOrange" />
        </span>
        <span class="text-[10px] font-medium font-mono">Jurnal</span>
      </button>

      <!-- FAB: Add Transaction -->
      <button
        id="nav-add-transaction"
        @click="router.push({ name: 'AddTransaction' })"
        class="flex flex-col items-center -mt-6 group"
      >
        <span class="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center
                     shadow-lg shadow-navy/30
                     transition-all duration-200
                     group-hover:bg-warmOrange group-hover:shadow-warmOrange/30
                     group-active:scale-95">
          <svg class="w-6 h-6 stroke-white" viewBox="0 0 24 24" fill="none"
            stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </span>
        <span class="text-[10px] font-medium font-mono mt-1"
          :class="isActive('AddTransaction') ? 'text-navy' : 'text-steel/60'">Catat</span>
      </button>

      <!-- Debt List -->
      <button
        id="nav-debts"
        @click="router.push({ name: 'DebtList' })"
        class="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 group"
        :class="isActive('DebtList') ? 'text-navy' : 'text-steel/60'"
      >
        <span class="relative">
          <!-- CreditCard icon -->
          <svg class="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
            :class="isActive('DebtList') ? 'stroke-navy' : 'stroke-steel/60'"
            viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <path d="M2 10h20"/>
            <path d="M6 15h4"/>
          </svg>
          <span v-if="isActive('DebtList')"
            class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-warmOrange" />
        </span>
        <span class="text-[10px] font-medium font-mono">Hutang</span>
      </button>
    </div>
  </nav>
</template>
