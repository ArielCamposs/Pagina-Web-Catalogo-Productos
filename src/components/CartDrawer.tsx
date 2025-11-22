---
import { useStore } from '@nanostores/react';
import { cartItems, removeFromCart, updateQuantity, clearCart, generateWhatsAppMessage, getCartCount } from '../stores/cartStore';
import { useState } from 'react';

const CartDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const items = useStore(cartItems);
    const itemsArray = Object.values(items);
    const totalItems = getCartCount();

    const handleSendWhatsApp = () => {
        const message = generateWhatsAppMessage();
        window.open(`https://wa.me/56912345678?text=${message}`, '_blank');
    };

    return (
        <>
            {/* Botón flotante del carrito */}
            <button
                onClick={() => setIsOpen(true)}
                className="cart-float-button"
                aria-label="Abrir carrito"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                    <span className="cart-badge">{totalItems}</span>
                )}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="cart-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer del carrito */}
            <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="cart-header">
                    <h2 className="text-2xl font-black">
                        Carrito ({totalItems})
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="cart-close-btn"
                        aria-label="Cerrar carrito"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido */}
                <div className="cart-content">
                    {itemsArray.length === 0 ? (
                        <div className="cart-empty">
                            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-gray-500 text-lg font-semibold">Tu carrito está vacío</p>
                            <p className="text-gray-400 text-sm mt-2">Agrega productos para comenzar</p>
                        </div>
                    ) : (
                        <div className="cart-items">
                            {itemsArray.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="cart-item-image"
                                    />
                                    <div className="cart-item-details">
                                        <h3 className="cart-item-name">{item.name}</h3>
                                        <p className="cart-item-category">{item.category}</p>

                                        <div className="cart-item-actions">
                                            <div className="quantity-selector-small">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="qty-btn-small"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                                                    </svg>
                                                </button>
                                                <span className="qty-display">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="qty-btn-small"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="remove-btn"
                                                aria-label="Eliminar producto"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer con acciones */}
                {itemsArray.length > 0 && (
                    <div className="cart-footer">
                        <button
                            onClick={handleSendWhatsApp}
                            className="whatsapp-btn"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Enviar Pedido por WhatsApp
                        </button>

                        <button
                            onClick={() => {
                                if (confirm('¿Estás seguro de vaciar el carrito?')) {
                                    clearCart();
                                }
                            }}
                            className="clear-btn"
                        >
                            Vaciar Carrito
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
