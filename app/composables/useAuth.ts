export const useAuth = () => {
    const login = async (username: string, password: string) => {
        const res = await $fetch('/api/auth/login', {
            method: 'POST',
            body: { username, password },
            credentials: 'include', // важное: cookie будет отправляться автоматически
        })
        return res
    }

    return { login }
}