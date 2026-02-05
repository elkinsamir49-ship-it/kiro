# FIFTY ONE - Tienda de Ropa Oversize

Una aplicación web moderna para la venta de ropa oversize en línea, desarrollada con arquitectura MVC vanilla JavaScript.

## 🚀 Características

- **Arquitectura MVC**: Separación clara de responsabilidades
- **Diseño Responsivo**: Optimizado para todos los dispositivos
- **Carrito de Compras**: Funcionalidad completa con localStorage
- **Búsqueda y Filtros**: Encuentra productos fácilmente
- **Modal de Detalles**: Vista detallada de cada producto
- **Gestión de Stock**: Control en tiempo real del inventario
- **Notificaciones**: Feedback visual para todas las acciones

## 📁 Estructura del Proyecto

```
fifty-one/
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos CSS
├── js/
│   ├── model.js           # Modelo de datos (MVC)
│   ├── view.js            # Vista y UI (MVC)
│   ├── controller.js      # Controlador (MVC)
│   └── app.js             # Inicialización de la app
└── README.md              # Documentación
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con variables CSS y Grid/Flexbox
- **JavaScript ES6+**: Lógica de la aplicación
- **LocalStorage**: Persistencia de datos del carrito
- **Google Fonts**: Tipografía Inter

## 🎨 Características de Diseño

- Paleta de colores moderna con tonos púrpura y grises
- Interfaz limpia y minimalista
- Animaciones suaves y transiciones
- Iconos emoji para una experiencia visual amigable
- Diseño mobile-first

## 🚀 Cómo Usar

1. **Abrir la aplicación**: Simplemente abre `index.html` en tu navegador
2. **Explorar productos**: Navega por la colección de ropa oversize
3. **Buscar y filtrar**: Usa la barra de búsqueda y filtros por categoría
4. **Ver detalles**: Haz clic en cualquier producto para ver más información
5. **Agregar al carrito**: Selecciona talla, color y cantidad
6. **Gestionar carrito**: El carrito se guarda automáticamente

## 🔧 Funcionalidades Técnicas

### Modelo (Model)
- Gestión de productos y categorías
- Sistema de carrito de compras
- Control de inventario y stock
- Persistencia con localStorage
- Patrón Observer para notificaciones

### Vista (View)
- Renderizado dinámico de productos
- Modal para detalles de productos
- Sistema de notificaciones
- Filtros y búsqueda en tiempo real
- Responsive design

### Controlador (Controller)
- Coordinación entre Model y View
- Manejo de eventos de usuario
- Lógica de negocio
- Gestión de estado de la aplicación

## 🛒 Funcionalidades del Carrito

- ✅ Agregar productos con talla y color
- ✅ Actualizar cantidades
- ✅ Eliminar productos
- ✅ Persistencia automática
- ✅ Control de stock en tiempo real
- ✅ Cálculo de totales

## 🎯 Productos Incluidos

1. **Camiseta Beige Oversize** - $29.99
2. **Hoodie Negro Oversize** - $49.99
3. **Pantalón Cargo Oversize** - $59.99
4. **Chaqueta Denim Oversize** - $79.99
5. **Shorts Oversize** - $34.99
6. **Polo Oversize** - $39.99

## 🔍 Comandos de Desarrollo

Para debugging, abre la consola del navegador y usa:

```javascript
// Información de debug
FiftyOne.debug()

// Estadísticas de la app
FiftyOne.controller.getStats()

// Exportar carrito
FiftyOne.app.exportCart()

// Acceso directo a componentes
FiftyOne.model    // Modelo de datos
FiftyOne.view     // Vista
FiftyOne.controller // Controlador
```

## 📱 Responsive Design

- **Desktop**: Grid de 3-4 productos por fila
- **Tablet**: Grid de 2 productos por fila
- **Mobile**: Lista vertical de productos
- **Modal**: Se adapta al tamaño de pantalla

## 🎨 Personalización

### Colores
Modifica las variables CSS en `styles.css`:

```css
:root {
    --primary-color: #6366f1;    /* Color principal */
    --secondary-color: #1f2937;  /* Color secundario */
    --accent-color: #f59e0b;     /* Color de acento */
}
```

### Productos
Agrega nuevos productos en `model.js`:

```javascript
{
    id: 7,
    name: "Nuevo Producto",
    description: "Descripción del producto",
    price: 45.99,
    image: "🧥",
    category: "categoria",
    sizes: ["S", "M", "L", "XL"],
    colors: ["color1", "color2"],
    stock: 10
}
```

## 🚀 Próximas Características

- [ ] Integración con pasarela de pagos
- [ ] Sistema de usuarios y autenticación
- [ ] Wishlist de productos
- [ ] Reviews y calificaciones
- [ ] Filtros avanzados (precio, talla, color)
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Desarrollo

Desarrollado con ❤️ usando arquitectura MVC vanilla JavaScript para máximo rendimiento y simplicidad.

---

**FIFTY ONE** - Ropa Oversize de Calidad Premium 🔥