import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { SubscriptionBadge } from '@/components/SubscriptionBadge';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useBusiness } from '@/contexts/BusinessContext';
import { countries } from '@/data/countries';
import { showSaveToast, showUploadToast } from '@/components/SettingsToast';
import { supabase } from '@/integrations/supabase/client';
import {
  Settings as SettingsIcon,
  Building2,
  Receipt,
  Calculator,
  Database,
  Shield,
  Palette,
  Bell,
  Globe,
  Clock,
  CreditCard,
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Upload,
  Crown,
  Mail,
  Lock,
  UserPlus,
  Key
} from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { subscription, hasFeature } = useSubscription();
  const { businesses, currentBusiness, addBusiness, updateBusiness, setCurrentBusiness } = useBusiness();
  
  const section = searchParams.get('section') || 'general';
  const subsection = searchParams.get('subsection') || 'appearance';
  const editId = searchParams.get('edit');
  const mode = searchParams.get('mode');

  const [fadeKey, setFadeKey] = useState(0);
  const [showSaveButton, setShowSaveButton] = useState(false);

  // General Settings State
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

  // Business Form State
  const [businessForm, setBusinessForm] = useState({
    businessName: '',
    businessType: 'retail',
    taxId: '',
    businessLicense: '',
    phone: '',
    email: '',
    logoUrl: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US'
  });

  // Operating Hours State
  const [operatingHours, setOperatingHours] = useState({
    monday: { open: '09:00', close: '17:00', closed: false },
    tuesday: { open: '09:00', close: '17:00', closed: false },
    wednesday: { open: '09:00', close: '17:00', closed: false },
    thursday: { open: '09:00', close: '17:00', closed: false },
    friday: { open: '09:00', close: '17:00', closed: false },
    saturday: { open: '09:00', close: '17:00', closed: false },
    sunday: { open: '09:00', close: '17:00', closed: true }
  });

  // Receipt Settings State
  const [receiptSettings, setReceiptSettings] = useState({
    template: 'classic-receipt',
    footerText: 'Thank you for your business!',
    paperSize: 'A4',
    fontSize: 12,
    showLogo: true,
    showBarcode: true,
    showTax: true,
    showDiscount: true
  });

  // Tax Settings State
  const [taxSettings, setTaxSettings] = useState({
    defaultTaxRate: 8,
    taxName: 'Sales Tax',
    taxNumber: '',
    calculationMethod: 'exclusive',
    enableTaxReporting: true,
    roundTaxes: true
  });

  // Backup Settings State
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    includeImages: true,
    includeReports: true,
    retentionDays: 30
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    requireStrongPassword: true,
    enableTwoFactor: false,
    passwordMinLength: 8,
    passwordRequireNumbers: true,
    passwordRequireSymbols: false
  });

  // User Management State
  const [users, setUsers] = useState([]);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'cashier',
    permissions: {
      dashboard: true,
      checkout: true,
      sales: false,
      products: false,
      customers: false,
      inventory: false,
      reports: false,
      settings: false
    }
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Load settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem('pos-general-settings');
        if (saved) {
          setGeneralSettings({ ...generalSettings, ...JSON.parse(saved) });
        }

        const savedReceipt = localStorage.getItem('pos-receipt-settings');
        if (savedReceipt) {
          setReceiptSettings({ ...receiptSettings, ...JSON.parse(savedReceipt) });
        }

        const savedTax = localStorage.getItem('pos-tax-settings');
        if (savedTax) {
          setTaxSettings({ ...taxSettings, ...JSON.parse(savedTax) });
        }

        const savedBackup = localStorage.getItem('pos-backup-settings');
        if (savedBackup) {
          setBackupSettings({ ...backupSettings, ...JSON.parse(savedBackup) });
        }

        const savedSecurity = localStorage.getItem('pos-security-settings');
        if (savedSecurity) {
          setSecuritySettings({ ...securitySettings, ...JSON.parse(savedSecurity) });
        }

        const savedUsers = localStorage.getItem('pos-users');
        if (savedUsers) {
          setUsers(JSON.parse(savedUsers));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Load business data when editing
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
          logoUrl: business.logoUrl || '',
          address: business.address,
          city: business.city,
          state: business.state,
          postalCode: business.postalCode,
          country: business.country
        });
        setOperatingHours(business.operatingHours);
      }
    } else if (mode === 'add') {
      // Reset form for new business
      setBusinessForm({
        businessName: '',
        businessType: 'retail',
        taxId: '',
        businessLicense: '',
        phone: '',
        email: '',
        logoUrl: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US'
      });
    } else if (currentBusiness && !editId) {
      // Load current business data
      setBusinessForm({
        businessName: currentBusiness.businessName,
        businessType: currentBusiness.businessType,
        taxId: currentBusiness.taxId,
        businessLicense: currentBusiness.businessLicense,
        phone: currentBusiness.phone,
        email: currentBusiness.email,
        logoUrl: currentBusiness.logoUrl || '',
        address: currentBusiness.address,
        city: currentBusiness.city,
        state: currentBusiness.state,
        postalCode: currentBusiness.postalCode,
        country: currentBusiness.country
      });
      setOperatingHours(currentBusiness.operatingHours);
    }
  }, [editId, mode, currentBusiness, businesses]);

  // Trigger fade transition when section changes
  useEffect(() => {
    setFadeKey(prev => prev + 1);
  }, [section, subsection]);

  const handleSectionChange = (newSection: string, newSubsection?: string) => {
    const params = new URLSearchParams();
    params.set('section', newSection);
    if (newSubsection) {
      params.set('subsection', newSubsection);
    }
    setSearchParams(params);
  };

  const saveGeneralSettings = () => {
    localStorage.setItem('pos-general-settings', JSON.stringify(generalSettings));
    setShowSaveButton(false);
    showSaveToast();
  };

  const saveReceiptSettings = () => {
    localStorage.setItem('pos-receipt-settings', JSON.stringify(receiptSettings));
    setShowSaveButton(false);
    showSaveToast();
  };

  const saveTaxSettings = () => {
    localStorage.setItem('pos-tax-settings', JSON.stringify(taxSettings));
    setShowSaveButton(false);
    showSaveToast();
  };

  const saveBackupSettings = () => {
    localStorage.setItem('pos-backup-settings', JSON.stringify(backupSettings));
    setShowSaveButton(false);
    showSaveToast();
  };

  const saveSecuritySettings = () => {
    localStorage.setItem('pos-security-settings', JSON.stringify(securitySettings));
    setShowSaveButton(false);
    showSaveToast();
  };

  const saveBusiness = () => {
    try {
      if (editId) {
        // Update existing business
        updateBusiness(editId, {
          ...businessForm,
          operatingHours
        });
        toast.success('Business updated successfully!');
      } else if (mode === 'add') {
        // Add new business
        const newBusinessId = addBusiness({
          ...businessForm,
          operatingHours
        });
        setCurrentBusiness(newBusinessId);
        toast.success('Business created successfully!');
        // Navigate back to business info without edit mode
        setSearchParams(new URLSearchParams([['section', 'business'], ['subsection', 'business-info']]));
      } else if (currentBusiness) {
        // Update current business
        updateBusiness(currentBusiness.id, {
          ...businessForm,
          operatingHours
        });
        toast.success('Business information updated successfully!');
      }
      setShowSaveButton(false);
    } catch (error) {
      toast.error('Error saving business information');
      console.error('Error saving business:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      // Validate form
      if (!newUser.email || !newUser.password || !newUser.firstName || !newUser.lastName) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (newUser.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }

      // In a real implementation, this would create the user in Supabase
      const userData = {
        id: Date.now().toString(),
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        permissions: newUser.permissions,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        inviteSent: true
      };

      const updatedUsers = [...users, userData];
      setUsers(updatedUsers);
      localStorage.setItem('pos-users', JSON.stringify(updatedUsers));

      // Reset form
      setNewUser({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'cashier',
        permissions: {
          dashboard: true,
          checkout: true,
          sales: false,
          products: false,
          customers: false,
          inventory: false,
          reports: false,
          settings: false
        }
      });

      setShowAddUserDialog(false);
      toast.success(`User ${userData.firstName} ${userData.lastName} has been created and invitation sent to ${userData.email}`);
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        toast.error('Please fill in all password fields');
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

      // In a real implementation, this would update the password in Supabase
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) {
        toast.error('Failed to change password: ' + error.message);
        return;
      }

      toast.success('Password changed successfully!');
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

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('pos-users', JSON.stringify(updatedUsers));
      toast.success('User deleted successfully');
    }
  };

  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('pos-users', JSON.stringify(updatedUsers));
    toast.success('User status updated');
  };

  const sidebarSections = [
    {
      title: 'General',
      icon: SettingsIcon,
      items: [
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'language', label: 'Language & Region', icon: Globe }
      ]
    },
    {
      title: 'Business',
      icon: Building2,
      items: [
        { id: 'business-info', label: 'Business Information', icon: Building2 },
        { id: 'business-operating-hours', label: 'Operating Hours', icon: Clock },
        { id: 'subscription', label: 'Subscription', icon: CreditCard }
      ]
    },
    {
      title: 'Invoice',
      icon: Receipt,
      items: [
        { id: 'receipt-settings', label: 'Receipt Settings', icon: Receipt },
        { id: 'template', label: 'Template', icon: Receipt },
        { id: 'numbering', label: 'Numbering', icon: Calculator }
      ]
    },
    {
      title: 'Tax',
      icon: Calculator,
      items: [
        { id: 'tax-rates', label: 'Tax Rates', icon: Calculator },
        { id: 'advanced-tax', label: 'Advanced Settings', icon: Settings }
      ]
    },
    {
      title: 'Backup',
      icon: Database,
      items: [
        { id: 'backup-create', label: 'Create Backup', icon: Database },
        { id: 'backup-schedule', label: 'Automatic Backups', icon: Clock },
        { id: 'backup-history', label: 'Backup History', icon: Database }
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        { id: 'security-general', label: 'General Security', icon: Shield },
        { id: 'user-management', label: 'User Management', icon: Users },
        { id: 'change-password', label: 'Change Password', icon: Key }
      ]
    }
  ];

  const businessTypes = [
    { value: 'retail', label: 'Retail Store' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'grocery', label: 'Grocery Store' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'electronics', label: 'Electronics Store' },
    { value: 'clothing', label: 'Clothing Store' },
    { value: 'service', label: 'Service Business' },
    { value: 'other', label: 'Other' }
  ];

  const receiptTemplates = [
    { id: 'classic-receipt', name: 'Classic Receipt', description: 'Traditional receipt layout' },
    { id: 'modern-receipt', name: 'Modern Receipt', description: 'Clean modern design' },
    { id: 'minimal-receipt', name: 'Minimal Receipt', description: 'Simple minimal layout' },
    { id: 'detailed-receipt', name: 'Detailed Receipt', description: 'Comprehensive information' },
    { id: 'thermal-receipt', name: 'Thermal Receipt', description: 'Optimized for thermal printers' }
  ];

  const userRoles = [
    { value: 'admin', label: 'Administrator', description: 'Full system access' },
    { value: 'manager', label: 'Manager', description: 'Management and reporting access' },
    { value: 'cashier', label: 'Cashier', description: 'POS and basic operations' },
    { value: 'inventory', label: 'Inventory Staff', description: 'Inventory management only' }
  ];

  const permissionLabels = {
    dashboard: 'Dashboard',
    checkout: 'POS/Checkout',
    sales: 'Sales Management',
    products: 'Product Management',
    customers: 'Customer Management',
    inventory: 'Inventory Management',
    reports: 'Reports & Analytics',
    settings: 'Settings Access'
  };

  // Get available states for selected country
  const getStatesForCountry = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    return country?.states || [];
  };

  const selectedCountryStates = getStatesForCountry(businessForm.country);

  const renderContent = () => {
    if (section === 'general') {
      if (subsection === 'appearance') {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select 
                    value={generalSettings.theme} 
                    onValueChange={(value) => {
                      setGeneralSettings({...generalSettings, theme: value});
                      setShowSaveButton(true);
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
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={generalSettings.primaryColor}
                      onChange={(e) => {
                        setGeneralSettings({...generalSettings, primaryColor: e.target.value});
                        setShowSaveButton(true);
                      }}
                      className="w-16 h-10"
                    />
                    <Input
                      value={generalSettings.primaryColor}
                      onChange={(e) => {
                        setGeneralSettings({...generalSettings, primaryColor: e.target.value});
                        setShowSaveButton(true);
                      }}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Font Size: {generalSettings.fontSize}px</Label>
                <input
                  type="range"
                  min="12"
                  max="18"
                  value={generalSettings.fontSize}
                  onChange={(e) => {
                    setGeneralSettings({...generalSettings, fontSize: parseInt(e.target.value)});
                    setShowSaveButton(true);
                  }}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
                  </div>
                  <Switch
                    checked={generalSettings.compactMode}
                    onCheckedChange={(checked) => {
                      setGeneralSettings({...generalSettings, compactMode: checked});
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
                      setGeneralSettings({...generalSettings, animationsEnabled: checked});
                      setShowSaveButton(true);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }

      if (subsection === 'notifications') {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
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
                      setGeneralSettings({...generalSettings, emailNotifications: checked});
                      setShowSaveButton(true);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={generalSettings.smsNotifications}
                    onCheckedChange={(checked) => {
                      setGeneralSettings({...generalSettings, smsNotifications: checked});
                      setShowSaveButton(true);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                  </div>
                  <Switch
                    checked={generalSettings.pushNotifications}
                    onCheckedChange={(checked) => {
                      setGeneralSettings({...generalSettings, pushNotifications: checked});
                      setShowSaveButton(true);
                    }}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Alert Types</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when products are low in stock</p>
                  </div>
                  <Switch
                    checked={generalSettings.lowStockAlerts}
                    onCheckedChange={(checked) => {
                      setGeneralSettings({...generalSettings, lowStockAlerts: checked});
                      setShowSaveButton(true);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sales Alerts</Label>
                    <p className="text-sm text-muted-foreground">Daily sales summary notifications</p>
                  </div>
                  <Switch
                    checked={generalSettings.salesAlerts}
                    onCheckedChange={(checked) => {
                      setGeneralSettings({...generalSettings, salesAlerts: checked});
                      setShowSaveButton(true);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>System Alerts</Label>
                    <p className="text-sm text-muted-foreground">System updates and maintenance notifications</p>
                  </div>
                  <Switch
                    checked={generalSettings.systemAlerts}
                    onCheckedChange={(checked) => {
                      setGeneralSettings({...generalSettings, systemAlerts: checked});
                      setShowSaveButton(true);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }

      if (subsection === 'language') {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language & Region Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select 
                    value={generalSettings.language} 
                    onValueChange={(value) => {
                      setGeneralSettings({...generalSettings, language: value});
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
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time Format</Label>
                  <Select 
                    value={generalSettings.timeFormat} 
                    onValueChange={(value) => {
                      setGeneralSettings({...generalSettings, timeFormat: value});
                      setShowSaveButton(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 Hour (AM/PM)</SelectItem>
                      <SelectItem value="24">24 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }
    }

    if (section === 'business') {
      if (subsection === 'business-info') {
        // Check if we need to show "add business" prompt
        if (businesses.length === 0 && !mode) {
          return (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business Setup Required
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-12">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Business Found</h3>
                <p className="text-muted-foreground mb-6">
                  You need to set up your business information to continue using the POS system.
                </p>
                <Button 
                  onClick={() => setSearchParams(new URLSearchParams([['section', 'business'], ['subsection', 'business-info'], ['mode', 'add']]))}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Your Business
                </Button>
              </CardContent>
            </Card>
          );
        }

        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business Information
                </div>
                {!editId && !mode && businesses.length > 0 && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSearchParams(new URLSearchParams([['section', 'business'], ['subsection', 'business-info'], ['mode', 'add']]))}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Business
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Business Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={businessForm.businessName}
                    onChange={(e) => {
                      setBusinessForm({...businessForm, businessName: e.target.value});
                      setShowSaveButton(true);
                    }}
                    placeholder="Your Business Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select 
                    value={businessForm.businessType} 
                    onValueChange={(value) => {
                      setBusinessForm({...businessForm, businessType: value});
                      setShowSaveButton(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={businessForm.taxId}
                    onChange={(e) => {
                      setBusinessForm({...businessForm, taxId: e.target.value});
                      setShowSaveButton(true);
                    }}
                    placeholder="Tax identification number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessLicense">Business License</Label>
                  <Input
                    id="businessLicense"
                    value={businessForm.businessLicense}
                    onChange={(e) => {
                      setBusinessForm({...businessForm, businessLicense: e.target.value});
                      setShowSaveButton(true);
                    }}
                    placeholder="Business license number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={businessForm.phone}
                    onChange={(e) => {
                      setBusinessForm({...businessForm, phone: e.target.value});
                      setShowSaveButton(true);
                    }}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={businessForm.email}
                    onChange={(e) => {
                      setBusinessForm({...businessForm, email: e.target.value});
                      setShowSaveButton(true);
                    }}
                    placeholder="business@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="logoUrl"
                    value={businessForm.logoUrl}
                    onChange={(e) => {
                      setBusinessForm({...businessForm, logoUrl: e.target.value});
                      setShowSaveButton(true);
                    }}
                    placeholder="https://example.com/logo.png"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="font-medium">Address Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={businessForm.address}
                    onChange={(e) => {
                      setBusinessForm({...businessForm, address: e.target.value});
                      setShowSaveButton(true);
                    }}
                    placeholder="123 Business Street"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={businessForm.city}
                      onChange={(e) => {
                        setBusinessForm({...businessForm, city: e.target.value});
                        setShowSaveButton(true);
                      }}
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Select 
                      value={businessForm.state} 
                      onValueChange={(value) => {
                        setBusinessForm({...businessForm, state: value});
                        setShowSaveButton(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCountryStates.map((state) => (
                          <SelectItem key={state.code} value={state.code}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={businessForm.postalCode}
                      onChange={(e) => {
                        setBusinessForm({...businessForm, postalCode: e.target.value});
                        setShowSaveButton(true);
                      }}
                      placeholder="10001"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select 
                    value={businessForm.country} 
                    onValueChange={(value) => {
                      setBusinessForm({...businessForm, country: value, state: ''});
                      setShowSaveButton(true);
                    }}
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
              </div>
            </CardContent>
          </Card>
        );
      }

      if (subsection === 'business-operating-hours') {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(operatingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-24">
                    <Label className="capitalize font-medium">{day}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!hours.closed}
                      onCheckedChange={(checked) => {
                        setOperatingHours({
                          ...operatingHours,
                          [day]: { ...hours, closed: !checked }
                        });
                        setShowSaveButton(true);
                      }}
                    />
                    <Label className="text-sm">Open</Label>
                  </div>
                  {!hours.closed && (
                    <>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">From:</Label>
                        <Input
                          type="time"
                          value={hours.open}
                          onChange={(e) => {
                            setOperatingHours({
                              ...operatingHours,
                              [day]: { ...hours, open: e.target.value }
                            });
                            setShowSaveButton(true);
                          }}
                          className="w-32"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">To:</Label>
                        <Input
                          type="time"
                          value={hours.close}
                          onChange={(e) => {
                            setOperatingHours({
                              ...operatingHours,
                              [day]: { ...hours, close: e.target.value }
                            });
                            setShowSaveButton(true);
                          }}
                          className="w-32"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      }

      if (subsection === 'subscription') {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Current Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    {subscription?.plan_id || 'Starter'} Plan
                  </p>
                </div>
                <SubscriptionBadge />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => navigate('/dashboard/subscription')}>
                  View All Plans
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard/subscription/manage')}>
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      }
    }

    if (section === 'invoice') {
      if (subsection === 'receipt-settings') {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Receipt Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Paper Size</Label>
                  <Select 
                    value={receiptSettings.paperSize} 
                    onValueChange={(value) => {
                      setReceiptSettings({...receiptSettings, paperSize: value});
                      setShowSaveButton(true);
                    }}
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
                <div className="space-y-2">
                  <Label>Font Size: {receiptSettings.fontSize}px</Label>
                  <input
                    type="range"
                    min="8"
                    max="16"
                    value={receiptSettings.fontSize}
                    onChange={(e) => {
                      setReceiptSettings({...receiptSettings, fontSize: parseInt(e.target.value)});
                      setShowSaveButton(true);
                    }}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Textarea
                  id="footerText"
                  value={receiptSettings.footerText}
                  onChange={(e) => {
                    setReceiptSettings({...receiptSettings, footerText: e.target.value});
                    setShowSaveButton(true);
                  }}
                  placeholder="Thank you for your business!"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Display Options</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>Show Logo</Label>
                    <Switch
                      checked={receiptSettings.showLogo}
                      onCheckedChange={(checked) => {
                        setReceiptSettings({...receiptSettings, showLogo: checked});
                        setShowSaveButton(true);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Barcode</Label>
                    <Switch
                      checked={receiptSettings.showBarcode}
                      onCheckedChange={(checked) => {
                        setReceiptSettings({...receiptSettings, showBarcode: checked});
                        setShowSaveButton(true);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Tax Details</Label>
                    <Switch
                      checked={receiptSettings.showTax}
                      onCheckedChange={(checked) => {
                        setReceiptSettings({...receiptSettings, showTax: checked});
                        setShowSaveButton(true);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Discounts</Label>
                    <Switch
                      checked={receiptSettings.showDiscount}
                      onCheckedChange={(checked) => {
                        setReceiptSettings({...receiptSettings, showDiscount: checked});
                        setShowSaveButton(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }

      if (subsection === 'template') {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Receipt Template
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {receiptTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      receiptSettings.template === template.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    onClick={() => {
                      setReceiptSettings({...receiptSettings, template: template.id});
                      setShowSaveButton(true);
                    }}
                  >
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    {receiptSettings.template === template.id && (
                      <Badge className="mt-2">Selected</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      }

      if (subsection === 'numbering') {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Invoice Numbering
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    placeholder="INV-"
                    defaultValue="INV-"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextNumber">Next Invoice Number</Label>
                  <Input
                    id="nextNumber"
                    type="number"
                    placeholder="1001"
                    defaultValue="1001"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Numbering Format</Label>
                <Select defaultValue="sequential">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sequential">Sequential (INV-001, INV-002)</SelectItem>
                    <SelectItem value="date-based">Date-based (INV-20240101-001)</SelectItem>
                    <SelectItem value="random">Random (INV-A1B2C3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <Label className="text-sm font-medium">Preview</Label>
                <p className="text-lg font-mono mt-1">INV-001</p>
              </div>
            </CardContent>
          </Card>
        );
      }
    }

    if (section === 'tax') {
      if (subsection === 'tax-rates') {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Tax Rate Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                  <Input
                    id="defaultTaxRate"
                    type="number"
                    step="0.01"
                    value={taxSettings.defaultTaxRate}
                    onChange={(e) => {
                      setTaxSettings({...taxSettings, defaultTaxRate: parseFloat(e.target.value) || 0});
                      setShowSaveButton(true);
                    }}
                    placeholder="8.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxName">Tax Name</Label>
                  <Input
                    id="taxName"
                    value={taxSettings.taxName}
                    onChange={(e) => {
                      setTaxSettings({...taxSettings, taxName: e.target.value});
                      setShowSaveButton(true);
                    }}
                    placeholder="Sales Tax"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="taxNumber">Tax Number</Label>
                  <Input
                    id="taxNumber"
                    value={taxSettings.taxNumber}
                    onChange={(e) => {
                      setTaxSettings({...taxSettings, taxNumber: e.target.value});
                      setShowSaveButton(true);
                    }}
                    placeholder="Tax registration number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Calculation Method</Label>
                  <Select 
                    value={taxSettings.calculationMethod} 
                    onValueChange={(value) => {
                      setTaxSettings({...taxSettings, calculationMethod: value});
                      setShowSaveButton(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exclusive">Tax Exclusive</SelectItem>
                      <SelectItem value="inclusive">Tax Inclusive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }

      if (subsection === 'advanced-tax') {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Advanced Tax Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Tax Reporting</Label>
                    <p className="text-sm text-muted-foreground">Generate tax reports for compliance</p>
                  </div>
                  <Switch
                    checked={taxSettings.enableTaxReporting}
                    onCheckedChange={(checked) => {
                      setTaxSettings({...taxSettings, enableTaxReporting: checked});
                      setShowSaveButton(true);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Round Tax Amounts</Label>
                    <p className="text-sm text-muted-foreground">Round tax calculations to nearest cent</p>
                  </div>
                  <Switch
                    checked={taxSettings.roundTaxes}
                    onCheckedChange={(checked) => {
                      setTaxSettings({...taxSettings, roundTaxes: checked});
                      setShowSaveButton(true);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }
    }

    if (section === 'backup') {
      if (subsection === 'backup-create') {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Create Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Select Data to Backup</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="products" defaultChecked />
                    <Label htmlFor="products">Products & Inventory</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sales" defaultChecked />
                    <Label htmlFor="sales">Sales Data</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="customers" defaultChecked />
                    <Label htmlFor="customers">Customer Data</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="settings" defaultChecked />
                    <Label htmlFor="settings">Settings</Label>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => {
                  toast.success('Backup created successfully!');
                  setShowSaveButton(false);
                }}
                className="w-full"
              >
                <Database className="h-4 w-4 mr-2" />
                Create Backup Now
              </Button>
            </CardContent>
          </Card>
        );
      }

      if (subsection === 'backup-schedule') {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Automatic Backups
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">Automatically backup data at scheduled intervals</p>
                </div>
                <Switch
                  checked={backupSettings.autoBackup}
                  onCheckedChange={(checked) => {
                    setBackupSettings({...backupSettings, autoBackup: checked});
                    setShowSaveButton(true);
                  }}
                />
              </div>

              {backupSettings.autoBackup && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Backup Frequency</Label>
                    <Select 
                      value={backupSettings.backupFrequency} 
                      onValueChange={(value) => {
                        setBackupSettings({...backupSettings, backupFrequency: value});
                        setShowSaveButton(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Every Hour</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backupTime">Backup Time</Label>
                    <Input
                      id="backupTime"
                      type="time"
                      value={backupSettings.backupTime}
                      onChange={(e) => {
                        setBackupSettings({...backupSettings, backupTime: e.target.value});
                        setShowSaveButton(true);
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      }

      if (subsection === 'backup-history') {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No backups available</p>
                <p className="text-sm">Create your first backup to see history here</p>
              </div>
            </CardContent>
          </Card>
        );
      }
    }

    if (section === 'security') {
      if (subsection === 'security-general') {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => {
                      setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value) || 30});
                      setShowSaveButton(true);
                    }}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => {
                      setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value) || 5});
                      setShowSaveButton(true);
                    }}
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Password Requirements</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Strong Passwords</Label>
                      <p className="text-sm text-muted-foreground">Enforce password complexity rules</p>
                    </div>
                    <Switch
                      checked={securitySettings.requireStrongPassword}
                      onCheckedChange={(checked) => {
                        setSecuritySettings({...securitySettings, requireStrongPassword: checked});
                        setShowSaveButton(true);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add extra security layer</p>
                    </div>
                    <Switch
                      checked={securitySettings.enableTwoFactor}
                      onCheckedChange={(checked) => {
                        setSecuritySettings({...securitySettings, enableTwoFactor: checked});
                        setShowSaveButton(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }

      if (subsection === 'user-management') {
        if (!hasFeature('multi_user_accounts')) {
          return (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-12">
                <Crown className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Multi-User Feature</h3>
                <p className="text-muted-foreground mb-6">
                  Upgrade to Standard plan or higher to add multiple users to your business.
                </p>
                <Button onClick={() => navigate('/dashboard/subscription')}>
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>
          );
        }

        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </div>
                  <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              value={newUser.firstName}
                              onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                              placeholder="John"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                              id="lastName"
                              value={newUser.lastName}
                              onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                              placeholder="Doe"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            placeholder="john.doe@company.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password">Password *</Label>
                          <Input
                            id="password"
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                            placeholder="Minimum 6 characters"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select 
                            value={newUser.role} 
                            onValueChange={(value) => setNewUser({...newUser, role: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {userRoles.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  <div>
                                    <div className="font-medium">{role.label}</div>
                                    <div className="text-xs text-muted-foreground">{role.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-4">
                          <Label>Permissions</Label>
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(permissionLabels).map(([key, label]) => (
                              <div key={key} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={key}
                                  checked={newUser.permissions[key]}
                                  onChange={(e) => setNewUser({
                                    ...newUser,
                                    permissions: {
                                      ...newUser.permissions,
                                      [key]: e.target.checked
                                    }
                                  })}
                                />
                                <Label htmlFor={key} className="text-sm">{label}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={handleAddUser} className="flex-1">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add User & Send Invite
                          </Button>
                          <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No users added yet</p>
                    <p className="text-sm">Add team members to collaborate on your business</p>
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
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.firstName} {user.lastName}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.isActive ? "default" : "secondary"}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleUserStatus(user.id)}
                              >
                                {user.isActive ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        );
      }

      if (subsection === 'change-password') {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button onClick={handleChangePassword} className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      }
    }

    return (
      <Card>
        <CardContent className="text-center py-12">
          <SettingsIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Settings Section</h3>
          <p className="text-muted-foreground">Configure your {section} settings</p>
        </CardContent>
      </Card>
    );
  };

  const getSaveFunction = () => {
    if (section === 'general') return saveGeneralSettings;
    if (section === 'business') return saveBusiness;
    if (section === 'invoice') return saveReceiptSettings;
    if (section === 'tax') return saveTaxSettings;
    if (section === 'backup') return saveBackupSettings;
    if (section === 'security') return saveSecuritySettings;
    return () => {};
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-6 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Settings</h2>
            <p className="text-sm text-muted-foreground">Configure your POS system</p>
          </div>

          <nav className="space-y-2">
            {sidebarSections.map((sectionItem) => {
              const SectionIcon = sectionItem.icon;
              return (
                <div key={sectionItem.title} className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1">
                    <SectionIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {sectionItem.title}
                    </span>
                  </div>
                  {sectionItem.items.map((item) => {
                    const ItemIcon = item.icon;
                    const isActive = section === sectionItem.title.toLowerCase() && subsection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSectionChange(sectionItem.title.toLowerCase(), item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <ItemIcon className="h-4 w-4" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div key={fadeKey} className="settings-content-fade">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Floating Save Button */}
      {showSaveButton && (
        <div className="fixed bottom-6 right-6 settings-save-button">
          <Button onClick={getSaveFunction()} size="lg" className="shadow-lg">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default Settings;