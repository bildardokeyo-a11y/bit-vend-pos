import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp, 
  Search, 
  Filter,
  Eye,
  Download,
  FileText,
  Archive,
  Calculator,
  CheckCircle
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface PayrollRecord {
  id: number;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  payPeriod: string;
  baseSalary: number;
  overtime: number;
  bonuses: number;
  deductions: number;
  grossPay: number;
  taxes: number;
  netPay: number;
  status: 'pending' | 'processed' | 'paid';
  payDate: string;
}

const Payroll = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const [payrollRecords] = useState<PayrollRecord[]>([
    {
      id: 1,
      employeeId: 'EMP-001',
      employeeName: 'John Smith',
      department: 'Sales',
      position: 'Sales Manager',
      payPeriod: 'January 2024',
      baseSalary: 6500.00,
      overtime: 450.00,
      bonuses: 1000.00,
      deductions: 125.00,
      grossPay: 7825.00,
      taxes: 1565.00,
      netPay: 6260.00,
      status: 'paid',
      payDate: '2024-01-31'
    },
    {
      id: 2,
      employeeId: 'EMP-002',
      employeeName: 'Sarah Johnson',
      department: 'Marketing',
      position: 'Marketing Specialist',
      payPeriod: 'January 2024',
      baseSalary: 4800.00,
      overtime: 200.00,
      bonuses: 0,
      deductions: 85.00,
      grossPay: 4915.00,
      taxes: 983.00,
      netPay: 3932.00,
      status: 'paid',
      payDate: '2024-01-31'
    },
    {
      id: 3,
      employeeId: 'EMP-003',
      employeeName: 'Mike Davis',
      department: 'IT',
      position: 'Software Developer',
      payPeriod: 'January 2024',
      baseSalary: 7200.00,
      overtime: 600.00,
      bonuses: 500.00,
      deductions: 150.00,
      grossPay: 8150.00,
      taxes: 1630.00,
      netPay: 6520.00,
      status: 'processed',
      payDate: '2024-02-01'
    },
    {
      id: 4,
      employeeId: 'EMP-004',
      employeeName: 'Lisa Wilson',
      department: 'HR',
      position: 'HR Manager',
      payPeriod: 'January 2024',
      baseSalary: 5800.00,
      overtime: 0,
      bonuses: 300.00,
      deductions: 100.00,
      grossPay: 6000.00,
      taxes: 1200.00,
      netPay: 4800.00,
      status: 'processed',
      payDate: '2024-02-01'
    },
    {
      id: 5,
      employeeId: 'EMP-005',
      employeeName: 'David Brown',
      department: 'Operations',
      position: 'Operations Manager',
      payPeriod: 'January 2024',
      baseSalary: 6200.00,
      overtime: 300.00,
      bonuses: 750.00,
      deductions: 110.00,
      grossPay: 7140.00,
      taxes: 1428.00,
      netPay: 5712.00,
      status: 'pending',
      payDate: '2024-02-05'
    }
  ]);

  const filteredPayroll = useMemo(() => {
    return payrollRecords.filter(record => {
      const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      const matchesDepartment = departmentFilter === 'all' || record.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [payrollRecords, searchTerm, statusFilter, departmentFilter]);

  const totalGrossPay = filteredPayroll.reduce((sum, record) => sum + record.grossPay, 0);
  const totalNetPay = filteredPayroll.reduce((sum, record) => sum + record.netPay, 0);
  const totalTaxes = filteredPayroll.reduce((sum, record) => sum + record.taxes, 0);
  const pendingPayments = payrollRecords.filter(record => record.status === 'pending').length;

  const departments = [...new Set(payrollRecords.map(record => record.department))];

  const getStatusBadge = (status: PayrollRecord['status']) => {
    const variants: { [key: string]: "default" | "destructive" | "outline" | "secondary" } = {
      pending: 'outline',
      processed: 'secondary',
      paid: 'default'
    };
    const colors = {
      pending: 'text-yellow-600',
      processed: 'text-blue-600',
      paid: 'text-green-600'
    };
    return { variant: variants[status], color: colors[status] };
  };

  const handleViewDetails = (record: PayrollRecord) => {
    setSelectedPayroll(record);
    setShowModal(true);
  };

  const handleExportPDF = () => {
    console.log('Exporting Payroll as PDF...');
  };

  const handleExportXLS = () => {
    console.log('Exporting Payroll as XLS...');
  };

  const handleExportAllZIP = () => {
    console.log('Exporting all payroll records as ZIP...');
  };

  const handleGeneratePayslip = () => {
    setShowPayslipModal(true);
  };

  const handleEmployeeSelect = (employeeId: string, checked: boolean) => {
    setSelectedEmployees(prev => 
      checked 
        ? [...prev, employeeId]
        : prev.filter(id => id !== employeeId)
    );
  };

  const generatePayslipPDF = (employee: PayrollRecord) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;
    
    // Company Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('COMPANY PAYSLIP', pageWidth / 2, 30, { align: 'center' });
    
    // Company Info
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text('ABC Corporation Ltd.', pageWidth / 2, 40, { align: 'center' });
    pdf.text('123 Business Street, City, State 12345', pageWidth / 2, 45, { align: 'center' });
    pdf.text('Phone: (555) 123-4567 | Email: hr@company.com', pageWidth / 2, 50, { align: 'center' });
    
    // Header border
    pdf.rect(margin, 15, pageWidth - 2 * margin, 45);
    
    // Employee Information Section
    let yPosition = 75;
    
    // Employee Info Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('EMPLOYEE INFORMATION', margin, yPosition);
    pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8);
    
    yPosition += 15;
    
    // Employee details in two columns
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    
    const leftColumn = margin + 5;
    const rightColumn = pageWidth / 2 + 10;
    
    pdf.text(`Employee ID: ${employee.employeeId}`, leftColumn, yPosition);
    pdf.text(`Pay Period: ${employee.payPeriod}`, rightColumn, yPosition);
    yPosition += 8;
    
    pdf.text(`Name: ${employee.employeeName}`, leftColumn, yPosition);
    pdf.text(`Pay Date: ${employee.payDate}`, rightColumn, yPosition);
    yPosition += 8;
    
    pdf.text(`Department: ${employee.department}`, leftColumn, yPosition);
    pdf.text(`Position: ${employee.position}`, rightColumn, yPosition);
    yPosition += 15;
    
    // Employee info border
    pdf.rect(margin, 70, pageWidth - 2 * margin, 40);
    
    // Payment Details Section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('PAYMENT BREAKDOWN', margin, yPosition);
    pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8);
    
    yPosition += 15;
    
    // Payment table headers
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('EARNINGS', margin + 5, yPosition);
    pdf.text('AMOUNT', pageWidth / 2 - 20, yPosition);
    pdf.text('DEDUCTIONS', pageWidth / 2 + 20, yPosition);
    pdf.text('AMOUNT', pageWidth - 40, yPosition);
    
    // Header line
    pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
    yPosition += 10;
    
    // Earnings column
    pdf.setFont('helvetica', 'normal');
    pdf.text('Base Salary', margin + 5, yPosition);
    pdf.text(`$${employee.baseSalary.toLocaleString()}`, pageWidth / 2 - 20, yPosition, { align: 'right' });
    
    // Deductions column
    pdf.text('Income Tax', pageWidth / 2 + 20, yPosition);
    pdf.text(`$${employee.taxes.toLocaleString()}`, pageWidth - 40, yPosition, { align: 'right' });
    yPosition += 8;
    
    pdf.text('Overtime', margin + 5, yPosition);
    pdf.text(`$${employee.overtime.toLocaleString()}`, pageWidth / 2 - 20, yPosition, { align: 'right' });
    
    pdf.text('Other Deductions', pageWidth / 2 + 20, yPosition);
    pdf.text(`$${employee.deductions.toLocaleString()}`, pageWidth - 40, yPosition, { align: 'right' });
    yPosition += 8;
    
    pdf.text('Bonuses', margin + 5, yPosition);
    pdf.text(`$${employee.bonuses.toLocaleString()}`, pageWidth / 2 - 20, yPosition, { align: 'right' });
    yPosition += 15;
    
    // Totals line
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;
    
    // Gross Pay
    pdf.setFont('helvetica', 'bold');
    pdf.text('GROSS PAY', margin + 5, yPosition);
    pdf.text(`$${employee.grossPay.toLocaleString()}`, pageWidth / 2 - 20, yPosition, { align: 'right' });
    
    pdf.text('TOTAL DEDUCTIONS', pageWidth / 2 + 20, yPosition);
    pdf.text(`$${(employee.taxes + employee.deductions).toLocaleString()}`, pageWidth - 40, yPosition, { align: 'right' });
    yPosition += 15;
    
    // Payment details border
    pdf.rect(margin, 115, pageWidth - 2 * margin, 70);
    
    // Vertical separator for earnings/deductions
    pdf.line(pageWidth / 2, 125, pageWidth / 2, 185);
    
    // Net Pay Section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 15);
    pdf.text('NET PAY', margin + 5, yPosition + 10);
    pdf.text(`$${employee.netPay.toLocaleString()}`, pageWidth - margin - 5, yPosition + 10, { align: 'right' });
    
    yPosition += 30;
    
    // Status badge
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Status: ${employee.status.toUpperCase()}`, margin + 5, yPosition);
    
    // Footer
    yPosition = pageHeight - 30;
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.text('This is a computer-generated payslip. No signature required.', pageWidth / 2, yPosition, { align: 'center' });
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition + 8, { align: 'center' });
    
    return pdf;
  };

  const handleGenerateSelectedPayslips = () => {
    if (selectedEmployees.length === 0) return;
    
    const selectedRecords = payrollRecords.filter(record => 
      selectedEmployees.includes(record.employeeId)
    );
    
    // Generate and download PDF for each selected employee
    selectedRecords.forEach((record) => {
      const pdf = generatePayslipPDF(record);
      pdf.save(`payslip-${record.employeeId}-${record.payPeriod.replace(' ', '-')}.pdf`);
    });
    
    setShowPayslipModal(false);
    setSelectedEmployees([]);
  };

  return (
    <div className="p-6 space-y-6 animate-fadeInUp">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">Manage employee payroll and compensation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGeneratePayslip}>
            <FileText className="w-4 h-4 mr-2" />
            Generate Payslip
          </Button>
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

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processed">Processed</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Gross Pay</p>
                <p className="text-2xl font-bold">${totalGrossPay.toLocaleString()}</p>
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
                <p className="text-sm text-muted-foreground">Total Net Pay</p>
                <p className="text-2xl font-bold">${totalNetPay.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                <Calculator className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Taxes</p>
                <p className="text-2xl font-bold">${totalTaxes.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold">{pendingPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card className="animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle>Payroll Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Pay Period</TableHead>
                <TableHead className="text-right">Gross Pay</TableHead>
                <TableHead className="text-right">Taxes</TableHead>
                <TableHead className="text-right">Net Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pay Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayroll.map((record) => {
                const statusBadge = getStatusBadge(record.status);
                return (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{record.employeeName}</p>
                        <p className="text-sm text-muted-foreground">{record.employeeId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.payPeriod}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${record.grossPay.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ${record.taxes.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${record.netPay.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadge.variant} className={statusBadge.color}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.payDate}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(record)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filteredPayroll.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No payroll records found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payroll Detail Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payroll Details - {selectedPayroll?.employeeName}</DialogTitle>
          </DialogHeader>
          {selectedPayroll && (
            <div className="space-y-6">
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
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Employee Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Employee ID:</span>
                      <span className="font-medium">{selectedPayroll.employeeId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span className="font-medium">{selectedPayroll.employeeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Department:</span>
                      <span className="font-medium">{selectedPayroll.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Position:</span>
                      <span className="font-medium">{selectedPayroll.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pay Period:</span>
                      <span className="font-medium">{selectedPayroll.payPeriod}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Payment Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Salary:</span>
                      <span className="font-medium">${selectedPayroll.baseSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overtime:</span>
                      <span className="font-medium">${selectedPayroll.overtime.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bonuses:</span>
                      <span className="font-medium">${selectedPayroll.bonuses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deductions:</span>
                      <span className="font-medium text-red-600">-${selectedPayroll.deductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Gross Pay:</span>
                      <span className="font-semibold">${selectedPayroll.grossPay.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes:</span>
                      <span className="font-medium text-red-600">-${selectedPayroll.taxes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold text-lg">Net Pay:</span>
                      <span className="font-semibold text-lg text-green-600">${selectedPayroll.netPay.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-muted-foreground">Status: </span>
                    <Badge variant={getStatusBadge(selectedPayroll.status).variant}>
                      {selectedPayroll.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Pay Date: </span>
                    <span className="font-medium">{selectedPayroll.payDate}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Generate Payslip Modal */}
      <Dialog open={showPayslipModal} onOpenChange={setShowPayslipModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Payslip</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">Select employees to generate payslips for:</p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {payrollRecords.map((record) => (
                <div key={record.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    checked={selectedEmployees.includes(record.employeeId)}
                    onCheckedChange={(checked) => 
                      handleEmployeeSelect(record.employeeId, checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{record.employeeName}</p>
                        <p className="text-sm text-muted-foreground">{record.employeeId} - {record.department}</p>
                        <p className="text-sm text-muted-foreground">{record.position}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${record.netPay.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{record.payPeriod}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {selectedEmployees.length} employee(s) selected
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPayslipModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerateSelectedPayslips}
                  disabled={selectedEmployees.length === 0}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Generate Payslips ({selectedEmployees.length})
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payroll;