import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcrypt'
import prisma from '../../db/client'

export default defineEventHandler(async (event) => {
    try {
        const { email, password } = await readBody(event)

        if (!email || !password) {
            throw createError({ statusCode: 400, message: 'Email and password required' })
        }

        // Проверяем, существует ли пользователь
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            throw createError({ statusCode: 400, message: 'User already exists' })
        }

        // Хэшируем пароль
        const hashedPassword = await bcrypt.hash(password, 10)

        // Создаём пользователя
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        })

        return {
            id: user.id,
            email: user.email,
            message: 'User created successfully'
        }
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Registration failed'
        })
    }
})