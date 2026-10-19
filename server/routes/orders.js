import { Router } from 'express';
import db from '../db.js';
import { authRequired, adminRequired } from '../middleware/auth.js';

const router = Router();

router.post('/', authRequired, (req, res) => {
  const { items, shipping } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  const { name, address, city, zip } = shipping || {};
  if (!name?.trim() || !address?.trim() || !city?.trim() || !zip?.trim()) {
    return res.status(400).json({ error: 'Complete shipping details are required' });
  }

  const createOrder = db.transaction(() => {
    let total = 0;
    const lineItems = [];
    for (const item of items) {
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      const qty = Math.max(1, Number(item.quantity) || 1);
      if (product.stock < qty) throw new Error(`Insufficient stock for ${product.name}`);
      total += product.price * qty;
      lineItems.push({ product, qty });
    }

    const orderResult = db
      .prepare(
        `INSERT INTO orders (user_id, total, shipping_name, shipping_address, shipping_city, shipping_zip, status)
         VALUES (?, ?, ?, ?, ?, ?, 'confirmed')`
      )
      .run(req.user.id, total, name.trim(), address.trim(), city.trim(), zip.trim());

    const orderId = orderResult.lastInsertRowid;
    const insertItem = db.prepare(
      'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)'
    );
    const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

    for (const { product, qty } of lineItems) {
      insertItem.run(orderId, product.id, qty, product.price);
      updateStock.run(qty, product.id);
    }

    return orderId;
  });

  try {
    const orderId = createOrder();
    const order = getOrderById(orderId);
    res.status(201).json({ order });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Could not place order' });
  }
});

function getOrderById(id) {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  if (!order) return null;
  const items = db
    .prepare(
      `SELECT oi.*, p.name, p.image_url FROM order_items oi
       JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?`
    )
    .all(id);
  return { ...order, items };
}

router.get('/mine', authRequired, (req, res) => {
  const orders = db
    .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id);
  const withItems = orders.map((o) => getOrderById(o.id));
  res.json({ orders: withItems });
});

router.get('/', authRequired, adminRequired, (_req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  const withItems = orders.map((o) => getOrderById(o.id));
  res.json({ orders: withItems });
});

export default router;
