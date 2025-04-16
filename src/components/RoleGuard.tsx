
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast({
          title: "Access Denied",
          description: "Please login to access this page.",
          variant: "destructive"
        });
        navigate('/login');
      } else if (!allowedRoles.includes(user.role)) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive"
        });
        // Redirect based on role
        if (user.role === 'ADMIN') {
          navigate('/admin-dashboard');
        } else if (user.role === 'COMPTABLE') {
          navigate('/comptable-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    }
  }, [user, loading, allowedRoles, navigate, toast]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default RoleGuard;
