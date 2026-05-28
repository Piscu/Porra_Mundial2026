// Configuración de la aplicación
const CONFIG = {
    // IDs de competiciones en football-data.org
    COMPETITIONS: {
        'WC': 'FIFA World Cup' // World Cup 2026
    },
    
    // URLs de API
    API_BASE_URL: 'https://api.football-data.org/v4',
    
    // Claves de almacenamiento local
    STORAGE_KEYS: {
        CURRENT_USER: 'porra_current_user',
        SESSION_TOKEN: 'porra_session_token',
        API_KEY: 'porra_api_key',
        SHEET_ID: 'porra_sheet_id',
        APPS_SCRIPT_URL: 'porra_apps_script_url',
        PREDICTIONS: 'porra_predictions',
        MATCHES_CACHE: 'porra_matches_cache',
        STANDINGS_CACHE: 'porra_standings_cache',
        SCORE_CONFIG: 'porra_score_config'
    },
    
    // Configuración de caché
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
    
    // Mapa de banderas de países (emoji)
    FLAGS: {
        'Argentina': '🇦🇷',
        'Brazil': '🇧🇷',
        'France': '🇫🇷',
        'Germany': '🇩🇪',
        'Spain': '🇪🇸',
        'England': '🇬🇧',
        'Italy': '🇮🇹',
        'Netherlands': '🇳🇱',
        'Belgium': '🇧🇪',
        'Portugal': '🇵🇹',
        'Mexico': '🇲🇽',
        'Canada': '🇨🇦',
        'United States': '🇺🇸',
        'Japan': '🇯🇵',
        'South Korea': '🇰🇷',
        'Australia': '🇦🇺',
        'Saudi Arabia': '🇸🇦',
        'Qatar': '🇶🇦',
        'UAE': '🇦🇪',
        'Uruguay': '🇺🇾',
        'Paraguay': '🇵🇾',
        'Chile': '🇨🇱',
        'Colombia': '🇨🇴',
        'Peru': '🇵🇪',
        'Greece': '🇬🇷',
        'Hungary': '🇭🇺',
        'Poland': '🇵🇱',
        'Serbia': '🇷🇸',
        'Turkey': '🇹🇷',
        'Iran': '🇮🇷',
        'Ghana': '🇬🇭',
        'Senegal': '🇸🇳',
        'Morocco': '🇲🇦',
        'Tunisia': '🇹🇳',
        'Egypt': '🇪🇬',
        'Costa Rica': '🇨🇷',
        'Panama': '🇵🇦',
        'Honduras': '🇭🇳',
        'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
        'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
        'Switzerland': '🇨🇭',
        'Austria': '🇦🇹',
        'Czech Republic': '🇨🇿',
        'Czechia': '🇨🇿',
        'Croatia': '🇭🇷',
        'Slovenia': '🇸🇮',
        'Slovakia': '🇸🇰',
        'Romania': '🇷🇴',
        'Bulgaria': '🇧🇬',
        'Norway': '🇳🇴',
        'Sweden': '🇸🇪',
        'Finland': '🇫🇮',
        'Denmark': '🇩🇰',
        'Iceland': '🇮🇸',
        'Ivory Coast': '🇨🇮',
        'Mali': '🇲🇱',
        'Cameroon': '🇨🇲',
        'Nigeria': '🇳🇬',
        'Zambia': '🇿🇲',
        'South Africa': '🇿🇦',
        'New Zealand': '🇳🇿',
        'Vietnam': '🇻🇳',
        'Thailand': '🇹🇭',
        'Indonesia': '🇮🇩',
        'Malaysia': '🇲🇾'
    }
};

// Función para obtener la bandera de un país
function getFlag(countryName) {
    return CONFIG.FLAGS[countryName] || '⚽';
}

// Función para guardar en localStorage
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error guardando en localStorage:', error);
        return false;
    }
}

// Función para obtener de localStorage
function getFromLocalStorage(key) {
    try {
        const value = localStorage.getItem(key);
        if (!value) return null;
        try {
            return JSON.parse(value);
        } catch (parseError) {
            // Valor guardado como string sin JSON
            return value;
        }
    } catch (error) {
        console.error('Error obteniendo de localStorage:', error);
        return null;
    }
}

// Función para limpiar localStorage
function clearLocalStorage() {
    try {
        Object.values(CONFIG.STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        return true;
    } catch (error) {
        console.error('Error limpiando localStorage:', error);
        return false;
    }
}

// Función para exportar datos
function exportData() {
    const data = {};
    Object.values(CONFIG.STORAGE_KEYS).forEach(key => {
        const value = getFromLocalStorage(key);
        if (value) {
            data[key] = value;
        }
    });
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `porra-datos-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}
