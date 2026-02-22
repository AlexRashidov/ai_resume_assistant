import prisma from '../../db/client'
import { useRuntimeConfig } from '#imports'
import jwt from 'jsonwebtoken'
import { defineEventHandler, readBody, createError } from 'h3'
//import useAuth from '../../middleware/auth'

// Типы для Gemini API
interface GeminiResponse {
    candidates: Array<{
        content: {
            parts: Array<{ text: string }>
        }
    }>
}

// Типизация тела запроса
interface GenerateBody {
    position: string
    experience: string
    type?: 'about' | 'skills' | 'analysis'
}

export default defineEventHandler(async (event) => {
    try {
        // ========== АВТОРИЗАЦИЯ ==========
        let userId = null
        try {
           // await useAuth(event)
            userId = event.context.userId
        } catch {
            // Если не авторизован - просим войти
            throw createError({
                statusCode: 401,
                message: 'Please login to generate resume'
            })
        }

        // Проверяем, что userId действительно есть
        if (!userId) {
            throw createError({
                statusCode: 401,
                message: 'Authentication required'
            })
        }
        // ========== КОНЕЦ АВТОРИЗАЦИИ ==========

        const body = await readBody<GenerateBody>(event)
        const { position, experience, type = 'about' } = body

        if (!position || !experience) {
            throw createError({
                statusCode: 400,
                message: 'Position and experience are required'
            })
        }

        const config = useRuntimeConfig()
        const apiKey = config.geminiApiKey

        if (!apiKey) {
            throw createError({
                statusCode: 500,
                message: 'Gemini API key is not configured'
            })
        }

        // Выбираем промпт в зависимости от типа генерации
        let promptText = ''

        switch (type) {
            case 'skills':
                promptText = `Ты профессиональный HR-специалист и карьерный консультант. 
Твоя задача — описать профессиональные навыки для резюме.

Должность: ${position}
Опыт: ${experience}

Перечисли 5-7 ключевых навыков в виде маркированного списка. 
Каждый навык должен быть конкретным и отражать реальный опыт.
Пиши на русском языке, кратко и профессионально.`
                break

            case 'analysis':
                promptText = `Ты карьерный консультант и эксперт по резюме.
Проанализируй опыт кандидата и дай рекомендации.

Должность: ${position}
Опыт: ${experience}

Напиши:
1. Три сильные стороны кандидата (основываясь на опыте)
2. Три рекомендации, что можно улучшить в резюме
3. Общий вердикт — готов ли кандидат к собеседованию

Пиши на русском языке, конструктивно и доброжелательно.`
                break

            default: // 'about'
                promptText = `Ты профессиональный HR-специалист и карьерный консультант.
Твоя задача — написать раздел "О себе" для резюме.

Должность: ${position}
Опыт: ${experience}

Напиши краткое, ёмкое и профессиональное описание (3-4 предложения).
Подчеркни ключевые компетенции и достижения.
Без воды, без лишних слов.
Пиши на русском языке.`
        }

        const geminiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent'

        // Отправляем запрос к Gemini API
        const response = await $fetch<GeminiResponse>(geminiUrl, {
            method: 'POST',
            params: { key: apiKey },
            body: {
                contents: [{
                    parts: [{ text: promptText }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500
                }
            },
            timeout: 15000
        })

        const generatedText = response.candidates?.[0]?.content?.parts?.[0]?.text

        if (!generatedText) {
            throw createError({
                statusCode: 500,
                message: 'Empty response from Gemini'
            })
        }

        // ========== СОХРАНЯЕМ В БД ==========
        try {
            await prisma.resume.create({
                data: {
                    position,
                    content: generatedText,
                    type,
                    userId // Теперь userId точно есть
                }
            })
        } catch (dbError) {
            console.error('Database save error:', dbError)
            // Не прерываем выполнение, если не удалось сохранить в БД
            // Просто логируем ошибку
        }
        // ========== КОНЕЦ СОХРАНЕНИЯ ==========

        // Возвращаем результат
        return {
            result: generatedText,
            type
        }

    } catch (error: any) {
        console.error('Generate API Error:', error)

        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to generate text'
        })
    }
})