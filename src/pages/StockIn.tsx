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
import { PRODUCTS } from '@/data/posData';
import { 
  Package, 
  Plus, 
  Trash2, 
  Search,
  Save,
  FileText,
  Calendar,
  Truck,
  User,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface StockInItem {
  id: string;
  productId: number;
  productName: string;
  sku: string;
  currentStock: number;
  receivedQty: number;
  unitCost: number;
  totalCost: number;
  expiryDate?: string;
  batchNo?: string;
}

interface StockInTransaction {
  id: string;
  referenceNo: string;
  supplierName: string;
  receivedDate: string;
  totalItems: number;
  totalAmount: number;
  status: 'pending' | 'received' | 'partial';
  notes?: string;
  items: StockInItem[];
  addedBy: string;
  addedAt: string;
}

const StockIn: React.FC = () => {
  const { toast } = useToast();
  const [stockInItems, setStockInItems] = useState<StockInItem[]>([]);
  const [formData, setFormData] = useState({
    referenceNo: `SI-${Date.now()}`,
    supplierName: '',
    receivedDate: new Date().toISOString().split('T')[0],
    notes: '',
    addedBy: 'Current User' // In a real app, this would come from authentication
  });

  // Sample stock in history
  const [stockInHistory] = useState<StockInTransaction[]>([
    {
      id: '1',
      referenceNo: 'SI-001',
      supplierName: 'ABC Suppliers Ltd',
      receivedDate: '2024-01-15',
      totalItems: 25,
      totalAmount: 1250.00,
      status: 'received',
      notes: 'Monthly inventory replenishment',
      items: [],
      addedBy: 'Alice Johnson',
      addedAt: '2024-01-15T09:30:00'
    },
    {
      id: '2',
      referenceNo: 'SI-002',
      supplierName: 'Global Trade Inc',
      receivedDate: '2024-01-14',
      totalItems: 15,
      totalAmount: 890.50,
      status: 'pending',
      notes: 'Urgent restock for high-demand items',
      items: [],
      addedBy: 'Bob Smith',
      addedAt: '2024-01-14T14:45:00'
    },
    {
      id: '3',
      referenceNo: 'SI-003',
      supplierName: 'Premium Wholesale Co',
      receivedDate: '2024-01-13',
      totalItems: 32,
      totalAmount: 1680.75,
      status: 'received',
      notes: 'Bulk order for seasonal items',
      items: [],
      addedBy: 'Carol Wilson',
      addedAt: '2024-01-13T11:20:00'
    }
  ]);

  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');

  const handleAddProduct = () => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product first",
        variant: "destructive",
      });
      return;
    }

    const product = PRODUCTS.find(p => p.id.toString() === selectedProduct);
    if (!product) return;

    const existingItem = stockInItems.find(item => item.productId === product.id);
    if (existingItem) {
      toast({
        title: "Product Already Added",
        description: "This product is already in the stock in list",
        variant: "destructive",
      });
      return;
    }

    const newItem: StockInItem = {
      id: `item-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      sku: `SKU-${product.id}`,
      currentStock: 0,
      receivedQty: 1,
      unitCost: product.price,
      totalCost: product.price,
      batchNo: '',
      expiryDate: ''
    };

    setStockInItems([...stockInItems, newItem]);
    setSelectedProduct('');
    toast({
      title: "Product Added",
      description: `${product.name} has been added to stock in`,
    });
  };

  const handleUpdateItem = (id: string, field: keyof StockInItem, value: any) => {
    setStockInItems(items =>
      items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'receivedQty' || field === 'unitCost') {
            updatedItem.totalCost = updatedItem.receivedQty * updatedItem.unitCost;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setStockInItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "Product has been removed from stock in",
    });
  };

  const handleSaveStockIn = () => {
    if (!formData.supplierName.trim()) {
      toast({
        title: "Error",
        description: "Please enter supplier name",
        variant: "destructive",
      });
      return;
    }

    if (stockInItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Stock In Saved",
      description: `Stock in transaction ${formData.referenceNo} has been saved successfully`,
    });

    // Reset form
    setStockInItems([]);
    setFormData({
      referenceNo: `SI-${Date.now()}`,
      supplierName: '',
      receivedDate: new Date().toISOString().split('T')[0],
      notes: '',
      addedBy: 'Current User'
    });
  };

  const totalAmount = stockInItems.reduce((sum, item) => sum + item.totalCost, 0);
  const totalItems = stockInItems.reduce((sum, item) => sum + item.receivedQty, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle2 className="w-3 h-3 mr-1" />Received</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'partial':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"><AlertCircle className="w-3 h-3 mr-1" />Partial</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Stock In Management</h1>
            <p className="text-muted-foreground">Receive inventory and update stock levels</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'new' ? 'default' : 'outline'}
            onClick={() => setActiveTab('new')}
            className="transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Stock In
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'outline'}
            onClick={() => setActiveTab('history')}
            className="transition-all duration-200 hover:scale-105"
          >
            <FileText className="h-4 w-4 mr-2" />
            History
          </Button>
        </div>
      </div>

      {activeTab === 'new' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stock In Details */}
            <Card className="animate-slideInLeft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Stock In Details
                </CardTitle>
                <CardDescription>
                  Enter the basic information for this stock in transaction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referenceNo">Reference No.</Label>
                    <Input
                      id="referenceNo"
                      value={formData.referenceNo}
                      onChange={(e) => setFormData({...formData, referenceNo: e.target.value})}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receivedDate">Received Date</Label>
                    <Input
                      id="receivedDate"
                      type="date"
                      value={formData.receivedDate}
                      onChange={(e) => setFormData({...formData, receivedDate: e.target.value})}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplierName">Supplier Name</Label>
                  <Input
                    id="supplierName"
                    placeholder="Enter supplier name"
                    value={formData.supplierName}
                    onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
                    className="transition-all duration-200 focus:scale-105"
                  />
                </div>
                  <div className="space-y-2">
                    <Label htmlFor="addedBy">Added By</Label>
                    <Input
                      id="addedBy"
                      value={formData.addedBy}
                      onChange={(e) => setFormData({...formData, addedBy: e.target.value})}
                      className="transition-all duration-200 focus:scale-105"
                      placeholder="User who added this stock"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any additional notes..."
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </div>
              </CardContent>
            </Card>

            {/* Add Products */}
            <Card className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Add Products
                </CardTitle>
                <CardDescription>
                  Select products to add to this stock in transaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="flex-1 transition-all duration-200 focus:scale-105">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCTS.filter(product => 
                        !stockInItems.some(item => item.productId === product.id)
                      ).map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          <div className="flex items-center justify-between w-full">
                            <span>{product.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              Stock: 0 | ${product.price}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleAddProduct}
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products List */}
            {stockInItems.length > 0 && (
              <Card className="animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle>Products to Receive ({stockInItems.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stockInItems.map((item, index) => (
                      <div 
                        key={item.id} 
                        className="p-4 border rounded-lg bg-muted/50 animate-fadeInUp hover:shadow-md transition-all duration-200"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.productName}</h4>
                            <p className="text-sm text-muted-foreground">
                              SKU: {item.sku} | Current Stock: {item.currentStock}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-110"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs">Received Qty</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.receivedQty}
                              onChange={(e) => handleUpdateItem(item.id, 'receivedQty', parseInt(e.target.value) || 0)}
                              className="h-8 transition-all duration-200 focus:scale-105"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Unit Cost ($)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.unitCost}
                              onChange={(e) => handleUpdateItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                              className="h-8 transition-all duration-200 focus:scale-105"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Batch No.</Label>
                            <Input
                              value={item.batchNo || ''}
                              onChange={(e) => handleUpdateItem(item.id, 'batchNo', e.target.value)}
                              className="h-8 transition-all duration-200 focus:scale-105"
                              placeholder="Optional"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Expiry Date</Label>
                            <Input
                              type="date"
                              value={item.expiryDate || ''}
                              onChange={(e) => handleUpdateItem(item.id, 'expiryDate', e.target.value)}
                              className="h-8 transition-all duration-200 focus:scale-105"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Total ($)</Label>
                            <div className="h-8 flex items-center px-3 bg-muted rounded-md text-sm font-medium">
                              {item.totalCost.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="animate-slideInLeft" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Transaction Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Items:</span>
                  <span className="font-medium">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Products:</span>
                  <span className="font-medium">{stockInItems.length}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold text-lg">${totalAmount.toFixed(2)}</span>
                </div>
                <Button 
                  onClick={handleSaveStockIn}
                  className="w-full transition-all duration-200 hover:scale-105 active:scale-95"
                  disabled={stockInItems.length === 0}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Stock In
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Stock In
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stockInHistory.slice(0, 3).map((transaction, index) => (
                  <div key={transaction.id} className="p-3 bg-muted/50 rounded-lg animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{transaction.referenceNo}</span>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">{transaction.supplierName}</p>
                    <p className="text-xs text-muted-foreground">{transaction.receivedDate}</p>
                    <div className="flex justify-between mt-2 text-xs">
                      <span>{transaction.totalItems} items</span>
                      <span className="font-medium">${transaction.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* History Tab */
        <Card className="animate-fadeInUp">
          <CardHeader>
            <CardTitle>Stock In History</CardTitle>
            <CardDescription>
              View all previous stock in transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stockInHistory.map((transaction, index) => (
                <div 
                  key={transaction.id} 
                  className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 animate-slideInLeft"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{transaction.referenceNo}</h4>
                        <p className="text-sm text-muted-foreground">{transaction.supplierName}</p>
                      </div>
                    </div>
                    {getStatusBadge(transaction.status)}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Date: </span>
                      <span>{transaction.receivedDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Items: </span>
                      <span>{transaction.totalItems}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount: </span>
                      <span className="font-medium">${transaction.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {transaction.notes && (
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      "{transaction.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StockIn;