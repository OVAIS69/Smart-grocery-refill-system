import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { Login } from '@/pages/Login';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

describe('Authentication', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('should render login form', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty form', async () => {
    const { user } = await import('@testing-library/user-event');
    const userEvent = user.setup();

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });
});

