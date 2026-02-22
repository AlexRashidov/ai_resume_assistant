import jwt from 'jsonwebtoken'
import { defineEventHandler, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
    const path = event.path || event.node.req.url

    // ✅ Пропускаем все не-API запросы (главная страница, CSS, JS и т.д.)
    if (!path.startsWith('/api/')) {
        return
    }

    // ✅ Публичные API эндпоинты (не требуют токена)
    const publicApiRoutes = ['/api/auth/login', '/api/auth/register']
    if (publicApiRoutes.includes(path)) {
        return
    }

    // Проверяем наличие токена
    const token = getCookie(event, 'token')
    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'Authentication required'
        })
    }

    // Проверяем JWT_SECRET
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Server Error',
            message: 'JWT_SECRET is not configured'
        })
    }

    // Верифицируем токен
    try {
        const decoded = jwt.verify(token, secret) as { userId: string }
        event.context.userId = decoded.userId
    } catch (err) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'Invalid token'
        })
    }
})