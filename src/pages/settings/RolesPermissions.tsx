import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

const RolesPermissions = () => {
  const [roles, setRoles] = useState([
    {
      id: '1',
      name: 'Admin',
      description: 'Full system access with all permissions',
      userCount: 2,
      permissions: ['sales:create', 'sales:read', 'sales:update', 'sales:delete', 'inventory:create', 'inventory:read', 'inventory:update', 'inventory:delete', 'reports:read', 'settings:update']
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Management level access with most permissions',
      userCount: 3,
      permissions: ['sales:create', 'sales:read', 'sales:update', 'inventory:create', 'inventory:read', 'inventory:update', 'reports:read']
    },
    {
      id: '3',
      name: 'Cashier',
      description: 'Basic POS and sales operations',
      userCount: 8,
      permissions: ['sales:create', 'sales:read', 'inventory:read']
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  const modulePermissions = [
    {
      module: 'Sales',
      permissions: [
        { id: 'sales:create', name: 'Create Sales' },
        { id: 'sales:read', name: 'View Sales' },
        { id: 'sales:update', name: 'Edit Sales' },
        { id: 'sales:delete', name: 'Delete Sales' }
      ]
    },
    {
      module: 'Inventory',
      permissions: [
        { id: 'inventory:create', name: 'Add Products' },
        { id: 'inventory:read', name: 'View Inventory' },
        { id: 'inventory:update', name: 'Edit Products' },
        { id: 'inventory:delete', name: 'Delete Products' }
      ]
    },
    {
      module: 'Reports',
      permissions: [
        { id: 'reports:read', name: 'View Reports' },
        { id: 'reports:create', name: 'Generate Reports' }
      ]
    },
    {
      module: 'Settings',
      permissions: [
        { id: 'settings:read', name: 'View Settings' },
        { id: 'settings:update', name: 'Modify Settings' }
      ]
    }
  ];

  const handleAddRole = () => {
    if (!newRole.name || !newRole.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const role = {
      id: Date.now().toString(),
      name: newRole.name,
      description: newRole.description,
      userCount: 0,
      permissions: newRole.permissions
    };

    setRoles(prev => [...prev, role]);
    setNewRole({ name: '', description: '', permissions: [] });
    setShowAddDialog(false);
    toast.success("Role created successfully!");
  };

  const handleEditRole = (role: any) => {
    setEditingRole({ ...role });
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setShowAddDialog(true);
  };

  const handleUpdateRole = () => {
    if (!newRole.name || !newRole.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setRoles(prev => prev.map(role => 
      role.id === editingRole.id 
        ? { ...role, name: newRole.name, description: newRole.description, permissions: newRole.permissions }
        : role
    ));

    setEditingRole(null);
    setNewRole({ name: '', description: '', permissions: [] });
    setShowAddDialog(false);
    toast.success("Role updated successfully!");
  };

  const handleDeleteRole = (id: string) => {
    setRoles(prev => prev.filter(role => role.id !== id));
    toast.success("Role deleted!");
  };

  const togglePermission = (permissionId: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const closeDialog = () => {
    setShowAddDialog(false);
    setEditingRole(null);
    setNewRole({ name: '', description: '', permissions: [] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Roles & Permissions</h2>
          <p className="text-muted-foreground mt-1">Manage user roles and their permissions.</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div>
                <Label htmlFor="roleName">Role Name *</Label>
                <Input
                  id="roleName"
                  value={newRole.name}
                  onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Sales Manager"
                />
              </div>
              <div>
                <Label htmlFor="roleDescription">Description *</Label>
                <Textarea
                  id="roleDescription"
                  value={newRole.description}
                  onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the role responsibilities..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-4">
                <Label>Permissions</Label>
                {modulePermissions.map((module) => (
                  <div key={module.module} className="space-y-2">
                    <h4 className="font-medium text-sm">{module.module}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {module.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={newRole.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <Label htmlFor={permission.id} className="text-sm">
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeDialog}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={editingRole ? handleUpdateRole : handleAddRole}
                  className="bg-success hover:bg-success/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingRole ? 'Update Role' : 'Save Role'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <div className="font-medium">{role.name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground max-w-xs">
                    {role.description}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{role.userCount} users</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission.split(':')[1]}
                      </Badge>
                    ))}
                    {role.permissions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleEditRole(role)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteRole(role.id)}
                      disabled={role.userCount > 0}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default RolesPermissions;