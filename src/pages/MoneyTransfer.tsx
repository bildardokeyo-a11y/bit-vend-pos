import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowRightLeft, 
  Search, 
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  Calendar,
  DollarSign,
  Send,
  Download,
  Filter
} from 'lucide-react';

const MoneyTransfer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const transfers = [
    {
      id: 'TRF-001',
      date: '2024-01-15',
      fromAccount: 'Business Checking (****4521)',
      toAccount: 'Business Savings (****7890)',
      amount: 5000.00,
      type: 'internal',
      status: 'completed',
      reference: 'Monthly Savings Transfer',
      fees: 0.00,
      completedAt: '2024-01-15 10:30 AM'
    },
    {
      id: 'TRF-002',
      date: '2024-01-14',
      fromAccount: 'Business Checking (****4521)',
      toAccount: 'Supplier Payment - ABC Corp',
      amount: 12500.00,
      type: 'external',
      status: 'pending',
      reference: 'Invoice Payment #INV-001',
      fees: 25.00,
      completedAt: null
    },
    {
      id: 'TRF-003',
      date: '2024-01-13',
      fromAccount: 'Petty Cash',
      toAccount: 'Business Checking (****4521)',
      amount: 200.00,
      type: 'cash_deposit',
      status: 'completed',
      reference: 'Cash deposit from daily sales',
      fees: 0.00,
      completedAt: '2024-01-13 04:15 PM'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'internal':
        return <ArrowRightLeft className="w-4 h-4 text-blue-500" />;
      case 'external':
        return <Send className="w-4 h-4 text-green-500" />;
      case 'cash_deposit':
        return <DollarSign className="w-4 h-4 text-purple-500" />;
      default:
        return <ArrowRightLeft className="w-4 h-4" />;
    }
  };

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.fromAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.toAccount.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
    const matchesType = typeFilter === 'all' || transfer.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalTransferred = transfers
    .filter(t => t.status === 'completed')
    .reduce((sum, transfer) => sum + transfer.amount, 0);

  return (
    <div className="p-6 space-y-6 animate-fadeInUp">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Money Transfers</h1>
          <p className="text-muted-foreground">Transfer funds between accounts and manage payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Transfer
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{transfers.length}</p>
                <p className="text-sm text-muted-foreground">Total Transfers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{transfers.filter(t => t.status === 'completed').length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{transfers.filter(t => t.status === 'pending').length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">${totalTransferred.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="animate-slideInLeft">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transfers, accounts, or references..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="external">External</SelectItem>
                <SelectItem value="cash_deposit">Cash Deposit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transfers List */}
      <div className="grid gap-4">
        {filteredTransfers.map((transfer, index) => (
          <Card key={transfer.id} className="hover:shadow-md transition-shadow animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-muted rounded-full">
                    {getTypeIcon(transfer.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{transfer.id}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {transfer.type.replace('_', ' ')} Transfer
                    </p>
                  </div>
                  {getStatusBadge(transfer.status)}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${transfer.amount.toFixed(2)}</p>
                  {transfer.fees > 0 && (
                    <p className="text-sm text-muted-foreground">+${transfer.fees.toFixed(2)} fees</p>
                  )}
                </div>
              </div>

              {/* Transfer Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">From:</span>
                  </div>
                  <span className="text-sm">{transfer.fromAccount}</span>
                </div>
                <div className="flex justify-center">
                  <ArrowRightLeft className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">To:</span>
                  </div>
                  <span className="text-sm">{transfer.toAccount}</span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-foreground dark:text-white" />
                  <div>
                    <p className="text-sm font-medium">{transfer.date}</p>
                    <p className="text-xs text-muted-foreground">Transfer Date</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">{transfer.reference}</p>
                  <p className="text-xs text-muted-foreground">Reference</p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {transfer.completedAt || 'Pending'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transfer.status === 'completed' ? 'Completed At' : 'Status'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Receipt
                </Button>
                {transfer.status === 'pending' && (
                  <>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                    <Button size="sm" className="bg-success hover:bg-success/90">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTransfers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ArrowRightLeft className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Transfers Found</h3>
            <p className="text-muted-foreground">No transfers match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoneyTransfer;