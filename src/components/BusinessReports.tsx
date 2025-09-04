import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Building2,
  Users,
  Truck,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  Receipt,
  XCircle,
  FileBarChart,
  Percent,
  Target,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

const BusinessReports: React.FC = () => {
  const { toast } = useToast();

  const businessMetrics = [
    { title: 'Outstanding Amounts', value: '$12,450', icon: AlertTriangle, trend: 'up', change: '+5.2%', color: 'text-orange-500' },
    { title: 'Net Profit', value: '$48,720', icon: TrendingUp, trend: 'up', change: '+12.5%', color: 'text-green-500' },
    { title: 'Total Payments Received', value: '$89,340', icon: CreditCard, trend: 'up', change: '+8.3%', color: 'text-blue-500' },
    { title: 'Total Expenses', value: '$34,680', icon: Receipt, trend: 'down', change: '-3.1%', color: 'text-red-500' },
    { title: 'Bills & Overdue Amounts', value: '$7,890', icon: XCircle, trend: 'up', change: '+2.1%', color: 'text-red-500' },
    { title: 'Draft Invoices', value: '23', icon: FileBarChart, trend: 'neutral', change: '0%', color: 'text-gray-500' },
    { title: 'Tax Collected & Payable', value: '$9,876', icon: Percent, trend: 'up', change: '+4.7%', color: 'text-purple-500' },
    { title: 'Gross Margin %', value: '32.4%', icon: Target, trend: 'up', change: '+1.2%', color: 'text-green-500' }
  ];

  const topCustomers = [
    { name: 'ABC Corporation', amount: '$15,670', transactions: 24, trend: 'up' },
    { name: 'Global Tech Inc', amount: '$12,340', transactions: 18, trend: 'up' },
    { name: 'Retail Solutions Ltd', amount: '$9,870', transactions: 15, trend: 'down' },
    { name: 'Enterprise Systems', amount: '$8,450', transactions: 12, trend: 'up' },
    { name: 'Digital Dynamics', amount: '$7,230', transactions: 10, trend: 'neutral' }
  ];

  const topVendors = [
    { name: 'Supplier ABC Ltd', amount: '$18,950', orders: 16, trend: 'up' },
    { name: 'Global Trade Inc', amount: '$14,230', orders: 12, trend: 'up' },
    { name: 'Wholesale Partners', amount: '$11,780', orders: 9, trend: 'down' },
    { name: 'Import Solutions', amount: '$9,340', orders: 8, trend: 'up' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-3 w-3 text-green-500" />;
      case 'down': return <ArrowDown className="h-3 w-3 text-red-500" />;
      default: return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-slideInLeft">
      {/* Key Business Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Key Business Metrics
          </CardTitle>
          <CardDescription>
            Essential financial indicators and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {businessMetrics.map((metric, index) => (
              <div 
                key={metric.title}
                className="p-4 border rounded-lg bg-muted/50 animate-fadeInUp transition-all duration-200 hover:shadow-md"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">{metric.title}</p>
                    <p className="text-lg font-bold">{metric.value}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-xs ${metric.color}`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Customers & Vendors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <Card className="animate-slideInLeft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Top Customers
            </CardTitle>
            <CardDescription>Highest value customers by sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCustomers.map((customer, index) => (
                <div 
                  key={customer.name}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.transactions} transactions</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{customer.amount}</span>
                    {getTrendIcon(customer.trend)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Vendors */}
        <Card className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Top Vendors
            </CardTitle>
            <CardDescription>Highest purchase volume vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topVendors.map((vendor, index) => (
                <div 
                  key={vendor.name}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{vendor.name}</p>
                      <p className="text-xs text-muted-foreground">{vendor.orders} orders</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{vendor.amount}</span>
                    {getTrendIcon(vendor.trend)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessReports;