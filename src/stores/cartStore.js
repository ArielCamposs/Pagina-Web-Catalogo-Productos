// Carrito simple sin dependencias externas
let cart = [];
let listeners = [];

export const cartStore = {
  // Obtener todos los items
  getItems() {
    return [...cart];
  },

  // Obtener cantidad total
  getCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  // Agregar producto
  addItem(product) {
    const existingIndex = cart.findIndex(item => item.name === product.name);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    this.notify();
  },

  // Actualizar cantidad
  updateQuantity(productName, quantity) {
    if (quantity <= 0) {
      this.removeItem(productName);
      return;
    }
    
    const index = cart.findIndex(item => item.name === productName);
    if (index >= 0) {
      cart[index].quantity = quantity;
      this.notify();
    }
  },

  // Remover item
  removeItem(productName) {
    cart = cart.filter(item => item.name !== productName);
    this.notify();
  },

  // Limpiar carrito
  clear() {
    cart = [];
    this.notify();
  },

  // Generar mensaje de WhatsApp
  generateWhatsAppMessage() {
    if (cart.length === 0) return '';
    
    let message = '¡Hola! Me gustaría cotizar los siguientes productos:\n\n';
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Categoría: ${item.category}\n`;
      message += `   Cantidad: ${item.quantity}\n\n`;
    });
    
    message += 'Espero su respuesta. ¡Gracias!';
    
    return encodeURIComponent(message);
  },

  // Suscribirse a cambios
  subscribe(callback) {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter(l => l !== callback);
    };
  },

  // Notificar cambios
  notify() {
    listeners.forEach(callback => callback(this.getItems()));
  }
};
