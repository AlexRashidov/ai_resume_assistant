<script setup lang="ts">
// Тип для одного результата
interface HistoryItem {
  id: string
  result: string
  type: string
  position: string
  timestamp: number
}

// --- Реактивные переменные (ОБЯЗАТЕЛЬНО должны быть объявлены здесь) ---
const generatedResult = ref<string | null>(null)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const lastType = ref('about')
const lastPosition = ref('')
const history = ref<HistoryItem[]>([])

// --- Composables ---
const { generateDescription } = useAI()

// --- Lifecycle hooks ---
// Загружаем историю при старте
onMounted(() => {
  const savedHistory = localStorage.getItem('generationHistory')
  if (savedHistory) {
    history.value = JSON.parse(savedHistory)
  }

  // Загружаем последний результат (для отображения)
  const lastResult = localStorage.getItem('lastResult')
  if (lastResult) {
    generatedResult.value = lastResult
  }
})

// --- Методы ---
// Сохраняем историю в localStorage
const saveToHistory = (result: string, type: string, position: string) => {
  const newItem: HistoryItem = {
    id: Date.now().toString(),
    result,
    type,
    position,
    timestamp: Date.now()
  }

  history.value = [newItem, ...history.value].slice(0, 20) // храним только 20 последних
  localStorage.setItem('generationHistory', JSON.stringify(history.value))
  localStorage.setItem('lastResult', result)
}

// Очистка истории
const clearHistory = () => {
  history.value = []
  localStorage.removeItem('generationHistory')
}

// Копирование в буфер обмена
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('Скопировано!')
  } catch (err) {
    alert('Не удалось скопировать')
  }
}

// Основной обработчик генерации
const handleGenerate = async (data: { position: string; experience: string; type: string }) => {
  isLoading.value = true
  errorMessage.value = null
  lastType.value = data.type
  lastPosition.value = data.position

  try {
    const response = await generateDescription(data.position, data.experience, data.type)
    generatedResult.value = response.result
    saveToHistory(response.result, data.type, data.position)
  } catch (err: any) {
    console.error('Generation error:', err)
    errorMessage.value = err.message || 'Произошла ошибка при генерации'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-12 animate-fade-in">
    <!-- Заголовок с анимацией -->
    <div class="text-center mb-12 animate-slide-down">
      <h2 class="text-4xl font-bold text-gray-800 dark:text-white mb-3">
        <span v-if="lastType === 'about'">Создай описание для резюме</span>
        <span v-else-if="lastType === 'skills'">Опиши свои навыки</span>
        <span v-else>Проанализируй резюме</span>
      </h2>
      <p class="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
        Расскажи о своем опыте, а нейросеть поможет его оформить
      </p>
    </div>

    <div class="max-w-3xl mx-auto">
      <!-- Карточка с формой (анимация) -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 animate-scale-in">
        <InputForm
            @generate="handleGenerate"
            :is-loading="isLoading"
        />

        <!-- Loader с анимацией -->
        <div v-if="isLoading" class="mt-8 animate-fade-in">
          <Loader />
        </div>

        <!-- Ошибка -->
        <div v-if="errorMessage" class="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-shake">
          <p class="text-red-700 dark:text-red-400">{{ errorMessage }}</p>
        </div>

        <!-- Результат с анимацией появления -->
        <div v-if="generatedResult && !isLoading" class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Результат:</h3>

            <div class="flex items-center gap-3">
              <!-- Кнопка PDF (комментарий, если компонент еще не создан) -->
              <!-- <PDFButton
                v-if="generatedResult"
                :text="generatedResult"
                :position="lastPosition"
                :type="lastType"
              /> -->

              <!-- Кнопка копирования -->
              <button
                  @click="copyToClipboard(generatedResult)"
                  class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  title="Копировать"
              >
                <span>📋</span>
                <span>Копировать</span>
              </button>
            </div>
          </div>

          <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{{ generatedResult }}</p>
          </div>
        </div>
      </div>

      <!-- История с анимацией -->
      <div v-if="history && history.length > 0" class="mt-12 animate-fade-in">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white">История</h3>
          <button
              @click="clearHistory"
              class="text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition"
          >
            Очистить историю
          </button>
        </div>
        <div class="space-y-3">
          <div
              v-for="(item, index) in history"
              :key="item.id"
              class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md dark:hover:shadow-2xl transition-all hover:-translate-y-1"
              :style="{ animationDelay: `${index * 0.1}s` }"
              style="animation: slide-in 0.3s ease-out forwards; opacity: 0;"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <span class="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {{ item.position }}
                </span>
                <span class="text-xs text-gray-400 dark:text-gray-500 ml-2">
                  {{ new Date(item.timestamp).toLocaleString() }}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                  {{ item.type === 'about' ? 'О себе' : item.type === 'skills' ? 'Навыки' : 'Анализ' }}
                </span>
                <button
                    @click="copyToClipboard(item.result)"
                    class="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                    title="Копировать"
                >
                  📋
                </button>
              </div>
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{{ item.result }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Анимации */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.animate-slide-down {
  animation: slide-down 0.5s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.5s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.4s ease-out;
}

.animate-shake {
  animation: shake 0.5s ease-out;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>