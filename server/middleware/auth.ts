import jwt from 'jsonwebtoken'
import { defineEventHandler, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
    const path = event.path || event.node.req.url

    // ✅ СПИСОК ПУБЛИЧНЫХ МАРШРУТОВ - всё, что не требует авторизации
    const publicRoutes = [
        '/',              // главная
        '/login',         // страница входа
        '/register',      // страница регистрации
        '/about',         // о проекте
        '/_nuxt',         // статические файлы Nuxt
        '/favicon.ico',   // иконка
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/me'
    ]

    // Проверяем, публичный ли маршрут
    const isPublic = publicRoutes.some(route => path.startsWith(route))
    if (isPublic) {
        return // Пропускаем без проверки токена
    }

    // Для всего остального (включая API) - проверяем токен
    const token = getCookie(event, 'token')

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