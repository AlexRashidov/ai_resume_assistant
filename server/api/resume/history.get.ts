import { defineEventHandler, createError } from 'h3'
import prisma from '../../db/client'

export default defineEventHandler(async (event) => {
    try {
        // Пытаемся авторизоваться, но не кидаем ошибку если нет токена
        try {
            //await useAuth(event)
        } catch {
            // Если авторизация не прошла - просто возвращаем пустой массив
            return { resumes: [] }
        }

        const userId = event.context.userId

        // Если userId нет (не авторизован) - пустой массив
        if (!userId) {
            return { resumes: [] }
        }

        // Получаем историю только для авторизованного пользователя
        const history = await prisma.resume.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        })

        return { resumes: history }
    } catch (error: any) {
        console.error('History error:', error)
        // Вместо ошибки возвращаем пустой массив
        return { resumes: [] }
    }
})