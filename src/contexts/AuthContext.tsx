
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, userService } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'isVerified' | 'verificationToken'>) => Promise<boolean>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in from session storage
    const checkLoginStatus = () => {
      const storedUser = sessionStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Failed to parse user from session storage', error);
          sessionStorage.removeItem('currentUser');
          sessionStorage.removeItem('isLoggedIn');
        }
      }
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const loggedInUser = userService.login(email, password);
      
      if (loggedInUser) {
        setUser(loggedInUser);
        sessionStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        sessionStorage.setItem('isLoggedIn', 'true');
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${loggedInUser.fullName}!`,
        });
        
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
      }
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'isVerified' | 'verificationToken'>): Promise<boolean> => {
    try {
      const newUser = userService.register(userData as User);
      
      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      });
      
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive"
        });
      }
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('isLoggedIn');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    navigate('/login');
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    const verified = userService.verifyEmail(token);
    
    if (verified) {
      toast({
        title: "Email Verified",
        description: "Your email has been verified. You can now log in.",
      });
      return true;
    } else {
      toast({
        title: "Verification Failed",
        description: "Invalid or expired verification token.",
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, verifyEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
