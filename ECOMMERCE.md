# Royal Commerce — Full Stack E-Commerce Store

A full-stack online store with a **royal blue** and **milky white** design system.

## Stack

| Layer    | Tech                                      |
|----------|-------------------------------------------|
| Frontend | React 19, React Router, Vite              |
| Backend  | Node.js, Express, SQLite (better-sqlite3) |
| Auth     | JWT + bcrypt                              |

## Features

- Product catalog with search and category filters
- Product detail pages
- Persistent shopping cart (localStorage)
- User registration and login
- Checkout with shipping form and stock validation
- Order history for customers
- Admin dashboard: CRUD products + view all orders

## Quick start

```bash
npm run install:all
npm run seed --prefix server
npm run dev
```

- **Store UI:** http://localhost:5173  
- **API:** http://localhost:3001/api/health  

## Demo accounts

| Role     | Email                     | Password    |
|----------|---------------------------|-------------|
| Admin    | admin@royalcommerce.com   | admin12345  |
| Customer | (register on `/register`) | —           |

## Production build

```bash
npm run build
npm start
```

The API serves the built client from `client/dist` on port 3001.

## Project layout

```
client/          React storefront
server/          Express API + SQLite
  routes/        auth, products, orders
  data/store.db  created on first run (gitignored)
```

The original Wanderlust Tours static auth pages remain in the repo root for reference.
