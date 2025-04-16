
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { userService } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await userService.requestPasswordReset(email);
      
      if (success) {
        toast({
          title: "Reset Link Sent",
          description: "If an account exists with this email, you will receive password reset instructions.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing your request.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="absolute inset-0 bg-white"></div>

      <main className="flex-grow flex items-center justify-center py-16 px-4 relative z-10">
        <div className="max-w-md w-full fade-in">
          <div className="text-center mb-8">
            <Link to="/login" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 gap-1 mb-6 font-mono">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
            <h2 className="text-3xl font-semibold font-mono text-blue-800">Reset Password</h2>
            <p className="mt-2 text-muted-foreground font-mono text-sm">Enter your email to receive reset instructions</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-8 shadow-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-mono">Email</label>
                <div className="relative">
                  <input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="creative-form-input"
                    required
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                    Sending...
                  </span>
                ) : 'Send Reset Instructions'}
              </button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;
