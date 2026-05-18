<script setup>
import { useRoute } from 'vue-router'
import BottomNav from './components/BottomNav.vue'

const route = useRoute()
</script>

<template>
  <!-- Outer background: cream #EFD2B0 applied via body -->
  <div class="app-shell">
    <router-view v-slot="{ Component, route: currentRoute }">
      <transition name="page" mode="out-in">
        <component :is="Component" :key="currentRoute.path" />
      </transition>
    </router-view>

    <!-- Bottom Navigation — hidden on login -->
    <BottomNav v-if="route.meta.requiresAuth" />
  </div>
</template>
