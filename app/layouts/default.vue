<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useTheme } from '~/composables/useTheme'

const { isDark, toggleTheme, initTheme } = useTheme()
const { logout, checkAuth, user } = useAuth()

// Инициализация темы и проверка авторизации при загрузке
onMounted(async () => {
  initTheme()
  await checkAuth() // обновит user.userId автоматически
})

// Выход
const handleLogout = async () => {
  try {
    await logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 flex flex-col">

    <!-- Шапка -->
    <header class="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">

          <!-- Логотип -->
          <NuxtLink to="/" class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text hover:opacity-80 transition">
            ResumeAI
          </NuxtLink>

          <div class="flex items-center gap-4">

            <!-- Навигация -->
            <nav class="space-x-4">
              <NuxtLink to="/" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                Главная
              </NuxtLink>
              <NuxtLink to="/about" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                О проекте
              </NuxtLink>
              <NuxtLink v-if="user.userId" to="/history" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                История
              </NuxtLink>
            </nav>

            <!-- Кнопки авторизации -->
            <div class="flex items-center gap-2">
              <template v-if="!user.userId">
                <NuxtLink
                    to="/login"
                    class="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
                >
                  Войти
                </NuxtLink>
                <NuxtLink
                    to="/register"
                    class="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Регистрация
                </NuxtLink>
              </template>

              <button
                  v-else
                  @click="handleLogout"
                  class="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
              >
                Выйти
              </button>

              <!-- Кнопка темы -->
              <button
                  @click="toggleTheme"
                  class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition ml-2"
                  :title="isDark ? 'Включить светлую тему' : 'Включить темную тему'"
              >
                <span v-if="isDark" class="text-xl">☀️</span>
                <span v-else class="text-xl">🌙</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>

    <!-- Основной контент -->
    <main class="flex-1 transition-colors duration-300">
      <slot />
    </main>

    <!-- Подвал -->
    <footer class="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80">
      <div class="container mx-auto px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        © 2026 ResumeAI. Создано с помощью ИИ
      </div>
    </footer>

  </div>
</template>