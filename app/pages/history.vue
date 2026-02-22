<template>
  <div>
    <h2>История генераций</h2>
    <ul>
      <li v-for="item in history" :key="item.id">
        <strong>{{ item.position }}</strong> ({{ item.type === 'about' ? 'О себе' : item.type === 'skills' ? 'Навыки' : 'Анализ' }})
        — {{ new Date(item.createdAt).toLocaleString() }}
        <p>{{ item.content }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useResume } from '~/composables/useResume'

interface HistoryItem {
  id: string
  position: string
  type: 'about' | 'skills' | 'analysis'
  content: string
  createdAt: string
}

const history = ref<HistoryItem[]>([])

const { getHistory } = useResume()

onMounted(async () => {
  try {
    history.value = await getHistory()
  } catch (e) {
    console.error('Failed to fetch history:', e)
  }
})
</script>