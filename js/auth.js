// Authentication Manager - Maneja login, registro y sesiones de usuario
class AuthManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.users = this.getUsers();
    }

    // Inicializar funcionalidad de login
    initLogin() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e.target);
            });
        }

        // Social login buttons
        this.initSocialLogin();
    }

    // Inicializar funcionalidad de registro
    initRegister() {
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(e.target);
            });

            // Password confirmation validation
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirm-password');
            
            if (password && confirmPassword) {
                confirmPassword.addEventListener('input', () => {
                    if (password.value !== confirmPassword.value) {
                        confirmPassword.setCustomValidity('Las contraseñas no coinciden');
                    } else {
                        confirmPassword.setCustomValidity('');
                    }
                });
            }
        }

        // Social login buttons
        this.initSocialLogin();
    }

    // Manejar login
    handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = formData.get('remember-me') === 'on';

        // Validar credenciales
        const user = this.validateCredentials(email, password);
        
        if (user) {
            this.loginUser(user, rememberMe);
            this.showNotification('¡Bienvenido de vuelta!', 'success');
            
            // Redirect to previous page or home
            setTimeout(() => {
                const returnUrl = new URLSearchParams(window.location.search).get('return') || 'index.html';
                window.location.href = returnUrl;
            }, 1500);
        } else {
            this.showNotification('Email o contraseña incorrectos', 'error');
        }
    }

    // Manejar registro
    handleRegister(form) {
        const formData = new FormData(form);
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            birthDate: formData.get('birthDate'),
            gender: formData.get('gender'),
            newsletter: formData.get('accept-newsletter') === 'on',
            createdAt: new Date().toISOString(),
            id: Date.now()
        };

        // Validar que el email no exista
        if (this.emailExists(userData.email)) {
            this.showNotification('Este email ya está registrado', 'error');
            return;
        }

        // Registrar usuario
        this.registerUser(userData);
        this.loginUser(userData, false);
        this.showNotification('¡Cuenta creada exitosamente! Bienvenido a FIFTY ONE', 'success');
        
        // Redirect to home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    // Validar credenciales
    validateCredentials(email, password) {
        return this.users.find(user => 
            user.email === email && user.password === password
        );
    }

    // Verificar si email existe
    emailExists(email) {
        return this.users.some(user => user.email === email);
    }

    // Registrar nuevo usuario
    registerUser(userData) {
        this.users.push(userData);
        this.saveUsers();
    }

    // Iniciar sesión de usuario
    loginUser(user, rememberMe) {
        const sessionData = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe
        };

        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
        }

        this.currentUser = sessionData;
        this.updateUserInterface();
    }

    // Cerrar sesión
    logout() {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        this.currentUser = null;
        this.updateUserInterface();
        this.showNotification('Sesión cerrada correctamente', 'success');
        
        // Redirect to home if on protected page
        if (window.location.pathname.includes('profile') || 
            window.location.pathname.includes('orders')) {
            window.location.href = 'index.html';
        }
    }

    // Obtener usuario actual
    getCurrentUser() {
        const stored = localStorage.getItem('currentUser') || 
                      sessionStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    }

    // Obtener todos los usuarios
    getUsers() {
        const stored = localStorage.getItem('users');
        return stored ? JSON.parse(stored) : this.getDefaultUsers();
    }

    // Usuarios por defecto para demo
    getDefaultUsers() {
        return [
            {
                id: 1,
                firstName: 'Demo',
                lastName: 'User',
                email: 'demo@fiftyone.com',
                password: '123456',
                phone: '+1234567890',
                createdAt: new Date().toISOString()
            }
        ];
    }

    // Guardar usuarios
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    // Actualizar interfaz de usuario
    updateUserInterface() {
        const userBtn = document.querySelector('.user-btn');
        const userMenus = document.querySelectorAll('.user-menu');

        if (this.currentUser && userBtn) {
            // Update user button
            userBtn.innerHTML = `👤 ${this.currentUser.firstName}`;
            userBtn.classList.add('logged-in');
            
            // Add dropdown menu if it doesn't exist
            this.createUserDropdown(userBtn);
        } else if (userBtn) {
            userBtn.innerHTML = '👤';
            userBtn.classList.remove('logged-in');
            userBtn.onclick = () => window.location.href = 'login.html';
        }
    }

    // Crear dropdown de usuario
    createUserDropdown(userBtn) {
        // Remove existing dropdown
        const existingDropdown = document.querySelector('.user-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }

        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.innerHTML = `
            <div class="user-info">
                <strong>${this.currentUser.firstName} ${this.currentUser.lastName}</strong>
                <small>${this.currentUser.email}</small>
            </div>
            <div class="user-menu-items">
                <a href="profile.html">Mi Perfil</a>
                <a href="orders.html">Mis Pedidos</a>
                <a href="wishlist.html">Lista de Deseos</a>
                <hr>
                <button onclick="authManager.logout()">Cerrar Sesión</button>
            </div>
        `;

        userBtn.parentNode.style.position = 'relative';
        userBtn.parentNode.appendChild(dropdown);

        // Toggle dropdown
        userBtn.onclick = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        };

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropdown.classList.remove('show');
        });
    }

    // Inicializar login social
    initSocialLogin() {
        const googleBtn = document.querySelector('.btn-social.google');
        const facebookBtn = document.querySelector('.btn-social.facebook');

        if (googleBtn) {
            googleBtn.addEventListener('click', () => {
                this.handleSocialLogin('google');
            });
        }

        if (facebookBtn) {
            facebookBtn.addEventListener('click', () => {
                this.handleSocialLogin('facebook');
            });
        }
    }

    // Manejar login social (simulado)
    handleSocialLogin(provider) {
        this.showNotification(`Login con ${provider} no disponible en demo`, 'warning');
        
        // Simulate social login for demo
        if (confirm(`¿Simular login con ${provider}?`)) {
            const demoUser = {
                id: Date.now(),
                firstName: 'Usuario',
                lastName: provider === 'google' ? 'Google' : 'Facebook',
                email: `demo@${provider}.com`,
                loginTime: new Date().toISOString(),
                socialProvider: provider
            };
            
            this.currentUser = demoUser;
            sessionStorage.setItem('currentUser', JSON.stringify(demoUser));
            this.updateUserInterface();
            this.showNotification(`¡Bienvenido via ${provider}!`, 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    }

    // Verificar si usuario está logueado
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Requerir autenticación
    requireAuth() {
        if (!this.isLoggedIn()) {
            const currentPage = window.location.pathname;
            window.location.href = `login.html?return=${encodeURIComponent(currentPage)}`;
            return false;
        }
        return true;
    }

    // Mostrar notificación
    showNotification(message, type = 'success') {
        // Create notification if it doesn't exist
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
                    max-width: 400px;
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

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
}

// Initialize global auth manager
let authManager;

document.addEventListener('DOMContentLoaded', function() {
    authManager = new AuthManager();
    authManager.updateUserInterface();
});