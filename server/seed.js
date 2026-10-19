import bcrypt from 'bcryptjs';
import db from './db.js';

const productCount = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
if (productCount > 0) {
  console.log('Database already seeded.');
  process.exit(0);
}

const adminHash = bcrypt.hashSync('admin12345', 10);
db.prepare(
  `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')`
).run('Store Admin', 'admin@royalcommerce.com', adminHash);

const products = [
  {
    name: 'Royal Silk Scarf',
    description: 'Hand-finished silk scarf in deep royal blue with milky white accents.',
    price: 49.99,
    category: 'Accessories',
    image_url: 'https://images.unsplash.com/photo-1601924999037-a68c63a9c9a2?w=600&q=80',
    stock: 24,
    featured: 1,
  },
  {
    name: 'Ceramic Pour-Over Set',
    description: 'Minimalist milky-white ceramic brewer with royal blue glaze trim.',
    price: 64.0,
    category: 'Home',
    image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&q=80',
    stock: 18,
    featured: 1,
  },
  {
    name: 'Merino Crew Sweater',
    description: 'Soft merino wool sweater in classic royal blue — everyday luxury.',
    price: 89.5,
    category: 'Apparel',
    image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
    stock: 30,
    featured: 1,
  },
  {
    name: 'Leather Weekender',
    description: 'Full-grain leather bag with navy lining and cream stitching.',
    price: 199.0,
    category: 'Bags',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    stock: 12,
    featured: 0,
  },
  {
    name: 'Wireless Earbuds Pro',
    description: 'Noise-cancelling earbuds with 32-hour case battery and premium sound.',
    price: 129.99,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    stock: 45,
    featured: 1,
  },
  {
    name: 'Linen Sheet Set',
    description: 'Breathable milky-white European linen — king size, 4-piece set.',
    price: 149.0,
    category: 'Home',
    image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
    stock: 20,
    featured: 0,
  },
  {
    name: 'Running Sneakers',
    description: 'Lightweight trainers with royal blue upper and cloud-white sole.',
    price: 110.0,
    category: 'Apparel',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    stock: 28,
    featured: 0,
  },
  {
    name: 'Stainless Water Bottle',
    description: 'Insulated 32oz bottle keeps drinks cold 24h — matte royal finish.',
    price: 34.99,
    category: 'Accessories',
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
    stock: 60,
    featured: 0,
  },
];

const insert = db.prepare(
  `INSERT INTO products (name, description, price, category, image_url, stock, featured)
   VALUES (@name, @description, @price, @category, @image_url, @stock, @featured)`
);

for (const p of products) {
  insert.run({ ...p, featured: p.featured ? 1 : 0 });
}

console.log('Seeded admin (admin@royalcommerce.com / admin12345) and', products.length, 'products.');
