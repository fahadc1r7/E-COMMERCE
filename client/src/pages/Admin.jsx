import { useEffect, useState } from 'react';
import { productsApi, ordersApi } from '../api/client.js';
import './Admin.css';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  category: 'Accessories',
  image_url: '',
  stock: '10',
  featured: false,
};

export default function Admin() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function loadProducts() {
    productsApi.list().then(({ products: p }) => setProducts(p));
  }

  function loadOrders() {
    ordersApi.all().then(({ orders: o }) => setOrders(o));
  }

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    const body = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      featured: Boolean(form.featured),
    };
    try {
      if (editingId) {
        await productsApi.update(editingId, body);
        setMessage('Product updated.');
      } else {
        await productsApi.create(body);
        setMessage('Product created.');
      }
      setForm(emptyProduct);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      category: p.category,
      image_url: p.image_url,
      stock: String(p.stock),
      featured: Boolean(p.featured),
    });
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return;
    await productsApi.remove(id);
    loadProducts();
  }

  return (
    <div className="container admin-page">
      <h1 className="page-title">Admin dashboard</h1>
      <p className="page-subtitle">Manage products and view all store orders.</p>

      <div className="admin-tabs">
        <button
          type="button"
          className={tab === 'products' ? 'active' : ''}
          onClick={() => setTab('products')}
        >
          Products
        </button>
        <button
          type="button"
          className={tab === 'orders' ? 'active' : ''}
          onClick={() => setTab('orders')}
        >
          Orders
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {tab === 'products' && (
        <div className="admin-grid">
          <form onSubmit={handleSave} className="admin-form">
            <h2>{editingId ? 'Edit product' : 'Add product'}</h2>
            <div className="field">
              <label>Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="admin-row">
              <div className="field">
                <label>Price</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Stock</label>
                <input
                  type="number"
                  required
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
            </div>
            <div className="field">
              <label>Category</label>
              <input
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Image URL</label>
              <input
                required
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              />
            </div>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured on homepage
            </label>
            <div className="admin-form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyProduct);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.name}</strong>
                      <span className="admin-cat">{p.category}</span>
                    </td>
                    <td>${p.price.toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td className="admin-actions">
                      <button type="button" onClick={() => startEdit(p)}>
                        Edit
                      </button>
                      <button type="button" className="danger" onClick={() => handleDelete(p.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="admin-orders">
          {orders.length === 0 ? (
            <p className="muted">No orders yet.</p>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="admin-order-row">
                <div>
                  <strong>#{o.id}</strong> — {o.shipping_name}
                  <span className="admin-order-meta">{new Date(o.created_at).toLocaleString()}</span>
                </div>
                <span>${o.total.toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
