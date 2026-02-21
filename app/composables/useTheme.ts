export const useTheme = () => {
    // Состояние темы
    const isDark = ref(false)

    // Проверяем сохраненную тему или системные настройки
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            isDark.value = savedTheme === 'dark'
        } else {
            // Проверяем системные настройки
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            isDark.value = prefersDark
        }

        // Применяем тему
        updateThemeClass()
    }

    // Обновляем класс на html
    const updateThemeClass = () => {
        if (isDark.value) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    // Переключение темы
    const toggleTheme = () => {
        isDark.value = !isDark.value
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
        updateThemeClass()
    }

    return {
        isDark,
        toggleTheme,
        initTheme
    }
}