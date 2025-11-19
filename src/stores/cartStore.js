import { atom } from 'nanostores';

// Función para cargar el carrito desde localStorage
function loadCartFromStorage() {
  if (typeof window === 'undefined') return [];
  
  try {
    const savedCart = localStorage.getItem('musaplast-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
}

// Función para guardar el carrito en localStorage
function saveCartToStorage(items) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('musaplast-cart', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

// Inicializar el carrito con los datos guardados
const $cart = atom(loadCartFromStorage());

export const cartStore = {
  subscribe(callback) {
    return $cart.subscribe(callback);
  },

  getItems() {
    return $cart.get();
  },

  getCount() {
    return $cart.get().reduce((total, item) => total + item.quantity, 0);
  },

  addItem(product) {
    const currentItems = $cart.get();
    const existingItem = currentItems.find(item => item.name === product.name);

    let newItems;
    if (existingItem) {
      newItems = currentItems.map(item =>
        item.name === product.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newItems = [...currentItems, { ...product, quantity: 1 }];
    }

    $cart.set(newItems);
    saveCartToStorage(newItems);
  },

  removeItem(productName) {
    const newItems = $cart.get().filter(item => item.name !== productName);
    $cart.set(newItems);
    saveCartToStorage(newItems);
  },

  updateQuantity(productName, quantity) {
    if (quantity <= 0) {
      this.removeItem(productName);
      return;
    }

    const newItems = $cart.get().map(item =>
      item.name === productName ? { ...item, quantity } : item
    );
    $cart.set(newItems);
    saveCartToStorage(newItems);
  },

  clear() {
    $cart.set([]);
    saveCartToStorage([]);
  },

  generateWhatsAppMessage() {
    const items = this.getItems();
    if (items.length === 0) return null;

    let message = '¡Hola! Me gustaría cotizar los siguientes productos:\n\n';
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Categoría: ${item.category}\n`;
      message += `   Cantidad: ${item.quantity}\n\n`;
    });
    
    message += 'Espero su respuesta. ¡Gracias!';
    
    return encodeURIComponent(message);
  }
};
