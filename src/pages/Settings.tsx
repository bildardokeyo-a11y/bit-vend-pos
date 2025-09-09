import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBusiness } from '@/contexts/BusinessContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { countries } from '@/data/countries';
import { supabase } from '@/integrations/supabase/client';
import { showSaveToast } from '@/components/SettingsToast';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Building2,
  Receipt,
  Calculator,
  Shield,
  Database,
  Users,
  Save,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Crown,
  Star,
  Zap,
  CheckCircle,
  Globe,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  CreditCard,
  User,
  Lock,
  Bell,
  Palette,
  Monitor,
  Upload,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { businesses, currentBusiness, addBusiness, updateBusiness } = useBusiness();
  const { subscription, hasFeature } = useSubscription();
  
  const section = searchParams.get('section') || 'general';
  const subsection = searchParams.get('subsection') || '';
  const mode = searchParams.get('mode') || '';
  const editId = searchParams.get('edit') || '';

  // State for various forms
  const [generalSettings, setGeneralSettings] = useState({
    language: 'en',
    timezone: 'UTC',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    theme: 'system',
    notifications: true,
    autoSave: true,
    compactMode: false
  });

  const [businessForm, setBusinessForm] = useState({
    businessName: '',
    businessType: 'retail',
    taxId: '',
    businessLicense: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    logoUrl: ''
  });

  const [operatingHours, setOperatingHours] = useState({
    monday: { open: '09:00', close: '17:00', closed: false },
    tuesday: { open: '09:00', close: '17:00', closed: false },
    wednesday: { open: '09:00', close: '17:00', closed: false },
    thursday: { open: '09:00', close: '17:00', closed: false },
    friday: { open: '09:00', close: '17:00', closed: false },
    saturday: { open: '09:00', close: '17:00', closed: false },
    sunday: { open: '09:00', close: '17:00', closed: true }
  });

  const [receiptSettings, setReceiptSettings] = useState({
    template: 'classic-receipt',
    showLogo: true,
    showAddress: true,
    showPhone: true,
    showEmail: true,
    footerText: 'Thank you for your business!',
    paperSize: 'A4',
    fontSize: '12'
  });

  const [taxSettings, setTaxSettings] = useState({
    defaultTaxRate: '8.00',
    taxInclusive: false,
    showTaxBreakdown: true,
    taxNumber: '',
    enableMultipleTaxes: false
  });

  const [users, setUsers] = useState([]);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  
  const [userForm, setUserForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'cashier',
    permissions: {
      pos_access: true,
      inventory_view: true,
      inventory_edit: false,
      sales_view: true,
      sales_edit: false,
      reports_view: false,
      reports_export: false,
      settings_view: false,
      settings_edit: false,
      user_management: false
    }
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
    if (editId && businesses.length > 0) {
      const business = businesses.find(b => b.id === editId);
      if (business) {
        setBusinessForm({
          businessName: business.businessName,
          businessType: business.businessType,
          taxId: business.taxId,
          businessLicense: business.businessLicense,
          phone: business.phone,
          email: business.email,
          address: business.address,
          city: business.city,
          state: business.state,
          postalCode: business.postalCode,
          country: business.country,
          logoUrl: business.logoUrl || ''
        });
        setOperatingHours(business.operatingHours);
      }
    }
  }, [editId, businesses]);

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('pos-app-settings');
      if (saved) {
        const settings = JSON.parse(saved);
        setGeneralSettings(prev => ({ ...prev, ...settings }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = (newSettings: any) => {
    try {
      localStorage.setItem('pos-app-settings', JSON.stringify(newSettings));
      showSaveToast();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  const handleSaveBusiness = () => {
    if (!businessForm.businessName || !businessForm.email) {
      toast.error('Business name and email are required');
      return;
    }

    try {
      if (editId) {
        updateBusiness(editId, {
          ...businessForm,
          operatingHours
        });
        toast.success('Business updated successfully');
      } else {
        addBusiness({
          ...businessForm,
          operatingHours
        });
        toast.success('Business added successfully');
      }
      
      // Reset form and navigate back
      setBusinessForm({
        businessName: '',
        businessType: 'retail',
        taxId: '',
        businessLicense: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
        logoUrl: ''
      });
      setSearchParams({ section: 'business', subsection: 'business-info' });
    } catch (error) {
      console.error('Error saving business:', error);
      toast.error('Failed to save business');
    }
  };

  const handleAddUser = async () => {
    if (!userForm.email || !userForm.password || !userForm.firstName || !userForm.lastName) {
      toast.error('All fields are required');
      return;
    }

    try {
      // In a real implementation, this would create the user in Supabase
      const newUser = {
        id: Date.now().toString(),
        email: userForm.email,
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        role: userForm.role,
        permissions: userForm.permissions,
        status: 'invited',
        createdAt: new Date().toISOString()
      };

      setUsers(prev => [...prev, newUser]);
      
      // Simulate sending invitation email
      toast.success(`Invitation sent to ${userForm.email}`);
      
      // Reset form
      setUserForm({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'cashier',
        permissions: {
          pos_access: true,
          inventory_view: true,
          inventory_edit: false,
          sales_view: true,
          sales_edit: false,
          reports_view: false,
          reports_export: false,
          settings_view: false,
          settings_edit: false,
          user_management: false
        }
      });
      setShowAddUserDialog(false);
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowChangePasswordDialog(false);
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    }
  };

  const selectedCountry = countries.find(c => c.code === businessForm.country);
  const availableStates = selectedCountry?.states || [];

  const sidebarItems = [
    {
      id: 'general',
      label: 'General',
      icon: SettingsIcon,
      subsections: []
    },
    {
      id: 'business',
      label: 'Business',
      icon: Building2,
      subsections: [
        { id: 'business-info', label: 'Business Information' },
        { id: 'business-operating-hours', label: 'Operating Hours' },
        { id: 'business-locations', label: 'Locations & Branches' },
        { id: 'subscription', label: 'Subscription & Billing' }
      ]
    },
    {
      id: 'invoice',
      label: 'Invoice & Receipt',
      icon: Receipt,
      subsections: [
        { id: 'receipt-settings', label: 'Receipt Settings' },
        { id: 'invoice-templates', label: 'Invoice Templates' },
        { id: 'numbering', label: 'Numbering' }
      ]
    },
    {
      id: 'tax',
      label: 'Tax',
      icon: Calculator,
      subsections: []
    },
    {
      id: 'backup',
      label: 'Backup & Restore',
      icon: Database,
      subsections: []
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      subsections: [
        { id: 'user-management', label: 'User Management' },
        { id: 'change-password', label: 'Change Password' },
        { id: 'security-settings', label: 'Security Settings' }
      ]
    }
  ];

  const renderContent = () => {
    if (section === 'general') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">General Settings</h2>
            <p className="text-muted-foreground">Configure general application preferences</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select 
                    value={generalSettings.theme} 
                    onValueChange={(value) => {
                      const newSettings = { ...generalSettings, theme: value };
                      setGeneralSettings(newSettings);
                      saveSettings(newSettings);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select 
                    value={generalSettings.language} 
                    onValueChange={(value) => {
                      const newSettings = { ...generalSettings, language: value };
                      setGeneralSettings(newSettings);
                      saveSettings(newSettings);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
                </div>
                <Switch
                  checked={generalSettings.compactMode}
                  onCheckedChange={(checked) => {
                    const newSettings = { ...generalSettings, compactMode: checked };
                    setGeneralSettings(newSettings);
                    saveSettings(newSettings);
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Save</Label>
                  <p className="text-sm text-muted-foreground">Automatically save changes</p>
                </div>
                <Switch
                  checked={generalSettings.autoSave}
                  onCheckedChange={(checked) => {
                    const newSettings = { ...generalSettings, autoSave: checked };
                    setGeneralSettings(newSettings);
                    saveSettings(newSettings);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (section === 'business') {
      if (subsection === 'business-info') {
        if (mode === 'add' || editId) {
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setSearchParams({ section: 'business', subsection: 'business-info' })}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {editId ? 'Edit Business' : 'Add New Business'}
                  </h2>
                  <p className="text-muted-foreground">
                    {editId ? 'Update business information' : 'Enter your business details'}
                  </p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={businessForm.businessName}
                        onChange={(e) => setBusinessForm(prev => ({ ...prev, businessName: e.target.value }))}
                        placeholder="Your Business Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select 
                        value={businessForm.businessType} 
                        onValueChange={(value) => setBusinessForm(prev => ({ ...prev, businessType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="grocery">Grocery</SelectItem>
                          <SelectItem value="pharmacy">Pharmacy</SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={businessForm.email}
                        onChange={(e) => setBusinessForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="business@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={businessForm.phone}
                        onChange={(e) => setBusinessForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 555-0123"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={businessForm.address}
                      onChange={(e) => setBusinessForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="123 Business Street"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select 
                        value={businessForm.country} 
                        onValueChange={(value) => setBusinessForm(prev => ({ ...prev, country: value, state: '' }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Select 
                        value={businessForm.state} 
                        onValueChange={(value) => setBusinessForm(prev => ({ ...prev, state: value }))}
                        disabled={!selectedCountry}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableStates.map((state) => (
                            <SelectItem key={state.code} value={state.code}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={businessForm.city}
                        onChange={(e) => setBusinessForm(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="City"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={businessForm.postalCode}
                        onChange={(e) => setBusinessForm(prev => ({ ...prev, postalCode: e.target.value }))}
                        placeholder="12345"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID</Label>
                      <Input
                        id="taxId"
                        value={businessForm.taxId}
                        onChange={(e) => setBusinessForm(prev => ({ ...prev, taxId: e.target.value }))}
                        placeholder="Tax identification number"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveBusiness} className="bg-save hover:bg-save-hover text-save-foreground">
                      <Save className="h-4 w-4 mr-2" />
                      {editId ? 'Update Business' : 'Add Business'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchParams({ section: 'business', subsection: 'business-info' })}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Business Information</h2>
                <p className="text-muted-foreground">Manage your business details and settings</p>
              </div>
              <Button 
                onClick={() => setSearchParams({ section: 'business', subsection: 'business-info', mode: 'add' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Business
              </Button>
            </div>

            {businesses.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Business Added</h3>
                  <p className="text-muted-foreground mb-4">Add your business information to get started</p>
                  <Button 
                    onClick={() => setSearchParams({ section: 'business', subsection: 'business-info', mode: 'add' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your Business
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {businesses.map((business) => (
                  <Card key={business.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{business.businessName}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{business.businessType}</p>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4" />
                              {business.email}
                            </div>
                            {business.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4" />
                                {business.phone}
                              </div>
                            )}
                            {business.address && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4" />
                                {business.address}, {business.city}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchParams({ 
                              section: 'business', 
                              subsection: 'business-info', 
                              edit: business.id 
                            })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      }

      if (subsection === 'subscription') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Subscription & Billing</h2>
              <p className="text-muted-foreground">Manage your subscription plan and billing</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {subscription?.plan_id ? 
                        subscription.plan_id.charAt(0).toUpperCase() + subscription.plan_id.slice(1) + ' Plan' : 
                        'Starter Plan'
                      }
                    </h3>
                    <p className="text-muted-foreground">
                      {subscription?.status === 'active' ? 'Active subscription' : 'Free plan'}
                    </p>
                  </div>
                  <Button onClick={() => navigate('/dashboard/subscription')}>
                    <Crown className="h-4 w-4 mr-2" />
                    Manage Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }
    }

    if (section === 'invoice' && subsection === 'receipt-settings') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Receipt Settings</h2>
            <p className="text-muted-foreground">Configure receipt templates and printing options</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Receipt Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Template Style</Label>
                <Select 
                  value={receiptSettings.template} 
                  onValueChange={(value) => setReceiptSettings(prev => ({ ...prev, template: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic-receipt">Classic Receipt</SelectItem>
                    <SelectItem value="modern-receipt">Modern Receipt</SelectItem>
                    <SelectItem value="minimal-receipt">Minimal Receipt</SelectItem>
                    <SelectItem value="detailed-receipt">Detailed Receipt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label>Show Logo</Label>
                  <Switch
                    checked={receiptSettings.showLogo}
                    onCheckedChange={(checked) => setReceiptSettings(prev => ({ ...prev, showLogo: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show Address</Label>
                  <Switch
                    checked={receiptSettings.showAddress}
                    onCheckedChange={(checked) => setReceiptSettings(prev => ({ ...prev, showAddress: checked }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Textarea
                  id="footerText"
                  value={receiptSettings.footerText}
                  onChange={(e) => setReceiptSettings(prev => ({ ...prev, footerText: e.target.value }))}
                  placeholder="Thank you for your business!"
                />
              </div>

              <Button 
                onClick={() => {
                  localStorage.setItem('receipt-settings', JSON.stringify(receiptSettings));
                  showSaveToast();
                }}
                className="bg-save hover:bg-save-hover text-save-foreground"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Receipt Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (section === 'security') {
      if (subsection === 'user-management') {
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">User Management</h2>
                <p className="text-muted-foreground">Manage team members and their permissions</p>
              </div>
              <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={userForm.firstName}
                          onChange={(e) => setUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={userForm.lastName}
                          onChange={(e) => setUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userForm.email}
                          onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="user@company.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          value={userForm.password}
                          onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Temporary password"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select 
                        value={userForm.role} 
                        onValueChange={(value) => setUserForm(prev => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin - Full access</SelectItem>
                          <SelectItem value="manager">Manager - Management access</SelectItem>
                          <SelectItem value="cashier">Cashier - POS access</SelectItem>
                          <SelectItem value="inventory">Inventory Staff - Stock management</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <Label>Permissions</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(userForm.permissions).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <Label className="text-sm">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Label>
                            <Switch
                              checked={value}
                              onCheckedChange={(checked) => 
                                setUserForm(prev => ({
                                  ...prev,
                                  permissions: { ...prev.permissions, [key]: checked }
                                }))
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleAddUser} className="flex-1">
                        <Plus className="h-4 w-4 mr-2" />
                        Add User & Send Invite
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
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
      }

      if (subsection === 'change-password') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Change Password</h2>
              <p className="text-muted-foreground">Update your account password</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Password Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button onClick={handleChangePassword} className="bg-save hover:bg-save-hover text-save-foreground">
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      }
    }

    if (section === 'tax') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Tax Settings</h2>
            <p className="text-muted-foreground">Configure tax rates and calculations</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tax Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                  <Input
                    id="defaultTaxRate"
                    type="number"
                    step="0.01"
                    value={taxSettings.defaultTaxRate}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, defaultTaxRate: e.target.value }))}
                    placeholder="8.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxNumber">Tax Number</Label>
                  <Input
                    id="taxNumber"
                    value={taxSettings.taxNumber}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, taxNumber: e.target.value }))}
                    placeholder="Tax registration number"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Tax Inclusive Pricing</Label>
                  <p className="text-sm text-muted-foreground">Prices include tax</p>
                </div>
                <Switch
                  checked={taxSettings.taxInclusive}
                  onCheckedChange={(checked) => setTaxSettings(prev => ({ ...prev, taxInclusive: checked }))}
                />
              </div>

              <Button 
                onClick={() => {
                  localStorage.setItem('tax-settings', JSON.stringify(taxSettings));
                  showSaveToast();
                }}
                className="bg-save hover:bg-save-hover text-save-foreground"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Tax Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (section === 'backup') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Backup & Restore</h2>
            <p className="text-muted-foreground">Manage your data backups and restoration</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Backup Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Create Backup
                </Button>
                <Button variant="outline" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Restore Backup
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Backup</Label>
                  <p className="text-sm text-muted-foreground">Automatically backup data daily</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Default content when no specific section is selected
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Settings</h2>
          <p className="text-muted-foreground">Configure your POS system</p>
        </div>
        
        <Card>
          <CardContent className="text-center py-12">
            <SettingsIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select a Setting Category</h3>
            <p className="text-muted-foreground">Choose a category from the sidebar to configure your settings</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground">Configure your POS system</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-card border-r border-border">
          <div className="p-4">
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = section === item.id;
                
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => setSearchParams({ section: item.id })}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                    
                    {isActive && item.subsections.length > 0 && (
                      <div className="ml-7 mt-2 space-y-1">
                        {item.subsections.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => setSearchParams({ section: item.id, subsection: sub.id })}
                            className={cn(
                              "w-full text-left px-3 py-1 rounded text-sm transition-colors",
                              subsection === sub.id
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;