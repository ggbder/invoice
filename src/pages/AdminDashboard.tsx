
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import UserManagementForm from '@/components/UserManagementForm';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/utils/formatters';
import { Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { invoiceService } from '@/services/invoiceService';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // Get all invoices (for stats)
  const invoices = invoiceService.getAllInvoices();
  
  const totalAmount = invoices.reduce((sum, invoice) => 
    sum + invoice.totalAmount, 0) || 0;

  const countByStatus = invoices.reduce((acc, invoice) => {
    acc[invoice.status] = (acc[invoice.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = [
    { name: 'En Attente', value: countByStatus['EnAttente'] || 0 },
    { name: 'Validées', value: countByStatus['Validee'] || 0 },
    { name: 'Annulées', value: countByStatus['Annulee'] || 0 },
  ];

  const COLORS = ["#F59E0B", "#10B981", "#EF4444"];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin Dashboard | RapproInvoice</title>
      </Helmet>
      <Navbar />
      
      <main className="container mx-auto px-4 py-20">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground mb-2">Total Invoices</div>
                <div className="text-2xl font-bold">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : invoices.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground mb-2">Total Amount</div>
                <div className="text-2xl font-bold">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : formatCurrency(totalAmount)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground mb-2">Pending Invoices</div>
                <div className="text-2xl font-bold">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : countByStatus['EnAttente'] || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="users" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="stats">Invoice Statistics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="mt-4">
              <UserManagementForm />
            </TabsContent>
            
            <TabsContent value="stats" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Invoice Status Distribution</h2>
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                  ) : invoices.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No invoice data available
                    </div>
                  ) : (
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
