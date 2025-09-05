import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/contexts/ProductContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Search, Package, Plus, Edit, Trash2, Filter, Eye, FileDown, Upload, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Mock product data (from checkout page)
const initialProducts = [
  {
    id: 1,
    name: "Premium Espresso Blend",
    description: "Artisanal dark roast",
    price: 24.99,
    category: "Coffee",
    stock: 150,
    sku: "ESP-001",
    status: "Active",
    image: "/lovable-uploads/coffee-blend.jpg"
  },
  {
    id: 2,
    name: "Organic Green Tea",
    description: "Hand-picked leaves",
    price: 18.50,
    category: "Tea",
    stock: 75,
    sku: "TEA-002",
    status: "Active",
    image: "/lovable-uploads/green-tea.jpg"
  },
  {
    id: 3,
    name: "Gourmet Chocolate Cake",
    description: "Belgian chocolate",
    price: 45.00,
    category: "Dessert",
    stock: 25,
    sku: "CAK-003",
    status: "Active",
    image: "/lovable-uploads/chocolate-cake.jpg"
  },
  {
    id: 4,
    name: "Vintage Wine Selection",
    description: "Reserve collection",
    price: 89.99,
    category: "Beverages",
    stock: 12,
    sku: "WIN-004",
    status: "Active",
    image: "/lovable-uploads/vintage-wine.jpg"
  },
  {
    id: 5,
    name: "Artisan Croissant",
    description: "Buttery perfection",
    price: 12.99,
    category: "Pastry",
    stock: 0,
    sku: "CRO-005",
    status: "Out of Stock",
    image: "/lovable-uploads/croissant.jpg"
  },
  {
    id: 6,
    name: "Truffle Collection",
    description: "Hand-crafted luxury",
    price: 65.00,
    category: "Confectionery",
    stock: 8,
    sku: "TRU-006",
    status: "Low Stock",
    image: "/lovable-uploads/truffle-collection.jpg"
  },
  {
    id: 7,
    name: "French Roast Coffee",
    description: "Bold and smooth",
    price: 22.99,
    category: "Coffee",
    stock: 200,
    sku: "COF-007",
    status: "Active"
  },
  {
    id: 8,
    name: "Earl Grey Tea",
    description: "Classic bergamot blend",
    price: 16.99,
    category: "Tea",
    stock: 120,
    sku: "TEA-008",
    status: "Active"
  },
  {
    id: 9,
    name: "Cheesecake Slice",
    description: "New York style",
    price: 35.00,
    category: "Dessert",
    stock: 15,
    sku: "CHE-009",
    status: "Active"
  },
  {
    id: 10,
    name: "Sparkling Water",
    description: "Premium mineral water",
    price: 8.99,
    category: "Beverages",
    stock: 300,
    sku: "WAT-010",
    status: "Active"
  },
  {
    id: 11,
    name: "Danish Pastry",
    description: "Traditional recipe",
    price: 14.50,
    category: "Pastry",
    stock: 45,
    sku: "DAN-011",
    status: "Active"
  },
  {
    id: 12,
    name: "Dark Chocolate Bar",
    description: "70% cocoa content",
    price: 28.00,
    category: "Confectionery",
    stock: 60,
    sku: "CHO-012",
    status: "Active"
  }
];

const categories = ["All", "Coffee", "Tea", "Dessert", "Beverages", "Pastry", "Confectionery"];

const getStatusBadge = (status: string, stock: number) => {
  const baseClasses = "w-24 text-center justify-center text-xs px-2 py-1";
  
  if (stock === 0) {
    return <Badge variant="destructive" className={baseClasses}>Out of Stock</Badge>;
  } else if (stock <= 10) {
    return <Badge variant="secondary" className={`${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200`}>Low Stock</Badge>;
  } else {
    return <Badge variant="default" className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>Active</Badge>;
  }
};

