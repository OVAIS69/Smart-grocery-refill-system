# Quick Start Guide

Get the Smart Grocery Refill System frontend up and running in 5 minutes.

## Prerequisites

- Node.js 20+ installed
- npm or yarn

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Start Mock Backend

In one terminal:

```bash
npm run mock
```

The mock server will start on `http://localhost:5000`

## Step 3: Start Frontend

In another terminal:

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Step 4: Login

Open your browser to `http://localhost:3000` and login with:

- **Email**: `manager@demo.com`
- **Password**: `password`

Or try:
- `admin@demo.com` / `password` (Admin)
- `supplier@demo.com` / `password` (Supplier)

## What's Next?

- Explore the **Products** page to see low-stock detection
- Create orders from the **Products** page
- Update order statuses as a **Supplier**
- View **Reports** as an **Admin** or **Manager**
- Check **Notifications** for alerts

## Troubleshooting

### Port Already in Use

If port 3000 or 5000 is already in use:

```bash
# Change Vite port
npm run dev -- --port 3001

# Change mock server port
PORT=5001 npm run mock
```

### Mock Server Not Starting

Make sure you're in the project root and have installed dependencies:

```bash
cd mock-server
npm install
cd ..
npm run mock
```

### Build Errors

Clear cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

1. **Auto-refill Demo**: Enable "Auto-refill" toggle in Products page to see automatic order creation
2. **Adjust Stock**: Use the mock API endpoint `POST /api/dev/adjust-stock` to simulate stock changes
3. **View Tests**: Run `npm test` to see unit tests, `npm run test:e2e` for E2E tests

## Need Help?

Check the [README.md](./README.md) for detailed documentation or [ARCHITECTURE.md](./ARCHITECTURE.md) for system design.

