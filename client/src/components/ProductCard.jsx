import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-image-wrap">
        <img src={product.image_url} alt={product.name} loading="lazy" />
        {product.featured ? <span className="product-badge">Featured</span> : null}
      </Link>
      <div className="product-card-body">
        <p className="product-category">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <div className="product-card-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={product.stock < 1}
            onClick={() => addItem(product)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
