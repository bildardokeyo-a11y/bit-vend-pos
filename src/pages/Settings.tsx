import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSaveToast } from '@/components/SettingsToast';
import { useBusiness } from '@/contexts/BusinessContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { countries } from '@/data/countries';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Settings as SettingsIcon,
  Building2,
  Receipt,
  Calculator,
  Shield,
  Database,
  ArrowLeft,
  Save,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Users,
  Mail,
  Lock,
  Crown,
  UserPlus,
  Key
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { businesses, currentBusiness, addBusiness, updateBusiness } = useBusiness();
  const { subscription, hasFeature } = useSubscription();
  
  const activeSection = searchParams.get('section') || 'general';
  const activeSubsection = searchParams.get('subsection') || '';
  const editMode = searchParams.get('mode') === 'add';
  const editId = searchParams.get('edit');

  const [fadeKey, setFadeKey] = useState(0);
  const [showSaveButton, setShowSaveButton] = useState(false);

  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    theme: 'light',
    primaryColor: '#3b82f6',
    fontSize: 14,
    compactMode: false,
    animationsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    lowStockAlerts: true,
    salesAlerts: true,
    systemAlerts: true,
    language: 'en',
    timeFormat: '12'
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

  const [invoiceSettings, setInvoiceSettings] = useState({
    receiptTemplate: 'classic-receipt',
    footerText: 'Thank you for your business!',
    paperSize: 'A4',
    fontSize: 12,
    showLogo: true,
    showBusinessInfo: true,
    showTaxInfo: true,
    invoicePrefix: 'INV-',
    nextNumber: 1001,
    numberingFormat: 'sequential'
  });

  const [taxSettings, setTaxSettings] = useState({
    defaultTaxRate: 8,
    taxName: 'VAT',
    taxNumber: '',
    calculationMethod: 'exclusive',
    enableTaxReporting: true,
    taxCategories: ['Standard', 'Reduced', 'Zero-rated']
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    twoFactorEnabled: false
  });

  // User management state
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
      settings_view: false,
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

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('pos-app-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setGeneralSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Update fade key when section changes
  useEffect(() => {
    setFadeKey(prev => prev + 1);
  }, [activeSection, activeSubsection]);

  // Load business data for editing
  useEffect(() => {
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
      }
    } else if (editMode || (!currentBusiness && businesses.length === 0)) {
      // Reset form for new business
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
    }
  }, [editId, editMode, businesses, currentBusiness]);

  const handleSectionChange = (section: string, subsection?: string) => {
    const params = new URLSearchParams();
    params.set('section', section);
    if (subsection) params.set('subsection', subsection);
    setSearchParams(params);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('pos-app-settings', JSON.stringify(generalSettings));
    showSaveToast();
    setShowSaveButton(false);
  };

  const handleBusinessSave = () => {
    if (!businessForm.businessName || !businessForm.email) {
      toast.error('Business name and email are required');
      return;
    }

    try {
      if (editId) {
        updateBusiness(editId, businessForm);
        toast.success('Business updated successfully!');
      } else {
        addBusiness(businessForm);
        toast.success('Business created successfully!');
      }
      
      // Navigate back to business list
      setSearchParams(new URLSearchParams([['section', 'business'], ['subsection', 'business-info']]));
    } catch (error) {
      toast.error('Error saving business information');
    }
  };

  const handleAddUser = async () => {
    if (!userForm.email || !userForm.password || !userForm.firstName || !userForm.lastName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!hasFeature('multi_user_accounts')) {
      toast.error('Multi-user accounts require Standard plan or higher');
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
        status: 'pending',
        createdAt: new Date().toISOString(),
        lastLogin: 'Never'
      };

      setUsers(prev => [...prev, newUser]);
      
      // Simulate sending invitation email
      toast.success(`Invitation sent to ${userForm.email}! They can sign in with the provided credentials.`);
      
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
          settings_view: false,
          user_management: false
        }
      });
      
      setShowAddUserDialog(false);
    } catch (error) {
      toast.error('Error adding user');
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) {
        toast.error('Error changing password: ' + error.message);
        return;
      }

      toast.success('Password changed successfully!');
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setShowChangePasswordDialog(false);
    } catch (error) {
      toast.error('Error changing password');
    }
  };

  const selectedCountry = countries.find(c => c.code === businessForm.country);
  const availableStates = selectedCountry?.states || [];

  const sidebarItems = [
    {
      id: 'general',
      label: 'General',
      icon: SettingsIcon,
      subsections: [
        { id: 'appearance', label: 'Appearance' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'language', label: 'Language & Region' }
      ]
    },
    {
      id: 'business',
      label: 'Business',
      icon: Building2,
      subsections: [
        { id: 'business-info', label: 'Business Information' },
        { id: 'business-operating-hours', label: 'Operating Hours' },
        { id: 'subscription', label: 'Subscription' }
      ]
    },
    {
      id: 'invoice',
      label: 'Invoice & Receipt',
      icon: Receipt,
      subsections: [
        { id: 'receipt-settings', label: 'Receipt Settings' },
        { id: 'template', label: 'Template' },
        { id: 'numbering', label: 'Numbering' }
      ]
    },
    {
      id: 'tax',
      label: 'Tax',
      icon: Calculator,
      subsections: [
        { id: 'tax-rates', label: 'Tax Rates' },
        { id: 'advanced', label: 'Advanced' }
      ]
    },
    {
      id: 'backup',
      label: 'Backup & Restore',
      icon: Database,
      subsections: [
        { id: 'create-backup', label: 'Create Backup' },
        { id: 'schedule', label: 'Schedule' },
        { id: 'history', label: 'History' }
      ]
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      subsections: [
        { id: 'general', label: 'General' },
        { id: 'users', label: 'User Management' },
        { id: 'change-password', label: 'Change Password' }
      ]
    }
  ];

  const renderContent = () => {
    if (activeSection === 'general') {
      if (activeSubsection === 'appearance') {
        return (
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Theme</Label>
                  <Select 
                    value={generalSettings.theme} 
                    onValueChange={(value) => {
                      setGeneralSettings(prev => ({ ...prev, theme: value }));
                      setShowSaveButton(true);
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Primary Color</Label>
                  <div className="flex gap-2 mt-2">
                    {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(color => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${generalSettings.primaryColor === color ? 'border-gray-800' : 'border-gray-300'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setGeneralSettings(prev => ({ ...prev, primaryColor: color }));
                          setShowSaveButton(true);
                        }}
                      />
                    ))}
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
                      setGeneralSettings(prev => ({ ...prev, compactMode: checked }));
                      setShowSaveButton(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Animations</Label>
                    <p className="text-sm text-muted-foreground">Enable smooth transitions</p>
                  </div>
                  <Switch
                    checked={generalSettings.animationsEnabled}
                    onCheckedChange={(checked) => {
                      setGeneralSettings(prev => ({ ...prev, animationsEnabled: checked }));
                      setShowSaveButton(true);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }

      if (activeSubsection === 'notifications') {
        return (
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={generalSettings.emailNotifications}
                    onCheckedChange={(checked) => {
                      setGeneralSettings(prev => ({ ...prev, emailNotifications: checked }));
                      setShowSaveButton(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when items are low in stock</p>
                  </div>
                  <Switch
                    checked={generalSettings.lowStockAlerts}
                    onCheckedChange={(checked) => {
                      setGeneralSettings(prev => ({ ...prev, lowStockAlerts: checked }));
                      setShowSaveButton(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sales Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified about important sales events</p>
                  </div>
                  <Switch
                    checked={generalSettings.salesAlerts}
                    onCheckedChange={(checked) => {
                      setGeneralSettings(prev => ({ ...prev, salesAlerts: checked }));
                      setShowSaveButton(true);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }

      if (activeSubsection === 'language') {
        return (
          <Card>
            <CardHeader>
              <CardTitle>Language & Region Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Language</Label>
                  <Select 
                    value={generalSettings.language} 
                    onValueChange={(value) => {
                      setGeneralSettings(prev => ({ ...prev, language: value }));
                      setShowSaveButton(true);
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

                <div>
                  <Label>Time Format</Label>
                  <Select 
                    value={generalSettings.timeFormat} 
                    onValueChange={(value) => {
                      setGeneralSettings(prev => ({ ...prev, timeFormat: value }));
                      setShowSaveButton(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 Hour</SelectItem>
                      <SelectItem value="24">24 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }

      // Default general section
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Select a subsection from the sidebar to configure general settings.</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeSection === 'business') {
      if (activeSubsection === 'business-info') {
        if (editMode || editId || (!currentBusiness && businesses.length === 0)) {
          return (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {editId ? 'Edit Business' : 'Add New Business'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={businessForm.businessName}
                        onChange={(e) => setBusinessForm(prev => ({ ...prev, businessName: e.target.value }))}
                        placeholder="Your Business Name"
                      />
                    </div>
                    <div>
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
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={businessForm.email}
                        onChange={(e) => setBusinessForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="business@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={businessForm.phone}
                        onChange={(e) => setBusinessForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 555-0123"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={businessForm.address}
                      onChange={(e) => setBusinessForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="123 Business Street"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select 
                        value={businessForm.country} 
                        onValueChange={(value) => {
                          setBusinessForm(prev => ({ ...prev, country: value, state: '' }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map(country => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
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
                          {availableStates.map(state => (
                            <SelectItem key={state.code} value={state.code}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={businessForm.postalCode}
                        onChange={(e) => setBusinessForm(prev => ({ ...prev, postalCode: e.target.value }))}
                        placeholder="12345"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleBusinessSave} className="bg-save hover:bg-save-hover text-save-foreground">
                      <Save className="h-4 w-4 mr-2" />
                      Save Business
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchParams(new URLSearchParams([['section', 'business'], ['subsection', 'business-info']]))}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }

        // Business list view
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Business Information</CardTitle>
                  <Button 
                    onClick={() => setSearchParams(new URLSearchParams([['section', 'business'], ['subsection', 'business-info'], ['mode', 'add']]))}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Business
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {businesses.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Business Added</h3>
                    <p className="text-muted-foreground mb-4">Add your business information to get started</p>
                    <Button 
                      onClick={() => setSearchParams(new URLSearchParams([['section', 'business'], ['subsection', 'business-info'], ['mode', 'add']]))}
                    >
                      Add Your Business
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {businesses.map(business => (
                      <div key={business.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{business.businessName}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{business.businessType}</p>
                          <p className="text-sm text-muted-foreground">{business.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSearchParams(new URLSearchParams([['section', 'business'], ['subsection', 'business-info'], ['edit', business.id]]))}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      }

      if (activeSubsection === 'subscription') {
        return (
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Current Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      {subscription?.plan_id || 'Starter'} Plan
                    </p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => navigate('/dashboard/subscription')}>
                    <Crown className="h-4 w-4 mr-2" />
                    Manage Subscription
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/dashboard/subscription/manage')}>
                    View Billing
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }

      if (activeSubsection === 'business-operating-hours') {
        return (
          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="font-medium w-20">{day}</span>
                      <Switch defaultChecked={day !== 'Sunday'} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Input type="time" defaultValue="09:00" className="w-24" />
                      <span>to</span>
                      <Input type="time" defaultValue="17:00" className="w-24" />
                    </div>
                  </div>
                ))}
                <Button className="bg-save hover:bg-save-hover text-save-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  Save Hours
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      }
    }

    if (activeSection === 'invoice') {
      if (activeSubsection === 'receipt-settings') {
        return (
          <Card>
            <CardHeader>
              <CardTitle>Receipt Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Receipt Template</Label>
                  <Select 
                    value={invoiceSettings.receiptTemplate} 
                    onValueChange={(value) => setInvoiceSettings(prev => ({ ...prev, receiptTemplate: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic-receipt">Classic</SelectItem>
                      <SelectItem value="modern-receipt">Modern</SelectItem>
                      <SelectItem value="minimal-receipt">Minimal</SelectItem>
                      <SelectItem value="detailed-receipt">Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Paper Size</Label>
                  <Select 
                    value={invoiceSettings.paperSize} 
                    onValueChange={(value) => setInvoiceSettings(prev => ({ ...prev, paperSize: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4</SelectItem>
                      <SelectItem value="Letter">Letter</SelectItem>
                      <SelectItem value="Thermal">Thermal (80mm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Footer Text</Label>
                <Textarea
                  value={invoiceSettings.footerText}
                  onChange={(e) => setInvoiceSettings(prev => ({ ...prev, footerText: e.target.value }))}
                  placeholder="Thank you for your business!"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Show Logo</Label>
                  <Switch
                    checked={invoiceSettings.showLogo}
                    onCheckedChange={(checked) => setInvoiceSettings(prev => ({ ...prev, showLogo: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show Business Info</Label>
                  <Switch
                    checked={invoiceSettings.showBusinessInfo}
                    onCheckedChange={(checked) => setInvoiceSettings(prev => ({ ...prev, showBusinessInfo: checked }))}
                  />
                </div>
              </div>

              <Button className="bg-save hover:bg-save-hover text-save-foreground">
                <Save className="h-4 w-4 mr-2" />
                Save Receipt Settings
              </Button>
            </CardContent>
          </Card>
        );
      }

      if (activeSubsection === 'numbering') {
        return (
          <Card>
            <CardHeader>
              <CardTitle>Invoice Numbering</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Invoice Prefix</Label>
                  <Input
                    value={invoiceSettings.invoicePrefix}
                    onChange={(e) => setInvoiceSettings(prev => ({ ...prev, invoicePrefix: e.target.value }))}
                    placeholder="INV-"
                  />
                </div>
                <div>
                  <Label>Next Number</Label>
                  <Input
                    type="number"
                    value={invoiceSettings.nextNumber}
                    onChange={(e) => setInvoiceSettings(prev => ({ ...prev, nextNumber: parseInt(e.target.value) || 1001 }))}
                  />
                </div>
              </div>

              <Button className="bg-save hover:bg-save-hover text-save-foreground">
                <Save className="h-4 w-4 mr-2" />
                Save Numbering Settings
              </Button>
            </CardContent>
          </Card>
        );
      }
    }

    if (activeSection === 'tax') {
      if (activeSubsection === 'tax-rates') {
        return (
          <Card>
            <CardHeader>
              <CardTitle>Tax Rates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Default Tax Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={taxSettings.defaultTaxRate}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, defaultTaxRate: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Tax Name</Label>
                  <Input
                    value={taxSettings.taxName}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, taxName: e.target.value }))}
                    placeholder="VAT, GST, Sales Tax"
                  />
                </div>
              </div>

              <div>
                <Label>Tax Number</Label>
                <Input
                  value={taxSettings.taxNumber}
                  onChange={(e) => setTaxSettings(prev => ({ ...prev, taxNumber: e.target.value }))}
                  placeholder="Your tax registration number"
                />
              </div>

              <Button className="bg-save hover:bg-save-hover text-save-foreground">
                <Save className="h-4 w-4 mr-2" />
                Save Tax Settings
              </Button>
            </CardContent>
          </Card>
        );
      }
    }

    if (activeSection === 'backup') {
      if (activeSubsection === 'create-backup') {
        return (
          <Card>
            <CardHeader>
              <CardTitle>Create Backup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground">Create a backup of your data including products, sales, customers, and settings.</p>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Full System Backup</h3>
                    <p className="text-sm text-muted-foreground">Includes all data and settings</p>
                  </div>
                  <Button>Create Backup</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Data Only Backup</h3>
                    <p className="text-sm text-muted-foreground">Products, sales, and customers only</p>
                  </div>
                  <Button variant="outline">Create Backup</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }
    }

    if (activeSection === 'security') {
      if (activeSubsection === 'users') {
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              value={userForm.firstName}
                              onChange={(e) => setUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                              placeholder="John"
                            />
                          </div>
                          <div>
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
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={userForm.email}
                              onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="john@company.com"
                            />
                          </div>
                          <div>
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

                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Select 
                            value={userForm.role} 
                            onValueChange={(value) => setUserForm(prev => ({ ...prev, role: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin - Full system access</SelectItem>
                              <SelectItem value="manager">Manager - Sales and inventory management</SelectItem>
                              <SelectItem value="cashier">Cashier - POS and basic sales</SelectItem>
                              <SelectItem value="inventory">Inventory Staff - Stock management only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Permissions</Label>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">POS Access</Label>
                              <Switch
                                checked={userForm.permissions.pos_access}
                                onCheckedChange={(checked) => 
                                  setUserForm(prev => ({
                                    ...prev,
                                    permissions: { ...prev.permissions, pos_access: checked }
                                  }))
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Inventory View</Label>
                              <Switch
                                checked={userForm.permissions.inventory_view}
                                onCheckedChange={(checked) => 
                                  setUserForm(prev => ({
                                    ...prev,
                                    permissions: { ...prev.permissions, inventory_view: checked }
                                  }))
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Inventory Edit</Label>
                              <Switch
                                checked={userForm.permissions.inventory_edit}
                                onCheckedChange={(checked) => 
                                  setUserForm(prev => ({
                                    ...prev,
                                    permissions: { ...prev.permissions, inventory_edit: checked }
                                  }))
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Sales View</Label>
                              <Switch
                                checked={userForm.permissions.sales_view}
                                onCheckedChange={(checked) => 
                                  setUserForm(prev => ({
                                    ...prev,
                                    permissions: { ...prev.permissions, sales_view: checked }
                                  }))
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Sales Edit</Label>
                              <Switch
                                checked={userForm.permissions.sales_edit}
                                onCheckedChange={(checked) => 
                                  setUserForm(prev => ({
                                    ...prev,
                                    permissions: { ...prev.permissions, sales_edit: checked }
                                  }))
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Reports View</Label>
                              <Switch
                                checked={userForm.permissions.reports_view}
                                onCheckedChange={(checked) => 
                                  setUserForm(prev => ({
                                    ...prev,
                                    permissions: { ...prev.permissions, reports_view: checked }
                                  }))
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Settings View</Label>
                              <Switch
                                checked={userForm.permissions.settings_view}
                                onCheckedChange={(checked) => 
                                  setUserForm(prev => ({
                                    ...prev,
                                    permissions: { ...prev.permissions, settings_view: checked }
                                  }))
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">User Management</Label>
                              <Switch
                                checked={userForm.permissions.user_management}
                                onCheckedChange={(checked) => 
                                  setUserForm(prev => ({
                                    ...prev,
                                    permissions: { ...prev.permissions, user_management: checked }
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button onClick={handleAddUser} className="flex-1">
                            <Mail className="h-4 w-4 mr-2" />
                            Send Invitation
                          </Button>
                          <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {!hasFeature('multi_user_accounts') ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Multi-User Accounts</h3>
                    <p className="text-muted-foreground mb-4">Upgrade to Standard plan or higher to add team members</p>
                    <Button onClick={() => navigate('/dashboard/subscription')}>
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No Users Added</h3>
                        <p className="text-muted-foreground">Add team members to collaborate on your POS system</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map(user => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{user.role}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                  {user.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{user.lastLogin}</TableCell>
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
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      }

      if (activeSubsection === 'change-password') {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-w-md">
                <div>
                  <Label htmlFor="currentPassword">Current Password *</Label>
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

                <div>
                  <Label htmlFor="newPassword">New Password *</Label>
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

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password *</Label>
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
              </div>
            </CardContent>
          </Card>
        );
      }

      if (activeSubsection === 'general') {
        return (
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 30 }))}
                  />
                </div>
                <div>
                  <Label>Max Login Attempts</Label>
                  <Input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) || 5 }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: checked }))}
                  />
                </div>
              </div>

              <Button className="bg-save hover:bg-save-hover text-save-foreground">
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        );
      }
    }

    // Default fallback
    return (
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Select a section from the sidebar to configure your settings.</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-sm text-muted-foreground">Configure your POS system</p>
            </div>
          </div>
          
          {showSaveButton && (
            <Button 
              onClick={handleSaveSettings}
              className="settings-save-button bg-save hover:bg-save-hover text-save-foreground gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r bg-muted/30 min-h-[calc(100vh-4rem)]">
          <div className="p-4">
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => handleSectionChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                  
                  {activeSection === item.id && item.subsections && (
                    <div className="ml-7 mt-2 space-y-1">
                      {item.subsections.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleSectionChange(item.id, sub.id)}
                          className={`w-full text-left px-3 py-1 text-sm rounded transition-colors ${
                            activeSubsection === sub.id
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div key={fadeKey} className="settings-content-fade">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;