import { defineEventHandler, createError } from 'h3'
//import useAuth from '../../middleware/useAuth.ts.bak'
import prisma from '../../db/client' // <-- default import

export default defineEventHandler(async (event) => {
 //   await useAuth(event) // ✅ функция middleware

    const userId = event.context.userId
    if (!userId) throw createError({ statusCode: 401, message: 'Unauthorized' })

    const history = await prisma.resumeHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20
    })

    return history
})