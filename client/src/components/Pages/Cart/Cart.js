import React, { useContext } from 'react';
import { CartContext } from '../../CartContext/CartContext';
import './Cart.css';
import './CartResponsive.css';

function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  return (
    <div className="cart-container">
      <h1>Seu Carrinho</h1>
      {cart.length === 0 ? (
        <p>O carrinho está vazio.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map(item => (
              <li key={item.id} className="cart-item">
                <img
                  src={item.imageUrls && item.imageUrls[0] ? item.imageUrls[0] : '/img/default.png'}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-qty">Qtd: {item.quantity}</span>
                  <span className="cart-item-price">
                    R$ {Number(item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                  Remover
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-actions">
            <button className="clear-cart-btn" onClick={clearCart}>
              Esvaziar Carrinho
            </button>
            <button
              className="checkout-btn"
              onClick={() => {
                const phone = '5531971842477';
                const msg = encodeURIComponent(
                  `Olá! Gostaria de finalizar meu pedido:\n\n` +
                  cart.map(item =>
                    `*${item.name}*\nQtd: ${item.quantity}\nValor: R$ ${Number(item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`
                  ).join('\n') +
                  `\n*Total:* R$ ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                );
                window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
                clearCart();
              }}
              disabled={cart.length === 0}
            >
              Finalizar Compra
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;