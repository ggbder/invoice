
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Cpu, Zap, Lock } from 'lucide-react';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [animateGear, setAnimateGear] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'COMPTABLE':
          navigate('/comptable-dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    }
    
    const timer = setTimeout(() => {
      setAnimateGear(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    const success = await login(email, password);
    
    if (success && user) {
      switch (user.role) {
        case 'COMPTABLE':
          navigate('/comptable-dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="absolute inset-0 bg-white"></div>

      <main className="flex-grow flex items-center justify-center py-16 px-4 relative z-10">
        <div className="max-w-md w-full fade-in">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 gap-1 mb-6 font-mono">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h2 className="text-3xl font-semibold font-mono text-blue-800">Welcome back</h2>
            <p className="mt-2 text-muted-foreground font-mono text-sm">Log in to your account to continue</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-8 shadow-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-mono">Email</label>
                <input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="creative-form-input"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 font-mono">Password</label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-mono">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="creative-form-input"
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="relative w-full py-2.5 px-4 text-center bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white transition-all duration-300 font-mono"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500 font-mono">OR</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <button type="button" className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                  <Cpu size={16} className="text-blue-600" />
                </button>
                <button type="button" className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                  <Zap size={16} className="text-blue-600" />
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600 font-mono">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
