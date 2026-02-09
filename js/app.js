// App.js - Punto de entrada de la aplicación
class FiftyOneApp {
    constructor() {
        this.model = null;
        this.view = null;
        this.controller = null;
        
        this.init();
    }

    init() {
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeApp();
            });
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        // Inicializar componentes MVC
        this.model = new ProductModel();
        this.view = new ProductView();
        this.controller = new ProductController(this.model, this.view);

        // Configurar eventos globales básicos
        this.setupGlobalEventListeners();
        
        console.log('🎉 FIFTY ONE App initialized successfully!');
        
        // Hacer disponible globalmente para debugging
        window.FiftyOne = {
            app: this,
            model: this.model,
            view: this.view,
            controller: this.controller,
            debug: () => this.controller.debug()
        };
    }

    setupGlobalEventListeners() {
        // Prevenir pérdida de datos del carrito
        window.addEventListener('beforeunload', (event) => {
            const cartItems = this.model.getCartItemCount();
            if (cartItems > 0) {
                event.preventDefault();
                event.returnValue = '¿Estás seguro de que quieres salir? Tienes productos en tu carrito.';
            }
        });

        // Atajos de teclado
        document.addEventListener('keydown', (event) => {
            // Ctrl/Cmd + K para buscar
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault();
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        });
    }

    // Métodos públicos para interactuar con la app
    addProduct(productData) {
        // Método para agregar productos dinámicamente
        this.model.products.push({
            id: Date.now(),
            ...productData
        });
        this.controller.refreshProductDisplay();
    }

    getAppStats() {
        return this.controller.getStats();
    }

    exportCart() {
        const cart = this.model.getCart();
        const dataStr = JSON.stringify(cart, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'fiftyone-cart.json';
        link.click();
    }

    importCart(jsonData) {
        try {
            const cartData = JSON.parse(jsonData);
            this.model.cart = cartData;
            this.model.saveCart();
            this.controller.refreshProductDisplay();
            this.view.showNotification('Carrito importado exitosamente', 'success');
        } catch (error) {
            this.view.showNotification('Error al importar carrito', 'error');
        }
    }
}

// Inicializar la aplicación
const app = new FiftyOneApp();

// Funciones de utilidad globales
window.FiftyOneUtils = {
    formatPrice: (price) => `$${price.toFixed(2)}`,
    formatDate: (date) => new Date(date).toLocaleDateString('es-ES'),
    generateId: () => Date.now() + Math.random().toString(36).substr(2, 9),
    
    // Validaciones
    validateEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    validatePhone: (phone) => /^\+?[\d\s-()]+$/.test(phone),
    
    // Utilidades de localStorage
    saveToStorage: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },
    
    loadFromStorage: (key, defaultValue = null) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return defaultValue;
        }
    }
};

// Configuración de desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🚀 FIFTY ONE - Development Mode');
    console.log('Available commands:');
    console.log('- FiftyOne.debug() - Show debug information');
    console.log('- FiftyOne.controller.getStats() - Get app statistics');
    console.log('- FiftyOne.app.exportCart() - Export cart to JSON');
}