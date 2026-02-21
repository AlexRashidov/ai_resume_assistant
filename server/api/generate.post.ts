// Типы для ответа от Gemini API
interface GeminiResponse {
    candidates: Array<{
        content: {
            parts: Array<{
                text: string
            }>
        }
    }>
}

export default defineEventHandler(async (event) => {
    try {
        // Получаем данные из тела запроса (включая type)
        const { position, experience, type } = await readBody(event)

        // Валидация
        if (!position || !experience) {
            throw createError({
                statusCode: 400,
                message: 'Position and experience are required'
            })
        }

        // Получаем API ключ из runtimeConfig
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
        const typeValue = type || 'about' // по умолчанию 'about'

        switch (typeValue) {
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

        // Правильный URL для Gemini 1.5 Flash
        const geminiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent'

        // Отправляем запрос к Gemini API
        const response = await $fetch<GeminiResponse>(geminiUrl, {
            method: 'POST',
            params: {
                key: apiKey
            },
            body: {
                contents: [{
                    parts: [{
                        text: promptText
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500 // Увеличил для analysis, который может быть длиннее
                }
            },
            // Добавляем таймаут 15 секунд
            timeout: 15000
        })

        // Безопасно извлекаем текст из ответа
        const generatedText = response.candidates?.[0]?.content?.parts?.[0]?.text

        if (!generatedText) {
            throw createError({
                statusCode: 500,
                message: 'Empty response from Gemini'
            })
        }

        // Возвращаем результат
        return {
            result: generatedText,
            type: typeValue // возвращаем тип, чтобы клиент знал, что это
        }

    } catch (error: any) {
        console.error('Gemini API Error:', error)

        // Подробная информация об ошибке
        const errorMessage = error.message || 'Failed to generate text'
        const statusCode = error.status || 500

        throw createError({
            statusCode,
            message: errorMessage
        })
    }
})