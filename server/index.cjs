const express = require('express');
const cors = require('cors');
const db = require('./db.cjs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ── USERS ENDPOINTS ──────────────────────────────────────────────────────────
app.get('/api/users', (req, res) => {
  res.json(db.getCollection('users'));
});

app.post('/api/users', (req, res) => {
  const { name, role, country, bio } = req.body;
  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required' });
  }

  const users = db.getCollection('users');
  const newUser = {
    id: `u-${Date.now()}`,
    name,
    role,
    country: country || 'Kenya 🇰🇪',
    bio: bio || '',
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
    rating: 5.0,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    skills: role === 'freelancer' ? ['Generalist'] : [],
    onboardingComplete: false,
    ...(role === 'student' ? { xp: 0, badges: [] } : {})
  };

  users.push(newUser);
  db.saveCollection('users', users);
  res.status(201).json(newUser);
});

app.post('/api/users/:id/onboarding', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const users = db.getCollection('users');
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    onboardingComplete: true
  };

  db.saveCollection('users', users);
  res.json(users[userIndex]);
});

// ── GIGS ENDPOINTS ────────────────────────────────────────────────────────────
app.get('/api/gigs', (req, res) => {
  res.json(db.getCollection('gigs'));
});

app.post('/api/gigs', (req, res) => {
  const { title, description, category, startingPrice, deliveryTime, freelancerId } = req.body;
  if (!title || !category || !startingPrice || !freelancerId) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const gigs = db.getCollection('gigs');
  const newGig = {
    id: `g-${Date.now()}`,
    title,
    description: description || '',
    category,
    freelancerId,
    startingPrice: Number(startingPrice),
    deliveryTime: Number(deliveryTime || 3),
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    badges: ['New Talent'],
    rating: 5.0,
    reviewsCount: 0
  };

  gigs.unshift(newGig);
  db.saveCollection('gigs', gigs);
  res.status(201).json(newGig);
});

// ── SHOUTOUTS ENDPOINTS ───────────────────────────────────────────────────────
app.get('/api/shoutouts', (req, res) => {
  res.json(db.getCollection('shoutouts'));
});

app.post('/api/shoutouts', (req, res) => {
  const { title, description, budget, deliveryTime, clientId, category } = req.body;
  if (!title || !budget || !clientId || !category) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const shoutouts = db.getCollection('shoutouts');
  const newShoutout = {
    id: `jr-${Date.now()}`,
    title,
    description: description || '',
    budget: Number(budget),
    deliveryTime: Number(deliveryTime || 3),
    clientId,
    category,
    createdAt: new Date().toISOString()
  };

  shoutouts.unshift(newShoutout);
  db.saveCollection('shoutouts', shoutouts);
  res.status(201).json(newShoutout);
});

// ── ORDERS & ESCROW ENDPOINTS ────────────────────────────────────────────────
app.get('/api/orders', (req, res) => {
  res.json(db.getCollection('orders'));
});

app.post('/api/orders', (req, res) => {
  const { gigId, clientId, freelancerId, amount } = req.body;
  if (!gigId || !clientId || !freelancerId || !amount) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const orders = db.getCollection('orders');
  const newOrder = {
    id: `o-${Math.floor(100 + Math.random() * 900)}`,
    gigId,
    clientId,
    freelancerId,
    amount: Number(amount),
    status: 'escrow_held',
    updatedAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  db.saveCollection('orders', orders);
  res.status(201).json(newOrder);
});

app.post('/api/orders/:id/deliver', (req, res) => {
  const { id } = req.params;
  const { note, fileUrl } = req.body;

  const orders = db.getCollection('orders');
  const orderIndex = orders.findIndex(o => o.id === id);

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  orders[orderIndex] = {
    ...orders[orderIndex],
    status: 'pending_approval',
    deliveryNote: note || 'Work Delivered',
    deliveryFileUrl: fileUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    updatedAt: new Date().toISOString()
  };

  db.saveCollection('orders', orders);
  res.json(orders[orderIndex]);
});

app.post('/api/orders/:id/approve', (req, res) => {
  const { id } = req.params;

  const orders = db.getCollection('orders');
  const orderIndex = orders.findIndex(o => o.id === id);

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  orders[orderIndex] = {
    ...orders[orderIndex],
    status: 'released',
    updatedAt: new Date().toISOString()
  };

  db.saveCollection('orders', orders);
  res.json(orders[orderIndex]);
});

app.listen(PORT, () => {
  console.log(`Kazify Backend running at http://localhost:${PORT}`);
});
