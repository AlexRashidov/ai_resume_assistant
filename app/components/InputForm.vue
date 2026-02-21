<script setup lang="ts">
const props = defineProps<{
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'generate', data: { position: string; experience: string; type: string }): void
}>()

const position = ref('')
const experience = ref('')
const generationType = ref('about') // 'about' | 'skills' | 'analysis'

const handleSubmit = () => {
  if (!position.value || !experience.value) {
    alert('Заполни все поля!')
    return
  }

  emit('generate', {
    position: position.value,
    experience: experience.value,
    type: generationType.value
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Поле для должности -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Желаемая должность
      </label>
      <input
          v-model="position"
          type="text"
          placeholder="например: Frontend-разработчик"
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
      />
    </div>

    <!-- Поле для опыта -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Опиши свой опыт
      </label>
      <textarea
          v-model="experience"
          rows="4"
          placeholder="например: работал 2 года с Vue 3, делал SPA, интегрировал REST API..."
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
      />
    </div>

    <!-- Выбор типа генерации -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Что сгенерировать?
      </label>
      <div class="grid grid-cols-3 gap-3">
        <button
            type="button"
            @click="generationType = 'about'"
            :class="[
            'px-4 py-2 rounded-lg border transition',
            generationType === 'about'
              ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-600'
          ]"
        >
          📝 О себе
        </button>
        <button
            type="button"
            @click="generationType = 'skills'"
            :class="[
            'px-4 py-2 rounded-lg border transition',
            generationType === 'skills'
              ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-600'
          ]"
        >
          🛠️ Навыки
        </button>
        <button
            type="button"
            @click="generationType = 'analysis'"
            :class="[
            'px-4 py-2 rounded-lg border transition',
            generationType === 'analysis'
              ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-600'
          ]"
        >
          📊 Анализ
        </button>
      </div>
    </div>

    <!-- Кнопка отправки -->
    <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
    >
      {{ isLoading ? 'Генерация...' : 'Сгенерировать' }}
    </button>
  </form>
</template>