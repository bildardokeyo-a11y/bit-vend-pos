import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Award, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Building2,
  Package,
  TrendingUp,
  Globe
} from 'lucide-react';
import { toast } from "sonner";
import { useSEO } from '@/lib/seo';

interface Brand {
  id: string;
  name: string;
  description: string;
  manufacturer: string;
  country: string;
  website: string;
  contactEmail: string;
  productCount: number;
  status: 'active' | 'inactive';
  establishedYear: number;
  logoUrl?: string;
  createdAt: string;
}

const Brands = () => {
  useSEO('Brand Management - Manage Product Brands', 'Manage product brands and manufacturers, track brand performance and product associations.');

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manufacturer: '',
    country: '',
    website: '',
    contactEmail: '',
    status: 'active' as Brand['status'],
    establishedYear: new Date().getFullYear(),
    logoUrl: ''
  });

  const [brands, setBrands] = useState<Brand[]>([
    // Brands will be loaded from database
  ]);

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBrand) {
      setBrands(prev => prev.map(brand =>
        brand.id === editingBrand.id
          ? { ...brand, ...formData }
          : brand
      ));
      toast.success('Brand updated successfully!');
    } else {
      const newBrand: Brand = {
        id: Date.now().toString(),
        ...formData,
        productCount: 0,
        createdAt: new Date().toISOString()
      };
      setBrands(prev => [...prev, newBrand]);
      toast.success('Brand created successfully!');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description,
      manufacturer: brand.manufacturer,
      country: brand.country,
      website: brand.website,
      contactEmail: brand.contactEmail,
      status: brand.status,
      establishedYear: brand.establishedYear,
      logoUrl: brand.logoUrl || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      setBrands(prev => prev.filter(brand => brand.id !== id));
      toast.success('Brand deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      manufacturer: '',
      country: '',
      website: '',
      contactEmail: '',
      status: 'active',
      establishedYear: new Date().getFullYear(),
      logoUrl: ''
    });
    setEditingBrand(null);
  };

  const activeBrands = brands.filter(b => b.status === 'active').length;
  const totalProducts = brands.reduce((sum, b) => sum + b.productCount, 0);
  const averageAge = Math.round(brands.reduce((sum, b) => sum + (new Date().getFullYear() - b.establishedYear), 0) / brands.length);

  return (
    <div className="space-y-6 p-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Brands</h1>
          <p className="text-muted-foreground">Manage product brands and manufacturers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => resetForm()}>
              <Plus size={16} />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBrand ? 'Edit Brand' : 'Add New Brand'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Brand Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Premium Brand Co."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturer">Manufacturer *</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                    placeholder="Manufacturer Inc."
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the brand and its specialties"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="USA"
                  />
                </div>
                <div>
                  <Label htmlFor="establishedYear">Established Year</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, establishedYear: Number(e.target.value) }))}
                    placeholder="1990"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="contact@brand.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Brand['status'] }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground">
                  Cancel
                </Button>
                <Button type="submit" className="bg-save hover:bg-save-hover text-save-foreground">
                  {editingBrand ? 'Update' : 'Create'} Brand
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brands.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Brands</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeBrands}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Brand Age</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageAge} years</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search brands by name, manufacturer, country, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Brands Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award size={20} />
            Brands ({filteredBrands.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-500 hover:bg-blue-500">
                <TableHead className="text-white font-semibold">Brand</TableHead>
                <TableHead className="text-white font-semibold">Manufacturer</TableHead>
                <TableHead className="text-white font-semibold">Country</TableHead>
                <TableHead className="text-white font-semibold">Products</TableHead>
                <TableHead className="text-white font-semibold">Established</TableHead>
                <TableHead className="text-white font-semibold">Contact</TableHead>
                <TableHead className="text-white font-semibold">Status</TableHead>
                <TableHead className="text-white font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        {brand.logoUrl ? (
                          <img 
                            src={brand.logoUrl} 
                            alt={brand.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <Award size={16} className="text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{brand.name}</div>
                        <div className="text-xs text-muted-foreground max-w-xs truncate">
                          {brand.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Building2 size={12} />
                      {brand.manufacturer}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Globe size={12} />
                      {brand.country}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {brand.productCount} products
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {brand.establishedYear}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date().getFullYear() - brand.establishedYear} years ago
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {brand.website && (
                        <div className="text-xs">
                          <a 
                            href={brand.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Website
                          </a>
                        </div>
                      )}
                      {brand.contactEmail && (
                        <div className="text-xs text-muted-foreground">
                          {brand.contactEmail}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={brand.status === 'active' ? "default" : "secondary"}>
                      {brand.status.charAt(0).toUpperCase() + brand.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(brand)}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(brand.id)}
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

export default Brands;