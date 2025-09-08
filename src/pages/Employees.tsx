import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FeatureGate } from '@/components/FeatureGate';
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  UserCheck,
  Phone,
  Mail,
  Building,
  Calendar
} from 'lucide-react';
import { toast } from "sonner";
import { useSEO } from '@/lib/seo';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  employeeId: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on_leave';
  workType: 'full_time' | 'part_time' | 'contract';
  manager: string;
  createdAt: string;
}

const Employees = () => {
  return (
    <FeatureGate feature="multi_user_accounts">
      <EmployeesContent />
    </FeatureGate>
  );
};

const EmployeesContent = () => {
  useSEO('Employee Management - Manage Employee Records', 'Manage employee records, information, and track employee details and performance.');

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: 0,
    employeeId: '',
    hireDate: '',
    status: 'active' as Employee['status'],
    workType: 'full_time' as Employee['workType'],
    manager: ''
  });

  const [employees, setEmployees] = useState<Employee[]>([
    // Employees will be loaded from database
  ]);

  const filteredEmployees = employees.filter(employee =>
    `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEmployee) {
      setEmployees(prev => prev.map(employee =>
        employee.id === editingEmployee.id
          ? { ...employee, ...formData }
          : employee
      ));
      toast.success('Employee updated successfully!');
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      setEmployees(prev => [...prev, newEmployee]);
      toast.success('Employee created successfully!');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      salary: employee.salary,
      employeeId: employee.employeeId,
      hireDate: employee.hireDate,
      status: employee.status,
      workType: employee.workType,
      manager: employee.manager
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setEmployees(prev => prev.filter(employee => employee.id !== id));
      toast.success('Employee deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      salary: 0,
      employeeId: '',
      hireDate: '',
      status: 'active',
      workType: 'full_time',
      manager: ''
    });
    setEditingEmployee(null);
  };

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const fullTimeEmployees = employees.filter(e => e.workType === 'full_time').length;
  const totalSalaryBudget = employees
    .filter(e => e.workType === 'full_time' || e.workType === 'contract')
    .reduce((sum, e) => sum + e.salary, 0);

  return (
    <div className="space-y-6 p-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Employee Management</h1>
            <p className="text-muted-foreground">Manage employee records and information</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 transition-all duration-200 hover:scale-105" onClick={() => resetForm()}>
              <Plus size={16} />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@company.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 555-0123"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeId">Employee ID *</Label>
                  <Input
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                    placeholder="EMP001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hireDate">Hire Date *</Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, hireDate: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="Sales Associate"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <select
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Operations">Operations</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">Human Resources</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary">Salary/Hourly Rate *</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: Number(e.target.value) }))}
                    placeholder="50000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="workType">Work Type</Label>
                  <select
                    id="workType"
                    value={formData.workType}
                    onChange={(e) => setFormData(prev => ({ ...prev, workType: e.target.value as Employee['workType'] }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manager">Manager</Label>
                  <Input
                    id="manager"
                    value={formData.manager}
                    onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                    placeholder="Manager Name"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Employee['status'] }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground">
                  Cancel
                </Button>
                <Button type="submit" className="bg-save hover:bg-save-hover text-save-foreground">
                  {editingEmployee ? 'Update' : 'Create'} Employee
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeEmployees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Full Time</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fullTimeEmployees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Salary Budget</CardTitle>
            <Calendar className="h-4 w-4 text-primary dark:text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSalaryBudget.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="animate-slideInLeft">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees by name, ID, position, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Employees List */}
      <div className="grid gap-4">
        {filteredEmployees.map((employee, index) => (
          <Card key={employee.id} className="hover:shadow-md transition-shadow animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{employee.firstName} {employee.lastName}</h3>
                    <p className="text-sm text-muted-foreground">{employee.employeeId} • {employee.position}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge 
                      variant={
                        employee.status === 'active' ? 'default' : 
                        employee.status === 'on_leave' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {employee.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {employee.workType.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    ${employee.salary.toLocaleString()}
                    {employee.workType === 'part_time' && '/hr'}
                  </p>
                  <p className="text-sm text-muted-foreground">{employee.department}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{employee.email}</p>
                    <p className="text-xs text-muted-foreground">Email</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{employee.phone || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Phone</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-foreground dark:text-white" />
                  <div>
                    <p className="text-sm font-medium">{new Date(employee.hireDate).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">Hire Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{employee.manager !== 'N/A' ? employee.manager : 'No Manager'}</p>
                    <p className="text-xs text-muted-foreground">Manager</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(employee)}>
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(employee.id)}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Employees Found</h3>
            <p className="text-muted-foreground">No employees match your current search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Employees;