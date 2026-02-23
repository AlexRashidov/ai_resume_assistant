// composables/useAuth.ts
import { useUser } from '~/composables/useUser'

export const useAuth = () => {
    const user = useUser()

    // --- Логин ---
    const login = async (email: string, password: string) => {
        try {
            const response: any = await $fetch('/api/auth/login', {
                method: 'POST',
                body: { email, password },
                credentials: 'include'
            })

            // Сохраняем userId в глобальное состояние
            user.value.userId = response.userId
            return response
        } catch (err: any) {
            throw new Error(err.data?.message || 'Login failed')
        }
    }

    // --- Логаут ---
    const logout = async () => {
        try {
            await $fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            })

            // Обнуляем userId
            user.value.userId = null

            // Редирект на страницу логина
            await navigateTo('/login')
        } catch (err: any) {
            console.error('Logout error:', err)
        }
    }

    // --- Проверка авторизации ---
    const checkAuth = async () => {
        try {
            const response: any = await $fetch('/api/auth/me', {
                credentials: 'include'
            })

            if (response.authenticated) {
                user.value.userId = response.userId
                return true
            } else {
                user.value.userId = null
                return false
            }
        } catch {
            user.value.userId = null
            return false
        }
    }

    return { login, logout, checkAuth, user }
}