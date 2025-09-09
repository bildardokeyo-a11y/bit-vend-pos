import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Search, 
  Building, 
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Banknote
} from 'lucide-react';

const BankAccounts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bankFilter, setBankFilter] = useState('all');

  const [bankAccounts] = useState([
    {
      id: '1',
      accountName: 'Business Checking',
      bankName: 'Chase Bank',
      accountNumber: '****1234',
      accountType: 'checking',
      balance: 25000,
      currency: 'USD',
      status: 'active',
      isDefault: true,
      lastSync: '2024-01-25 10:30 AM',
      recentTransactions: [
        { id: '1', description: 'Sales Deposit', amount: 1500, type: 'credit', date: '2024-01-25' },
        { id: '2', description: 'Office Rent', amount: -2000, type: 'debit', date: '2024-01-24' },
        { id: '3', description: 'Supplier Payment', amount: -800, type: 'debit', date: '2024-01-23' }
      ]
    },
    {
      id: '2',
      accountName: 'Business Savings',
      bankName: 'Bank of America',
      accountNumber: '****5678',
      accountType: 'savings',
      balance: 50000,
      currency: 'USD',
      status: 'active',
      isDefault: false,
      lastSync: '2024-01-25 10:30 AM',
      recentTransactions: [
        { id: '1', description: 'Interest Payment', amount: 125, type: 'credit', date: '2024-01-20' },
        { id: '2', description: 'Transfer to Checking', amount: -5000, type: 'debit', date: '2024-01-18' }
      ]
    }
  ]);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <Building className="w-5 h-5" />;
      case 'savings':
        return <TrendingUp className="w-5 h-5" />;
      case 'cash':
        return <Banknote className="w-5 h-5" />;
      case 'credit':
        return <CreditCard className="w-5 h-5" />;
      default:
        return <Building className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'frozen':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Frozen</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredAccounts = bankAccounts.filter(account => {
    const matchesSearch = account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.bankName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBank = bankFilter === 'all' || account.bankName === bankFilter;
    return matchesSearch && matchesBank;
  });

  const totalBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="p-6 space-y-6 animate-fadeInUp">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bank Accounts</h1>
          <p className="text-muted-foreground">Manage your business bank accounts and cash flow</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Reconcile
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-2xl font-bold">${totalBalance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Accounts</p>
                <p className="text-2xl font-bold">{bankAccounts.filter(a => a.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-green-600">+$12.5K</p>
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
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={bankFilter} onValueChange={setBankFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Banks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Banks</SelectItem>
                <SelectItem value="Chase Bank">Chase Bank</SelectItem>
                <SelectItem value="Bank of America">Bank of America</SelectItem>
                <SelectItem value="Cash Account">Cash Account</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Accounts List */}
      <div className="grid gap-4">
        {filteredAccounts.map((account, index) => (
          <Card key={account.id} className={`hover:shadow-md transition-shadow animate-fadeInUp ${account.isDefault ? 'ring-2 ring-primary' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-muted rounded-full">
                    {getAccountIcon(account.accountType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{account.accountName}</h3>
                      {account.isDefault && <Badge variant="outline">Default</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{account.bankName} • {account.accountNumber}</p>
                    <p className="text-xs text-muted-foreground">Last sync: {account.lastSync}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${account.balance.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(account.status)}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium capitalize">{account.accountType} Account</p>
                  <p className="text-xs text-muted-foreground">Account Type</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{account.currency}</p>
                  <p className="text-xs text-muted-foreground">Currency</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{account.recentTransactions.length}</p>
                  <p className="text-xs text-muted-foreground">Recent Transactions</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={account.status === 'active'} />
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Recent Transactions</h4>
                <div className="space-y-2">
                  {account.recentTransactions.slice(0, 3).map((transaction, index) => (
                    <div key={index} className="flex justify-between items-center py-2 px-3 bg-muted/50 rounded">
                      <div className="flex items-center gap-3">
                        <div className={`p-1 rounded-full ${transaction.type === 'credit' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                          {transaction.type === 'credit' ? 
                            <TrendingUp className="w-3 h-3 text-green-600" /> : 
                            <TrendingDown className="w-3 h-3 text-red-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <p className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  {account.recentTransactions.length > 3 && (
                    <Button variant="ghost" size="sm" className="w-full">
                      View All Transactions
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-1 text-foreground dark:text-white" />
                  Reconcile
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                {!account.isDefault && (
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAccounts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Bank Accounts Found</h3>
            <p className="text-muted-foreground">No accounts match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BankAccounts;