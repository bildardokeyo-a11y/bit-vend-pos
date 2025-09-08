import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FeatureGate } from '@/components/FeatureGate';
import { SubscriptionBadge } from '@/components/SubscriptionBadge';
import { showSaveToast, showUploadToast } from '@/components/SettingsToast';
import { useBusiness } from '@/contexts/BusinessContext';
import { countries } from '@/data/countries';
import { 
  Settings as SettingsIcon, 
  Building2, 
  Monitor, 
  Printer, 
  Scan, 
  DollarSign, 
  Shield, 
  Palette, 
  Bell, 
  Mail, 
  Save, 
  Upload, 
  Plus, 
  Edit, 
  Trash2, 
  Crown,
  CreditCard,
  User,
  Globe,
  Clock,
  Camera,
  FileText,
  Database,
  Smartphone,
  Wifi,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { businesses, currentBusiness, addBusiness, updateBusiness } = useBusiness();
  
  // Get URL parameters for navigation
  const section = searchParams.get('section') || 'business';
  const subsection = searchParams.get('subsection') || 'business-info';
  const editId = searchParams.get('edit');
  const mode = searchParams.get('mode');

  // Settings state
  const [activeSection, setActiveSection] = useState(section);
  const [activeSubsection, setActiveSubsection] = useState(subsection);
  const [showPassword, setShowPassword] = useState(false);

  // Business form state
  const [businessForm, setBusinessForm] = useState(() => {
    if (editId) {
      const business = businesses.find(b => b.id === editId);
      return business ? {
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
        country: business.country,
        operatingHours: business.operatingHours
      } : getDefaultBusinessForm();
    }
    return currentBusiness ? {
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
      country: currentBusiness.country,
      operatingHours: currentBusiness.operatingHours
    } : getDefaultBusinessForm();
  });

  function getDefaultBusinessForm() {
    return {
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
      country: 'US',
      operatingHours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '09:00', close: '17:00', closed: false },
        sunday: { open: '09:00', close: '17:00', closed: true },
      }
    };
  }

  // Update URL when section/subsection changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('section', activeSection);
    params.set('subsection', activeSubsection);
    if (editId) params.set('edit', editId);
    if (mode) params.set('mode', mode);
    setSearchParams(params);
  }, [activeSection, activeSubsection, editId, mode, setSearchParams]);

  // Handle section navigation
  const handleSectionChange = (newSection: string, newSubsection?: string) => {
    setActiveSection(newSection);
    if (newSubsection) {
      setActiveSubsection(newSubsection);
    } else {
      // Set default subsection for each section
      const defaultSubsections = {
        business: 'business-info',
        'pos-terminal': 'receipt-settings',
        system: 'general',
        hardware: 'receipt-printer',
        app: 'invoice-templates',
        security: 'general'
      };
      setActiveSubsection(defaultSubsections[newSection as keyof typeof defaultSubsections] || 'general');
    }
  };

  // Handle business form submission
  const handleBusinessSubmit = () => {
    try {
      if (mode === 'add') {
        const newBusinessId = addBusiness(businessForm);
        showSaveToast('New business created successfully!');
        navigate('/dashboard/settings?section=business&subsection=business-info');
      } else if (editId) {
        updateBusiness(editId, businessForm);
        showSaveToast('Business updated successfully!');
        navigate('/dashboard/settings?section=business&subsection=business-info');
      } else if (currentBusiness) {
        updateBusiness(currentBusiness.id, businessForm);
        showSaveToast('Business information saved successfully!');
      }
    } catch (error) {
      console.error('Error saving business:', error);
    }
  };

  // Get available states for selected country
  const selectedCountry = countries.find(c => c.code === businessForm.country);
  const availableStates = selectedCountry?.states || [];

  // Get available cities for selected state
  const selectedState = availableStates.find(s => s.code === businessForm.state);
  const availableCities = selectedState?.cities || [];

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

  const sidebarSections = [
    {
      title: 'Business',
      icon: Building2,
      key: 'business',
      subsections: [
        { key: 'business-info', label: 'Business Information', icon: Building2 },
        { key: 'business-operating-hours', label: 'Operating Hours', icon: Clock },
        { key: 'business-locations', label: 'Locations & Branches', icon: Globe },
        { key: 'subscription', label: 'Subscription', icon: CreditCard, feature: 'basic_sales_tracking' }
      ]
    },
    {
      title: 'POS Terminal',
      icon: Monitor,
      key: 'pos-terminal',
      subsections: [
        { key: 'receipt-settings', label: 'Receipt Settings', icon: FileText },
        { key: 'terminal-behavior', label: 'Terminal Behavior', icon: Monitor },
        { key: 'display-settings', label: 'Display Settings', icon: Eye }
      ]
    },
    {
      title: 'System',
      icon: SettingsIcon,
      key: 'system',
      subsections: [
        { key: 'general', label: 'General', icon: SettingsIcon },
        { key: 'email-templates', label: 'Email Templates', icon: Mail },
        { key: 'backup', label: 'Backup', icon: Database }
      ]
    },
    {
      title: 'Hardware',
      icon: Printer,
      key: 'hardware',
      subsections: [
        { key: 'receipt-printer', label: 'Receipt Printer', icon: Printer },
        { key: 'barcode-scanner', label: 'Barcode Scanner', icon: Scan },
        { key: 'cash-drawer', label: 'Cash Drawer', icon: DollarSign }
      ]
    },
    {
      title: 'App Settings',
      icon: Smartphone,
      key: 'app',
      subsections: [
        { key: 'invoice-templates', label: 'Invoice Templates', icon: FileText },
        { key: 'notifications', label: 'Notifications', icon: Bell },
        { key: 'theme', label: 'Theme', icon: Palette }
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      key: 'security',
      subsections: [
        { key: 'general', label: 'General', icon: Shield },
        { key: 'sessions', label: 'Sessions', icon: User },
        { key: 'audit', label: 'Audit Logs', icon: FileText }
      ]
    }
  ];

  return (
    <div className="flex h-full bg-background animate-fadeInUp">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r border-border p-6 overflow-y-auto animate-slideInLeft">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Settings</h2>
            <SubscriptionBadge />
          </div>
          
          <nav className="space-y-2">
            {sidebarSections.map((section, sectionIndex) => {
              const SectionIcon = section.icon;
              const isActiveSection = activeSection === section.key;
              
              return (
                <div key={section.key} className="animate-fadeInUp" style={{ animationDelay: `${sectionIndex * 0.1}s` }}>
                  <Button
                    variant={isActiveSection ? "secondary" : "ghost"}
                    className="w-full justify-start mb-2 transition-all duration-200 hover:scale-105"
                    onClick={() => handleSectionChange(section.key)}
                  >
                    <SectionIcon className="mr-2 h-4 w-4" />
                    {section.title}
                  </Button>
                  
                  {isActiveSection && (
                    <div className="ml-4 space-y-1 animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
                      {section.subsections.map((subsection, subIndex) => {
                        const SubIcon = subsection.icon;
                        const isActiveSubsection = activeSubsection === subsection.key;
                        
                        const content = (
                          <Button
                            key={subsection.key}
                            variant={isActiveSubsection ? "default" : "ghost"}
                            size="sm"
                            className="w-full justify-start transition-all duration-200 hover:scale-105 animate-fadeInUp"
                            style={{ animationDelay: `${subIndex * 0.05}s` }}
                            onClick={() => setActiveSubsection(subsection.key)}
                          >
                            <SubIcon className="mr-2 h-3 w-3" />
                            {subsection.label}
                          </Button>
                        );

                        return subsection.feature ? (
                          <FeatureGate key={subsection.key} feature={subsection.feature as any} showUpgrade={false}>
                            {content}
                          </FeatureGate>
                        ) : content;
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
        {/* Business Information */}
        {activeSection === 'business' && activeSubsection === 'business-info' && (
          <div className="space-y-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Business Information</h1>
                <p className="text-muted-foreground">Manage your business details and branding</p>
              </div>
              {(mode === 'add' || editId) && (
                <Button variant="outline" onClick={() => navigate('/dashboard/settings?section=business&subsection=business-info')}>
                  Cancel
                </Button>
              )}
            </div>

            <Card className="animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {mode === 'add' ? 'Add New Business' : editId ? 'Edit Business' : 'Business Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={businessForm.businessName}
                        onChange={(e) => setBusinessForm({...businessForm, businessName: e.target.value})}
                        placeholder="Your Business Name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select value={businessForm.businessType} onValueChange={(value) => setBusinessForm({...businessForm, businessType: value})}>
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

                    <div>
                      <Label htmlFor="taxId">Tax ID</Label>
                      <Input
                        id="taxId"
                        value={businessForm.taxId}
                        onChange={(e) => setBusinessForm({...businessForm, taxId: e.target.value})}
                        placeholder="Tax identification number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="businessLicense">Business License</Label>
                      <Input
                        id="businessLicense"
                        value={businessForm.businessLicense}
                        onChange={(e) => setBusinessForm({...businessForm, businessLicense: e.target.value})}
                        placeholder="Business license number"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={businessForm.phone}
                        onChange={(e) => setBusinessForm({...businessForm, phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={businessForm.email}
                        onChange={(e) => setBusinessForm({...businessForm, email: e.target.value})}
                        placeholder="business@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="logoUrl">Logo URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="logoUrl"
                          value={businessForm.logoUrl}
                          onChange={(e) => setBusinessForm({...businessForm, logoUrl: e.target.value})}
                          placeholder="https://example.com/logo.png"
                        />
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Address Information</h3>
                  
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={businessForm.address}
                      onChange={(e) => setBusinessForm({...businessForm, address: e.target.value})}
                      placeholder="123 Business Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select 
                        value={businessForm.country} 
                        onValueChange={(value) => setBusinessForm({...businessForm, country: value, state: '', city: ''})}
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

                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Select 
                        value={businessForm.state} 
                        onValueChange={(value) => setBusinessForm({...businessForm, state: value, city: ''})}
                        disabled={!selectedCountry}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={selectedCountry ? "Select state" : "Select country first"} />
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

                    <div>
                      <Label htmlFor="city">City</Label>
                      <Select 
                        value={businessForm.city} 
                        onValueChange={(value) => setBusinessForm({...businessForm, city: value})}
                        disabled={!selectedState}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={selectedState ? "Select city" : "Select state first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={businessForm.postalCode}
                      onChange={(e) => setBusinessForm({...businessForm, postalCode: e.target.value})}
                      placeholder="12345"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleBusinessSubmit} className="bg-save hover:bg-save-hover text-save-foreground">
                    <Save className="h-4 w-4 mr-2" />
                    {mode === 'add' ? 'Create Business' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Operating Hours */}
        {activeSection === 'business' && activeSubsection === 'business-operating-hours' && (
          <div className="space-y-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Operating Hours</h1>
              <p className="text-muted-foreground">Set your business operating schedule</p>
            </div>

            <Card className="animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Weekly Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(businessForm.operatingHours).map(([day, hours], index) => (
                  <div key={day} className="flex items-center gap-4 animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="w-24">
                      <Label className="capitalize">{day}</Label>
                    </div>
                    <Switch
                      checked={!hours.closed}
                      onCheckedChange={(checked) => 
                        setBusinessForm({
                          ...businessForm,
                          operatingHours: {
                            ...businessForm.operatingHours,
                            [day]: { ...hours, closed: !checked }
                          }
                        })
                      }
                    />
                    {!hours.closed && (
                      <>
                        <Input
                          type="time"
                          value={hours.open}
                          onChange={(e) => 
                            setBusinessForm({
                              ...businessForm,
                              operatingHours: {
                                ...businessForm.operatingHours,
                                [day]: { ...hours, open: e.target.value }
                              }
                            })
                          }
                          className="w-32"
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={hours.close}
                          onChange={(e) => 
                            setBusinessForm({
                              ...businessForm,
                              operatingHours: {
                                ...businessForm.operatingHours,
                                [day]: { ...hours, close: e.target.value }
                              }
                            })
                          }
                          className="w-32"
                        />
                      </>
                    )}
                    {hours.closed && (
                      <span className="text-muted-foreground">Closed</span>
                    )}
                  </div>
                ))}
                
                <div className="flex justify-end pt-4">
                  <Button onClick={handleBusinessSubmit} className="bg-save hover:bg-save-hover text-save-foreground">
                    <Save className="h-4 w-4 mr-2" />
                    Save Hours
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Subscription */}
        {activeSection === 'business' && activeSubsection === 'subscription' && (
          <div className="space-y-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Subscription Management</h1>
              <p className="text-muted-foreground">Manage your subscription plan and billing</p>
            </div>
            
            <Card className="animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription Plans
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  View and manage your subscription plans, billing information, and payment methods.
                </p>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={() => navigate('/dashboard/subscription')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    View Plans & Pricing
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/dashboard/subscription/manage')}
                  >
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Manage Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Receipt Settings */}
        {activeSection === 'pos-terminal' && activeSubsection === 'receipt-settings' && (
          <div className="space-y-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Receipt Settings</h1>
              <p className="text-muted-foreground">Configure receipt templates and printing options</p>
            </div>

            <Card className="animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle>Receipt Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Template Style</Label>
                  <Select defaultValue="classic-receipt">
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

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Print</Label>
                    <p className="text-sm text-muted-foreground">Automatically print receipt after payment</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => showSaveToast()} className="bg-save hover:bg-save-hover text-save-foreground">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Default placeholder for other sections */}
        {(activeSection !== 'business' || (activeSubsection !== 'business-info' && activeSubsection !== 'business-operating-hours' && activeSubsection !== 'subscription')) && 
         (activeSection !== 'pos-terminal' || activeSubsection !== 'receipt-settings') && (
          <div className="space-y-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div>
              <h1 className="text-2xl font-bold text-foreground capitalize">
                {activeSubsection.replace('-', ' ')} Settings
              </h1>
              <p className="text-muted-foreground">
                Configure {activeSubsection.replace('-', ' ').toLowerCase()} options
              </p>
            </div>

            <Card className="animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-12 text-center">
                <SettingsIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Settings Panel</h3>
                <p className="text-muted-foreground">
                  This settings section is under development. More options will be available soon.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;