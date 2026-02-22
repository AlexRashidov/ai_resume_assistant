interface ResumeItem {
    id: string
    position: string
    content: string
    type: 'about' | 'skills' | 'analysis'
    createdAt: string
}

export const useResume = () => {
    const getHistory = async (): Promise<ResumeItem[]> => {
        try {
            const response = await $fetch<{ resumes: ResumeItem[] }>('/api/resume/history')
            return response.resumes
        } catch (err) {
            console.error('Fetch history error:', err)
            return []
        }
    }

    return { getHistory }
}