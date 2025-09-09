import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, Edit, Trash2, Search, Filter, CalendarDays, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Holiday {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  type: 'public' | 'company' | 'religious' | 'national';
  description: string;
  isRecurring: boolean;
  createdAt: string;
}

const Holidays = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    type: 'public' as Holiday['type'],
    description: '',
    isRecurring: false
  });

  const [holidays] = useState<Holiday[]>([

  const filteredHolidays = useMemo(() => {
    return holidays.filter(holiday => {
      const matchesSearch = holiday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          holiday.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || holiday.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [holidays, searchTerm, typeFilter]);

  const upcomingHolidays = holidays.filter(holiday => new Date(holiday.startDate) > new Date()).length;
  const recurringHolidays = holidays.filter(holiday => holiday.isRecurring).length;

  const getTypeBadge = (type: Holiday['type']) => {
    const variants: { [key: string]: "default" | "destructive" | "outline" | "secondary" } = {
      public: 'default',
      company: 'secondary',
      religious: 'outline',
      national: 'destructive'
    };
    return variants[type];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHoliday) {
      toast.success('Holiday updated successfully!');
    } else {
      toast.success('Holiday added successfully!');
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      type: 'public',
      description: '',
      isRecurring: false
    });
    setEditingHoliday(null);
    setShowAddDialog(false);
  };

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setFormData({
      name: holiday.name,
      startDate: holiday.startDate,
      endDate: holiday.endDate,
      type: holiday.type,
      description: holiday.description,
      isRecurring: holiday.isRecurring
    });
    setShowAddDialog(true);
  };

  const handleDelete = (holidayId: number) => {
    toast.success('Holiday deleted successfully!');
  };

  return (
    <div className="p-6 space-y-6 animate-fadeInUp">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Holidays</h1>
          <p className="text-muted-foreground">Manage company holidays and observances</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Holiday
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Holiday Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value: Holiday['type']) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="religious">Religious</SelectItem>
                      <SelectItem value="national">National</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                />
                <Label htmlFor="isRecurring">Recurring Holiday</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground">
                  Cancel
                </Button>
                <Button type="submit" className="bg-save hover:bg-save-hover text-save-foreground">
                  {editingHoliday ? 'Update Holiday' : 'Add Holiday'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="animate-slideInLeft">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search holidays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="religious">Religious</SelectItem>
                <SelectItem value="national">National</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <CalendarDays className="w-6 h-6 text-blue-600 dark:text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Holidays</p>
                <p className="text-2xl font-bold">{filteredHolidays.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Calendar className="w-6 h-6 text-green-600 dark:text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">{upcomingHolidays}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recurring</p>
                <p className="text-2xl font-bold">{recurringHolidays}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <Filter className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Company Holidays</p>
                <p className="text-2xl font-bold">{holidays.filter(h => h.type === 'company').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holidays Table */}
      <Card className="animate-slideInLeft" style={{ animationDelay: '0.5s' }}>
        <CardHeader>
          <CardTitle>All Holidays</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-500 hover:bg-blue-500">
                <TableHead className="text-white font-semibold">Holiday Name</TableHead>
                <TableHead className="text-white font-semibold">Type</TableHead>
                <TableHead className="text-white font-semibold">Start Date</TableHead>
                <TableHead className="text-white font-semibold">End Date</TableHead>
                <TableHead className="text-white font-semibold">Recurring</TableHead>
                <TableHead className="text-white font-semibold">Description</TableHead>
                <TableHead className="text-white font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHolidays.map((holiday, index) => (
                <TableRow key={holiday.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.05}s` }}>
                  <TableCell className="font-medium">{holiday.name}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadge(holiday.type)}>
                      {holiday.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{holiday.startDate}</TableCell>
                  <TableCell>{holiday.endDate}</TableCell>
                  <TableCell>
                    <Badge variant={holiday.isRecurring ? 'default' : 'secondary'}>
                      {holiday.isRecurring ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{holiday.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(holiday)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Holiday</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{holiday.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(holiday.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredHolidays.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No holidays found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Holidays;