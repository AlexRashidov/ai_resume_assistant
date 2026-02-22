import jwt from 'jsonwebtoken'
import { defineEventHandler, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
    // Пропускаем все не-API запросы
    if (!event.path.startsWith('/api/')) {
        return
    }

    // Публичные API эндпоинты
    const publicApiRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/me']
    if (publicApiRoutes.includes(event.path)) {
        return
    }

    const token = getCookie(event, 'token')
    if (!token) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
        event.context.userId = decoded.userId
    } catch (err) {
        throw createError({ statusCode: 401, message: 'Invalid token' })
    }
})