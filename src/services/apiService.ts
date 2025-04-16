import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Updated for React Router
import { useToast } from '@/components/ui/use-toast';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const navigate = useNavigate(); // React Router's navigation hook
    const { toast } = useToast();

    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('authToken');

      // Redirect to login page
      if (window.location.pathname !== '/login') {
        navigate('/login'); // Use React Router's navigate
      }
    }

    // Show error toast
    toast({
      title: 'Error',
      description: error.message || 'An unexpected error occurred.',
      variant: 'destructive',
    });

    return Promise.reject(error);
  }
);

export default api;