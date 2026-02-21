<script setup lang="ts">
import { jsPDF } from 'jspdf'

const props = defineProps<{
  text: string
  position: string
  type: string
}>()

const generatePDF = () => {
  const doc = new jsPDF()

  // Заголовок
  doc.setFontSize(20)
  doc.setTextColor(79, 70, 229) // indigo-600
  doc.text('ResumeAI', 20, 20)

  // Тип генерации
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  const typeText = props.type === 'about' ? 'О себе' : props.type === 'skills' ? 'Навыки' : 'Анализ резюме'
  doc.text(`Тип: ${typeText}`, 20, 35)

  // Должность
  doc.text(`Должность: ${props.position}`, 20, 45)

  // Разделитель
  doc.setDrawColor(200, 200, 200)
  doc.line(20, 50, 190, 50)

  // Основной текст
  doc.setFontSize(12)
  doc.setTextColor(50, 50, 50)

  // Разбиваем текст на строки (макс ширина 170)
  const lines = doc.splitTextToSize(props.text, 170)
  doc.text(lines, 20, 60)

  // Сохраняем PDF
  doc.save(`resume-${Date.now()}.pdf`)
}
</script>

<template>
  <button
      @click="generatePDF"
      class="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition"
      title="Скачать PDF"
  >
    <span>📥</span>
    <span>Скачать PDF</span>
  </button>
</template>