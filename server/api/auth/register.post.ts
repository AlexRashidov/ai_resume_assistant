import prisma from '../../db/client'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { email, password } = body as { email: string; password: string }

        if (!email || !password) {
            throw createError({ statusCode: 400, message: 'Email and password required' })
        }

        // Проверяем, есть ли уже пользователь
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            throw createError({ statusCode: 400, message: 'User already exists' })
        }

        // Хэшируем пароль
        const hashedPassword = await bcrypt.hash(password, 10)

        // Создаём пользователя
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        })

        return { id: user.id, email: user.email }
    } catch (err: any) {
        console.error(err)
        throw createError({ statusCode: err.statusCode || 500, message: err.message })
    }
})