<script setup lang="ts">
const { isDark, toggleTheme, initTheme } = useTheme()

// Инициализация темы при загрузке
onMounted(() => {
  initTheme()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
    <!-- Шапка -->
    <header class="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Логотип -->
          <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text">
            ResumeAI
          </h1>

          <div class="flex items-center gap-4">
            <!-- Навигация -->
            <nav class="space-x-4">
              <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">Главная</a>
              <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">О проекте</a>
            </nav>

            <!-- Кнопка переключения темы -->
            <button
                @click="toggleTheme"
                class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                :title="isDark ? 'Включить светлую тему' : 'Включить темную тему'"
            >
              <span v-if="isDark" class="text-xl">☀️</span>
              <span v-else class="text-xl">🌙</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Основной контент -->
    <main class="transition-colors duration-300">
      <slot />
    </main>

    <!-- Подвал -->
    <footer class="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 mt-auto">
      <div class="container mx-auto px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        © 2026 ResumeAI. Создано с помощью ИИ
      </div>
    </footer>
  </div>
</template>