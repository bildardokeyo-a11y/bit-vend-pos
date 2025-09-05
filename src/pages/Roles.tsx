import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useSEO } from '@/lib/seo';
import { Plus, Edit2, Trash2, Shield, Users, Settings } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  permissions: string;
  description: string;
  userCount: number;
}

const roles: Role[] = [
  { id: '1', name: 'Admin', permissions: 'All Access', description: 'Full system access and user management', userCount: 2 },
  { id: '2', name: 'Manager', permissions: 'Sales, Inventory', description: 'Manage sales operations and inventory', userCount: 5 },
  { id: '3', name: 'Cashier', permissions: 'POS, Receipts', description: 'Handle point of sale transactions', userCount: 8 },
];

const Roles: React.FC = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    permissions: '',
    description: ''
  });
  useSEO('Roles & Permissions | Bit Vend POS', 'Manage user roles and access permissions.', '/roles');

  const handleSubmit = () => {
    if (!formData.name || !formData.permissions) {
      toast({ title: 'Error', description: 'Name and permissions are required', variant: 'destructive' });
      return;
    }

    toast({ 
      title: editingRole ? 'Role Updated' : 'Role Created', 
      description: `Role has been ${editingRole ? 'updated' : 'created'} successfully` 
    });
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', permissions: '', description: '' });
    setEditingRole(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      permissions: role.permissions,
      description: role.description
    });
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    toast({ title: 'Role Deleted', description: 'Role has been deleted successfully' });
  };

  return (
    <div className="p-6 space-y-6 animate-fadeInUp">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Roles & Permissions</h1>
          <p className="text-muted-foreground mt-1">Manage user roles and access levels</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter role name"
                  className="border-input bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="permissions">Permissions *</Label>
                <Input
                  id="permissions"
                  value={formData.permissions}
                  onChange={(e) => setFormData({...formData, permissions: e.target.value})}
                  placeholder="e.g., Sales, Inventory, Reports"
                  className="border-input bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Role description..."
                  className="border-input bg-background text-foreground"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1">
                  {editingRole ? 'Update' : 'Create'}
                </Button>
                <Button variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{roles.length}</p>
                <p className="text-sm text-muted-foreground">Total Roles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{roles.reduce((sum, role) => sum + role.userCount, 0)}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Permissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <main>
        <Card className="animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
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
                    <TableHead className="text-white font-semibold">Description</TableHead>
                    <TableHead className="text-white font-semibold">Users</TableHead>
                    <TableHead className="text-white font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role, index) => (
                    <TableRow key={role.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.05}s` }}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.permissions}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>{role.userCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(role)}>
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
                                <AlertDialogTitle>Delete Role</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the "{role.name}" role? This will affect {role.userCount} users.
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
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Roles;
