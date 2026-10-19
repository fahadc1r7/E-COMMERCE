import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './Cart.css';

export default function Cart() {
  const { items, subtotal, setQuantity, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="container cart-page">
        <h1 className="page-title">Your cart</h1>
        <p className="page-subtitle">Your cart is empty.</p>
        <Link to="/shop" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <div className="cart-header">
        <div>
          <h1 className="page-title">Your cart</h1>
          <p className="page-subtitle">{items.length} unique item(s)</p>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={clear}>
          Clear cart
        </button>
      </div>

      <div className="cart-layout">
        <ul className="cart-list">
          {items.map((item) => (
            <li key={item.productId} className="cart-item">
              <img src={item.image_url} alt="" />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>${item.price.toFixed(2)} each</p>
              </div>
              <div className="cart-item-qty">
                <button type="button" onClick={() => setQuantity(item.productId, item.quantity - 1)}>
                  −
                </button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => setQuantity(item.productId, item.quantity + 1)}>
                  +
                </button>
              </div>
              <p className="cart-item-line">${(item.price * item.quantity).toFixed(2)}</p>
              <button
                type="button"
                className="cart-remove"
                onClick={() => removeItem(item.productId)}
                aria-label="Remove"
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        <aside className="cart-summary">
          <h2>Order summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{subtotal >= 100 ? 'Free' : '$9.99'}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${(subtotal + (subtotal >= 100 ? 0 : 9.99)).toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary btn-block">
            Proceed to checkout
          </Link>
          <Link to="/shop" className="continue-link">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
