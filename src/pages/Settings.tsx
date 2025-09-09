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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useBusiness } from '@/contexts/BusinessContext';
import { countries } from '@/data/countries';
import { supabase } from '@/integrations/supabase/client';
import { showSaveToast, showUploadToast } from '@/components/SettingsToast';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Building2,
  Receipt,
  Calculator,
  Database,
  Shield,
  Users,
  Plus,
  Edit,
  Trash2,
  Save,
  Upload,
  Download,
  Eye,
  EyeOff,
  Mail,
  Crown,
  Star,
  Zap,
  CheckCircle,
  AlertTriangle,
  Globe,
  Palette,
  Monitor,
  Sun,
  Moon,
  Smartphone,
  Printer,
  FileText,
  CreditCard,
  Lock,
  Key,
  UserPlus,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { subscription, hasFeature } = useSubscription();
  const { businesses, currentBusiness, addBusiness, updateBusiness } = useBusiness();
  
  // URL parameters for navigation
  const section = searchParams.get('section') || 'general';
  const subsection = searchParams.get('subsection') || '';
  const mode = searchParams.get('mode') || '';
  const editId = searchParams.get('edit') || '';

  // State management
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showBusinessDialog, setShowBusinessDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
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
    country: '',
    logoUrl: ''
  });

  const [userForm, setUserForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'cashier',
    permissions: {
      pos_access: false,
      pos_view: false,
      pos_edit: false,
      inventory_access: false,
      inventory_view: false,
      inventory_edit: false,
      reports_access: false,
      reports_view: false,
      reports_edit: false,
      settings_access: false,
      settings_view: false,
      settings_edit: false
    }
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [generalSettings, setGeneralSettings] = useState({
    theme: 'system',
    language: 'en',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    autoSave: true,
    notifications: true
  });

  const [receiptSettings, setReceiptSettings] = useState({
    template: 'classic-receipt',
    showLogo: true,
    showAddress: true,
    showPhone: true,
    showEmail: true,
    footerText: 'Thank you for your business!',
    paperSize: 'A4',
    printAutomatically: false
  });

  const [taxSettings, setTaxSettings] = useState({
    defaultTaxRate: 8,
    taxInclusive: false,
    showTaxOnReceipt: true,
    taxNumber: '',
    taxName: 'VAT'
  });

  // Navigation functions
  const updateURL = (newSection: string, newSubsection?: string, newMode?: string, newEditId?: string) => {
    const params = new URLSearchParams();
    params.set('section', newSection);
    if (newSubsection) params.set('subsection', newSubsection);
    if (newMode) params.set('mode', newMode);
    if (newEditId) params.set('edit', newEditId);
    setSearchParams(params);
  };

  // Initialize forms when editing
  useEffect(() => {
    if (mode === 'add' && section === 'business' && subsection === 'business-info') {
      setShowBusinessDialog(true);
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
        country: '',
        logoUrl: ''
      });
    } else if (editId && section === 'business' && subsection === 'business-info') {
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
        setSelectedCountry(business.country);
        setSelectedState(business.state);
        setShowBusinessDialog(true);
      }
    }
  }, [mode, editId, section, subsection, businesses]);

  // Business form handlers
  const handleBusinessSubmit = () => {
    if (!businessForm.businessName || !businessForm.businessType) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editId) {
        updateBusiness(editId, {
          ...businessForm,
          operatingHours: currentBusiness?.operatingHours || {}
        });
        toast.success('Business updated successfully!');
      } else {
        addBusiness({
          ...businessForm,
          operatingHours: {
            monday: { open: '09:00', close: '17:00', closed: false },
            tuesday: { open: '09:00', close: '17:00', closed: false },
            wednesday: { open: '09:00', close: '17:00', closed: false },
            thursday: { open: '09:00', close: '17:00', closed: false },
            friday: { open: '09:00', close: '17:00', closed: false },
            saturday: { open: '09:00', close: '17:00', closed: false },
            sunday: { open: '09:00', close: '17:00', closed: true }
          }
        });
        toast.success('Business added successfully!');
      }
      
      setShowBusinessDialog(false);
      updateURL('business', 'business-info');
    } catch (error) {
      toast.error('Error saving business information');
    }
  };

  // User form handlers
  const handleUserSubmit = async () => {
    if (!userForm.email || !userForm.password || !userForm.firstName || !userForm.lastName) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Simulate user creation - in production this would create a Supabase user
      toast.success(`User invitation sent to ${userForm.email}!`);
      
      // Reset form
      setUserForm({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'cashier',
        permissions: {
          pos_access: false,
          pos_view: false,
          pos_edit: false,
          inventory_access: false,
          inventory_view: false,
          inventory_edit: false,
          reports_access: false,
          reports_view: false,
          reports_edit: false,
          settings_access: false,
          settings_view: false,
          settings_edit: false
        }
      });
      setShowAddUserDialog(false);
    } catch (error) {
      toast.error('Error creating user');
    }
  };

  // Password change handler
  const handlePasswordChange = async () => {
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

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordDialog(false);
    } catch (error) {
      toast.error('Error changing password');
    }
  };

  // Country/State handlers
  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setSelectedState('');
    setBusinessForm(prev => ({ ...prev, country: countryCode, state: '' }));
  };

  const handleStateChange = (stateCode: string) => {
    setSelectedState(stateCode);
    setBusinessForm(prev => ({ ...prev, state: stateCode }));
  };

  // Get states for selected country
  const selectedCountryData = countries.find(c => c.code === selectedCountry);
  const availableStates = selectedCountryData?.states || [];

  // Sidebar menu structure
  const sidebarMenu = [
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
      id: 'invoice-receipt',
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
        { id: 'permissions', label: 'Permissions' }
      ]
    }
  ];

  // Render main content based on current section/subsection
  const renderMainContent = () => {
    if (section === 'general') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">General Settings</h2>
            <p className="text-muted-foreground">Configure general application preferences</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={generalSettings.theme} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, theme: value }))}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={generalSettings.language} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={generalSettings.currency} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Save</Label>
                    <p className="text-sm text-muted-foreground">Automatically save changes</p>
                  </div>
                  <Switch
                    checked={generalSettings.autoSave}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, autoSave: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">Enable system notifications</p>
                  </div>
                  <Switch
                    checked={generalSettings.notifications}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, notifications: checked }))}
                  />
                </div>
              </div>

              <Button onClick={() => showSaveToast()} className="bg-save hover:bg-save-hover text-save-foreground">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (section === 'business') {
      if (subsection === 'business-info') {
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Business Information</h2>
                <p className="text-muted-foreground">Manage your business details and information</p>
              </div>
              <Button onClick={() => updateURL('business', 'business-info', 'add')} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Business
              </Button>
            </div>

            {/* Business List */}
            <Card>
              <CardHeader>
                <CardTitle>Your Businesses</CardTitle>
              </CardHeader>
              <CardContent>
                {businesses.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Business Added</h3>
                    <p className="text-muted-foreground mb-4">Add your business information to get started</p>
                    <Button onClick={() => updateURL('business', 'business-info', 'add')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your Business
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {businesses.map((business) => (
                      <div key={business.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{business.businessName}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{business.businessType}</p>
                            <p className="text-xs text-muted-foreground">{business.city}, {business.country}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {currentBusiness?.id === business.id && (
                            <Badge variant="default">Current</Badge>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateURL('business', 'business-info', 'edit', business.id)}
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

            {/* Business Dialog */}
            <Dialog open={showBusinessDialog} onOpenChange={setShowBusinessDialog}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editId ? 'Edit Business' : 'Add New Business'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
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
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select value={businessForm.businessType} onValueChange={(value) => setBusinessForm(prev => ({ ...prev, businessType: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail">Retail Store</SelectItem>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="grocery">Grocery Store</SelectItem>
                          <SelectItem value="pharmacy">Pharmacy</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="clothing">Clothing Store</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={businessForm.phone}
                        onChange={(e) => setBusinessForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 555-0123"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={businessForm.email}
                        onChange={(e) => setBusinessForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="business@example.com"
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
                      <Select value={selectedCountry} onValueChange={handleCountryChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
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
                      <Select value={selectedState} onValueChange={handleStateChange} disabled={!selectedCountry}>
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

                  <div className="flex gap-3">
                    <Button onClick={handleBusinessSubmit} className="bg-save hover:bg-save-hover text-save-foreground">
                      <Save className="h-4 w-4 mr-2" />
                      {editId ? 'Update Business' : 'Add Business'}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setShowBusinessDialog(false);
                      updateURL('business', 'business-info');
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {subscription?.plan_id ? subscription.plan_id.charAt(0).toUpperCase() + subscription.plan_id.slice(1) : 'Starter'} Plan
                    </h3>
                    <p className="text-muted-foreground">
                      {subscription?.status === 'active' ? 'Active subscription' : 'Free plan'}
                    </p>
                  </div>
                  <Button onClick={() => navigate('/dashboard/subscription')}>
                    Manage Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }
    }

    if (section === 'invoice-receipt') {
      if (subsection === 'receipt-settings') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Receipt Settings</h2>
              <p className="text-muted-foreground">Configure receipt templates and printing options</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Receipt Template
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Template Style</Label>
                  <Select value={receiptSettings.template} onValueChange={(value) => setReceiptSettings(prev => ({ ...prev, template: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic-receipt">Classic Receipt</SelectItem>
                      <SelectItem value="modern-receipt">Modern Receipt</SelectItem>
                      <SelectItem value="minimal-receipt">Minimal Receipt</SelectItem>
                      <SelectItem value="detailed-receipt">Detailed Receipt</SelectItem>
                      <SelectItem value="thermal-receipt">Thermal Receipt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Show Business Logo</Label>
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
                  <div className="flex items-center justify-between">
                    <Label>Print Automatically</Label>
                    <Switch
                      checked={receiptSettings.printAutomatically}
                      onCheckedChange={(checked) => setReceiptSettings(prev => ({ ...prev, printAutomatically: checked }))}
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

                <Button onClick={() => showSaveToast()} className="bg-save hover:bg-save-hover text-save-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  Save Receipt Settings
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
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Tax Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                  <Input
                    id="defaultTaxRate"
                    type="number"
                    step="0.01"
                    value={taxSettings.defaultTaxRate}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, defaultTaxRate: parseFloat(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxName">Tax Name</Label>
                  <Input
                    id="taxName"
                    value={taxSettings.taxName}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, taxName: e.target.value }))}
                    placeholder="VAT, GST, Sales Tax"
                  />
                </div>
              </div>

              <div className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Tax on Receipt</Label>
                    <p className="text-sm text-muted-foreground">Display tax breakdown</p>
                  </div>
                  <Switch
                    checked={taxSettings.showTaxOnReceipt}
                    onCheckedChange={(checked) => setTaxSettings(prev => ({ ...prev, showTaxOnReceipt: checked }))}
                  />
                </div>
              </div>

              <Button onClick={() => showSaveToast()} className="bg-save hover:bg-save-hover text-save-foreground">
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
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Create Backup
                </Button>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Restore Backup
                </Button>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Regular backups are automatically created daily. You can also create manual backups anytime.
                </AlertDescription>
              </Alert>
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
                <p className="text-muted-foreground">Manage team members and their access permissions</p>
              </div>
              <Button onClick={() => setShowAddUserDialog(true)} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Team Members</h3>
                  <p className="text-muted-foreground mb-4">Add team members to collaborate on your POS system</p>
                  <Button onClick={() => setShowAddUserDialog(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First User
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Add User Dialog */}
            <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
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
                        placeholder="john@company.com"
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
                    <Select value={userForm.role} onValueChange={(value) => setUserForm(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="cashier">Cashier</SelectItem>
                        <SelectItem value="inventory">Inventory Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(userForm.permissions).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            checked={value}
                            onCheckedChange={(checked) => 
                              setUserForm(prev => ({
                                ...prev,
                                permissions: { ...prev.permissions, [key]: checked }
                              }))
                            }
                          />
                          <Label className="text-sm">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleUserSubmit} className="bg-save hover:bg-save-hover text-save-foreground">
                      <Send className="h-4 w-4 mr-2" />
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
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Password Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
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
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
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
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handlePasswordChange} className="bg-save hover:bg-save-hover text-save-foreground">
                    <Save className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }
    }

    // Default content when no specific section is selected
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Settings</h2>
          <p className="text-muted-foreground">Select a section from the sidebar to configure your settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sidebarMenu.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => updateURL(item.id)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Configure {item.label.toLowerCase()} settings
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
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
              {sidebarMenu.map((item) => {
                const Icon = item.icon;
                const isActive = section === item.id;
                
                return (
                  <div key={item.id}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-2",
                        isActive && "bg-primary/10 text-primary"
                      )}
                      onClick={() => updateURL(item.id)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                    
                    {/* Subsections */}
                    {isActive && item.subsections.length > 0 && (
                      <div className="ml-6 mt-2 space-y-1">
                        {item.subsections.map((sub) => (
                          <Button
                            key={sub.id}
                            variant={subsection === sub.id ? "secondary" : "ghost"}
                            size="sm"
                            className="w-full justify-start text-sm"
                            onClick={() => updateURL(item.id, sub.id)}
                          >
                            {sub.label}
                          </Button>
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
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;