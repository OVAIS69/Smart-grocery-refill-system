# Architecture Documentation

## Overview

The Smart Grocery Refill System frontend is a single-page application (SPA) built with React, TypeScript, and modern web technologies. It follows a component-based architecture with clear separation of concerns.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │  Hooks   │  │ Services │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│       │             │             │             │            │
│       └────────────┴─────────────┴─────────────┘            │
│                          │                                   │
│                    ┌──────▼──────┐                          │
│                    │   Store     │                          │
│                    │  (Zustand)  │                          │
│                    └──────┬──────┘                          │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           │ HTTP/REST
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Backend API                              │
│              (Mock Server / Production)                     │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
smart-grocery-refill-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Badge.tsx
│   │   ├── FormFields.tsx
│   │   ├── Layout.tsx
│   │   ├── Loading.tsx
│   │   ├── Modal.tsx
│   │   ├── Navbar.tsx
│   │   ├── Pagination.tsx
│   │   ├── ProductCard.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Table.tsx
│   │   ├── Toast.tsx
│   │   └── useToast.ts
│   ├── pages/               # Page components
│   │   ├── Admin.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx
│   │   ├── Notifications.tsx
│   │   ├── Orders.tsx
│   │   ├── Products.tsx
│   │   ├── Profile.tsx
│   │   └── Reports.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAutoRefill.ts
│   │   ├── useNotifications.ts
│   │   ├── useOrders.ts
│   │   └── useProducts.ts
│   ├── services/            # API service layer
│   │   ├── api.ts           # Axios instance
│   │   ├── auth.ts
│   │   ├── notifications.ts
│   │   ├── orders.ts
│   │   ├── products.ts
│   │   └── reports.ts
│   ├── store/               # State management
│   │   └── authStore.ts     # Auth state (Zustand)
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── cn.ts
│   │   ├── currency.ts
│   │   ├── date.ts
│   │   ├── index.ts
│   │   └── validators.ts
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│   └── __tests__/           # Unit tests
├── mock-server/             # Mock API server
│   ├── index.js
│   └── seed.js
├── e2e/                     # E2E tests
│   ├── login.spec.ts
│   └── orders.spec.ts
├── scripts/                 # Utility scripts
│   └── seed.ts
└── public/                  # Static assets
```

## Data Flow

### Authentication Flow

```
User Input → Login Form → authService.login()
    ↓
API Call → Backend
    ↓
Response (token, user) → authStore.login()
    ↓
Store token in localStorage
    ↓
Update Zustand store
    ↓
Redirect to Dashboard
```

### Data Fetching Flow

```
Component → React Query Hook (useProducts, useOrders, etc.)
    ↓
Service Layer (productService, orderService, etc.)
    ↓
API Client (axios with interceptors)
    ↓
Backend API
    ↓
Response → React Query Cache
    ↓
