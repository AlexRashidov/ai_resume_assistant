<template>
  <div class="flex flex-col items-center justify-center py-8">
    <!-- Анимированный спиннер -->
    <div class="relative">
      <!-- Внешний круг -->
      <div class="w-16 h-16 rounded-full border-4 border-indigo-100"></div>
      <!-- Внутренний круг с анимацией -->
      <div class="w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
    </div>
    <!-- Текст -->
    <p class="mt-4 text-gray-600 font-medium">Нейросеть думает...</p>
    <p class="text-sm text-gray-400">Обычно занимает 3-5 секунд</p>
  </div>
</template>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>