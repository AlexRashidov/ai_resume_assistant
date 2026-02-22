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
                body: { position, experience, type }
            })
            return response
        } catch (err) {
            console.error('Generation error:', err)
            throw err
        }
    }

    return { generateDescription }
}