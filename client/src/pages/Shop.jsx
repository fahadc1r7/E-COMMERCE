import { useEffect, useState } from 'react';
import { productsApi } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import './Shop.css';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.categories().then(({ categories: c }) => setCategories(c));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (q.trim()) params.q = q.trim();
    productsApi
      .list(params)
      .then(({ products: p }) => setProducts(p))
      .finally(() => setLoading(false));
  }, [category, q]);

  return (
    <div className="container shop-page">
      <h1 className="page-title">Shop</h1>
      <p className="page-subtitle">Browse our full catalog of premium goods.</p>

      <div className="shop-toolbar">
        <input
          type="search"
          placeholder="Search products…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="shop-search"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="shop-filter">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : products.length === 0 ? (
        <p className="muted">No products match your filters.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
