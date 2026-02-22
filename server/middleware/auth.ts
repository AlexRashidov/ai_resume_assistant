// server/middleware/api-auth.ts
import jwt from 'jsonwebtoken'
import { getCookie } from 'h3'

export default defineEventHandler(async (event) => {
    const path = event.path || event.node.req.url

    // Применяем middleware только к API маршрутам
    if (!path.startsWith('/api/')) {
        return // пропускаем все не-API запросы
    }

    // Исключаем публичные API эндпоинты
    const publicApiRoutes = ['/api/auth/login', '/api/auth/register']
    if (publicApiRoutes.includes(path)) {
        return
    }

    const token = getCookie(event, 'token')

    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'Authentication required'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
        event.context.userId = decoded.userId
    } catch (err) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'Invalid token'
        })
    }
})