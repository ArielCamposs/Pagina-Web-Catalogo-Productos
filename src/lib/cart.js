// Simple cart management without external dependencies
let cart = [];

// Load cart from localStorage
if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('musaplast-cart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading cart:', e);
        }
    }
}

// Save cart to localStorage
function saveCart() {
    if (typeof window !== 'undefined') {
        localStorage.setItem('musaplast-cart', JSON.stringify(cart));
        updateCartUI();
    }
}

// Add product to cart
export function addToCart(product, quantity = 1) {
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }

    saveCart();
}

// Remove product from cart
export function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

// Update quantity
export function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        saveCart();
    }
}

// Clear cart
export function clearCart() {
    cart = [];
    saveCart();
}

// Get cart items
export function getCartItems() {
    return cart;
}

// Get cart count
export function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Generate WhatsApp message
export function generateWhatsAppMessage() {
    if (cart.length === 0) {
        return encodeURIComponent('Hola, quisiera información sobre sus productos');
    }

    let message = '¡Hola! Quisiera hacer el siguiente pedido:\n\n';

    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   Categoría: ${item.category}\n`;
        message += `   Cantidad: ${item.quantity}\n\n`;
    });

    message += `Total de productos: ${getCartCount()}\n\n`;
    message += '¿Podrían confirmar disponibilidad y precio?';

    return encodeURIComponent(message);
}

// Update cart UI (called from cart component)
function updateCartUI() {
    // Dispatch custom event for cart updates
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cart-updated', {
            detail: { items: cart, count: getCartCount() }
        }));
    }
}
