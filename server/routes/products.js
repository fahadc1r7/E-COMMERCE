import { Router } from 'express';
import db from '../db.js';
import { authRequired, adminRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const { category, q, featured } = req.query;
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (q) {
    sql += ' AND (name LIKE ? OR description LIKE ?)';
    const term = `%${q}%`;
    params.push(term, term);
  }
  if (featured === '1') {
    sql += ' AND featured = 1';
  }
  sql += ' ORDER BY featured DESC, name ASC';
  const products = db.prepare(sql).all(...params);
  res.json({ products });
});

router.get('/categories', (_req, res) => {
  const rows = db.prepare('SELECT DISTINCT category FROM products ORDER BY category').all();
  res.json({ categories: rows.map((r) => r.category) });
});

router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
});

router.post('/', authRequired, adminRequired, (req, res) => {
  const { name, description, price, category, image_url, stock, featured } = req.body;
  if (!name || !description || price == null || !category || !image_url) {
    return res.status(400).json({ error: 'Missing required product fields' });
  }
  const result = db
    .prepare(
      `INSERT INTO products (name, description, price, category, image_url, stock, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      name,
      description,
      Number(price),
      category,
      image_url,
      Number(stock) || 0,
      featured ? 1 : 0
    );
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ product });
});

router.put('/:id', authRequired, adminRequired, (req, res) => {
  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });
  const { name, description, price, category, image_url, stock, featured } = req.body;
  db.prepare(
    `UPDATE products SET name = ?, description = ?, price = ?, category = ?,
     image_url = ?, stock = ?, featured = ? WHERE id = ?`
  ).run(
    name,
    description,
    Number(price),
    category,
    image_url,
    Number(stock),
    featured ? 1 : 0,
    req.params.id
  );
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json({ product });
});

router.delete('/:id', authRequired, adminRequired, (req, res) => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
  res.status(204).send();
});

export default router;
