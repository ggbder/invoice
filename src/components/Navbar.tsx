
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Basic navigation items for all users
  let navItems = [
    { name: 'Home', path: '/', showWhen: 'always' },
  ];

  // Add role-specific navigation items
  if (user) {
    switch (user.role) {
      case 'ADMIN':
        navItems = [
          ...navItems,
          { name: 'Admin Dashboard', path: '/admin-dashboard', showWhen: 'loggedIn' },
          { name: 'Dashboard', path: '/dashboard', showWhen: 'loggedIn' },
        ];
        break;
      case 'AGENT':
        navItems = [
          ...navItems,
          { name: 'Dashboard', path: '/dashboard', showWhen: 'loggedIn' },
          { name: 'Create Invoice', path: '/create-invoice', showWhen: 'loggedIn' },
        ];
        break;
      case 'COMPTABLE':
        navItems = [
          ...navItems,
          { name: 'Comptable Dashboard', path: '/comptable-dashboard', showWhen: 'loggedIn' },
        ];
        break;
    }
  }

  const filteredNavItems = navItems.filter(item => 
    item.showWhen === 'always' || 
    (item.showWhen === 'loggedIn' && user) ||
    (item.showWhen === 'loggedOut' && !user)
  );

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-semibold tracking-tight text-foreground flex items-center">
              <span className="text-primary font-bold">Invoice</span>
              <span className="ml-1 text-gray-800">Pro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(item.path)
                    ? 'text-primary bg-primary/5'
                    : 'text-foreground/80 hover:text-foreground hover:bg-secondary'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Sign Up / Login Buttons or User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {user.fullName} ({user.role})
                </span>
                <Button 
                  onClick={handleLogout}
                  variant="ghost"
                  className="flex items-center text-sm font-medium"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <Button 
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden absolute top-full left-0 right-0 bg-white shadow-md transition-all duration-300 overflow-hidden',
          mobileMenuOpen ? 'max-h-[500px] border-b' : 'max-h-0'
        )}
      >
        <div className="px-4 py-3 space-y-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                isActive(item.path)
                  ? 'text-primary bg-primary/5'
                  : 'text-foreground/80 hover:text-foreground hover:bg-secondary'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 pb-2 border-t border-border mt-2">
            {user ? (
              <>
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {user.fullName} ({user.role})
                </div>
                <Button
                  variant="ghost"
                  className="flex items-center w-full justify-start px-3 py-2 text-base font-medium text-primary"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost"
                className="w-full justify-start text-left px-3 py-2 text-base font-medium text-primary"
                asChild
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
