import React, { useState, useCallback, useRef } from 'react';
import { countries, Country, State } from '@/data/countries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Bell, 
  Link as LinkIcon,
  Globe,
  Zap,
  Building,
  MapPin,
  Hash,
  Sliders,
  Palette,
  Key,
  Languages,
  Smartphone,
  FileText,
  Printer,
  ShoppingCart,
  Edit,
  Mail,
  MessageSquare,
  Shield,
  Cookie,
  CreditCard,
  Plug,
  University,
  Percent,
  Coins,
  Database,
  Ban,
  Upload,
  Save,
  X,
  Crown,
  Star,
  Check,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { toast } from "sonner";

type SettingsSection = {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  subsections: {
    id: string;
    title: string;
    icon: React.ComponentType<any>;
  }[];
};

const settingsSections: SettingsSection[] = [
  {
    id: 'general',
    title: 'General Settings',
    icon: SettingsIcon,
    subsections: [
      { id: 'general-settings', title: 'General Settings', icon: Building },
      { id: 'profile', title: 'Profile', icon: User },
      { id: 'security', title: 'Security', icon: Lock },
      { id: 'notifications', title: 'Notifications', icon: Bell }
    ]
  },
  {
    id: 'website',
    title: 'Website Settings',
    icon: Globe,
    subsections: [
      { id: 'web-settings', title: 'Web Settings', icon: Globe },
      { id: 'company-settings', title: 'Company Settings', icon: Building },
      { id: 'system-settings', title: 'System Settings', icon: Zap }
    ]
  },
  {
    id: 'app',
    title: 'App Settings',
    icon: Smartphone,
    subsections: [
      { id: 'app-settings', title: 'App Settings', icon: Smartphone },
      { id: 'invoice-settings', title: 'Invoice Settings', icon: FileText },
      { id: 'invoice-templates', title: 'Invoice Templates', icon: FileText },
      { id: 'subscription', title: 'Subscription Plans', icon: Crown }
    ]
  },
  {
    id: 'system',
    title: 'System Settings',
    icon: Zap,
    subsections: [
      { id: 'email-templates', title: 'Email Templates', icon: Mail },
      { id: 'signature-templates', title: 'Signature Templates', icon: Edit },
      { id: 'email', title: 'Email Config', icon: Mail },
      { id: 'sms', title: 'SMS', icon: MessageSquare }
    ]
  },
  {
    id: 'financial',
    title: 'Financial Settings',
    icon: CreditCard,
    subsections: [
      { id: 'financial-settings', title: 'Financial Settings', icon: CreditCard },
      { id: 'payment-gateway', title: 'Payment Gateway', icon: Plug },
      { id: 'bank-accounts', title: 'Bank Accounts', icon: University }
    ]
  },
  {
    id: 'admin',
    title: 'User Management',
    icon: User,
    subsections: [
      { id: 'users', title: 'Users', icon: User },
      { id: 'roles', title: 'Roles & Permissions', icon: Shield },
      { id: 'user-profile', title: 'User Profile', icon: User }
    ]
  },
  {
    id: 'other',
    title: 'Other Settings',
    icon: Zap,
    subsections: [
      { id: 'other-settings', title: 'Other Settings', icon: Zap },
      { id: 'storage', title: 'Storage', icon: Database }
    ]
  }
];

const subscriptionPlans = [
  {
    name: 'Starter',
    price: 29,
    period: 'month',
    features: ['Up to 1,000 transactions/month', 'Basic inventory management', 'Email support', '1 POS terminal'],
    popular: false
  },
  {
    name: 'Professional',
    price: 79,
    period: 'month',
    features: ['Up to 10,000 transactions/month', 'Advanced inventory & reporting', 'Priority support', 'Up to 3 POS terminals', 'Multi-location support'],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 199,
    period: 'month',
    features: ['Unlimited transactions', 'Advanced analytics & AI insights', '24/7 phone support', 'Unlimited POS terminals', 'Custom integrations', 'Dedicated account manager'],
    popular: false
  },
  {
    name: 'Custom',
    price: null,
    period: 'contact',
    features: ['Everything in Enterprise', 'Custom development', 'On-premise deployment options', 'White-label solution', 'SLA guarantees'],
    popular: false
  }
];

