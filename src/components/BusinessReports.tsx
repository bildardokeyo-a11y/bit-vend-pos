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

  const [businessMetrics] = useState([
    { title: 'Outstanding Amounts', value: '$0', icon: AlertTriangle, trend: 'neutral', change: '0%', color: 'text-orange-500' },
    { title: 'Net Profit', value: '$0', icon: TrendingUp, trend: 'neutral', change: '0%', color: 'text-green-500' },
    { title: 'Total Payments Received', value: '$0', icon: CreditCard, trend: 'neutral', change: '0%', color: 'text-blue-500' },
    { title: 'Total Expenses', value: '$0', icon: Receipt, trend: 'neutral', change: '0%', color: 'text-red-500' },
    { title: 'Bills & Overdue Amounts', value: '$0', icon: XCircle, trend: 'neutral', change: '0%', color: 'text-red-500' },
    { title: 'Draft Invoices', value: '0', icon: FileBarChart, trend: 'neutral', change: '0%', color: 'text-gray-500' },
    { title: 'Tax Collected & Payable', value: '$0', icon: Percent, trend: 'neutral', change: '0%', color: 'text-purple-500' },
    { title: 'Gross Margin %', value: '0%', icon: Target, trend: 'neutral', change: '0%', color: 'text-green-500' }
  ]);

  const [topCustomers] = useState([]);

  const [topVendors] = useState([]);

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
    </div>
  );
};

export default BusinessReports;