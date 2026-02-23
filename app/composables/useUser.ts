// composables/useUser.ts
export const useUser = () => useState<{ userId?: string | null }>('user', () => ({ userId: null }))