import { defineEventHandler, getCookie } from 'h3'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')

    if (!token) {
        return {
            authenticated: false
        }
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }

        return {
            authenticated: true,
            userId: decoded.userId
        }
    } catch (error) {
        return {
            authenticated: false
        }
    }
})