const Products = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Handle delete product
  const handleDeleteProduct = (productId: number, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      setProducts(prev => prev.filter(product => product.id !== productId));
      toast({
        title: "Product Deleted",
        description: `${productName} has been removed from inventory.`,
        variant: "destructive",
      });
    }
  };

  // Handle navigation
  const handleViewProduct = (productId: number) => {
    navigate(`/products/view/${productId}`);
  };

  const handleEditProduct = (productId: number) => {
    navigate(`/products/edit/${productId}`);
  };

  // Handle export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Products Report', 14, 22);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
    doc.text(`Total Products: ${filteredProducts.length}`, 14, 40);
    
    // Prepare table data
    const tableData = filteredProducts.map(product => [
      product.name,
      product.sku,
      product.category,
      `$${product.price.toFixed(2)}`,
      product.stock.toString(),
      product.stock === 0 ? 'Out of Stock' : product.stock <= 10 ? 'Low Stock' : 'Active'
    ]);
    
    // Add table
    autoTable(doc, {
      head: [['Product Name', 'SKU', 'Category', 'Price', 'Stock', 'Status']],
      body: tableData,
      startY: 50,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 20 },
        4: { cellWidth: 15 },
        5: { cellWidth: 25 },
      },
    });
    
    const filename = `products_report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    toast({
      title: "PDF Export",
      description: `Products report exported to ${filename}`,
    });
  };

  // Handle export to Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredProducts.map(product => ({
      'Product Name': product.name,
      'Description': product.description,
      'SKU': product.sku,
      'Category': product.category,
      'Price': product.price,
      'Stock': product.stock,
      'Status': product.status
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    
    const filename = `products_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, filename);
    
    toast({
      title: "Excel Export",
      description: `Products exported to ${filename}`,
    });
  };

  // Handle import from Excel
  const handleImportExcel = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = new Uint8Array(event.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            console.log('Imported data:', jsonData);
            toast({
              title: "Excel Import",
              description: `Successfully imported ${jsonData.length} rows from ${file.name}`,
            });
          } catch (error) {
            toast({
              title: "Import Error",
              description: "Failed to import Excel file. Please check the format.",
              variant: "destructive",
            });
          }
        };
        reader.readAsArrayBuffer(file);
      }
    };
    input.click();
  };

  return (
    <div className="p-6 space-y-6 bg-background dark:bg-black min-h-screen animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your product inventory and catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => navigate('/products/add')}
            className="bg-orange-500 hover:bg-orange-600 text-white gap-2 transition-all duration-200 hover:scale-95 active:scale-90"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
          
          <Button 
            onClick={handleExportPDF}
            className="bg-red-500 hover:bg-red-600 text-white gap-2 transition-all duration-200 hover:scale-95 active:scale-90"
          >
            <FileDown className="h-4 w-4" />
            PDF
          </Button>
          
          <Button 
            onClick={handleExportExcel}
            className="bg-green-500 hover:bg-green-600 text-white gap-2 transition-all duration-200 hover:scale-95 active:scale-90"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          
          <Button 
            onClick={handleImportExcel}
            className="bg-blue-500 hover:bg-blue-600 text-white gap-2 transition-all duration-200 hover:scale-95 active:scale-90"
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dark:bg-[#1c1c1c]">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-[#1c1c1c]">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{products.filter(p => p.stock > 10).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-[#1c1c1c]">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold">{products.filter(p => p.stock > 0 && p.stock <= 10).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-[#1c1c1c]">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold">{products.filter(p => p.stock === 0).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="dark:bg-[#1c1c1c]">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products by name, SKU, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Category:</span>
              </div>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="dark:bg-[#1c1c1c]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Products ({filteredProducts.length})</span>
            <Badge variant="outline" className="rounded-full">
              Page {currentPage} of {totalPages}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border dark:bg-[#1c1c1c]">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-500 hover:bg-blue-500">
                  <TableHead className="text-white font-semibold">Product</TableHead>
                  <TableHead className="text-white font-semibold">SKU</TableHead>
                  <TableHead className="text-white font-semibold">Category</TableHead>
                  <TableHead className="text-white font-semibold">Price</TableHead>
                  <TableHead className="text-white font-semibold">Stock</TableHead>
                  <TableHead className="text-white font-semibold">Status</TableHead>
                  <TableHead className="text-right text-white font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No products found</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                 ) : (
                    paginatedProducts.map((product) => (
                     <TableRow key={product.id} className="hover:bg-muted/50 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:z-10 relative">
                       <TableCell>
                         <div className="flex items-center gap-3">
                           <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                             {product.image ? (
                               <img 
                                 src={product.image} 
                                 alt={product.name}
                                 className="w-full h-full object-cover"
                                 onError={(e) => {
                                   const target = e.target as HTMLImageElement;
                                   target.style.display = 'none';
                                   target.nextElementSibling?.classList.remove('hidden');
                                 }}
                               />
                             ) : null}
                             <Package className={`h-5 w-5 text-muted-foreground ${product.image ? 'hidden' : ''}`} />
                           </div>
                           <div>
                             <p className="font-medium">{product.name}</p>
                             <p className="text-sm text-muted-foreground">{product.description}</p>
                           </div>
                         </div>
                       </TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-full">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600 dark:text-green-400">
                        ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "font-medium",
                          product.stock === 0 ? "text-red-600 dark:text-red-400" :
                          product.stock <= 10 ? "text-orange-600 dark:text-orange-400" :
                          "text-green-600 dark:text-green-400"
                        )}>
                          {product.stock} units
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(product.status, product.stock)}
                      </TableCell>
                       <TableCell className="text-right">
                         <div className="flex items-center justify-end gap-1 sm:gap-2">
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <Button 
                                 variant="ghost" 
                                 size="sm" 
                                 className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400 transition-colors"
                                 onClick={() => handleViewProduct(product.id)}
                               >
                                 <Eye className="h-4 w-4" />
                               </Button>
                             </TooltipTrigger>
                             <TooltipContent>
                               <p>View Product</p>
                             </TooltipContent>
                           </Tooltip>
                           
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <Button 
                                 variant="ghost" 
                                 size="sm" 
                                 className="h-8 w-8 p-0 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950 dark:hover:text-amber-400 transition-colors"
                                 onClick={() => handleEditProduct(product.id)}
                               >
                                 <Edit className="h-4 w-4" />
                               </Button>
                             </TooltipTrigger>
                             <TooltipContent>
                               <p>Edit Product</p>
                             </TooltipContent>
                           </Tooltip>
                           
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <Button 
                                 variant="ghost" 
                                 size="sm" 
                                 className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors"
                                 onClick={() => handleDeleteProduct(product.id, product.name)}
                               >
                                 <Trash2 className="h-4 w-4" />
                               </Button>
                             </TooltipTrigger>
                             <TooltipContent>
                               <p>Delete Product</p>
                             </TooltipContent>
                           </Tooltip>
                         </div>
                       </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={page === currentPage}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;