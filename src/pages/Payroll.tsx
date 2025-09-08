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
import { useBusiness } from '@/contexts/BusinessContext';
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
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  
  const { currentBusiness } = useBusiness();

  const [payrollRecords] = useState<PayrollRecord[]>([]);

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

  // Filter employees for payslip modal
  const filteredEmployeesForPayslip = useMemo(() => {
    return payrollRecords.filter(record =>
      record.employeeName.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(employeeSearchTerm.toLowerCase())
    );
  }, [payrollRecords, employeeSearchTerm]);

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
    setEmployeeSearchTerm(''); // Reset search when opening modal
    setSelectedEmployees([]); // Reset selections
  };

  const handleEmployeeSelect = (employeeId: string, checked: boolean) => {
    setSelectedEmployees(prev => 
      checked 
        ? [...prev, employeeId]
        : prev.filter(id => id !== employeeId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(filteredEmployeesForPayslip.map(record => record.employeeId));
    } else {
      setSelectedEmployees([]);
    }
  };

  const isAllSelected = filteredEmployeesForPayslip.length > 0 && 
    filteredEmployeesForPayslip.every(record => selectedEmployees.includes(record.employeeId));
  
  const isSomeSelected = selectedEmployees.length > 0 && !isAllSelected;

  const generatePayslipPDF = (employee: PayrollRecord) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 15;
    
    // Get company information
    const companyName = currentBusiness?.businessName || 'Company Name';
    const companyAddress = currentBusiness?.address ? 
      `${currentBusiness.address}, ${currentBusiness.city}, ${currentBusiness.state} ${currentBusiness.postalCode}` : 
      'Company Address';
    const companyPhone = currentBusiness?.phone || 'Company Phone';
    const companyEmail = currentBusiness?.email || 'company@email.com';
    
    // Company Header Section
    pdf.setFillColor(240, 240, 240);
    pdf.rect(0, 0, pageWidth, 60, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(0, 0, 0);
    pdf.text('PAYSLIP', pageWidth / 2, 25, { align: 'center' });
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text(companyName, pageWidth / 2, 35, { align: 'center' });
    
    pdf.setFontSize(9);
    pdf.text(companyAddress, pageWidth / 2, 42, { align: 'center' });
    pdf.text(`Phone: ${companyPhone} | Email: ${companyEmail}`, pageWidth / 2, 48, { align: 'center' });
    
    // Header border
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.rect(margin, 10, pageWidth - 2 * margin, 45);
    
    let yPosition = 70;
    
    // Employee Information Section
    pdf.setFillColor(250, 250, 250);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('EMPLOYEE INFORMATION', margin + 3, yPosition + 8);
    
    // Border for section header
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 12);
    
    yPosition += 18;
    
    // Employee details in organized layout
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    
    const leftColumn = margin + 5;
    const rightColumn = pageWidth / 2 + 5;
    const lineHeight = 6;
    
    // Left column
    pdf.text(`Employee ID: ${employee.employeeId}`, leftColumn, yPosition);
    pdf.text(`Name: ${employee.employeeName}`, leftColumn, yPosition + lineHeight);
    pdf.text(`Department: ${employee.department}`, leftColumn, yPosition + lineHeight * 2);
    
    // Right column
    pdf.text(`Pay Period: ${employee.payPeriod}`, rightColumn, yPosition);
    pdf.text(`Pay Date: ${employee.payDate}`, rightColumn, yPosition + lineHeight);
    pdf.text(`Position: ${employee.position}`, rightColumn, yPosition + lineHeight * 2);
    
    // Employee info section border
    pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 25);
    
    yPosition += 35;
    
    // Payment Details Section Header
    pdf.setFillColor(250, 250, 250);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('PAYMENT BREAKDOWN', margin + 3, yPosition + 8);
    
    // Border for section header
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 12);
    
    yPosition += 18;
    
    // Payment table
    const tableStartY = yPosition;
    const colWidth = (pageWidth - 2 * margin) / 4;
    
    // Table headers
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPosition, colWidth * 2, 10, 'F');
    pdf.rect(margin + colWidth * 2, yPosition, colWidth * 2, 10, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('EARNINGS', margin + 5, yPosition + 7);
    pdf.text('AMOUNT', margin + colWidth - 5, yPosition + 7, { align: 'right' });
    pdf.text('DEDUCTIONS', margin + colWidth * 2 + 5, yPosition + 7);
    pdf.text('AMOUNT', margin + colWidth * 4 - 5, yPosition + 7, { align: 'right' });
    
    // Table borders
    pdf.rect(margin, yPosition, colWidth * 4, 10);
    pdf.line(margin + colWidth, yPosition, margin + colWidth, yPosition + 10);
    pdf.line(margin + colWidth * 2, yPosition, margin + colWidth * 2, yPosition + 10);
    pdf.line(margin + colWidth * 3, yPosition, margin + colWidth * 3, yPosition + 10);
    
    yPosition += 15;
    
    // Payment details rows
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    
    const earnings = [
      { label: 'Base Salary', amount: employee.baseSalary },
      { label: 'Overtime', amount: employee.overtime },
      { label: 'Bonuses', amount: employee.bonuses }
    ];
    
    const deductions = [
      { label: 'Income Tax', amount: employee.taxes },
      { label: 'Other Deductions', amount: employee.deductions }
    ];
    
    const maxRows = Math.max(earnings.length, deductions.length);
    
    for (let i = 0; i < maxRows; i++) {
      const rowY = yPosition + (i * 8);
      
      // Earnings column
      if (earnings[i]) {
        pdf.text(earnings[i].label, margin + 5, rowY);
        pdf.text(`$${earnings[i].amount.toLocaleString()}`, margin + colWidth - 5, rowY, { align: 'right' });
      }
      
      // Deductions column
      if (deductions[i]) {
        pdf.text(deductions[i].label, margin + colWidth * 2 + 5, rowY);
        pdf.text(`$${deductions[i].amount.toLocaleString()}`, margin + colWidth * 4 - 5, rowY, { align: 'right' });
      }
      
      // Row borders
      pdf.rect(margin, rowY - 4, colWidth * 4, 8);
      pdf.line(margin + colWidth, rowY - 4, margin + colWidth, rowY + 4);
      pdf.line(margin + colWidth * 2, rowY - 4, margin + colWidth * 2, rowY + 4);
      pdf.line(margin + colWidth * 3, rowY - 4, margin + colWidth * 3, rowY + 4);
    }
    
    yPosition += (maxRows * 8) + 10;
    
    // Totals section
    pdf.setFillColor(230, 230, 230);
    pdf.rect(margin, yPosition, colWidth * 4, 12, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('GROSS PAY', margin + 5, yPosition + 8);
    pdf.text(`$${employee.grossPay.toLocaleString()}`, margin + colWidth - 5, yPosition + 8, { align: 'right' });
    
    pdf.text('TOTAL DEDUCTIONS', margin + colWidth * 2 + 5, yPosition + 8);
    pdf.text(`$${(employee.taxes + employee.deductions).toLocaleString()}`, margin + colWidth * 4 - 5, yPosition + 8, { align: 'right' });
    
    // Totals borders
    pdf.rect(margin, yPosition, colWidth * 4, 12);
    pdf.line(margin + colWidth, yPosition, margin + colWidth, yPosition + 12);
    pdf.line(margin + colWidth * 2, yPosition, margin + colWidth * 2, yPosition + 12);
    pdf.line(margin + colWidth * 3, yPosition, margin + colWidth * 3, yPosition + 12);
    
    yPosition += 20;
    
    // Net Pay Section
    pdf.setFillColor(200, 230, 200);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 15, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('NET PAY', margin + 10, yPosition + 10);
    pdf.text(`$${employee.netPay.toLocaleString()}`, pageWidth - margin - 10, yPosition + 10, { align: 'right' });
    
    // Net pay border
    pdf.setLineWidth(1);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 15);
    
    yPosition += 25;
    
    // Status information
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(`Payment Status: ${employee.status.toUpperCase()}`, margin + 5, yPosition);
    
    // Footer
    yPosition = pageHeight - 25;
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.text('This is a computer-generated payslip. No signature required.', pageWidth / 2, yPosition, { align: 'center' });
    pdf.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth / 2, yPosition + 6, { align: 'center' });
    
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
              <TableRow className="bg-blue-500 hover:bg-blue-500">
                <TableHead className="text-white font-semibold">Employee</TableHead>
                <TableHead className="text-white font-semibold">Department</TableHead>
                <TableHead className="text-white font-semibold">Pay Period</TableHead>
                <TableHead className="text-white font-semibold text-right">Gross Pay</TableHead>
                <TableHead className="text-white font-semibold text-right">Taxes</TableHead>
                <TableHead className="text-white font-semibold text-right">Net Pay</TableHead>
                <TableHead className="text-white font-semibold">Status</TableHead>
                <TableHead className="text-white font-semibold">Pay Date</TableHead>
                <TableHead className="text-white font-semibold">Actions</TableHead>
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
            
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search employees..."
                value={employeeSearchTerm}
                onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Select All Checkbox */}
            <div className="flex items-center space-x-3 p-3 border rounded-lg bg-muted/20">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
              />
              <div className="flex-1">
                <p className="font-medium">
                  {isAllSelected ? 'Deselect All' : 'Select All'} 
                  {filteredEmployeesForPayslip.length > 0 && ` (${filteredEmployeesForPayslip.length} employees)`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedEmployees.length > 0 
                    ? `${selectedEmployees.length} employee(s) selected`
                    : 'No employees selected'
                  }
                </p>
              </div>
            </div>

            {/* Employee List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredEmployeesForPayslip.length > 0 ? (
                filteredEmployeesForPayslip.map((record) => (
                  <div key={record.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
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
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No employees found matching your search.</p>
                </div>
              )}
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