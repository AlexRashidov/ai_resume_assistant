import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../../db/client'

export default defineEventHandler(async (event) => {
    try {
        const { email, password } = await readBody(event)

        if (!email || !password) {
            throw createError({ statusCode: 400, message: 'Email and password required' })
        }

        // Ищем пользователя
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            throw createError({ statusCode: 401, message: 'Invalid credentials' })
        }

        // Проверяем пароль
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            throw createError({ statusCode: 401, message: 'Invalid credentials' })
        }

        // Создаём JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        )

        // Устанавливаем cookie
        setCookie(event, 'token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 дней
        })

        return {
            id: user.id,
            email: user.email,
            message: 'Login successful'
        }
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Login failed'
        })
    }
})