import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ordersApi } from '../api/client.js';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const justPlaced = location.state?.placed;

  useEffect(() => {
    ordersApi
      .mine()
      .then(({ orders: o }) => setOrders(o))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container orders-page">
      <h1 className="page-title">Your orders</h1>
      <p className="page-subtitle">Track past purchases and order details.</p>

      {justPlaced && (
        <div className="alert alert-success">Order placed successfully. Thank you!</div>
      )}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="muted">You have not placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order.id} className="order-card">
              <header className="order-head">
                <div>
                  <strong>Order #{order.id}</strong>
                  <span className="order-date">{new Date(order.created_at).toLocaleString()}</span>
                </div>
                <span className="order-status">{order.status}</span>
              </header>
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    <img src={item.image_url} alt="" />
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>${(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <footer className="order-foot">
                <span>
                  Ship to: {order.shipping_name}, {order.shipping_city}
                </span>
                <strong>${order.total.toFixed(2)}</strong>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
