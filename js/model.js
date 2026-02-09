// Model - Maneja los datos y la lógica de negocio
class ProductModel {
    constructor() {
        this.products = [
            {
                id: 1,
                name: "Camiseta Beige Oversize",
                description: "Camiseta oversize de algodón premium, perfecta para un look casual y cómodo.",
                price: 29.99,
                image: "👕",
                category: "camisetas",
                sizes: ["S", "M", "L", "XL", "XXL"],
                colors: ["beige", "negro", "blanco"],
                stock: 15
            },
            {
                id: 2,
                name: "Hoodie Negro Oversize",
                description: "Sudadera con capucha oversize, ideal para los días frescos.",
                price: 49.99,
                image: "🧥",
                category: "hoodies",
                sizes: ["S", "M", "L", "XL", "XXL"],
                colors: ["negro", "gris", "azul marino"],
                stock: 8
            },
            {
                id: 3,
                name: "Pantalón Cargo Oversize",
                description: "Pantalón cargo con múltiples bolsillos, estilo urbano y cómodo.",
                price: 59.99,
                image: "👖",
                category: "pantalones",
                sizes: ["S", "M", "L", "XL", "XXL"],
                colors: ["khaki", "negro", "verde militar"],
                stock: 12
            },
            {
                id: 4,
                name: "Chaqueta Denim Oversize",
                description: "Chaqueta de mezclilla oversize, clásica y versátil.",
                price: 79.99,
                image: "🧥",
                category: "chaquetas",
                sizes: ["S", "M", "L", "XL", "XXL"],
                colors: ["azul claro", "azul oscuro", "negro"],
                stock: 6
            },
            {
                id: 5,
                name: "Shorts Oversize",
                description: "Shorts cómodos y amplios, perfectos para el verano.",
                price: 34.99,
                image: "🩳",
                category: "shorts",
                sizes: ["S", "M", "L", "XL", "XXL"],
                colors: ["beige", "negro", "gris"],
                stock: 20
            },
            {
                id: 6,
                name: "Polo Oversize",
                description: "Polo oversize de algodón piqué, elegante y casual.",
                price: 39.99,
                image: "👔",
                category: "polos",
                sizes: ["S", "M", "L", "XL", "XXL"],
                colors: ["blanco", "negro", "azul marino"],
                stock: 10
            }
        ];
        
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.categories = ["camisetas", "hoodies", "pantalones", "chaquetas", "shorts", "polos"];
        this.observers = [];
    }

    // Observer pattern para notificar cambios
    addObserver(observer) {
        this.observers.push(observer);
    }

    notifyObservers(event, data) {
        this.observers.forEach(observer => {
            if (observer[event]) {
                observer[event](data);
            }
        });
    }

    // Obtener todos los productos
    getAllProducts() {
        return this.products;
    }

    // Obtener producto por ID
    getProductById(id) {
        return this.products.find(product => product.id === parseInt(id));
    }

    // Filtrar productos por categoría
    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }

    // Buscar productos
    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }

    // Obtener categorías
    getCategories() {
        return this.categories;
    }

    // Carrito de compras
    addToCart(productId, quantity = 1, size = "M", color = null) {
        const product = this.getProductById(productId);
        if (!product) return false;

        if (product.stock < quantity) {
            this.notifyObservers('onError', 'No hay suficiente stock disponible');
            return false;
        }

        const existingItem = this.cart.find(item => 
            item.id === productId && item.size === size && item.color === color
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                quantity: quantity,
                size: size,
                color: color || product.colors[0],
                addedAt: new Date().toISOString()
            });
        }

        // Actualizar stock
        product.stock -= quantity;
        
        this.saveCart();
        this.notifyObservers('onCartUpdated', this.cart);
        return true;
    }

    removeFromCart(productId, size, color) {
        const itemIndex = this.cart.findIndex(item => 
            item.id === productId && item.size === size && item.color === color
        );

        if (itemIndex !== -1) {
            const item = this.cart[itemIndex];
            const product = this.getProductById(productId);
            
            // Restaurar stock
            if (product) {
                product.stock += item.quantity;
            }
            
            this.cart.splice(itemIndex, 1);
            this.saveCart();
            this.notifyObservers('onCartUpdated', this.cart);
            return true;
        }
        return false;
    }

    updateCartItemQuantity(productId, size, color, newQuantity) {
        const item = this.cart.find(item => 
            item.id === productId && item.size === size && item.color === color
        );

        if (item && newQuantity > 0) {
            const product = this.getProductById(productId);
            const quantityDiff = newQuantity - item.quantity;
            
            if (product && product.stock >= quantityDiff) {
                item.quantity = newQuantity;
                product.stock -= quantityDiff;
                
                this.saveCart();
                this.notifyObservers('onCartUpdated', this.cart);
                return true;
            }
        }
        return false;
    }

    getCart() {
        return this.cart;
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => {
            const product = this.getProductById(item.id);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    }

    getCartItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    clearCart() {
        // Restaurar stock
        this.cart.forEach(item => {
            const product = this.getProductById(item.id);
            if (product) {
                product.stock += item.quantity;
            }
        });
        
        this.cart = [];
        this.saveCart();
        this.notifyObservers('onCartUpdated', this.cart);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Simular procesamiento de pedido
    processOrder(orderData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.cart.length === 0) {
                    reject('El carrito está vacío');
                    return;
                }

                // Calculate totals
                const subtotal = this.getCartTotal();
                const shipping = 5.99;
                const total = subtotal + shipping;

                const order = {
                    id: Date.now(),
                    items: [...this.cart],
                    subtotal: subtotal,
                    shipping: shipping,
                    total: total,
                    customerInfo: orderData,
                    status: 'confirmado',
                    createdAt: new Date().toISOString()
                };

                // Save order to localStorage for demo purposes
                const orders = JSON.parse(localStorage.getItem('orders')) || [];
                orders.push(order);
                localStorage.setItem('orders', JSON.stringify(orders));

                this.clearCart();
                resolve(order);
            }, 2000); // Simulate processing time
        });
    }

    // Get order history
    getOrderHistory() {
        return JSON.parse(localStorage.getItem('orders')) || [];
    }

    // Get order by ID
    getOrderById(orderId) {
        const orders = this.getOrderHistory();
        return orders.find(order => order.id === orderId);
    }
}