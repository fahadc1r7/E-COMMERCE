import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersApi } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import './Checkout.css';

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({ name: '', address: '', city: '', zip: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const shippingCost = subtotal >= 100 ? 0 : 9.99;
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="container checkout-page">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">Your cart is empty.</p>
        <Link to="/shop" className="btn btn-primary">
          Go to shop
        </Link>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await ordersApi.create({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shipping,
      });
      clear();
      navigate('/orders', { state: { placed: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container checkout-page">
      <h1 className="page-title">Checkout</h1>
      <p className="page-subtitle">Enter shipping details to complete your order.</p>

      <div className="checkout-layout">
        <form onSubmit={handleSubmit} className="checkout-form">
          {error && <div className="alert alert-error">{error}</div>}
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              required
              value={shipping.name}
              onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="address">Street address</label>
            <input
              id="address"
              required
              value={shipping.address}
              onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
            />
          </div>
          <div className="checkout-row">
            <div className="field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                required
                value={shipping.city}
                onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="zip">ZIP / Postal</label>
              <input
                id="zip"
                required
                value={shipping.zip}
                onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Placing order…' : `Pay $${total.toFixed(2)}`}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Your items</h2>
          <ul>
            {items.map((i) => (
              <li key={i.productId}>
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span>${(i.price * i.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="checkout-totals">
            <div>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div>
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="checkout-grand">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
