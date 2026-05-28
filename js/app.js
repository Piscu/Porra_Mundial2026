// Aplicación principal
class PorraApp {
    constructor() {
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        try {
            // Cargar configuración guardada
            const savedApiKey = getFromLocalStorage(CONFIG.STORAGE_KEYS.API_KEY);
            const savedSheetId = getFromLocalStorage(CONFIG.STORAGE_KEYS.SHEET_ID);

            if (savedApiKey) {
                initFootballAPI(savedApiKey);
            }

            if (savedSheetId) {
                initGoogleSheets(savedSheetId);
            }

            this.initialized = true;
            console.log('Aplicación inicializada correctamente');
        } catch (error) {
            console.error('Error inicializando aplicación:', error);
        }
    }
}

// Crear instancia de la aplicación
const app = new PorraApp();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Manejar errores globales
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
});

// Manejar rechazos de promesas no capturadas
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada no capturada:', event.reason);
});
