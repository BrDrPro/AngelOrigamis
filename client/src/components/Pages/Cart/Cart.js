import React, { useContext, useState } from 'react';
import { CartContext } from '../../CartContext/CartContext';
import { createOrder } from '../../../api/orders';
import './Cart.css';
import './CartResponsive.css';

function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const canCheckout = cart.length > 0 && customerName.trim() && customerPhone.trim() && customerEmail.trim();

  async function handleCheckout() {
    if (!canCheckout) return;
    setCheckoutLoading(true);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total
      });
    } catch (err) {
      console.error('Erro ao registrar pedido:', err);
      // Segue para o WhatsApp mesmo se o registro falhar, para não travar a compra do cliente.
    }

    const phone = '5531971842477';
    const msg = encodeURIComponent(
      `Olá! Gostaria de finalizar meu pedido:\n\n` +
      `*Nome:* ${customerName.trim()}\n` +
      `*Telefone:* ${customerPhone.trim()}\n` +
      `*E-mail:* ${customerEmail.trim()}\n\n` +
      cart.map(item =>
        `*${item.name}*\nQtd: ${item.quantity}\nValor: R$ ${Number(item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`
      ).join('\n') +
      `\n*Total:* R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    clearCart();
    setCheckoutLoading(false);
  }

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
                  <span className="cart-item-measure">{item.measure}</span>
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
          <div className="customer-info-form">
            <h2>Seus dados</h2>
            <div className="customer-info-row">
              <div className="form-group">
                <label htmlFor="customerName">Nome</label>
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="customerPhone">Telefone</label>
                <input
                  type="tel"
                  id="customerPhone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="customerEmail">E-mail</label>
              <input
                type="email"
                id="customerEmail"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="cart-actions">
            <button className="clear-cart-btn" onClick={clearCart}>
              Esvaziar Carrinho
            </button>
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={!canCheckout || checkoutLoading}
            >
              {checkoutLoading ? 'Enviando...' : 'Finalizar Compra'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;