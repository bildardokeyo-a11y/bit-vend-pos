import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, 
  Download, 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Archive
} from 'lucide-react';

const TrialBalance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [showModal, setShowModal] = useState(false);

  const trialBalanceData = {
    asOfDate: '2024-01-31',
    accounts: [
      { accountCode: '1000', accountName: 'Cash and Cash Equivalents', debit: 145832.45, credit: 0 },
      { accountCode: '1100', accountName: 'Accounts Receivable', debit: 85430.22, credit: 0 },
      { accountCode: '1200', accountName: 'Inventory', debit: 234567.89, credit: 0 },
      { accountCode: '1300', accountName: 'Prepaid Expenses', debit: 12450.00, credit: 0 },
      { accountCode: '1500', accountName: 'Property, Plant & Equipment', debit: 450000.00, credit: 0 },
      { accountCode: '1600', accountName: 'Accumulated Depreciation', debit: 0, credit: 85000.00 },
      { accountCode: '2000', accountName: 'Accounts Payable', debit: 0, credit: 65432.10 },
      { accountCode: '2100', accountName: 'Accrued Expenses', debit: 0, credit: 23456.78 },
      { accountCode: '2200', accountName: 'Notes Payable', debit: 0, credit: 250000.00 },
      { accountCode: '3000', accountName: 'Owner\'s Capital', debit: 0, credit: 250000.00 },
      { accountCode: '3100', accountName: 'Retained Earnings', debit: 0, credit: 84392.68 },
      { accountCode: '4000', accountName: 'Sales Revenue', debit: 0, credit: 350000.00 },
      { accountCode: '5000', accountName: 'Cost of Goods Sold', debit: 180000.00, credit: 0 },
      { accountCode: '6000', accountName: 'Operating Expenses', debit: 95000.00, credit: 0 },
      { accountCode: '6100', accountName: 'Depreciation Expense', debit: 15000.00, credit: 0 }
    ]
  };

  const totalDebits = trialBalanceData.accounts.reduce((sum, account) => sum + account.debit, 0);
  const totalCredits = trialBalanceData.accounts.reduce((sum, account) => sum + account.credit, 0);

  const handleExportPDF = () => {
    console.log('Exporting Trial Balance as PDF...');
  };

  const handleExportXLS = () => {
    console.log('Exporting Trial Balance as XLS...');
  };

  const handleExportAllZIP = () => {
    console.log('Exporting all reports as ZIP...');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trial Balance</h1>
          <p className="text-muted-foreground">View your company's trial balance</p>
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

      {/* Period Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
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
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Trial Balance - Detailed View</DialogTitle>
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
                        <TableHead>Account Code</TableHead>
                        <TableHead>Account Name</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trialBalanceData.accounts.map((account, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{account.accountCode}</TableCell>
                          <TableCell>{account.accountName}</TableCell>
                          <TableCell className="text-right">
                            {account.debit > 0 ? `$${account.debit.toLocaleString()}` : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {account.credit > 0 ? `$${account.credit.toLocaleString()}` : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t-2">
                        <TableCell className="font-bold">TOTALS</TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right font-bold">${totalDebits.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-bold">${totalCredits.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Debits</p>
                <p className="text-2xl font-bold">${totalDebits.toLocaleString()}</p>
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
                <p className="text-2xl font-bold">${totalCredits.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Balance Check</p>
                <p className="text-2xl font-bold text-green-600">Balanced</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trial Balance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trial Balance as of {trialBalanceData.asOfDate}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Code</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trialBalanceData.accounts.map((account, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{account.accountCode}</TableCell>
                  <TableCell>{account.accountName}</TableCell>
                  <TableCell className="text-right">
                    {account.debit > 0 ? `$${account.debit.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {account.credit > 0 ? `$${account.credit.toLocaleString()}` : '-'}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t-2 font-bold">
                <TableCell>TOTALS</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">${totalDebits.toLocaleString()}</TableCell>
                <TableCell className="text-right">${totalCredits.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrialBalance;