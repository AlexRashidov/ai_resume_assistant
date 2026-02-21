export default defineNuxtConfig({
    compatibilityDate:'2026-02-21',
    devtools: { enabled: true },
    modules: ['@nuxtjs/tailwindcss'],

    runtimeConfig: {
        geminiApiKey: process.env.GEMINI_API_KEY
    },

    // Важно для темной темы!
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
})