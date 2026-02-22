import { defineEventHandler } from 'h3'
import useAuth from '../../middleware/auth'

export default defineEventHandler(async (event) => {
    try {
        // Проверяем авторизацию
        await useAuth(event)

        // Если дошли сюда - пользователь авторизован
        return {
            authenticated: true,
            userId: event.context.userId
        }
    } catch (error) {
        // Не авторизован
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }
})