import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSEO } from '@/lib/seo';
import { Search } from 'lucide-react';

const mock = [
  { id: 1, name: 'Premium Espresso Blend', sku: 'ESP-001', stock: 150, status: 'Active' },
  { id: 2, name: 'Organic Green Tea', sku: 'TEA-002', stock: 75, status: 'Active' },
  { id: 3, name: 'Gourmet Chocolate Cake', sku: 'CAK-003', stock: 25, status: 'Active' },
];

const StockReport: React.FC = () => {
  useSEO('Stock Report | Bit Vend POS', 'View stock levels and item availability across inventory.', '/stock-report');

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock Report</h1>
          <p className="text-muted-foreground mt-1">Current inventory levels</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or SKU" className="pl-9" />
        </div>
      </header>

      <main>
        <Card>
          <CardHeader>
            <CardTitle>Items ({mock.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-500 hover:bg-blue-500">
                    <TableHead className="text-white font-semibold">Product</TableHead>
                    <TableHead className="text-white font-semibold">SKU</TableHead>
                    <TableHead className="text-white font-semibold">Stock</TableHead>
                    <TableHead className="text-white font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mock.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="font-mono text-sm">{row.sku}</TableCell>
                      <TableCell>{row.stock}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-full">
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StockReport;
