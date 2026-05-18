<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import api from "../utils/api";

const router = useRouter();

// ── State ─────────────────────────────────────────────────────────────
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

// ── Computed ──────────────────────────────────────────────────────────
const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
});

const isFormReady = computed(
  () => isEmailValid.value && password.value.length >= 1,
);

// ── Methods ───────────────────────────────────────────────────────────
async function handleLogin() {
  if (!isFormReady.value || isLoading.value) return;
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const { data } = await api.post("/auth/login", {
      email: email.value,
      password: password.value,
    });

    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    router.push({ name: "Dashboard" });
  } catch (err) {
    const msg = err.response?.data?.message;
    if (err.response?.status === 422) {
      errorMessage.value = "Email atau kata sandi salah.";
    } else if (err.response?.status === 429) {
      errorMessage.value =
        "Terlalu banyak percobaan. Coba lagi beberapa menit.";
    } else {
      errorMessage.value = msg || "Gagal masuk. Periksa koneksi Anda.";
    }
  } finally {
    isLoading.value = false;
  }
}

function handleGoogleLogin() {
  // Placeholder for Google OAuth — not yet configured on backend
  errorMessage.value = "Login dengan Google belum tersedia.";
}
</script>

<template>
  <main class="flex flex-col min-h-screen px-6 py-10">
    <!-- Header -->
    <header class="mb-10">
      <div class="flex items-center gap-2 mb-8">
        <!-- Logo mark -->
        <div
          class="w-9 h-9 rounded-xl bg-navy flex items-center justify-center shadow-md"
        >
          <svg class="w-5 h-5 fill-warmOrange" viewBox="0 0 24 24">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z"
            />
          </svg>
        </div>
        <span class="font-mono font-bold text-navy text-lg tracking-tight"
          >KeluargaKas</span
        >
      </div>

      <h1 class="font-mono font-bold text-4xl text-navy leading-tight">
        Log in
      </h1>
      <p class="text-steel text-sm mt-1.5">Selamat datang kembali 👋</p>
    </header>

    <!-- Google OAuth Button -->
    <button
      id="btn-google-login"
      @click="handleGoogleLogin"
      class="btn-outline flex items-center justify-center gap-3 mb-5"
    >
      <!-- Google SVG icon -->
      <svg
        class="w-4.5 h-4.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      <span class="text-navy font-medium text-sm">Sign in with Google</span>
    </button>

    <!-- Divider -->
    <div class="flex items-center gap-3 mb-5">
      <div class="flex-1 h-px bg-steel/20" />
      <span class="text-steel text-xs font-mono">atau</span>
      <div class="flex-1 h-px bg-steel/20" />
    </div>

    <!-- Form -->
    <form
      id="form-login"
      @submit.prevent="handleLogin"
      class="flex flex-col gap-4"
      novalidate
    >
      <!-- Email -->
      <div class="flex flex-col gap-1.5">
        <label for="input-email" class="text-xs font-medium text-navy/70"
          >Alamat Email</label
        >
        <div class="relative">
          <span
            class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none"
          >
            <svg
              class="w-4 h-4 stroke-steel/60"
              viewBox="0 0 24 24"
              fill="none"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 7L2 7" />
            </svg>
          </span>
          <input
            id="input-email"
            v-model="email"
            type="email"
            autocomplete="email"
            inputmode="email"
            placeholder="email@keluargakas.app"
            class="input-field pl-10"
          />
        </div>
      </div>

      <!-- Password -->
      <div class="flex flex-col gap-1.5">
        <label for="input-password" class="text-xs font-medium text-navy/70"
          >Kata Sandi</label
        >
        <div class="relative">
          <span
            class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none"
          >
            <svg
              class="w-4 h-4 stroke-steel/60"
              viewBox="0 0 24 24"
              fill="none"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <input
            id="input-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="••••••••"
            class="input-field pl-10 pr-11"
          />
          <button
            type="button"
            id="btn-toggle-password"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-3.5 flex items-center text-steel/50 hover:text-steel transition-colors"
          >
            <svg
              v-if="!showPassword"
              class="w-4 h-4 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <svg
              v-else
              class="w-4 h-4 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
              />
              <path
                d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
              />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </button>
        </div>
        <div class="flex justify-end mt-0.5">
          <a
            href="#"
            class="text-xs text-steel hover:text-navy transition-colors"
            >Lupa kata sandi?</a
          >
        </div>
      </div>

      <!-- Error message -->
      <transition name="slide-up">
        <p
          v-if="errorMessage"
          class="text-rose-500 text-xs font-mono bg-rose-50 px-3 py-2 rounded-lg"
        >
          {{ errorMessage }}
        </p>
      </transition>

      <!-- Submit Button -->
      <button
        id="btn-submit-login"
        type="submit"
        :disabled="!isFormReady || isLoading"
        class="btn-primary mt-2 flex items-center justify-center gap-2"
        :class="
          isFormReady ? 'bg-warmOrange text-navy' : 'bg-gray-200 text-gray-400'
        "
      >
        <svg
          v-if="isLoading"
          class="w-4 h-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <span>{{ isLoading ? "Memproses..." : "Lanjut" }}</span>
      </button>
    </form>
  </main>
</template>
