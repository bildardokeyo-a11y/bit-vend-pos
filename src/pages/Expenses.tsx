import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  Search,
  Save,
  FileText,
  Calendar,
  User,
  TrendingUp,
  TrendingDown,
  Receipt,
  Tag,
  Building2,
  CreditCard,
  Filter,
  Download,
  Upload
} from 'lucide-react';

interface Expense {
  id: string;
  referenceNo: string;
  date: string;
  categoryId: string;
  categoryName: string;
  description: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'bank' | 'cheque';
  vendor?: string;
  receiptNo?: string;
  status: 'approved' | 'pending' | 'rejected';
  approvedBy?: string;
  notes?: string;
}

// Sample expense categories
const expenseCategories = [
  { id: '1', name: 'Office Supplies', color: 'bg-blue-100 text-blue-800' },
  { id: '2', name: 'Utilities', color: 'bg-green-100 text-green-800' },
  { id: '3', name: 'Marketing', color: 'bg-purple-100 text-purple-800' },
  { id: '4', name: 'Transportation', color: 'bg-yellow-100 text-yellow-800' },
  { id: '5', name: 'Rent', color: 'bg-red-100 text-red-800' },
  { id: '6', name: 'Equipment', color: 'bg-indigo-100 text-indigo-800' },
  { id: '7', name: 'Professional Services', color: 'bg-pink-100 text-pink-800' },
  { id: '8', name: 'Maintenance', color: 'bg-orange-100 text-orange-800' },
];

