// View - Maneja la interfaz de usuario y la presentación
class ProductView {
    constructor() {
        // Wait for DOM to be ready before initializing elements
        this.initializeElements();
        this.initializeEventListeners();
    }

    initializeElements() {
        // Basic elements
        this.productsContainer = document.getElementById('products-container');
        this.modal = document.getElementById('product-modal');
        this.modalBody = document.getElementById('modal-body');
        this.closeModal = document.querySelector('.close');
        
        // Cart modal elements
        this.cartModal = document.getElementById('cart-modal');
        this.cartBody = document.getElementById('cart-body');
        this.cartClose = document.querySelector('.cart-close');
        this.cartTotalAmount = document.getElementById('cart-total-amount');
        this.clearCartBtn = document.getElementById('clear-cart-btn');
        this.checkoutBtn = document.getElementById('checkout-btn');
        
        // Checkout modal elements
        this.checkoutModal = document.getElementById('checkout-modal');
        this.checkoutClose = document.querySelector('.checkout-close');
        this.checkoutForm = document.getElementById('checkout-form');
        this.checkoutItems = document.getElementById('checkout-items');
        this.orderSubtotal = document.getElementById('order-subtotal');
        this.orderShipping = document.getElementById('order-shipping');
        this.orderTotal = document.getElementById('order-total');
        
        // Success modal elements
        this.successModal = document.getElementById('success-modal');
        this.continueShoppingBtn = document.getElementById('continue-shopping');
        this.orderDetails = document.getElementById('order-details');
    }

