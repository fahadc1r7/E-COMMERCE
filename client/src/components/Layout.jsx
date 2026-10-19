import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import './Layout.css';

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark">RC</span>
            <span className="logo-text">Royal Commerce</span>
          </Link>
          <nav className="nav-main">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/shop">Shop</NavLink>
            {user && (
              <NavLink to="/orders">Orders</NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin">Admin</NavLink>
            )}
          </nav>
          <div className="header-actions">
            <Link to="/cart" className="cart-link">
              Cart
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
            {user ? (
              <div className="user-menu">
                <span className="user-name">Hi, {user.name.split(' ')[0]}</span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Sign in
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <p className="footer-brand">Royal Commerce</p>
            <p className="footer-tagline">Curated goods in royal blue & milky white.</p>
          </div>
          <div>
            <p className="footer-heading">Shop</p>
            <Link to="/shop">All products</Link>
          </div>
          <div>
            <p className="footer-heading">Account</p>
            <Link to="/orders">Order history</Link>
          </div>
        </div>
        <p className="footer-copy container">© {new Date().getFullYear()} Royal Commerce</p>
      </footer>
    </>
  );
}