const Expenses: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'new' | 'list' | 'analytics'>('new');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    referenceNo: `EXP-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    description: '',
    amount: '',
    paymentMethod: '',
    vendor: '',
    receiptNo: '',
    notes: ''
  });

  // Sample expenses data
  const [expenses] = useState<Expense[]>([
    {
      id: '1',
      referenceNo: 'EXP-001',
      date: '2024-01-15',
      categoryId: '1',
      categoryName: 'Office Supplies',
      description: 'Printer paper and ink cartridges',
      amount: 125.50,
      paymentMethod: 'card',
      vendor: 'Office Depot',
      receiptNo: 'REC-001',
      status: 'approved',
      approvedBy: 'John Manager',
      notes: 'Monthly office supplies purchase'
    },
    {
      id: '2',
      referenceNo: 'EXP-002',
      date: '2024-01-14',
      categoryId: '2',
      categoryName: 'Utilities',
      description: 'Electricity bill - January',
      amount: 320.75,
      paymentMethod: 'bank',
      vendor: 'City Electric Company',
      receiptNo: 'ELEC-2024-001',
      status: 'approved',
      approvedBy: 'Jane Smith',
      notes: 'Higher usage due to winter season'
    },
    {
      id: '3',
      referenceNo: 'EXP-003',
      date: '2024-01-13',
      categoryId: '3',
      categoryName: 'Marketing',
      description: 'Social media advertising campaign',
      amount: 500.00,
      paymentMethod: 'card',
      vendor: 'Facebook Ads',
      status: 'pending',
      notes: 'Q1 marketing campaign'
    },
    {
      id: '4',
      referenceNo: 'EXP-004',
      date: '2024-01-12',
      categoryId: '4',
      categoryName: 'Transportation',
      description: 'Delivery truck fuel',
      amount: 85.25,
      paymentMethod: 'cash',
      vendor: 'Shell Gas Station',
      receiptNo: 'FUEL-001',
      status: 'approved',
      approvedBy: 'Mike Johnson'
    }
  ]);

  const handleSaveExpense = () => {
    if (!formData.categoryId || !formData.description || !formData.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Expense Saved",
      description: `Expense ${formData.referenceNo} has been saved successfully`,
    });

    // Reset form
    setFormData({
      referenceNo: `EXP-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      categoryId: '',
      description: '',
      amount: '',
      paymentMethod: '',
      vendor: '',
      receiptNo: '',
      notes: ''
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rejected</Badge>;
      default:
        return null;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <DollarSign className="w-4 h-4" />;
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'bank':
        return <Building2 className="w-4 h-4" />;
      default:
        return <Receipt className="w-4 h-4" />;
    }
  };

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = filterCategory === 'all' || expense.categoryId === filterCategory;
    const matchesStatus = filterStatus === 'all' || expense.status === filterStatus;
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.referenceNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Calculate analytics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const approvedExpenses = expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
  const monthlyExpenses = expenses.filter(e => e.date.startsWith('2024-01')).reduce((sum, e) => sum + e.amount, 0);

  // Category breakdown
  const categoryBreakdown = expenseCategories.map(category => {
    const categoryExpenses = expenses.filter(e => e.categoryId === category.id);
    const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
    return { ...category, total, count: categoryExpenses.length };
  }).filter(c => c.total > 0);

  return (
    <div className="p-6 space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Expense Management</h1>
            <p className="text-muted-foreground">Track and manage business expenses</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'new' ? 'default' : 'outline'}
            onClick={() => setActiveTab('new')}
            className="transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Expense
          </Button>
          <Button
            variant={activeTab === 'list' ? 'default' : 'outline'}
            onClick={() => setActiveTab('list')}
            className="transition-all duration-200 hover:scale-105"
          >
            <FileText className="h-4 w-4 mr-2" />
            Expenses List
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'default' : 'outline'}
            onClick={() => setActiveTab('analytics')}
            className="transition-all duration-200 hover:scale-105"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {activeTab === 'new' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="animate-slideInLeft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Receipt className="h-5 w-5 mr-2" />
                  Add New Expense
                </CardTitle>
                <CardDescription>
                  Enter the details for a new business expense
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referenceNo">Reference No. *</Label>
                    <Input
                      id="referenceNo"
                      value={formData.referenceNo}
                      onChange={(e) => setFormData({...formData, referenceNo: e.target.value})}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.categoryId} onValueChange={(value) => setFormData({...formData, categoryId: value})}>
                      <SelectTrigger className="transition-all duration-200 focus:scale-105">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter expense description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="transition-all duration-200 focus:scale-105"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                      <SelectTrigger className="transition-all duration-200 focus:scale-105">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendor">Vendor/Supplier</Label>
                    <Input
                      id="vendor"
                      placeholder="Enter vendor name"
                      value={formData.vendor}
                      onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="receiptNo">Receipt/Invoice No.</Label>
                    <Input
                      id="receiptNo"
                      placeholder="Enter receipt number"
                      value={formData.receiptNo}
                      onChange={(e) => setFormData({...formData, receiptNo: e.target.value})}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" className="w-full transition-all duration-200 hover:scale-105">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Receipt
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes or comments"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="transition-all duration-200 focus:scale-105"
                  />
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    onClick={handleSaveExpense}
                    className="flex-1 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Expense
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setFormData({
                      referenceNo: `EXP-${Date.now()}`,
                      date: new Date().toISOString().split('T')[0],
                      categoryId: '',
                      description: '',
                      amount: '',
                      paymentMethod: '',
                      vendor: '',
                      receiptNo: '',
                      notes: ''
                    })}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    Clear Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            <Card className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600 dark:text-green-400">Approved This Month</span>
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    ${approvedExpenses.toFixed(2)}
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-600 dark:text-yellow-400">Pending Approval</span>
                    <TrendingDown className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                    ${pendingExpenses.toFixed(2)}
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 dark:text-blue-400">Total Expenses</span>
                    <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    ${totalExpenses.toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {expenseCategories.slice(0, 5).map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded transition-colors">
                      <span className="text-sm">{category.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {expenses.filter(e => e.categoryId === category.id).length}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="space-y-6">
          {/* Filters */}
          <Card className="animate-slideInLeft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search expenses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 transition-all duration-200 focus:scale-105"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {expenseCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full transition-all duration-200 hover:scale-105">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expenses List */}
          <Card className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>Expenses ({filteredExpenses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredExpenses.map((expense, index) => (
                  <div 
                    key={expense.id} 
                    className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {getPaymentMethodIcon(expense.paymentMethod)}
                        </div>
                        <div>
                          <h4 className="font-medium">{expense.description}</h4>
                          <p className="text-sm text-muted-foreground">
                            {expense.referenceNo} • {expense.categoryName}
                          </p>
                          {expense.vendor && (
                            <p className="text-xs text-muted-foreground">
                              Vendor: {expense.vendor}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${expense.amount.toFixed(2)}</div>
                        {getStatusBadge(expense.status)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Date: </span>
                        <span>{expense.date}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payment: </span>
                        <span className="capitalize">{expense.paymentMethod}</span>
                      </div>
                      {expense.receiptNo && (
                        <div>
                          <span className="text-muted-foreground">Receipt: </span>
                          <span>{expense.receiptNo}</span>
                        </div>
                      )}
                      {expense.approvedBy && (
                        <div>
                          <span className="text-muted-foreground">Approved by: </span>
                          <span>{expense.approvedBy}</span>
                        </div>
                      )}
                    </div>
                    
                    {expense.notes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        {expense.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overview Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="animate-slideInLeft">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <p className="text-2xl font-bold">${approvedExpenses.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">${pendingExpenses.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slideInLeft" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold">${monthlyExpenses.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card className="animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle>Expense by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryBreakdown.map((category, index) => (
                  <div key={category.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ${category.total.toFixed(2)} ({category.count} items)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(category.total / totalExpenses) * 100}%`,
                          animationDelay: `${index * 0.2}s`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Trends */}
          <Card className="animate-slideInLeft" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.slice(0, 6).map((expense, index) => (
                  <div 
                    key={expense.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getPaymentMethodIcon(expense.paymentMethod)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{expense.description}</p>
                        <p className="text-xs text-muted-foreground">{expense.categoryName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${expense.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{expense.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Expenses;