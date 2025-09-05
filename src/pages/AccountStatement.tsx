import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Archive,
  Search,
  Filter
} from 'lucide-react';

const AccountStatement = () => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const accounts = [
    { id: '1000', name: 'Cash and Cash Equivalents' },
    { id: '1100', name: 'Accounts Receivable' },
    { id: '2000', name: 'Accounts Payable' },
    { id: '4000', name: 'Sales Revenue' },
    { id: '5000', name: 'Cost of Goods Sold' }
  ];

  const accountStatementData = {
    accountInfo: {
      accountCode: '1000',
      accountName: 'Cash and Cash Equivalents',
      openingBalance: 125000.00,
      closingBalance: 145832.45
    },
    transactions: [
      {
        id: 1,
        date: '2024-01-31',
        description: 'Cash Sale - INV-2024-001',
        reference: 'CS-001',
        debit: 5500.00,
        credit: 0,
        balance: 130500.00,
        type: 'receipt'
      },
      {
        id: 2,
        date: '2024-01-30',
        description: 'Supplier Payment - SUP-001',
        reference: 'PY-001',
        debit: 0,
        credit: 2800.00,
        balance: 125000.00,
        type: 'payment'
      },
      {
        id: 3,
        date: '2024-01-29',
        description: 'Bank Deposit',
        reference: 'BD-001',
        debit: 15000.00,
        credit: 0,
        balance: 127800.00,
        type: 'deposit'
      },
      {
        id: 4,
        date: '2024-01-28',
        description: 'Office Rent Payment',
        reference: 'RN-001',
        debit: 0,
        credit: 3500.00,
        balance: 112800.00,
        type: 'payment'
      },
      {
        id: 5,
        date: '2024-01-27',
        description: 'Customer Payment - CUST-001',
        reference: 'RC-002',
        debit: 8750.00,
        credit: 0,
        balance: 116300.00,
        type: 'receipt'
      }
    ]
  };

  const filteredTransactions = accountStatementData.transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDebits = filteredTransactions.reduce((sum, transaction) => sum + transaction.debit, 0);
  const totalCredits = filteredTransactions.reduce((sum, transaction) => sum + transaction.credit, 0);

  const getTransactionBadge = (type: string) => {
    const variants: { [key: string]: "default" | "destructive" | "outline" | "secondary" } = {
      receipt: 'default',
      payment: 'secondary',
      deposit: 'outline',
      withdrawal: 'destructive'
    };
    return variants[type] || 'default';
  };

  const handleExportPDF = () => {
    console.log('Exporting Account Statement as PDF...');
  };

  const handleExportXLS = () => {
    console.log('Exporting Account Statement as XLS...');
  };

  const handleExportAllZIP = () => {
    console.log('Exporting all reports as ZIP...');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Account Statement</h1>
          <p className="text-muted-foreground">View detailed account transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportAllZIP}>
            <Archive className="w-4 h-4 mr-2" />
            Export All ZIP
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.id} - {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="current-quarter">Current Quarter</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  <SelectItem value="current-year">Current Year</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[250px]"
              />
            </div>
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Account Statement - Detailed View</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex justify-end gap-2 mb-4">
                    <Button variant="outline" size="sm" onClick={handleExportPDF}>
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportXLS}>
                      <FileText className="w-4 h-4 mr-1" />
                      XLS
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell className="font-medium">{transaction.reference}</TableCell>
                          <TableCell>
                            <Badge variant={getTransactionBadge(transaction.type)}>
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {transaction.debit > 0 ? `$${transaction.debit.toLocaleString()}` : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {transaction.credit > 0 ? `$${transaction.credit.toLocaleString()}` : '-'}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${transaction.balance.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Opening Balance</p>
                <p className="text-xl font-bold">${accountStatementData.accountInfo.openingBalance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Debits</p>
                <p className="text-xl font-bold">${totalDebits.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-xl font-bold">${totalCredits.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Closing Balance</p>
                <p className="text-xl font-bold">${accountStatementData.accountInfo.closingBalance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Statement Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {accountStatementData.accountInfo.accountCode} - {accountStatementData.accountInfo.accountName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="font-medium">{transaction.reference}</TableCell>
                  <TableCell>
                    <Badge variant={getTransactionBadge(transaction.type)}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.debit > 0 ? `$${transaction.debit.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.credit > 0 ? `$${transaction.credit.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${transaction.balance.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountStatement;