import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSEO } from '@/lib/seo';

const roles = [
  { id: 1, name: 'Admin', permissions: 'All Access' },
  { id: 2, name: 'Manager', permissions: 'Sales, Inventory' },
  { id: 3, name: 'Cashier', permissions: 'POS, Receipts' },
];

const Roles: React.FC = () => {
  const { toast } = useToast();
  useSEO('Roles & Permissions | Bit Vend POS', 'Manage user roles and access permissions.', '/roles');

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Roles & Permissions</h1>
        <Button onClick={() => toast({ title: 'Add Role', description: 'This is a demo action.' })}>Add Role</Button>
      </header>
      <main>
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-500 hover:bg-blue-500">
                    <TableHead className="text-white font-semibold">Role</TableHead>
                    <TableHead className="text-white font-semibold">Permissions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell>{r.permissions}</TableCell>
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

export default Roles;
