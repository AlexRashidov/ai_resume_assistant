import { defineEventHandler, createError } from 'h3'
import useAuth from '../../middleware/auth'
import prisma from '../../db/client'

export default defineEventHandler(async (event) => {
    try {
        // Проверяем авторизацию
        await useAuth(event)

        const userId = event.context.userId
        if (!userId) {
            throw createError({ statusCode: 401, message: 'Unauthorized' })
        }

        // Получаем историю
        const history = await prisma.resume.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        })

        return { resumes: history }
    } catch (error: any) {
        console.error('History error:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to fetch history'
        })
    }
})