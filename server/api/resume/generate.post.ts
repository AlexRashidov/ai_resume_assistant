import { defineEventHandler, readBody, createError } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
    try {
        const { position, experience, type = 'about' } = await readBody(event)

        if (!position || !experience) {
            throw createError({ statusCode: 400, message: 'Position and experience required' })
        }

        const config = useRuntimeConfig()
        const apiKey = config.geminiApiKey

        if (!apiKey) {
            throw createError({ statusCode: 500, message: 'Gemini API key not configured' })
        }

        // Формируем промпт
        let promptText = ''
        switch (type) {
            case 'skills':
                promptText = `Ты HR-специалист. Должность: ${position}. Опыт: ${experience}. Перечисли 5-7 ключевых навыков.`
                break
            case 'analysis':
                promptText = `Ты карьерный консультант. Должность: ${position}. Опыт: ${experience}. Напиши сильные стороны, рекомендации и вердикт.`
                break
            default:
                promptText = `Ты HR-специалист. Должность: ${position}. Опыт: ${experience}. Напиши краткое описание "О себе".`
        }

        const geminiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent'

        const response = await $fetch(geminiUrl, {
            method: 'POST',
            params: { key: apiKey },
            body: {
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
            },
            timeout: 15000
        })

        const generatedText = response.candidates?.[0]?.content?.parts?.[0]?.text

        if (!generatedText) {
            throw createError({ statusCode: 500, message: 'Empty response from Gemini' })
        }

        // Сохранение в БД временно отключено
        // await prisma.resume.create({ ... })

        return { result: generatedText, type }
    } catch (error: any) {
        console.error('Generate error:', error)
        throw createError({ statusCode: error.status || 500, message: error.message })
    }
})