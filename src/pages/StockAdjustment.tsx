import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Layers, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface StockAdjustment {
  id: string;
  referenceNo: string;
  product: string;
  currentStock: number;
  adjustedStock: number;
  adjustmentType: 'increase' | 'decrease';
  reason: string;
  date: string;
  status: 'approved' | 'pending' | 'cancelled';
  notes?: string;
}

const StockAdjustment = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdjustment, setEditingAdjustment] = useState<StockAdjustment | null>(null);
  const [formData, setFormData] = useState({
    referenceNo: '',
    product: '',
    currentStock: '',
    adjustedStock: '',
    adjustmentType: '',
    reason: '',
    notes: ''
  });

  const [adjustments] = useState<StockAdjustment[]>([
    {
      id: '1',
      referenceNo: 'SA-001',
      product: 'Laptop Dell XPS 13',
      currentStock: 50,
      adjustedStock: 48,
      adjustmentType: 'decrease',
      reason: 'Physical Count Variance',
      date: '2024-01-15',
      status: 'approved',
      notes: 'Two units missing during inventory count'
    },
    {
      id: '2',
      referenceNo: 'SA-002',
      product: 'iPhone 15 Pro',
      currentStock: 25,
      adjustedStock: 30,
      adjustmentType: 'increase',
      reason: 'Found Inventory',
      date: '2024-01-14',
      status: 'pending'
    },
    {
      id: '3',
      referenceNo: 'SA-003',
      product: 'Samsung Monitor',
      currentStock: 15,
      adjustedStock: 12,
      adjustmentType: 'decrease',
      reason: 'Damaged Goods',
      date: '2024-01-13',
      status: 'approved'
    }
  ]);

  const filteredAdjustments = useMemo(() => {
    return adjustments.filter(adjustment =>
      adjustment.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [adjustments, searchTerm]);

  const handleSubmit = () => {
    if (!formData.product || !formData.currentStock || !formData.adjustedStock || !formData.reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const current = parseInt(formData.currentStock);
    const adjusted = parseInt(formData.adjustedStock);
    
    if (current === adjusted) {
      toast({
        title: "Error",
        description: "Adjusted stock cannot be the same as current stock",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: editingAdjustment ? "Adjustment Updated" : "Adjustment Created",
      description: `Stock adjustment has been ${editingAdjustment ? 'updated' : 'created'} successfully`,
    });

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      referenceNo: '',
      product: '',
      currentStock: '',
      adjustedStock: '',
      adjustmentType: '',
      reason: '',
      notes: ''
    });
    setEditingAdjustment(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (adjustment: StockAdjustment) => {
    setEditingAdjustment(adjustment);
    setFormData({
      referenceNo: adjustment.referenceNo,
      product: adjustment.product,
      currentStock: adjustment.currentStock.toString(),
      adjustedStock: adjustment.adjustedStock.toString(),
      adjustmentType: adjustment.adjustmentType,
      reason: adjustment.reason,
      notes: adjustment.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    toast({
      title: "Adjustment Deleted",
      description: "Stock adjustment has been deleted successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAdjustmentTypeColor = (type: string) => {
    return type === 'increase' ? 'bg-green-500' : 'bg-red-500';
  };

  // Auto-calculate adjustment type based on stock values
  React.useEffect(() => {
    if (formData.currentStock && formData.adjustedStock) {
      const current = parseInt(formData.currentStock);
      const adjusted = parseInt(formData.adjustedStock);
      const type = adjusted > current ? 'increase' : 'decrease';
      if (formData.adjustmentType !== type) {
        setFormData(prev => ({ ...prev, adjustmentType: type }));
      }
    }
  }, [formData.currentStock, formData.adjustedStock]);

  return (
    <div className="p-6 space-y-6 animate-fadeInUp">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Adjustment</h1>
          <p className="text-muted-foreground">Manage inventory stock corrections</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAdjustment(null)}>
              <Plus className="h-4 w-4 mr-2" />
              New Adjustment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingAdjustment ? 'Edit' : 'Create'} Stock Adjustment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="referenceNo">Reference No</Label>
                <Input
                  id="referenceNo"
                  value={formData.referenceNo}
                  onChange={(e) => setFormData({...formData, referenceNo: e.target.value})}
                  placeholder="SA-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product">Product *</Label>
                <Select value={formData.product} onValueChange={(value) => setFormData({...formData, product: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laptop Dell XPS 13">Laptop Dell XPS 13</SelectItem>
                    <SelectItem value="iPhone 15 Pro">iPhone 15 Pro</SelectItem>
                    <SelectItem value="Samsung Monitor">Samsung Monitor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentStock">Current Stock *</Label>
                  <Input
                    id="currentStock"
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({...formData, currentStock: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adjustedStock">Adjusted Stock *</Label>
                  <Input
                    id="adjustedStock"
                    type="number"
                    value={formData.adjustedStock}
                    onChange={(e) => setFormData({...formData, adjustedStock: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
              {formData.adjustmentType && (
                <div className="space-y-2">
                  <Label>Adjustment Type</Label>
                  <Badge className={getAdjustmentTypeColor(formData.adjustmentType)}>
                    {formData.adjustmentType} ({Math.abs(parseInt(formData.adjustedStock || '0') - parseInt(formData.currentStock || '0'))})
                  </Badge>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Select value={formData.reason} onValueChange={(value) => setFormData({...formData, reason: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Physical Count Variance">Physical Count Variance</SelectItem>
                    <SelectItem value="Damaged Goods">Damaged Goods</SelectItem>
                    <SelectItem value="Found Inventory">Found Inventory</SelectItem>
                    <SelectItem value="System Error">System Error</SelectItem>
                    <SelectItem value="Theft">Theft</SelectItem>
                    <SelectItem value="Expiry">Expiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1">
                  {editingAdjustment ? 'Update' : 'Create'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search adjustments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <FileDown className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Adjustments</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Total adjustments made</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Increases</CardTitle>
            <Layers className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+5</div>
            <p className="text-xs text-muted-foreground">Stock increases</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Decreases</CardTitle>
            <Layers className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-5</div>
            <p className="text-xs text-muted-foreground">Stock decreases</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Layers className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Adjustments this month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adjustment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>Adjusted</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdjustments.map((adjustment) => (
                <TableRow key={adjustment.id}>
                  <TableCell className="font-medium">{adjustment.referenceNo}</TableCell>
                  <TableCell>{adjustment.product}</TableCell>
                  <TableCell>{adjustment.currentStock}</TableCell>
                  <TableCell>{adjustment.adjustedStock}</TableCell>
                  <TableCell>
                    <Badge className={getAdjustmentTypeColor(adjustment.adjustmentType)}>
                      {adjustment.adjustmentType} ({Math.abs(adjustment.adjustedStock - adjustment.currentStock)})
                    </Badge>
                  </TableCell>
                  <TableCell>{adjustment.reason}</TableCell>
                  <TableCell>{adjustment.date}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(adjustment.status)}>
                      {adjustment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(adjustment)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Adjustment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this adjustment? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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

export default StockAdjustment;