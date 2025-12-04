import express from 'express';
import cors from 'cors';
import { seedData } from './seed.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data stores
let users = [...seedData.users];
let products = [...seedData.products];
let orders = [...seedData.orders];
let notifications = [...seedData.notifications];

// Auth middleware (simple token check)
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const { password: _, ...userWithoutPassword } = user;
  const token = `mock-token-${user.id}-${Date.now()}`;
  res.json({ token, user: userWithoutPassword });
});

// Products routes
app.get('/api/products', (req, res) => {
  let filtered = [...products];
  const { q, category, lowStock, page = 1, limit = 10 } = req.query;

  if (q) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );
  }
  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (lowStock === 'true') {
    filtered = filtered.filter((p) => p.stock <= p.threshold);
  }

  const start = (parseInt(page) - 1) * parseInt(limit);
  const end = start + parseInt(limit);
  const paginated = filtered.slice(start, end);

  res.json({
    data: paginated,
    total: filtered.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(filtered.length / parseInt(limit)),
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', authenticate, (req, res) => {
  const newProduct = {
    id: products.length + 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', authenticate, (req, res) => {
  const index = products.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  products[index] = {
    ...products[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  res.json(products[index]);
});

app.delete('/api/products/:id', authenticate, (req, res) => {
  const index = products.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  products.splice(index, 1);
  res.status(204).send();
});

// Orders routes
app.get('/api/orders', authenticate, (req, res) => {
  let filtered = [...orders];
  const { status, supplierId, page = 1, limit = 10 } = req.query;

  if (status) {
    filtered = filtered.filter((o) => o.status === status);
  }
  if (supplierId) {
    filtered = filtered.filter((o) => o.supplierId === parseInt(supplierId));
  }

  // Populate product and user data
  filtered = filtered.map((order) => ({
    ...order,
    product: products.find((p) => p.id === order.productId),
    requestedByUser: users.find((u) => u.id === order.requestedBy),
    supplier: users.find((u) => u.id === order.supplierId),
  }));

  const start = (parseInt(page) - 1) * parseInt(limit);
  const end = start + parseInt(limit);
  const paginated = filtered.slice(start, end);

  res.json({
    data: paginated,
    total: filtered.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(filtered.length / parseInt(limit)),
  });
});

app.get('/api/orders/:id', authenticate, (req, res) => {
  const order = orders.find((o) => o.id === parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json({
    ...order,
    product: products.find((p) => p.id === order.productId),
    requestedByUser: users.find((u) => u.id === order.requestedBy),
    supplier: users.find((u) => u.id === order.supplierId),
  });
});

app.post('/api/orders', authenticate, (req, res) => {
  const product = products.find((p) => p.id === req.body.productId);
  const totalAmount = product ? product.price * (req.body.quantity || 1) : 0;
  
  const newOrder = {
    id: orders.length + 1,
    ...req.body,
    status: 'pending',
    paymentStatus: 'unpaid',
    totalAmount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.push(newOrder);

  // Create notification
  notifications.push({
    id: notifications.length + 1,
    type: 'LOW_STOCK',
    title: 'New Order Created',
    message: `Order #${newOrder.id} created for ${product?.name || 'product'}`,
    read: false,
    orderId: newOrder.id,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(newOrder);
});

app.put('/api/orders/:id', authenticate, (req, res) => {
  const index = orders.findIndex((o) => o.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  const updateData = { ...req.body };
  
  // If payment status is being updated to 'paid', set paidAt timestamp
  if (updateData.paymentStatus === 'paid' && orders[index].paymentStatus !== 'paid') {
    updateData.paidAt = new Date().toISOString();
  }
  
  orders[index] = {
    ...orders[index],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };
  res.json(orders[index]);
});

// Notifications routes
app.get('/api/notifications', authenticate, (req, res) => {
  res.json(notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post('/api/notifications/:id/mark-read', authenticate, (req, res) => {
  const index = notifications.findIndex((n) => n.id === parseInt(req.params.id));
  if (index !== -1) {
    notifications[index].read = true;
  }
  res.json({ success: true });
});

app.post('/api/notifications/mark-read', authenticate, (req, res) => {
  notifications.forEach((n) => (n.read = true));
  res.json({ success: true });
});

// Reports routes
app.get('/api/reports/monthly-consumption', authenticate, (req, res) => {
  const { start, end } = req.query;
  // Mock data for reports
  const mockData = [
    { month: '2024-01', productId: 1, productName: 'Rice 5kg', quantity: 100, totalValue: 40000 },
    { month: '2024-02', productId: 1, productName: 'Rice 5kg', quantity: 120, totalValue: 48000 },
    { month: '2024-03', productId: 2, productName: 'Toothpaste', quantity: 50, totalValue: 4000 },
  ];
  res.json(mockData);
});

// Users routes (admin only)
app.get('/api/users', authenticate, (req, res) => {
  const usersWithoutPassword = users.map(({ password, ...user }) => user);
  res.json(usersWithoutPassword);
});

app.post('/api/users', authenticate, (req, res) => {
  const newUser = {
    id: users.length + 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/api/users/:id', authenticate, (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  users[index] = {
    ...users[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  res.json(users[index]);
});

app.delete('/api/users/:id', authenticate, (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  users.splice(index, 1);
  res.status(204).send();
});

// Dev endpoint to adjust stock (for demo/testing)
app.post('/api/dev/adjust-stock', authenticate, (req, res) => {
  const { productId, newStock } = req.body;
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  product.stock = newStock;
  res.json(product);
});

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('Demo credentials:');
  console.log('  admin@demo.com / password');
  console.log('  manager@demo.com / password');
  console.log('  supplier@demo.com / password');
});

