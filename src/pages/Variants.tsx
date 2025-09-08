import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Layers, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Package,
  Tag
} from 'lucide-react';
import { toast } from "sonner";

interface Variant {
  id: string;
  name: string;
  values: string[];
  type: 'color' | 'size' | 'material' | 'custom';
  isActive: boolean;
  productCount: number;
  createdAt: string;
}

const Variants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    values: [''],
    type: 'custom' as Variant['type'],
    isActive: true
  });

  const [variants, setVariants] = useState<Variant[]>([
    {
      id: '1',
      name: 'Size',
      values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      type: 'size',
      isActive: true,
      productCount: 15,
      createdAt: '2024-01-10T08:00:00Z'
    },
    {
      id: '2',
      name: 'Color',
      values: ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow'],
      type: 'color',
      isActive: true,
      productCount: 12,
      createdAt: '2024-01-10T08:15:00Z'
    },
    {
      id: '3',
      name: 'Material',
      values: ['Cotton', 'Polyester', 'Wool', 'Silk', 'Denim'],
      type: 'material',
      isActive: true,
      productCount: 8,
      createdAt: '2024-01-10T08:20:00Z'
    },
    {
      id: '4',
      name: 'Storage Capacity',
      values: ['16GB', '32GB', '64GB', '128GB', '256GB'],
      type: 'custom',
      isActive: true,
      productCount: 5,
      createdAt: '2024-01-10T08:25:00Z'
    }
  ]);

  const filteredVariants = variants.filter(variant =>
    variant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    variant.values.some(value => value.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredValues = formData.values.filter(value => value.trim() !== '');
    
    if (editingVariant) {
      setVariants(prev => prev.map(variant =>
        variant.id === editingVariant.id
          ? { ...variant, ...formData, values: filteredValues }
          : variant
      ));
      toast.success('Variant updated successfully!');
    } else {
      const newVariant: Variant = {
        id: Date.now().toString(),
        ...formData,
        values: filteredValues,
        productCount: 0,
        createdAt: new Date().toISOString()
      };
      setVariants(prev => [...prev, newVariant]);
      toast.success('Variant created successfully!');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (variant: Variant) => {
    setEditingVariant(variant);
    setFormData({
      name: variant.name,
      values: [...variant.values, ''], // Add empty value for new entries
      type: variant.type,
      isActive: variant.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this variant? This will affect all products using this variant.')) {
      setVariants(prev => prev.filter(variant => variant.id !== id));
      toast.success('Variant deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      values: [''],
      type: 'custom',
      isActive: true
    });
    setEditingVariant(null);
  };

  const addValueField = () => {
    setFormData(prev => ({
      ...prev,
      values: [...prev.values, '']
    }));
  };

  const updateValue = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.map((v, i) => i === index ? value : v)
    }));
  };

  const removeValue = (index: number) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }));
  };

  const getTypeColor = (type: Variant['type']) => {
    const colors = {
      color: 'bg-red-100 text-red-800',
      size: 'bg-blue-100 text-blue-800',
      material: 'bg-green-100 text-green-800',
      custom: 'bg-purple-100 text-purple-800'
    };
    return colors[type];
  };

  return (
    <div className="space-y-6 p-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Product Variants</h1>
          <p className="text-muted-foreground">Manage product variations like size, color, and material</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => resetForm()}>
              <Plus size={16} />
              Add Variant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVariant ? 'Edit Variant' : 'Add New Variant'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Variant Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Size, Color, Material"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Variant Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Variant['type'] }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="custom">Custom</option>
                    <option value="color">Color</option>
                    <option value="size">Size</option>
                    <option value="material">Material</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Variant Values</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addValueField}>
                    <Plus size={14} className="mr-1" />
                    Add Value
                  </Button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {formData.values.map((value, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={value}
                        onChange={(e) => updateValue(index, e.target.value)}
                        placeholder={`Value ${index + 1}`}
                      />
                      {formData.values.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeValue(index)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground">
                  Cancel
                </Button>
                <Button type="submit" className="bg-save hover:bg-save-hover text-save-foreground">
                  {editingVariant ? 'Update' : 'Create'} Variant
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search variants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Variants</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{variants.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Variants</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {variants.filter(v => v.isActive).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Variants Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag size={20} />
            Variants ({filteredVariants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-500 hover:bg-blue-500">
                <TableHead className="text-white font-semibold">Name</TableHead>
                <TableHead className="text-white font-semibold">Type</TableHead>
                <TableHead className="text-white font-semibold">Values</TableHead>
                <TableHead className="text-white font-semibold">Products Using</TableHead>
                <TableHead className="text-white font-semibold">Status</TableHead>
                <TableHead className="text-white font-semibold">Created</TableHead>
                <TableHead className="text-white font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVariants.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell className="font-medium">{variant.name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(variant.type)}>
                      {variant.type.charAt(0).toUpperCase() + variant.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {variant.values.slice(0, 3).map((value, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {value}
                        </Badge>
                      ))}
                      {variant.values.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{variant.values.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{variant.productCount}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={variant.isActive ? "default" : "secondary"}>
                      {variant.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(variant.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(variant)}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(variant.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
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

export default Variants;