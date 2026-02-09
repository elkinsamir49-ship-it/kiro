// Controller - Maneja la lógica de la aplicación y coordina Model y View
class ProductController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        this.currentFilter = '';
        this.currentSearch = '';
        
        this.initializeEventListeners();
        this.setupModelObservers();
        this.loadInitialData();
    }

    initializeEventListeners() {
        // Event delegation para productos
        document.addEventListener('click', (e) => {
            // Agregar al carrito desde la grilla
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productId = parseInt(e.target.dataset.productId);
                this.handleAddToCart(productId);
            }
            
            // Agregar al carrito desde el modal
            if (e.target.classList.contains('add-to-cart-btn-modal')) {
                const productId = parseInt(e.target.dataset.productId);
                this.handleAddToCartFromModal(productId);
            }
            
            // Mostrar detalles del producto
            if (e.target.closest('.product-card')) {
                const productCard = e.target.closest('.product-card');
                const productId = parseInt(productCard.dataset.productId);
                this.showProductDetails(productId);
            }

            // Cart button - show cart modal
            if (e.target.classList.contains('cart-btn')) {
                this.showCart();
            }

            // Clear cart button
            if (e.target.id === 'clear-cart-btn') {
                this.handleClearCart();
            }

            // Checkout button
            if (e.target.id === 'checkout-btn') {
                this.showCheckout();
            }

            // Quantity controls
            if (e.target.classList.contains('increase-qty')) {
                const { id, size, color } = e.target.dataset;
                this.handleQuantityChange(parseInt(id), size, color, 1);
            }

            if (e.target.classList.contains('decrease-qty')) {
                const { id, size, color } = e.target.dataset;
                this.handleQuantityChange(parseInt(id), size, color, -1);
            }

            // Remove item from cart
            if (e.target.classList.contains('remove-item-btn')) {
                const { id, size, color } = e.target.dataset;
                this.handleRemoveFromCart(parseInt(id), size, color);
            }
        });

        // Checkout form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'checkout-form') {
                e.preventDefault();
                this.handleCheckoutSubmit();
            }
        });

        // Búsqueda
        document.addEventListener('input', (e) => {
            if (e.target.id === 'search-input') {
                this.handleSearch(e.target.value);
            }
        });

        // Filtro por categoría
        document.addEventListener('change', (e) => {
            if (e.target.id === 'category-select') {
                this.handleCategoryFilter(e.target.value);
            }
        });

        // Navegación
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cta-btn')) {
                this.scrollToProducts();
            }
        });
    }

    setupModelObservers() {
        // Observer para actualizaciones del carrito
        this.model.addObserver({
            onCartUpdated: (cart) => {
                const itemCount = this.model.getCartItemCount();
                this.view.updateCartCounter(itemCount);
                
                // Update cart modal if it's open
                if (this.view.cartModal && this.view.cartModal.style.display === 'block') {
                    const products = this.model.getAllProducts();
                    const total = this.model.getCartTotal();
                    this.view.renderCart(cart, products);
                    this.view.updateCartTotal(total);
                }
                
                // Show notification only for additions, not for updates
                if (cart.length > 0) {
                    this.view.showNotification(`Carrito actualizado (${itemCount} items)`, 'success');
                }
            },
            
            onError: (message) => {
                this.view.showNotification(message, 'error');
            }
        });
    }

    loadInitialData() {
        // Cargar productos iniciales
        const products = this.model.getAllProducts();
        this.view.renderProducts(products);
        
        // Cargar filtros
        const categories = this.model.getCategories();
        this.view.renderFilters(categories);
        
        // Actualizar contador del carrito
        const cartCount = this.model.getCartItemCount();
        this.view.updateCartCounter(cartCount);
    }

    // Manejar agregar al carrito desde la grilla
    handleAddToCart(productId) {
        const product = this.model.getProductById(productId);
        if (!product) {
            this.view.showNotification('Producto no encontrado', 'error');
            return;
        }

        if (product.stock === 0) {
            this.view.showNotification('Producto agotado', 'warning');
            return;
        }

        const success = this.model.addToCart(productId, 1, 'M');
        if (success) {
            this.view.updateProductCard(productId, { stock: product.stock });
            this.refreshProductDisplay();
        }
    }

    // Manejar agregar al carrito desde el modal
    handleAddToCartFromModal(productId) {
        const sizeSelect = document.getElementById('size-select');
        const colorSelect = document.getElementById('color-select');
        const quantityInput = document.getElementById('quantity-input');

        if (!sizeSelect || !colorSelect || !quantityInput) {
            this.view.showNotification('Error en la selección de opciones', 'error');
            return;
        }

        const size = sizeSelect.value;
        const color = colorSelect.value;
        const quantity = parseInt(quantityInput.value);

        if (quantity <= 0) {
            this.view.showNotification('Cantidad inválida', 'error');
            return;
        }

        const product = this.model.getProductById(productId);
        if (quantity > product.stock) {
            this.view.showNotification(`Solo hay ${product.stock} unidades disponibles`, 'warning');
            return;
        }

        const success = this.model.addToCart(productId, quantity, size, color);
        if (success) {
            this.view.hideModal();
            this.view.updateProductCard(productId, { stock: product.stock });
            this.refreshProductDisplay();
        }
    }

    // Mostrar detalles del producto
    showProductDetails(productId) {
        const product = this.model.getProductById(productId);
        if (product) {
            this.view.showProductDetails(product);
        }
    }

    // Manejar búsqueda
    handleSearch(query) {
        this.currentSearch = query.trim();
        this.applyFilters();
    }

    // Manejar filtro por categoría
    handleCategoryFilter(category) {
        this.currentFilter = category;
        this.applyFilters();
    }

    // Aplicar filtros combinados
    applyFilters() {
        let products = this.model.getAllProducts();

        // Aplicar filtro de categoría
        if (this.currentFilter) {
            products = this.model.getProductsByCategory(this.currentFilter);
        }

        // Aplicar búsqueda
        if (this.currentSearch) {
            const searchResults = this.model.searchProducts(this.currentSearch);
            if (this.currentFilter) {
                // Intersección de resultados
                products = products.filter(product => 
                    searchResults.some(searchProduct => searchProduct.id === product.id)
                );
            } else {
                products = searchResults;
            }
        }

        this.view.renderProducts(products);
    }

    // Refrescar la visualización de productos
    refreshProductDisplay() {
        this.applyFilters();
    }

    // Scroll a la sección de productos
    scrollToProducts() {
        const productsSection = document.querySelector('.products-section');
        if (productsSection) {
            productsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Métodos para el carrito
    showCart() {
        const cartItems = this.model.getCart();
        const products = this.model.getAllProducts();
        const total = this.model.getCartTotal();
        
        this.view.renderCart(cartItems, products);
        this.view.updateCartTotal(total);
        this.view.showCartModal();
    }

    handleClearCart() {
        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            this.model.clearCart();
            this.showCart(); // Refresh cart display
        }
    }

    handleQuantityChange(productId, size, color, change) {
        const cartItems = this.model.getCart();
        const item = cartItems.find(item => 
            item.id === productId && item.size === size && item.color === color
        );
        
        if (item) {
            const newQuantity = item.quantity + change;
            if (newQuantity > 0) {
                this.model.updateCartItemQuantity(productId, size, color, newQuantity);
                this.showCart(); // Refresh cart display
            } else {
                this.handleRemoveFromCart(productId, size, color);
            }
        }
    }

    handleRemoveFromCart(productId, size, color) {
        if (confirm('¿Eliminar este producto del carrito?')) {
            this.model.removeFromCart(productId, size, color);
            this.showCart(); // Refresh cart display
        }
    }

    showCheckout() {
        const cartItems = this.model.getCart();
        const products = this.model.getAllProducts();
        const subtotal = this.model.getCartTotal();
        
        this.view.renderCheckoutItems(cartItems, products);
        this.view.updateCheckoutTotals(subtotal);
        this.view.hideCartModal();
        this.view.showCheckoutModal();
    }

    async handleCheckoutSubmit() {
        const formData = this.view.getCheckoutFormData();
        
        // Validate form
        if (!this.validateCheckoutForm(formData)) {
            return;
        }

        try {
            // Show loading state
            const submitBtn = document.querySelector('button[type="submit"][form="checkout-form"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Procesando...';
            submitBtn.disabled = true;

            // Process order
            const orderData = await this.model.processOrder(formData);
            
            // Show success
            this.view.showOrderSuccess(orderData);
            this.view.clearCheckoutForm();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
        } catch (error) {
            this.view.showNotification(`Error al procesar el pedido: ${error}`, 'error');
            
            // Reset button
            const submitBtn = document.querySelector('button[type="submit"][form="checkout-form"]');
            submitBtn.textContent = 'Confirmar Pedido';
            submitBtn.disabled = false;
        }
    }

    validateCheckoutForm(formData) {
        const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'zip'];
        
        for (const field of requiredFields) {
            if (!formData[field] || formData[field].trim() === '') {
                this.view.showNotification(`El campo ${field} es requerido`, 'error');
                return false;
            }
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            this.view.showNotification('Email inválido', 'error');
            return false;
        }

        return true;
    }

    // Procesar pedido
    async processOrder(customerData) {
        try {
            this.view.showNotification('Procesando pedido...', 'warning');
            const order = await this.model.processOrder(customerData);
            this.view.showNotification(`Pedido #${order.id} procesado exitosamente`, 'success');
            this.refreshProductDisplay();
            return order;
        } catch (error) {
            this.view.showNotification(`Error al procesar pedido: ${error}`, 'error');
            throw error;
        }
    }

    // Obtener estadísticas
    getStats() {
        const products = this.model.getAllProducts();
        const cart = this.model.getCart();
        
        return {
            totalProducts: products.length,
            totalStock: products.reduce((sum, product) => sum + product.stock, 0),
            cartItems: cart.length,
            cartTotal: this.model.getCartTotal(),
            categories: this.model.getCategories().length
        };
    }

    // Método para debugging
    debug() {
        console.log('=== FIFTY ONE DEBUG INFO ===');
        console.log('Products:', this.model.getAllProducts());
        console.log('Cart:', this.model.getCart());
        console.log('Stats:', this.getStats());
        console.log('Current Filter:', this.currentFilter);
        console.log('Current Search:', this.currentSearch);
    }
}