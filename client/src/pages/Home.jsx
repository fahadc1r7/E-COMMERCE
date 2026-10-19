import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi
      .list({ featured: '1' })
      .then(({ products }) => setFeatured(products))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">New season collection</p>
            <h1>Elegance in royal blue & milky white</h1>
            <p className="hero-lead">
              Discover curated apparel, home goods, and accessories — crafted for a refined everyday
              life.
            </p>
            <div className="hero-cta">
              <Link to="/shop" className="btn btn-primary">
                Shop collection
              </Link>
              <Link to="/register" className="btn btn-outline">
                Create account
              </Link>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-panel hero-panel-a" />
            <div className="hero-panel hero-panel-b" />
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2 className="page-title">Featured picks</h2>
          <Link to="/shop">View all →</Link>
        </div>
        {loading ? (
          <p className="muted">Loading products…</p>
        ) : (
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="promo-strip">
        <div className="container promo-inner">
          <div>
            <h3>Free shipping over $100</h3>
            <p>Milky-white gift wrapping on every order this month.</p>
          </div>
          <Link to="/shop" className="btn btn-primary">
            Start shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
