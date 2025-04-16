
import './index.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ComptableDashboard from "./pages/ComptableDashboard";
import CreateInvoice from "./pages/CreateInvoice";
import BulkUpload from "./pages/BulkUpload";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import RoleGuard from "./components/RoleGuard";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Admin-only route for user creation */}
              <Route path="/admin-dashboard" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/comptable-dashboard" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['COMPTABLE']}>
                    <ComptableDashboard />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/create-invoice" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['ADMIN', 'AGENT']}>
                    <CreateInvoice />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/bulk-upload" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['ADMIN', 'AGENT']}>
                    <BulkUpload />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
