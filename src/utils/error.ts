import axios from 'axios';

interface ApiErrorShape {
  message?: string;
  errors?: Record<string, string[]>;
}

export const getErrorMessage = (error: unknown, fallback = 'Something went wrong'): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorShape | undefined;
    return data?.message ?? error.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};


