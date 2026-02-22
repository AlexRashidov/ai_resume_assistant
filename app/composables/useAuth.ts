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
        await $fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        })
        await navigateTo('/login')
    }

    return { login, logout }
}