    initializeEventListeners() {
        // Product modal events
        if (this.closeModal) {
            this.closeModal.addEventListener('click', () => {
                this.hideModal();
            });
        }

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hideModal();
                }
            });
        }

        // Cart modal events
        if (this.cartClose) {
            this.cartClose.addEventListener('click', () => {
                this.hideCartModal();
            });
        }

        if (this.cartModal) {
            this.cartModal.addEventListener('click', (e) => {
                if (e.target === this.cartModal) {
                    this.hideCartModal();
                }
            });
        }

        // Checkout modal events
        if (this.checkoutClose) {
            this.checkoutClose.addEventListener('click', () => {
                this.hideCheckoutModal();
            });
        }

        if (this.checkoutModal) {
            this.checkoutModal.addEventListener('click', (e) => {
                if (e.target === this.checkoutModal) {
                    this.hideCheckoutModal();
                }
            });
        }

        // Success modal events
        if (this.continueShoppingBtn) {
            this.continueShoppingBtn.addEventListener('click', () => {
                this.hideSuccessModal();
            });
        }

        if (this.successModal) {
            this.successModal.addEventListener('click', (e) => {
                if (e.target === this.successModal) {
                    this.hideSuccessModal();
                }
            });
        }

        // Global ESC key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
                this.hideCartModal();
                this.hideCheckoutModal();
                this.hideSuccessModal();
            }
        });
    }

    // Renderizar lista de productos
    renderProducts(products) {
        if (!this.productsContainer) return;

        if (products.length === 0) {
            this.productsContainer.innerHTML = `
                <div class="no-products">
                    <p>No se encontraron productos</p>
                </div>
            `;
            return;
        }

        this.productsContainer.innerHTML = products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    ${product.image}
                </div>
                <div class="product-info">
                    <h4 class="product-name">${product.name}</h4>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-stock">Stock: ${product.stock} unidades</div>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Mostrar detalles del producto en modal
    showProductDetails(product) {
        if (!product) return;

        this.modalBody.innerHTML = `
            <div class="product-details">
                <div class="product-detail-image">
                    ${product.image}
                </div>
                <div class="product-detail-info">
                    <h2>${product.name}</h2>
                    <p class="product-detail-description">${product.description}</p>
                    <div class="product-detail-price">$${product.price.toFixed(2)}</div>
                    
                    <div class="product-options">
                        <div class="size-selector">
                            <label>Talla:</label>
                            <select id="size-select">
                                ${product.sizes.map(size => `
                                    <option value="${size}">${size}</option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div class="color-selector">
                            <label>Color:</label>
                            <select id="color-select">
                                ${product.colors.map(color => `
                                    <option value="${color}">${color}</option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div class="quantity-selector">
                            <label>Cantidad:</label>
                            <input type="number" id="quantity-input" min="1" max="${product.stock}" value="1">
                        </div>
                    </div>
                    
                    <div class="product-stock-info">
                        <span class="stock-indicator ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                            ${product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
                        </span>
                    </div>
                    
                    <button class="add-to-cart-btn-modal" data-product-id="${product.id}" 
                            ${product.stock === 0 ? 'disabled' : ''}>
                        ${product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                    </button>
                </div>
            </div>
        `;

        this.showModal();
    }

    showModal() {
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Cart Modal Methods
    showCartModal() {
        if (this.cartModal) {
            this.cartModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    hideCartModal() {
        if (this.cartModal) {
            this.cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Checkout Modal Methods
    showCheckoutModal() {
        if (this.checkoutModal) {
            this.checkoutModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    hideCheckoutModal() {
        if (this.checkoutModal) {
            this.checkoutModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Success Modal Methods
    showSuccessModal() {
        if (this.successModal) {
            this.successModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    hideSuccessModal() {
        if (this.successModal) {
            this.successModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Render Cart Items
    renderCart(cartItems, products) {
        if (!this.cartBody) return;

        if (cartItems.length === 0) {
            this.cartBody.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega algunos productos para comenzar</p>
                </div>
            `;
            this.cartTotalAmount.textContent = '$0.00';
            this.checkoutBtn.disabled = true;
            return;
        }

        this.cartBody.innerHTML = cartItems.map(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) return '';

            const itemTotal = product.price * item.quantity;

            return `
                <div class="cart-item" data-item-id="${item.id}" data-size="${item.size}" data-color="${item.color}">
                    <div class="cart-item-image">${product.image}</div>
                    <div class="cart-item-info">
                        <h4>${product.name}</h4>
                        <div class="cart-item-details">
                            Talla: ${item.size} | Color: ${item.color}
                        </div>
                    </div>
                    <div class="cart-item-price">$${product.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease-qty" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn increase-qty" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">
                        Eliminar
                    </button>
                </div>
            `;
        }).join('');

        this.checkoutBtn.disabled = false;
    }

    // Update Cart Total
    updateCartTotal(total) {
        if (this.cartTotalAmount) {
            this.cartTotalAmount.textContent = `$${total.toFixed(2)}`;
        }
    }

    // Render Checkout Items
    renderCheckoutItems(cartItems, products) {
        if (!this.checkoutItems) return;

        this.checkoutItems.innerHTML = cartItems.map(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) return '';

            const itemTotal = product.price * item.quantity;

            return `
                <div class="checkout-item">
                    <div class="checkout-item-info">
                        <div class="checkout-item-name">${product.name}</div>
                        <div class="checkout-item-details">
                            ${item.quantity}x | Talla: ${item.size} | Color: ${item.color}
                        </div>
                    </div>
                    <div class="checkout-item-price">$${itemTotal.toFixed(2)}</div>
                </div>
            `;
        }).join('');
    }

    // Update Checkout Totals
    updateCheckoutTotals(subtotal, shipping = 5.99) {
        if (this.orderSubtotal) {
            this.orderSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        }
        if (this.orderShipping) {
            this.orderShipping.textContent = `$${shipping.toFixed(2)}`;
        }
        if (this.orderTotal) {
            this.orderTotal.textContent = `$${(subtotal + shipping).toFixed(2)}`;
        }
    }

    // Show Order Success
    showOrderSuccess(orderData) {
        if (this.orderDetails) {
            this.orderDetails.innerHTML = `
                <div><strong>Número de Pedido:</strong> #${orderData.id}</div>
                <div><strong>Total:</strong> $${orderData.total.toFixed(2)}</div>
                <div><strong>Fecha:</strong> ${new Date(orderData.createdAt).toLocaleDateString('es-ES')}</div>
                <div><strong>Estado:</strong> ${orderData.status}</div>
            `;
        }
        
        this.hideCheckoutModal();
        this.hideCartModal();
        this.showSuccessModal();
    }

    // Get Form Data
    getCheckoutFormData() {
        const getName = () => {
            const el = document.getElementById('customer-name');
            return el ? el.value : '';
        };
        
        const getEmail = () => {
            const el = document.getElementById('customer-email');
            return el ? el.value : '';
        };
        
        const getPhone = () => {
            const el = document.getElementById('customer-phone');
            return el ? el.value : '';
        };
        
        const getAddress = () => {
            const el = document.getElementById('customer-address');
            return el ? el.value : '';
        };
        
        const getCity = () => {
            const el = document.getElementById('customer-city');
            return el ? el.value : '';
        };
        
        const getState = () => {
            const el = document.getElementById('customer-state');
            return el ? el.value : '';
        };
        
        const getZip = () => {
            const el = document.getElementById('customer-zip');
            return el ? el.value : '';
        };
        
        const getNotes = () => {
            const el = document.getElementById('order-notes');
            return el ? el.value : '';
        };

        return {
            name: getName(),
            email: getEmail(),
            phone: getPhone(),
            address: getAddress(),
            city: getCity(),
            state: getState(),
            zip: getZip(),
            notes: getNotes()
        };
    }

    // Clear Form
    clearCheckoutForm() {
        if (this.checkoutForm) {
            this.checkoutForm.reset();
        }
    }

    // Mostrar notificación
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Agregar estilos si no existen
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 0.5rem;
                    color: white;
                    z-index: 1001;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    animation: slideIn 0.3s ease-out;
                }
                .notification-success { background: #10b981; }
                .notification-error { background: #ef4444; }
                .notification-warning { background: #f59e0b; }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto-remove después de 3 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);

        // Cerrar manualmente
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    // Actualizar contador del carrito
    updateCartCounter(count) {
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.textContent = `🛒 ${count > 0 ? count : ''}`;
        }
    }

    // Mostrar loading
    showLoading(container) {
        if (container) {
            container.innerHTML = '<div class="loading"></div>';
        }
    }

    // Renderizar carrito (para futuras implementaciones)
    renderCart(cartItems, products) {
        // Esta función se puede expandir para mostrar el carrito completo
        console.log('Cart items:', cartItems);
    }

    // Filtros y búsqueda
    renderFilters(categories) {
        const filtersContainer = document.createElement('div');
        filtersContainer.className = 'filters-container';
        filtersContainer.innerHTML = `
            <div class="filters">
                <div class="search-filter">
                    <input type="text" id="search-input" placeholder="Buscar productos...">
                </div>
                <div class="category-filter">
                    <select id="category-select">
                        <option value="">Todas las categorías</option>
                        ${categories.map(category => `
                            <option value="${category}">${category.charAt(0).toUpperCase() + category.slice(1)}</option>
                        `).join('')}
                    </select>
                </div>
            </div>
        `;

        // Insertar antes del contenedor de productos
        const productsSection = document.querySelector('.products-section .container');
        if (productsSection && !document.querySelector('.filters-container')) {
            productsSection.insertBefore(filtersContainer, this.productsContainer.parentNode);
        }
    }

    // Actualizar vista de producto individual
    updateProductCard(productId, newData) {
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        if (productCard) {
            const stockElement = productCard.querySelector('.product-stock');
            const addButton = productCard.querySelector('.add-to-cart-btn');
            
            if (stockElement) {
                stockElement.textContent = `Stock: ${newData.stock} unidades`;
            }
            
            if (addButton) {
                addButton.disabled = newData.stock === 0;
                addButton.textContent = newData.stock > 0 ? 'Agregar al Carrito' : 'Agotado';
            }
        }
    }
}