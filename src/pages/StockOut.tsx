import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Package, FileDown } from 'lucide-react';
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

interface StockOutItem {
  id: string;
  referenceNo: string;
  product: string;
  quantity: number;
  reason: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  notes?: string;
}

const StockOut = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockOutItem | null>(null);
  const [formData, setFormData] = useState({
    referenceNo: '',
    product: '',
    quantity: '',
    reason: '',
    notes: ''
  });

  const [stockOutItems] = useState<StockOutItem[]>([
    {
      id: '1',
      referenceNo: 'SO-001',
      product: 'Laptop Dell XPS 13',
      quantity: 2,
      reason: 'Damaged',
      date: '2024-01-15',
      status: 'completed',
      notes: 'Water damage during transport'
    },
    {
      id: '2',
      referenceNo: 'SO-002',
      product: 'iPhone 15 Pro',
      quantity: 1,
      reason: 'Expired',
      date: '2024-01-14',
      status: 'pending'
    },
    {
      id: '3',
      referenceNo: 'SO-003',
      product: 'Samsung Monitor',
      quantity: 3,
      reason: 'Theft',
      date: '2024-01-13',
      status: 'completed'
    }
  ]);

  const filteredItems = useMemo(() => {
    return stockOutItems.filter(item =>
      item.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stockOutItems, searchTerm]);

  const handleSubmit = () => {
    if (!formData.product || !formData.quantity || !formData.reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: editingItem ? "Stock Out Updated" : "Stock Out Created",
      description: `Stock out entry has been ${editingItem ? 'updated' : 'created'} successfully`,
    });

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      referenceNo: '',
      product: '',
      quantity: '',
      reason: '',
      notes: ''
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: StockOutItem) => {
    setEditingItem(item);
    setFormData({
      referenceNo: item.referenceNo,
      product: item.product,
      quantity: item.quantity.toString(),
      reason: item.reason,
      notes: item.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    toast({
      title: "Stock Out Deleted",
      description: "Stock out entry has been deleted successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fadeInUp">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Out</h1>
          <p className="text-muted-foreground">Manage outbound stock movements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Stock Out
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Add'} Stock Out</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="referenceNo">Reference No</Label>
                <Input
                  id="referenceNo"
                  value={formData.referenceNo}
                  onChange={(e) => setFormData({...formData, referenceNo: e.target.value})}
                  placeholder="SO-001"
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
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Select value={formData.reason} onValueChange={(value) => setFormData({...formData, reason: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Damaged">Damaged</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Theft">Theft</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                    <SelectItem value="Return">Return</SelectItem>
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
                  {editingItem ? 'Update' : 'Create'}
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
            placeholder="Search stock out entries..."
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
            <CardTitle className="text-sm font-medium">Total Out</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Total items moved out</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Completed transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Stock out this month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Out History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.referenceNo}</TableCell>
                  <TableCell>{item.product}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
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
                            <AlertDialogTitle>Delete Stock Out</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this stock out entry? This action cannot be undone.
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

export default StockOut;