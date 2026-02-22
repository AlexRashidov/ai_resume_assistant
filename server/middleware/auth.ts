import jwt from 'jsonwebtoken'
import { defineEventHandler, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
    const path = event.path || event.node.req.url

    // 👇 КЛЮЧЕВОЕ: Пропускаем ВСЁ, кроме API
    if (!path.startsWith('/api/')) {
        return // Главная, CSS, JS, картинки - всё работает без токена
    }

    // Теперь только API маршруты требуют проверки
    const token = getCookie(event, 'token')

    // Публичные API (не требуют токена)
    const publicApiRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/me']
    if (publicApiRoutes.includes(path)) {
        return // Пропускаем без токена
    }

    // Все остальные API требуют токен
    if (!token) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
        event.context.userId = decoded.userId
    } catch (err) {
        throw createError({
            statusCode: 401,
            message: 'Invalid token'
        })
    }
})