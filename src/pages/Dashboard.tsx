
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer } from '@/components/ui/chart';
import { formatCurrency } from '@/utils/formatters';
import { Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { invoiceService, Invoice } from '@/services/invoiceService';

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchInvoices = () => {
      setLoading(true);
      try {
        // If we have a user ID, get invoices for that user
        if (user?.id) {
          // For ADMIN, get all invoices
          const loadedInvoices = user.role === 'ADMIN' 
            ? invoiceService.getAllInvoices()
            : invoiceService.getUserInvoices(user.id);
          
          setInvoices(loadedInvoices);
        } else {
          setInvoices([]);
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user]);

  const totalAmount = invoices.reduce((sum: number, invoice: Invoice) => 
    sum + invoice.totalAmount, 0) || 0;

  const countByStatus = invoices.reduce((acc: Record<string, number>, invoice: Invoice) => {
    acc[invoice.status] = (acc[invoice.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = [
    { name: 'En Attente', value: countByStatus['EnAttente'] || 0 },
    { name: 'Validées', value: countByStatus['Validee'] || 0 },
    { name: 'Annulées', value: countByStatus['Annulee'] || 0 },
  ];

  const COLORS = ["#F59E0B", "#10B981", "#EF4444"];

  const recentInvoices = invoices.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dashboard | RapproInvoice</title>
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h1 className="text-3xl font-bold tracking-tight">
              {user?.role === 'AGENT' ? 'Agent Dashboard' : 'Admin Dashboard'}
            </h1>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button asChild>
                <Link to="/create-invoice">Create Invoice</Link>
              </Button>
              {user?.role === 'ADMIN' && (
                <Button variant="outline" asChild>
                  <Link to="/bulk-upload">Bulk Upload</Link>
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : invoices.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : formatCurrency(totalAmount)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : countByStatus['EnAttente'] || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                ) : invoices.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No invoice data available
                  </div>
                ) : (
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
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

            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Recently created invoices</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                ) : invoices.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No invoices found. Create your first invoice!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentInvoices.map((invoice: Invoice) => (
                      <div key={invoice.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-muted-foreground">{invoice.supplierName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(invoice.totalAmount)}</p>
                          <p className={`text-sm ${
                            invoice.status === 'Validee' ? 'text-green-500' : 
                            invoice.status === 'EnAttente' ? 'text-amber-500' : 'text-red-500'
                          }`}>
                            {invoice.status === 'EnAttente' ? 'Pending' : 
                             invoice.status === 'Validee' ? 'Approved' : 'Cancelled'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/invoices">View All Invoices</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