Component Re-renders with Data
```

## Key Components

### 1. Authentication Store (Zustand)

**Location**: `src/store/authStore.ts`

Manages:
- User state
- Authentication token
- Login/logout actions
- Role-based permission checks

**Features**:
- Persists to localStorage
- Auto-initializes on app load
- Provides `hasRole()` helper

### 2. API Service Layer

**Location**: `src/services/`

**Structure**:
- `api.ts`: Axios instance with interceptors
- Individual service files for each domain (products, orders, etc.)

**Features**:
- Automatic token injection
- Error handling (401 redirects to login)
- Type-safe API calls

### 3. React Query Hooks

**Location**: `src/hooks/`

**Purpose**: Encapsulate data fetching logic with caching and refetching

**Benefits**:
- Automatic caching
- Background refetching
- Optimistic updates
- Loading/error states

### 4. Component Architecture

**Layout Components**:
- `Layout.tsx`: Main app layout wrapper
- `Navbar.tsx`: Top navigation bar
- `Sidebar.tsx`: Side navigation (desktop)

**UI Components**:
- Reusable, accessible components
- Follow Headless UI patterns
- Tailwind CSS styling

**Page Components**:
- Route-specific pages
- Use hooks for data fetching
- Handle loading/error states

## Routing

### Route Structure

```
/                    → Dashboard (all roles)
/login               → Login page (public)
/products            → Products list (all roles)
/orders              → Orders list (all roles)
/notifications       → Notifications (all roles)
/reports             → Reports (admin, manager)
/admin               → User management (admin only)
/profile             → User profile (all roles)
/*                   → 404 page
```

### Route Protection

Implemented via `ProtectedRoute` component in `App.tsx`:
- Checks authentication status
- Validates user roles
- Redirects unauthorized users

## State Management

### Global State (Zustand)

**Auth Store**: User authentication and permissions

### Server State (React Query)

**Cached Data**:
- Products
- Orders
- Notifications
- Reports
- Users (admin)

**Cache Keys**:
- `['products', filters]`
- `['orders', filters]`
- `['notifications']`
- `['reports', type, params]`
- `['users']`

### Local State (React useState)

Used for:
- Form inputs
- UI state (modals, toggles)
- Temporary selections

## Data Models

### User

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'supplier';
}
```

### Product

```typescript
interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;        // stock_quantity
  threshold: number;    // threshold_level
  category: string;
  sku?: string;
  unit?: string;
}
```

### Order

```typescript
interface Order {
  id: number;
  productId: number;
  product?: Product;
  quantity: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  supplierId?: number;
  supplier?: User;
  requestedBy?: number;
  requestedByUser?: User;
  createdAt: string;
  updatedAt: string;
}
```

### Notification

```typescript
interface Notification {
  id: number;
  type: 'LOW_STOCK' | 'ORDER_SHIPPED' | 'ORDER_DELIVERED' | 'SYSTEM';
  title: string;
  message: string;
  read: boolean;
  userId?: number;
  productId?: number;
  orderId?: number;
  createdAt: string;
}
```

## Features Implementation

### 1. Auto-Refill System

**Location**: `src/hooks/useAutoRefill.ts`

**How it works**:
1. Polls products API every 30 seconds
2. Filters products with `stock <= threshold`
3. Creates refill orders automatically
4. Shows toast notifications

**Toggle**: Can be enabled/disabled in Products page UI

### 2. Low Stock Detection

**Implementation**:
- Product cards show red border when `stock <= threshold`
- Dashboard shows low stock alerts
- Badge component highlights low stock items

### 3. Role-Based Access Control

**Implementation**:
- `ProtectedRoute` component checks roles
- `hasRole()` helper in auth store
- Conditional rendering in components
- API endpoints protected by backend

### 4. Notifications System

**Features**:
- Real-time polling (30s interval)
- Read/unread status
- Mark as read (single/all)
- Toast notifications for actions

### 5. Reports & Analytics

**Features**:
- Monthly consumption charts (Recharts)
- Date range filtering
- CSV export functionality
- Mock data for demo

## API Integration

### Base Configuration

**File**: `src/services/api.ts`

- Base URL from environment variable
- Request interceptor: Adds auth token
- Response interceptor: Handles 401 errors

### Error Handling

- Network errors: Display toast notification
- 401 Unauthorized: Clear auth and redirect to login
- Validation errors: Show field-specific errors
- Server errors: Generic error message

## Testing Strategy

### Unit Tests

**Framework**: Jest + React Testing Library

**Coverage**:
- Authentication logic
- Component rendering
- Form validation
- Utility functions

**Location**: `src/__tests__/`

### E2E Tests

**Framework**: Playwright

**Scenarios**:
- Login flow
- Product browsing
- Order creation
- Status updates

**Location**: `e2e/`

## Build & Deployment

### Development Build

```bash
npm run dev
```

- Vite dev server
- Hot module replacement
- Fast refresh

### Production Build

```bash
npm run build
```

- TypeScript compilation
- Code minification
- Asset optimization
- Output: `dist/` directory

### Docker Deployment

**Multi-stage build**:
1. Build stage: Compile TypeScript and bundle
2. Production stage: Serve with nginx

**Configuration**:
- `Dockerfile`: Frontend build
- `docker-compose.yml`: Frontend + Backend
- `nginx.conf`: SPA routing configuration

## Performance Optimizations

1. **Code Splitting**: Automatic via Vite
2. **Lazy Loading**: Route-based code splitting
3. **React Query Caching**: Reduces API calls
4. **Image Optimization**: Use WebP format
5. **Bundle Analysis**: Monitor with `vite-bundle-visualizer`

## Security Considerations

1. **Token Storage**: localStorage (consider httpOnly cookies)
2. **XSS Protection**: React's built-in escaping
3. **CSRF**: Handled by backend
4. **Input Validation**: Client + Server side
5. **HTTPS**: Required in production

## Accessibility

1. **Semantic HTML**: Proper heading hierarchy
2. **ARIA Labels**: Screen reader support
3. **Keyboard Navigation**: Full keyboard support
4. **Focus Management**: Modal focus trapping
5. **Color Contrast**: WCAG AA compliant

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Not Supported**: IE11

## Future Enhancements

1. **WebSocket Integration**: Real-time notifications
2. **Offline Support**: Service workers + PWA
3. **Internationalization**: i18n support
4. **Dark Mode**: Theme switching
5. **Advanced Filtering**: More filter options
6. **Bulk Operations**: Multi-select actions
7. **Export Formats**: PDF reports
8. **Mobile App**: React Native version

## References

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Query Docs](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)

