// server/middleware/useAuth.ts
import jwt from 'jsonwebtoken'
import { H3Event, getCookie, createError, eventHandler } from 'h3'

export default eventHandler(async (event: H3Event) => {
    const token = getCookie(event, 'token')
    const secret = process.env.JWT_SECRET

    if (!secret) {
        throw createError({ statusCode: 500, message: 'JWT_SECRET not set' })
    }

    // --- Локальный fallback для разработки ---
    if (!token && process.env.NODE_ENV === 'development') {
        event.context.userId = 'devuser'
        return
    }

    if (!token) {
        throw createError({ statusCode: 401, message: 'Unauthorized: token missing' })
    }

    try {
        const decoded = jwt.verify(token, secret) as { userId: string }
        event.context.userId = decoded.userId
    } catch (err) {
        console.error('JWT verification error:', err)
        throw createError({ statusCode: 401, message: 'Unauthorized: invalid token' })
    }
})