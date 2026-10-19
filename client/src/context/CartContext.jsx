import { createContext, useContext, useMemo, useReducer } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'rc_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function cartReducer(state, action) {
  let next;
  switch (action.type) {
    case 'ADD': {
      const existing = state.find((i) => i.productId === action.product.id);
      if (existing) {
        next = state.map((i) =>
          i.productId === action.product.id
            ? { ...i, quantity: Math.min(i.quantity + (action.qty || 1), action.product.stock) }
            : i
        );
      } else {
        next = [
          ...state,
          {
            productId: action.product.id,
            name: action.product.name,
            price: action.product.price,
            image_url: action.product.image_url,
            stock: action.product.stock,
            quantity: action.qty || 1,
          },
        ];
      }
      break;
    }
    case 'REMOVE':
      next = state.filter((i) => i.productId !== action.productId);
      break;
    case 'SET_QTY': {
      next = state
        .map((i) =>
          i.productId === action.productId
            ? { ...i, quantity: Math.max(1, Math.min(action.quantity, i.stock)) }
            : i
        )
        .filter((i) => i.quantity > 0);
      break;
    }
    case 'CLEAR':
      next = [];
      break;
    default:
      return state;
  }
  saveCart(next);
  return next;
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);

  const value = useMemo(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    return {
      items,
      count,
      subtotal,
      addItem: (product, qty) => dispatch({ type: 'ADD', product, qty }),
      removeItem: (productId) => dispatch({ type: 'REMOVE', productId }),
      setQuantity: (productId, quantity) => dispatch({ type: 'SET_QTY', productId, quantity }),
      clear: () => dispatch({ type: 'CLEAR' }),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
