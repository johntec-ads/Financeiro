const ThemeContext = {
    currentTheme: 'light',

    init() {
        this.loadTheme();
        this.setupThemeToggle();
    },

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    },

    setTheme(theme) {
        this.currentTheme = theme;
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${theme}`);
        localStorage.setItem('theme', theme);
    },

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },

    setupThemeToggle() {
        // Você pode adicionar um botão no HTML para chamar esta função
        window.toggleTheme = () => this.toggleTheme();
    }
};
