export const useAuth = () => {
    const login = async (email: string, password: string) => {
        try {
            const response = await $fetch('/api/auth/login', {
                method: 'POST',
                body: { email, password },
                credentials: 'include'
            })
            return response
        } catch (err: any) {
            throw new Error(err.data?.message || 'Login failed')
        }
    }

    const logout = async () => {
        try {
            await $fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            })

            // Перенаправляем на главную после выхода
            await navigateTo('/')

            // Перезагружаем страницу, чтобы обновить состояние
            window.location.reload()
        } catch (err: any) {
            console.error('Logout error:', err)
        }
    }

    const checkAuth = async () => {
        try {
            await $fetch('/api/auth/me', {
                credentials: 'include'
            })
            return true
        } catch {
            return false
        }
    }

    return { login, logout, checkAuth }
}