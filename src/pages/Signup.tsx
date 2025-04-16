
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'AGENT' | 'COMPTABLE'>('AGENT');
  const [loading, setLoading] = useState(false);
  const [animateGear, setAnimateGear] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, user } = useAuth();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate('/dashboard');
    }
    
    // Trigger animations after a small delay
    const timer = setTimeout(() => {
      setAnimateGear(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple validation
    if (!fullName || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Register user using auth context
    const success = await register({
      fullName,
      email,
      password,
      role
    });
    
    if (success) {
      // Navigate to login page with a message about email verification
      navigate('/login');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Background with blueprint grid */}
      <div className="absolute inset-0 bg-white blueprint-grid"></div>
      
      {/* Technical drawings (similar to Login page) */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="500" cy="500" r="200" stroke="#0066CC" strokeWidth="0.5" strokeDasharray="5 5" />
          <circle cx="500" cy="500" r="300" stroke="#0066CC" strokeWidth="0.5" strokeDasharray="5 5" />
          <circle cx="500" cy="500" r="400" stroke="#0066CC" strokeWidth="0.5" strokeDasharray="5 5" />
          <line x1="0" y1="500" x2="1000" y2="500" stroke="#0066CC" strokeWidth="0.5" strokeDasharray="5 5" />
          <line x1="500" y1="0" x2="500" y2="1000" stroke="#0066CC" strokeWidth="0.5" strokeDasharray="5 5" />
        </svg>
      </div>
      
      {/* Mechanical elements animation (similar to Login page) */}
      <div className={`absolute right-28 top-24 transition-opacity duration-1000 ${animateGear ? 'opacity-100' : 'opacity-0'}`}>
        <svg className="w-32 h-32 spin-gear" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M50 92C73.196 92 92 73.196 92 50C92 26.804 73.196 8 50 8C26.804 8 8 26.804 8 50C8 73.196 26.804 92 50 92ZM50 70C61.046 70 70 61.046 70 50C70 38.954 61.046 30 50 30C38.954 30 30 38.954 30 50C30 61.046 38.954 70 50 70Z" stroke="#0066CC" strokeWidth="1.5" />
          <path d="M50 0V16M50 84V100M100 50H84M16 50H0M14.64 14.64L25.76 25.76M85.36 85.36L74.24 74.24M85.36 14.64L74.24 25.76M14.64 85.36L25.76 74.24" stroke="#0066CC" strokeWidth="3" className="draw-in" />
        </svg>
      </div>
      
      {/* Add some decorative mechanical elements (similar to Login page) */}
      <div className={`absolute left-32 bottom-24 transition-opacity duration-1000 delay-300 ${animateGear ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '300ms' }}>
        <svg className="w-16 h-16 spin-gear-reverse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M50 92C73.196 92 92 73.196 92 50C92 26.804 73.196 8 50 8C26.804 8 8 26.804 8 50C8 73.196 26.804 92 50 92ZM50 70C61.046 70 70 61.046 70 50C70 38.954 61.046 30 50 30C38.954 30 30 38.954 30 50C30 61.046 38.954 70 50 70Z" stroke="#0066CC" strokeWidth="1.5" />
          <path d="M50 0V16M50 84V100M100 50H84M16 50H0M14.64 14.64L25.76 25.76M85.36 85.36L74.24 74.24M85.36 14.64L74.24 25.76M14.64 85.36L25.76 74.24" stroke="#0066CC" strokeWidth="3" className="draw-in" />
        </svg>
      </div>

      <main className="flex-grow flex items-center justify-center py-16 px-4 relative z-10">
        <div className="max-w-md w-full fade-in">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 gap-1 mb-6 font-mono">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h2 className="text-3xl font-semibold font-mono text-blue-800">Create an Account</h2>
            <p className="mt-2 text-muted-foreground font-mono text-sm">Sign up to get started with RapproInvoice</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-8 shadow-sm">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 font-mono">Full Name</label>
                <input 
                  id="fullName" 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="creative-form-input"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-mono">Email</label>
                <input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="creative-form-input"
                  placeholder="john.doe@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 font-mono">Password</label>
                <input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="creative-form-input"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 font-mono">Confirm Password</label>
                <input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="creative-form-input"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 font-mono">Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'AGENT' | 'COMPTABLE')}
                  className="creative-form-input"
                >
                  <option value="AGENT">Agent</option>
                  <option value="COMPTABLE">Comptable</option>
                </select>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  Agents can create and submit invoices, while Comptables can validate invoices
                </p>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="relative w-full py-2.5 px-4 text-center bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white transition-all duration-300 font-mono mt-4"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600 font-mono">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Coordinates overlay */}
      <div className="absolute bottom-5 left-5 text-xs font-mono text-blue-800/40 fade-in">
        x: 21.45 y: 92.67
      </div>
      
      <Footer />
    </div>
  );
};

export default Signup;
