import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { productsApi } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    productsApi
      .get(id)
      .then(({ product: p }) => setProduct(p))
      .catch(() => setError('Product not found'));
  }, [id]);

  if (error) {
    return (
      <div className="container product-detail">
        <p className="alert alert-error">{error}</p>
        <Link to="/shop">← Back to shop</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container product-detail">
        <p className="muted">Loading…</p>
      </div>
    );
  }

  function handleAdd() {
    addItem(product, qty);
  }

  return (
    <div className="container product-detail">
      <Link to="/shop" className="back-link">
        ← Back to shop
      </Link>
      <div className="detail-grid">
        <div className="detail-image">
          <img src={product.image_url} alt={product.name} />
        </div>
        <div className="detail-info">
          <p className="detail-category">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <p className="detail-desc">{product.description}</p>
          <p className="detail-stock">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          <div className="detail-actions">
            <label className="qty-label">
              Qty
              <input
                type="number"
                min={1}
                max={product.stock}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                disabled={product.stock < 1}
              />
            </label>
            <button
              type="button"
              className="btn btn-primary"
              disabled={product.stock < 1}
              onClick={handleAdd}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
