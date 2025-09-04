import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { PRODUCTS } from '@/data/posData';
import ReportsTable from '@/components/ReportsTable';
import BusinessReports from '@/components/BusinessReports';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Filter,
  Download,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Eye,
  RefreshCw,
  PieChart,
  Target,
  Clock,
  FileBarChart
} from 'lucide-react';

interface SaleItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Sale {
  id: string;
  invoiceNo: string;
  date: string;
  time: string;
  customerName?: string;
  customerPhone?: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'bank';
  status: 'completed' | 'pending' | 'refunded';
  cashier: string;
}

const SalesReport: React.FC = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeView, setActiveView] = useState<'overview' | 'detailed' | 'products' | 'customers'>('overview');

  // Sample sales data
  const [sales] = useState<Sale[]>([
    {
      id: '1',
      invoiceNo: 'INV-001',
      date: '2024-01-15',
      time: '10:30 AM',
      customerName: 'John Doe',
      customerPhone: '+1-555-0123',
      items: [
        { productId: 1, productName: 'Apple iPhone 13', quantity: 1, unitPrice: 699.00, total: 699.00 },
        { productId: 5, productName: 'Apple AirPods Pro', quantity: 1, unitPrice: 249.00, total: 249.00 }
      ],
      subtotal: 948.00,
      tax: 94.80,
      discount: 0,
      total: 1042.80,
      paymentMethod: 'card',
      status: 'completed',
      cashier: 'Alice Johnson'
    },
    {
      id: '2',
      invoiceNo: 'INV-002',
      date: '2024-01-15',
      time: '11:15 AM',
      items: [
        { productId: 2, productName: 'Samsung Galaxy S21', quantity: 1, unitPrice: 799.00, total: 799.00 }
      ],
      subtotal: 799.00,
      tax: 79.90,
      discount: 50.00,
      total: 828.90,
      paymentMethod: 'cash',
      status: 'completed',
      cashier: 'Bob Smith'
    },
    {
      id: '3',
      invoiceNo: 'INV-003',
      date: '2024-01-14',
      time: '2:45 PM',
      customerName: 'Jane Smith',
      customerPhone: '+1-555-0456',
      items: [
        { productId: 6, productName: 'MacBook Pro 14"', quantity: 1, unitPrice: 1999.00, total: 1999.00 },
        { productId: 7, productName: 'Magic Mouse', quantity: 1, unitPrice: 79.00, total: 79.00 }
      ],
      subtotal: 2078.00,
      tax: 207.80,
      discount: 100.00,
      total: 2185.80,
      paymentMethod: 'card',
      status: 'completed',
      cashier: 'Alice Johnson'
    },
    {
      id: '4',
      invoiceNo: 'INV-004',
      date: '2024-01-14',
      time: '4:20 PM',
      items: [
        { productId: 3, productName: 'iPad Pro 11"', quantity: 2, unitPrice: 899.00, total: 1798.00 }
      ],
      subtotal: 1798.00,
      tax: 179.80,
      discount: 0,
      total: 1977.80,
      paymentMethod: 'bank',
      status: 'completed',
      cashier: 'Carol Wilson'
    },
    {
      id: '5',
      invoiceNo: 'INV-005',
      date: '2024-01-13',
      time: '9:10 AM',
      customerName: 'Mike Johnson',
      items: [
        { productId: 4, productName: 'Apple Watch Series 8', quantity: 1, unitPrice: 399.00, total: 399.00 },
        { productId: 8, productName: 'iPhone Case', quantity: 2, unitPrice: 29.99, total: 59.98 }
      ],
      subtotal: 458.98,
      tax: 45.90,
      discount: 20.00,
      total: 484.88,
      paymentMethod: 'cash',
      status: 'completed',
      cashier: 'Bob Smith'
    }
  ]);

  // Filter sales based on date range and filters
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      
      const withinDateRange = saleDate >= start && saleDate <= end;
      const matchesPaymentMethod = selectedPaymentMethod === 'all' || sale.paymentMethod === selectedPaymentMethod;
      const matchesStatus = selectedStatus === 'all' || sale.status === selectedStatus;
      
      return withinDateRange && matchesPaymentMethod && matchesStatus;
    });
  }, [sales, dateRange, selectedPaymentMethod, selectedStatus]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalTransactions = filteredSales.length;
    const totalItems = filteredSales.reduce((sum, sale) => 
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const averageOrderValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;
    
    const totalTax = filteredSales.reduce((sum, sale) => sum + sale.tax, 0);
    const totalDiscount = filteredSales.reduce((sum, sale) => sum + sale.discount, 0);
    const totalSubtotal = filteredSales.reduce((sum, sale) => sum + sale.subtotal, 0);

    // Payment method breakdown
    const paymentBreakdown = {
      cash: filteredSales.filter(s => s.paymentMethod === 'cash').reduce((sum, s) => sum + s.total, 0),
      card: filteredSales.filter(s => s.paymentMethod === 'card').reduce((sum, s) => sum + s.total, 0),
      bank: filteredSales.filter(s => s.paymentMethod === 'bank').reduce((sum, s) => sum + s.total, 0)
    };

    // Top selling products
    const productSales = new Map();
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const existing = productSales.get(item.productId) || { 
          name: item.productName, 
          quantity: 0, 
          revenue: 0 
        };
        productSales.set(item.productId, {
          name: item.productName,
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + item.total
        });
      });
    });

    const topProducts = Array.from(productSales.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Daily sales trend
    const dailySales = new Map();
    filteredSales.forEach(sale => {
      const date = sale.date;
      const existing = dailySales.get(date) || { transactions: 0, revenue: 0 };
      dailySales.set(date, {
        transactions: existing.transactions + 1,
        revenue: existing.revenue + sale.total
      });
    });

    const salesTrend = Array.from(dailySales.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      totalSales,
      totalTransactions,
      totalItems,
      averageOrderValue,
      totalTax,
      totalDiscount,
      totalSubtotal,
      paymentBreakdown,
      topProducts,
      salesTrend
    };
  }, [filteredSales]);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    const today = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'today':
        startDate = new Date();
        break;
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        return;
    }
    
    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
      case 'refunded':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Refunded</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sales Reports & Analytics</h1>
            <p className="text-muted-foreground">Comprehensive sales insights and performance metrics</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={activeView === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveView('overview')}
            className="transition-all duration-200 hover:scale-105"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeView === 'detailed' ? 'default' : 'outline'}
            onClick={() => setActiveView('detailed')}
            className="transition-all duration-200 hover:scale-105"
          >
            <FileBarChart className="h-4 w-4 mr-2" />
            Detailed
          </Button>
          <Button
            variant={activeView === 'products' ? 'default' : 'outline'}
            onClick={() => setActiveView('products')}
            className="transition-all duration-200 hover:scale-105"
          >
            <Package className="h-4 w-4 mr-2" />
            Products
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="animate-slideInLeft">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Date Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>Quick Period</Label>
              <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="quarter">Last 3 Months</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                className="transition-all duration-200 focus:scale-105"
              />
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                className="transition-all duration-200 focus:scale-105"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end space-x-2">
              <Button variant="outline" className="flex-1 transition-all duration-200 hover:scale-105">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" className="flex-1 transition-all duration-200 hover:scale-105">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="animate-slideInLeft">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sales</p>
                    <p className="text-2xl font-bold text-green-600">${analytics.totalSales.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12.5% vs last period
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Transactions</p>
                    <p className="text-2xl font-bold text-blue-600">{analytics.totalTransactions}</p>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8.3% vs last period
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Package className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Items Sold</p>
                    <p className="text-2xl font-bold text-purple-600">{analytics.totalItems}</p>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +15.2% vs last period
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slideInLeft" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Target className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Order Value</p>
                    <p className="text-2xl font-bold text-orange-600">${analytics.averageOrderValue.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +5.8% vs last period
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Methods */}
            <Card className="animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Cash</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">${analytics.paymentBreakdown.cash.toFixed(2)}</span>
                      <div className="text-xs text-muted-foreground">
                        {analytics.totalSales > 0 ? ((analytics.paymentBreakdown.cash / analytics.totalSales) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Card</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">${analytics.paymentBreakdown.card.toFixed(2)}</span>
                      <div className="text-xs text-muted-foreground">
                        {analytics.totalSales > 0 ? ((analytics.paymentBreakdown.card / analytics.totalSales) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Bank Transfer</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">${analytics.paymentBreakdown.bank.toFixed(2)}</span>
                      <div className="text-xs text-muted-foreground">
                        {analytics.totalSales > 0 ? ((analytics.paymentBreakdown.bank / analytics.totalSales) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="animate-slideInLeft" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Top Selling Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg animate-fadeInUp"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.quantity} sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${product.revenue.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Trend */}
          <Card className="animate-slideInLeft" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Daily Sales Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.salesTrend.map((day, index) => (
                  <div 
                    key={day.date} 
                    className="flex items-center justify-between p-3 border rounded-lg animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{new Date(day.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">{day.transactions} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${day.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comprehensive Reports Table */}
          <ReportsTable />
        </div>
      )}

      {/* Business Overview Reports */}
      <BusinessReports />

      {activeView === 'detailed' && (
        <Card className="animate-slideInLeft">
          <CardHeader>
            <CardTitle>Detailed Sales Transactions</CardTitle>
            <CardDescription>Complete list of sales with transaction details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSales.map((sale, index) => (
                <div 
                  key={sale.id} 
                  className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <ShoppingCart className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{sale.invoiceNo}</h4>
                        <p className="text-sm text-muted-foreground">
                          {sale.date} at {sale.time} • Cashier: {sale.cashier}
                        </p>
                        {sale.customerName && (
                          <p className="text-xs text-muted-foreground">
                            Customer: {sale.customerName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">${sale.total.toFixed(2)}</div>
                      {getStatusBadge(sale.status)}
                    </div>
                  </div>
                  
                  {/* Items */}
                  <div className="bg-muted/50 rounded-lg p-3 mb-3">
                    <h5 className="font-medium text-sm mb-2">Items ({sale.items.length})</h5>
                    <div className="space-y-1">
                      {sale.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between text-sm">
                          <span>{item.productName} × {item.quantity}</span>
                          <span>${item.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Totals */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Subtotal: </span>
                      <span>${sale.subtotal.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tax: </span>
                      <span>${sale.tax.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Discount: </span>
                      <span>${sale.discount.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Payment: </span>
                      <span className="capitalize">{sale.paymentMethod}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total: </span>
                      <span className="font-medium">${sale.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeView === 'products' && (
        <Card className="animate-slideInLeft">
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>Analyze product sales performance and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="p-4 border rounded-lg animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">Product ID: {product.id}</p>
                      </div>
                    </div>
                    <Badge variant="outline">Rank #{index + 1}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{product.quantity}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Units Sold</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">${product.revenue.toFixed(2)}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">Revenue</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">${(product.revenue / product.quantity).toFixed(2)}</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">Avg Price</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalesReport;