import api from './apiService';

// User interface (remove passwordHash and verificationToken from frontend)
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'AGENT' | 'COMPTABLE';
  isVerified: boolean;
}

// Service methods
export const userService = {
  // Create a new user (admins only)
  async createUser(userData: Omit<User, 'id' | 'isVerified'>): Promise<User> {
    try {
      const response = await api.post('/api/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  },

  // Login user
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    }
  },

  // Verify email via token
  async verifyEmail(token: string): Promise<boolean> {
    try {
      const response = await api.post(`/api/verify/${token}`);
      return response.data.success;
    } catch (error) {
      console.error('Verification failed:', error);
      return false;
    }
  },

  // Request password reset
  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      const response = await api.post('/api/reset-password/request', { email });
      return response.data.success;
    } catch (error) {
      console.error('Password reset request failed:', error);
      return false;
    }
  },

  // Reset password via token
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      const response = await api.post('/api/reset-password', { token, newPassword });
      return response.data.success;
    } catch (error) {
      console.error('Password reset failed:', error);
      return false;
    }
  },
};