const Settings = () => {
  const [activeSection, setActiveSection] = useState('');
  const [activeSubsection, setActiveSubsection] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [availableStates, setAvailableStates] = useState<State[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Settings state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    email: '',
    address: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    avatar: null as File | null
  });
  
  const [companyData, setCompanyData] = useState({
    name: 'BitVend POS',
    email: 'support@bitvendpos.com',
    phone: '+1 555-123-4567',
    address: '123 Business Street\nSuite 400\nNew York, NY 10001',
    website: 'https://www.bitvendpos.com',
    logo: null as File | null
  });
  
  const [switches, setSwitches] = useState({
    twoFactor: false,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    systemAlerts: true,
    dailySummary: false,
    offlineMode: true,
    autoPrintReceipt: true,
    quickAddProducts: true,
    cookieConsent: true,
    otpLogin: true,
    otpTransactions: false,
    googleLogin: true,
    facebookLogin: false,
    linkedinLogin: false
  });

  // New settings state
  const [invoiceSettings, setInvoiceSettings] = useState({
    invoicePrefix: 'INV-',
    startingNumber: 1000,
    defaultNotes: '',
    termsConditions: '',
    showTaxDetails: true,
    displayLogo: true,
    footerText: ''
  });

  const [selectedTemplate, setSelectedTemplate] = useState('general-1');
  
  const [signatures, setSignatures] = useState([
    { id: '1', name: 'John Doe Signature', isDefault: true, url: '/placeholder-signature.png' }
  ]);

  const [users, setUsers] = useState([
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: true }
  ]);

  const [roles, setRoles] = useState([
    { id: '1', name: 'Admin', description: 'Full system access', userCount: 2, permissions: ['all'] }
  ]);

  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'BitVend POS',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'America/New_York',
    currency: 'USD'
  });

  const [webSettings, setWebSettings] = useState({
    siteTitle: 'BitVend POS System',
    seoEnabled: true,
    googleAnalyticsCode: ''
  });

  const [appSettings, setAppSettings] = useState({
    twoFactorEnabled: false,
    darkMode: false,
    themeColor: '#3b82f6'
  });

  const [systemSettings, setSystemSettings] = useState({
    emailFromName: 'BitVend POS',
    autoBackup: true,
    maintenanceMode: false
  });

  const [financialSettings, setFinancialSettings] = useState({
    taxEnabled: true,
    defaultTaxRate: 8.25,
    discountsEnabled: true,
    partialPaymentsEnabled: true
  });

  const [otherSettings, setOtherSettings] = useState({
    defaultLanguage: 'en',
    emailNotifications: true,
    googleMapsApiKey: ''
  });

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  const handleSubsectionClick = useCallback((sectionId: string, subsectionId: string) => {
    setActiveSection(sectionId);
    setActiveSubsection(subsectionId);
    
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: true
    }));
  }, []);
  
  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    setSelectedCountry(countryCode);
    setAvailableStates(country?.states || []);
    setSelectedState('');
    setAvailableCities([]);
    setProfileData(prev => ({ ...prev, country: countryCode, state: '', city: '' }));
  };
  
  const handleStateChange = (stateCode: string) => {
    const state = availableStates.find(s => s.code === stateCode);
    setSelectedState(stateCode);
    setAvailableCities(state?.cities || []);
    setProfileData(prev => ({ ...prev, state: stateCode, city: '' }));
  };
  
  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      setProfileData(prev => ({ ...prev, avatar: file }));
      toast.success("Avatar uploaded successfully!");
    } else {
      toast.error("File size must be less than 2MB");
    }
  };
  
  const handleSwitchChange = (key: string, value: boolean) => {
    setSwitches(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = () => {
    // Save company data to localStorage for receipt
    const companySettings = {
      companyName: companyData.name,
      companyAddress: companyData.address,
      companyPhone: companyData.phone,
      companyEmail: companyData.email
    };
    localStorage.setItem('companySettings', JSON.stringify(companySettings));
    toast.success("Settings saved successfully!");
  };
  
  const handleCancel = () => {
    toast.info("Changes cancelled");
  };

  const renderContent = () => {
    const sectionKey = `${activeSection}-${activeSubsection}`;
    
    switch (sectionKey) {
      case 'general-profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6 transition-transform duration-200">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <Button 
                  variant="outline" 
                  className="mr-2 transition-transform duration-200" 
                  onClick={handleAvatarUpload}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Avatar
                </Button>
                <p className="text-sm text-muted-foreground mt-1">JPG or PNG. Max 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={profileData.firstName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="John"
                  className="dark:placeholder:text-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={profileData.lastName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Doe"
                  className="dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={profileData.username}
                  onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="johndoe123"
                  className="dark:placeholder:text-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 555 123 4567"
                  className="dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john.doe@email.com"
                className="dark:placeholder:text-gray-500"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                value={profileData.address}
                onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Main Street, Suite 400"
                className="dark:placeholder:text-gray-500"
                rows={3} 
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={profileData.country} onValueChange={handleCountryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-card dark:bg-settings-form">
                    {countries.map(country => (
                      <SelectItem key={`${country.code}-${country.name}`} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select value={profileData.state} onValueChange={handleStateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-card dark:bg-settings-form">
                    {availableStates.map(state => (
                      <SelectItem key={`${state.code}-${state.name}`} value={state.code}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Select 
                  value={profileData.city} 
                  onValueChange={(value) => setProfileData(prev => ({ ...prev, city: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-card dark:bg-settings-form">
                    {availableCities.map(city => (
                      <SelectItem key={`${profileData.state}-${city}`} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="postal">Postal Code</Label>
              <Input 
                id="postal" 
                value={profileData.postalCode}
                onChange={(e) => setProfileData(prev => ({ ...prev, postalCode: e.target.value }))}
                placeholder="90001"
                className="dark:placeholder:text-gray-500"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="border-cancel text-cancel hover:bg-cancel/10 dark:border-cancel dark:text-cancel dark:hover:bg-cancel/10 transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-success hover:bg-success/90 text-success-foreground transition-transform duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        );

      case 'website-company-settings':
        return (
          <div className="space-y-6">
            <div className="transition-transform duration-200">
              <Label htmlFor="companyName">Company Name</Label>
              <Input 
                id="companyName" 
                value={companyData.name}
                onChange={(e) => setCompanyData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="BitVend POS" 
              />
            </div>
            
            <div className="transition-transform duration-200">
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input 
                id="companyEmail" 
                type="email" 
                value={companyData.email}
                onChange={(e) => setCompanyData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="support@bitvendpos.com" 
              />
            </div>
            
            <div className="transition-transform duration-200">
              <Label htmlFor="companyPhone">Company Phone</Label>
              <Input 
                id="companyPhone" 
                type="tel" 
                value={companyData.phone}
                onChange={(e) => setCompanyData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 555-123-4567" 
              />
            </div>
            
            <div className="transition-transform duration-200">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Textarea 
                id="companyAddress" 
                value={companyData.address}
                onChange={(e) => setCompanyData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Business Street, Suite 400, New York, NY 10001" 
                rows={4}
              />
            </div>
            
            <div className="transition-transform duration-200">
              <Label htmlFor="website">Website URL</Label>
              <Input 
                id="website" 
                type="url" 
                value={companyData.website}
                onChange={(e) => setCompanyData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://www.bitvendpos.com" 
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="border-cancel text-cancel hover:bg-cancel/10 dark:border-cancel dark:text-cancel dark:hover:bg-cancel/10 transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-success hover:bg-success/90 text-success-foreground transition-transform duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        );

      case 'app-subscription':
        return (
          <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {subscriptionPlans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                    plan.popular 
                      ? 'border-primary bg-primary/5 shadow-lg' 
                      : 'border-border bg-background/50 hover:border-primary/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      {plan.price ? (
                        <>
                          <span className="text-3xl font-bold">${plan.price}</span>
                          <span className="text-muted-foreground">/{plan.period}</span>
                        </>
                      ) : (
                        <span className="text-lg font-semibold">Contact Us</span>
                      )}
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full transition-transform ${
                        plan.popular ? 'bg-success hover:bg-success/90' : ''
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.price ? 'Choose Plan' : 'Contact Sales'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // General Settings Cases
      case 'general-general-settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">General Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={generalSettings.companyName}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={generalSettings.language} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel}><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-success hover:bg-success/90"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Web Settings Cases  
      case 'website-web-settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Web Settings</h3>
            <div>
              <Label htmlFor="siteTitle">Site Title</Label>
              <Input
                id="siteTitle"
                value={webSettings.siteTitle}
                onChange={(e) => setWebSettings(prev => ({ ...prev, siteTitle: e.target.value }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="seoEnabled">Enable SEO</Label>
                <p className="text-sm text-muted-foreground">Enable search engine optimization</p>
              </div>
              <Switch
                id="seoEnabled"
                checked={webSettings.seoEnabled}
                onCheckedChange={(checked) => setWebSettings(prev => ({ ...prev, seoEnabled: checked }))}
              />
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel}><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-success hover:bg-success/90"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // App Settings Cases
      case 'app-app-settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">App Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for account access</p>
                </div>
                <Switch
                  id="twoFactor"
                  checked={appSettings.twoFactorEnabled}
                  onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, twoFactorEnabled: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Use dark color scheme</p>
                </div>
                <Switch
                  id="darkMode"
                  checked={appSettings.darkMode}
                  onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, darkMode: checked }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel}><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-success hover:bg-success/90"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Invoice Settings
      case 'app-invoice-settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Invoice Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                <Input
                  id="invoicePrefix"
                  value={invoiceSettings.invoicePrefix}
                  onChange={(e) => setInvoiceSettings(prev => ({ ...prev, invoicePrefix: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="startingNumber">Starting Number</Label>
                <Input
                  id="startingNumber"
                  type="number"
                  value={invoiceSettings.startingNumber}
                  onChange={(e) => setInvoiceSettings(prev => ({ ...prev, startingNumber: parseInt(e.target.value) || 1000 }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="termsConditions">Terms & Conditions</Label>
              <Textarea
                id="termsConditions"
                rows={6}
                value={invoiceSettings.termsConditions}
                onChange={(e) => setInvoiceSettings(prev => ({ ...prev, termsConditions: e.target.value }))}
                placeholder="Enter your terms and conditions..."
              />
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel}><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-success hover:bg-success/90"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Invoice Templates
      case 'app-invoice-templates':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Invoice Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['general-1', 'general-2', 'general-3', 'receipt-1', 'receipt-2'].map((templateId) => (
                <Card 
                  key={templateId}
                  className={`cursor-pointer transition-all ${selectedTemplate === templateId ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedTemplate(templateId)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-3 flex items-center justify-center">
                      <div className="text-muted-foreground text-sm">Preview</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{templateId}</h4>
                      {selectedTemplate === templateId && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} className="bg-success hover:bg-success/90">Save Template</Button>
            </div>
          </div>
        );

      // Email Templates
      case 'system-email-templates':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Email Templates</h3>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-3 space-y-2">
                <h4 className="font-medium">Templates</h4>
                {['Invoice', 'Payment Receipt', 'Notification'].map((template) => (
                  <Button key={template} variant="ghost" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    {template}
                  </Button>
                ))}
              </div>
              <div className="col-span-9">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject Line</Label>
                    <Input id="subject" placeholder="Enter email subject..." />
                  </div>
                  <div>
                    <Label htmlFor="body">Email Body</Label>
                    <Textarea id="body" rows={12} placeholder="Enter email body..." />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel}><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-success hover:bg-success/90"><Save className="w-4 h-4 mr-2" />Save Template</Button>
            </div>
          </div>
        );

      // Signature Templates
      case 'system-signature-templates':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Signature Templates</h3>
              <Button><Upload className="w-4 h-4 mr-2" />Add Signature</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {signatures.map((signature) => (
                <Card key={signature.id}>
                  <CardContent className="p-4">
                    <div className="aspect-[3/1] bg-muted rounded-lg mb-3 flex items-center justify-center">
                      <div className="text-muted-foreground text-sm">Signature Preview</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{signature.name}</h4>
                      {signature.isDefault && <Badge variant="default">Default</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      // System Settings
      case 'website-system-settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">System Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emailFromName">Email From Name</Label>
                <Input
                  id="emailFromName"
                  value={systemSettings.emailFromName}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, emailFromName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="autoBackup">Auto Backup</Label>
                <Switch
                  checked={systemSettings.autoBackup}
                  onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoBackup: checked }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel}><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-success hover:bg-success/90"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Financial Settings
      case 'financial-financial-settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Financial Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="taxEnabled">Enable Tax Calculations</Label>
                  <p className="text-sm text-muted-foreground">Apply tax to transactions</p>
                </div>
                <Switch
                  id="taxEnabled"
                  checked={financialSettings.taxEnabled}
                  onCheckedChange={(checked) => setFinancialSettings(prev => ({ ...prev, taxEnabled: checked }))}
                />
              </div>
              {financialSettings.taxEnabled && (
                <div>
                  <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                  <Input
                    id="defaultTaxRate"
                    type="number"
                    value={financialSettings.defaultTaxRate}
                    onChange={(e) => setFinancialSettings(prev => ({ ...prev, defaultTaxRate: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel}><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-success hover:bg-success/90"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Users Management
      case 'admin-users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Users</h3>
              <Button><User className="w-4 h-4 mr-2" />Add User</Button>
            </div>
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{user.role}</Badge>
                    <Switch checked={user.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // Roles & Permissions  
      case 'admin-roles':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Roles & Permissions</h3>
              <Button><Shield className="w-4 h-4 mr-2" />Add Role</Button>
            </div>
            <div className="space-y-2">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{role.name}</div>
                    <div className="text-sm text-muted-foreground">{role.description}</div>
                  </div>
                  <Badge variant="secondary">{role.userCount} users</Badge>
                </div>
              ))}
            </div>
          </div>
        );

      // Other Settings
      case 'other-other-settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Other Settings</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="defaultLanguage">Default Language</Label>
                <Select value={otherSettings.defaultLanguage} onValueChange={(value) => setOtherSettings(prev => ({ ...prev, defaultLanguage: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="googleMapsApi">Google Maps API Key</Label>
                <Input
                  id="googleMapsApi"
                  type="password"
                  value={otherSettings.googleMapsApiKey}
                  onChange={(e) => setOtherSettings(prev => ({ ...prev, googleMapsApiKey: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel}><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-success hover:bg-success/90"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Add other cases as needed...
      default:
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                Settings for {activeSection} - {activeSubsection} will be available soon.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="flex">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png"
          className="hidden"
        />
        
        {/* Sidebar */}
        <div className="w-80 bg-card dark:bg-settings-form border-r border-border p-6 min-h-screen overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your POS system configuration</p>
          </div>
          
          <div className="space-y-2">
            {settingsSections.map((section) => (
              <div key={section.id} className="transition-transform duration-200">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-3 h-auto"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center">
                    <section.icon className="w-4 h-4 mr-3" />
                    <span className="font-medium">{section.title}</span>
                  </div>
                  {expandedSections[section.id] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
                
                {expandedSections[section.id] && (
                  <div className="ml-6 mt-2 space-y-1">
                    {section.subsections.map((subsection) => (
                      <Button
                        key={subsection.id}
                        variant={
                          activeSection === section.id && activeSubsection === subsection.id
                            ? "secondary"
                            : "ghost"
                        }
                        className="w-full justify-start p-2 h-auto text-sm transition-transform duration-200"
                        onClick={() => handleSubsectionClick(section.id, subsection.id)}
                      >
                        <subsection.icon className="w-3 h-3 mr-2" />
                        {subsection.title}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <Card className="bg-settings-card border-border hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-foreground text-xl">
                {settingsSections
                  .find(s => s.id === activeSection)
                  ?.subsections.find(sub => sub.id === activeSubsection)
                  ?.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-settings-form p-6 rounded-lg">
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;