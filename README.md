# Smart Grocery Refill System - Frontend

A production-ready React frontend application for managing grocery inventory, orders, and automated refill requests.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Development](#development)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Demo Credentials](#demo-credentials)
- [Production Considerations](#production-considerations)

## ✨ Features

- **Role-Based Access Control**: Admin, Manager, and Supplier roles with protected routes
- **Product Management**: CRUD operations for products with low-stock alerts
- **Order Management**: Create, view, and update order statuses
- **Auto-Refill System**: Automatic detection and ordering when stock falls below threshold
- **Notifications**: Real-time notifications with read/unread status
- **Reports & Analytics**: Monthly consumption reports with charts and CSV export
- **Responsive Design**: Mobile-first, accessible UI built with Tailwind CSS
- **Branded UI System**: Evergreen primary + citrus secondary palette, gradient hero sections, and glassmorphism cards tuned for Smart Grocery’s visual strategy
- **Type Safety**: Full TypeScript implementation
- **Testing**: Unit tests (Jest) and E2E tests (Playwright)

## 🛠 Tech Stack

- **React 18** with **Vite**
- **TypeScript**
- **React Router v6** for routing
- **React Query** for data fetching and caching
- **Zustand** for state management
- **React Hook Form + Zod** for forms and validation
- **Tailwind CSS** for styling
- **Headless UI** for accessible components
- **Recharts** for data visualization
- **Axios** for API calls
- **Jest + React Testing Library** for unit tests
- **Playwright** for E2E tests

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- (Optional) Docker and Docker Compose

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-grocery-refill-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the mock backend server (in a separate terminal):
```bash
npm run mock
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💻 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run test:e2e` - Run E2E tests
- `npm run mock` - Start mock API server
- `npm run storybook` - Start Storybook (component library)

### Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── services/        # API service layer
├── store/           # Zustand stores
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── __tests__/       # Unit tests

mock-server/         # Mock API server
e2e/                # E2E tests
scripts/            # Utility scripts
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## 🧪 Testing

### Unit Tests

```bash
npm test
```

Tests are located in `src/__tests__/` and use Jest with React Testing Library.

### E2E Tests

```bash
npm run test:e2e
```

E2E tests are written with Playwright and located in `e2e/`.

### Test Coverage

```bash
npm run test:coverage
```

## 🏗 Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory, ready to be served by any static file server.

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
docker-compose up --build
```

This will start both the frontend (nginx) and mock backend server.

### Manual Docker Build

```bash
# Build frontend
docker build -t smart-grocery-frontend .

# Run container
docker run -p 3000:80 smart-grocery-frontend
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE=http://localhost:5000/api
```

For production, set this to your actual backend API URL.

## 📡 API Documentation

### Authentication

**POST** `/api/auth/login`
```json
{
  "email": "manager@demo.com",
  "password": "password"
}
```

Response:
```json
{
  "token": "mock-token-...",
  "user": {
    "id": 1,
    "name": "Manager User",
    "email": "manager@demo.com",
    "role": "manager"
  }
}
```

### Products

- **GET** `/api/products?page=1&limit=10&q=search&category=Grocery&lowStock=true`
- **GET** `/api/products/:id`
- **POST** `/api/products` (Admin/Manager only)
- **PUT** `/api/products/:id` (Admin/Manager only)
- **DELETE** `/api/products/:id` (Admin only)

### Orders

- **GET** `/api/orders?page=1&limit=10&status=pending`
- **GET** `/api/orders/:id`
- **POST** `/api/orders`
- **PUT** `/api/orders/:id` (Update status - Supplier/Admin)

### Notifications

- **GET** `/api/notifications`
- **POST** `/api/notifications/:id/mark-read`
- **POST** `/api/notifications/mark-read`

### Reports

- **GET** `/api/reports/monthly-consumption?start=2024-01-01&end=2024-12-31` (Admin/Manager only)

### Users (Admin only)

- **GET** `/api/users`
- **POST** `/api/users`
- **PUT** `/api/users/:id`
- **DELETE** `/api/users/:id`

### Dev Endpoints

- **POST** `/api/dev/adjust-stock` - Adjust product stock for testing
```json
{
  "productId": 1,
  "newStock": 5
}
```

All API requests (except login) require authentication:
```
Authorization: Bearer <token>
```

## 👥 Demo Credentials

| Role     | Email              | Password |
|----------|-------------------|----------|
| Admin    | admin@demo.com     | password |
| Manager  | manager@demo.com   | password |
| Supplier | supplier@demo.com  | password |

## 🎯 Key Features Explained

### Auto-Refill System

The frontend includes an optional auto-refill feature that can be toggled in the Products page. When enabled:

1. Polls product data every 30 seconds
2. Detects products with stock ≤ threshold
3. Automatically creates refill orders
4. Shows notifications for low-stock items

This is a demo feature. In production, this logic should be handled by the backend.

### Role-Based Access

- **Admin**: Full access to all features including user management
- **Manager**: Can manage products, view reports, create orders
- **Supplier**: Can view and update order statuses

### Low Stock Detection

Products with stock below their threshold are:
- Highlighted with red borders and badges
- Shown in the dashboard alerts
- Automatically flagged for refill (if auto-refill is enabled)

## 🚨 Production Considerations

### Security

- **Token Storage**: Currently using localStorage. Consider httpOnly cookies for production
- **CORS**: Configure CORS properly on the backend
- **HTTPS**: Always use HTTPS in production
- **Environment Variables**: Never commit `.env` files with secrets
- **Input Validation**: All user inputs are validated client-side, but backend validation is essential

### Performance

- **Code Splitting**: Implemented via Vite's automatic code splitting
- **Image Optimization**: Use optimized images and lazy loading
- **Caching**: API responses are cached via React Query
- **Bundle Size**: Monitor bundle size with `npm run build -- --analyze`

### Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management for modals

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 not supported

### Responsive & Visual System

- Layouts verified at 360px, 768px, 1024px, and 1440px viewports
- Sidebar collapses on tablet/mobile while the navbar exposes a mobile menu
- Cards, tables, and filter panels use responsive grids with consistent spacing
- Tailwind theme exposes `primary`, `secondary`, `accent`, and `neutral` tokens so new features can align with Smart Grocery’s brand palette

## 📝 License

This project is part of the Smart Grocery Refill System. See the main project documentation for license information.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test && npm run test:e2e`
4. Ensure linting passes: `npm run lint`
5. Submit a pull request

## 📚 Additional Resources

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture documentation
- [Project Specification](./SMART%20GROCERY%20REFILL%20SYSTEM.docx) - Original project specification

## 🐛 Troubleshooting

### Mock server not starting

Ensure port 5000 is not in use:
```bash
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

### Build errors

Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### E2E tests failing

Ensure the dev server is running:
```bash
npm run dev
# In another terminal
npm run test:e2e
```

## 📞 Support

For issues and questions, please refer to the project documentation or create an issue in the repository.

