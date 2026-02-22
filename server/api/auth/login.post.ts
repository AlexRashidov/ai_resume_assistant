import { defineEventHandler, readBody, setCookie } from 'h3'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { username, password } = body

    // Простая проверка (для теста)
    if (username !== 'test' || password !== '1234') {
        throw createError({ statusCode: 401, message: 'Неверные данные' })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) throw createError({ statusCode: 500, message: 'JWT_SECRET не настроен' })

    const token = jwt.sign({ userId: '1' }, secret, { expiresIn: '1h' })

    // Устанавливаем cookie для фронтенда
    setCookie(event, 'token', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false, // локально можно false
        maxAge: 3600,
    })

    return { message: 'Вход успешен', token }
})