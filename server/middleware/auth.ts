import jwt from 'jsonwebtoken'
import { defineEventHandler, getCookie, createError } from 'h3'

export default defineEventHandler((event) => {
    const path = event.path || event.node.req.url

    // Пропускаем всё, что не API
    if (!path?.startsWith('/api/')) return

    // Публичные API
    const publicApiRoutes = [
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/me',
        '/api/auth/logout'
    ]
    if (publicApiRoutes.includes(path)) return

    const token = getCookie(event, 'token')

    if (!token) {
        throw createError({
            statusCode: 401,
            message: 'Пожалуйста, авторизуйтесь или зарегистрируйтесь'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
        event.context.userId = decoded.userId
    } catch {
        throw createError({
            statusCode: 401,
            message: 'Неверный токен. Пожалуйста, авторизуйтесь.'
        })
    }
})