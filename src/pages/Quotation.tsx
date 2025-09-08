import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Calendar,
  DollarSign,
  Package,
  User,
  Send,
  Eye,
  Edit,
  Copy,
  Download,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Quotation = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const quotations = [
    {
      id: 'QUO-2024-001',
      customer: 'TechCorp Solutions',
      customerEmail: 'contact@techcorp.com',
      date: '2024-01-15',
      validUntil: '2024-02-15',
      items: [
        { name: 'MacBook Pro 16"', quantity: 5, price: 2499.99, total: 12499.95 },
        { name: 'iPhone 15 Pro', quantity: 10, price: 999.99, total: 9999.90 }
      ],
      subtotal: 22499.85,
      tax: 1799.99,
      total: 24299.84,
      status: 'sent',
      notes: 'Bulk order discount applied'
    },
    {
      id: 'QUO-2024-002',
      customer: 'StartupX Inc',
      customerEmail: 'orders@startupx.com',
      date: '2024-01-14',
      validUntil: '2024-02-14',
      items: [
        { name: 'Dell XPS 13', quantity: 3, price: 1299.99, total: 3899.97 },
        { name: 'Wireless Mouse', quantity: 3, price: 79.99, total: 239.97 }
      ],
      subtotal: 4139.94,
      tax: 331.20,
      total: 4471.14,
      status: 'accepted',
      notes: 'Rush delivery requested'
    },
    {
      id: 'QUO-2024-003',
      customer: 'Global Enterprises',
      customerEmail: 'procurement@global.com',
      date: '2024-01-13',
      validUntil: '2024-02-13',
      items: [
        { name: 'Surface Pro 9', quantity: 8, price: 1099.99, total: 8799.92 },
        { name: 'Type Cover', quantity: 8, price: 129.99, total: 1039.92 }
      ],
      subtotal: 9839.84,
      tax: 787.19,
      total: 10627.03,
      status: 'draft',
      notes: ''
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary"><Edit className="w-3 h-3 mr-1" />Draft</Badge>;
      case 'sent':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Send className="w-3 h-3 mr-1" />Sent</Badge>;
      case 'accepted':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'expired':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredQuotations = quotations.filter(quote => {
    const matchesSearch = quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 animate-fadeInUp">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quotations</h1>
          <p className="text-muted-foreground">Create and manage customer quotations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button onClick={() => navigate('/dashboard/products/add')}>
            <Plus className="w-4 h-4 mr-2" />
            New Quotation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Total Quotes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-sm text-muted-foreground">Accepted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Send className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">$142.5K</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quotations or customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quotations List */}
      <div className="grid gap-4">
        {filteredQuotations.map((quote) => (
          <Card key={quote.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{quote.id}</h3>
                    <p className="text-sm text-muted-foreground">{quote.customer}</p>
                  </div>
                  {getStatusBadge(quote.status)}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${quote.total.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Valid until {quote.validUntil}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-foreground dark:text-white" />
                  <div>
                    <p className="text-sm font-medium">{quote.date}</p>
                    <p className="text-xs text-muted-foreground">Quote Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{quote.items.length} item(s)</p>
                    <p className="text-xs text-muted-foreground">Products</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">${quote.subtotal.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Subtotal</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{quote.customerEmail}</p>
                    <p className="text-xs text-muted-foreground">Email</p>
                  </div>
                </div>
              </div>

              {/* Items Preview */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Items:</h4>
                <div className="space-y-2">
                  {quote.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 px-3 bg-muted/50 rounded">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                      <p className="font-medium">${item.total.toFixed(2)}</p>
                    </div>
                  ))}
                  {quote.items.length > 2 && (
                    <p className="text-sm text-muted-foreground px-3">
                      +{quote.items.length - 2} more item(s)
                    </p>
                  )}
                </div>
              </div>

              {quote.notes && (
                <div className="mt-4 p-3 bg-muted/50 rounded">
                  <p className="text-sm"><strong>Notes:</strong> {quote.notes}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-1" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                {quote.status === 'draft' && (
                  <Button size="sm">
                    <Send className="w-4 h-4 mr-1" />
                    Send
                  </Button>
                )}
                {quote.status === 'sent' && (
                  <Button size="sm" className="bg-success hover:bg-success/90">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuotations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Quotations Found</h3>
            <p className="text-muted-foreground">No quotations match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Quotation;