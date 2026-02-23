interface GenerateResponse {
    result: string
    type: 'about' | 'skills' | 'analysis'
}

type GenerateType = 'about' | 'skills' | 'analysis'

export const useAI = () => {
    const generateDescription = async (
        position: string,
        experience: string,
        type: GenerateType = 'about'
    ): Promise<GenerateResponse> => {
        try {
            const response = await $fetch<GenerateResponse>('/api/resume/generate', {
                method: 'POST',
                body: { position, experience, type },
                credentials: 'include' // обязательно для куки авторизации
            })
            return response
        } catch (err: any) {
            // --- Если не авторизован, пробрасываем 401 ---
            if (err?.response?.status === 401) {
                throw { statusCode: 401, data: err.response?.data }
            }
            // Любые другие ошибки оставляем как есть
            throw err
        }
    }

    return { generateDescription }
}