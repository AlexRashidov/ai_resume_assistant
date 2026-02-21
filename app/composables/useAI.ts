interface GenerateResponse {
    result: string
    type?: string
}

export const useAI = () => {
    const generateDescription = async (position: string, experience: string, type: string = 'about'): Promise<GenerateResponse> => {
        try {
            const response = await $fetch<GenerateResponse>('/api/generate', {
                method: 'POST',
                body: {
                    position,
                    experience,
                    type
                }
            })

            return response
        } catch (error) {
            console.error('Generation error:', error)
            throw error
        }
    }

    return {
        generateDescription
    }
}