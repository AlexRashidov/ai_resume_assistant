import prisma from '../../db/client'
import { readBody, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import jwt from 'jsonwebtoken'

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

// Middleware авторизации
const authenticate = (event: any) => {
    const token = event.node.req.cookies?.token
    if (!token) throw createError({ statusCode: 401, message: 'Unauthorized' })
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
        event.context.userId = decoded.userId
    } catch {
        throw createError({ statusCode: 401, message: 'Invalid token' })
    }
}

export default defineEventHandler(async (event) => {
    try {
        authenticate(event)

        const body = await readBody<GenerateBody>(event)
        const { position, experience, type = 'about' } = body

        if (!position || !experience) {
            throw createError({ statusCode: 400, message: 'Position and experience required' })
        }

        const config = useRuntimeConfig()
        const apiKey = config.geminiApiKey
        if (!apiKey) throw createError({ statusCode: 500, message: 'Gemini API key not configured' })

        // Выбираем промпт
        let promptText = ''
        switch (type) {
            case 'skills':
                promptText = `Ты HR-специалист. Должность: ${position}. Опыт: ${experience}.
Перечисли 5-7 ключевых навыков кратко и профессионально на русском.`
                break
            case 'analysis':
                promptText = `Ты карьерный консультант. Должность: ${position}. Опыт: ${experience}.
Напиши:
1. Три сильные стороны
2. Три рекомендации
3. Общий вердикт
На русском языке.`
                break
            default:
                promptText = `Ты HR-специалист. Должность: ${position}. Опыт: ${experience}.
Напиши краткое профессиональное описание "О себе" (3-4 предложения) на русском.`
        }

        const geminiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent'

        const response = await $fetch<GeminiResponse>(geminiUrl, {
            method: 'POST',
            params: { key: apiKey },
            body: {
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
            },
            timeout: 15000
        })

        const generatedText = response.candidates?.[0]?.content?.parts?.[0]?.text
        if (!generatedText) throw createError({ statusCode: 500, message: 'Empty response from Gemini' })

        // Сохраняем в БД
        await prisma.resume.create({
            data: {
                position,
                content: generatedText,
                type,
                userId: event.context.userId
            }
        })

        return { result: generatedText, type }
    } catch (error: any) {
        console.error('Generate API Error:', error)
        throw createError({ statusCode: error.status || 500, message: error.message || 'Failed to generate text' })
    }
})