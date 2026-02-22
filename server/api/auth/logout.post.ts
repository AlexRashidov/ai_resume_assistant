import { defineEventHandler, deleteCookie } from 'h3'

export default defineEventHandler(async (event) => {
    // Удаляем cookie с токеном
    deleteCookie(event, 'token', {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    })

    return {
        message: 'Logged out successfully'
    }
})