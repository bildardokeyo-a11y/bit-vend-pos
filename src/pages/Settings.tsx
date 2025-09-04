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
      { id: 'profile', title: 'Profile', icon: User },
      { id: 'security', title: 'Security', icon: Lock },
      { id: 'notifications', title: 'Notifications', icon: Bell },
      { id: 'connected-apps', title: 'Connected Apps', icon: LinkIcon }
    ]
  },
  {
    id: 'website',
    title: 'Website Settings',
    icon: Globe,
    subsections: [
      { id: 'system-settings', title: 'System Settings', icon: Zap },
      { id: 'company-settings', title: 'Company Settings', icon: Building },
      { id: 'localization', title: 'Localization', icon: MapPin },
      { id: 'prefixes', title: 'Prefixes', icon: Hash },
      { id: 'preference', title: 'Preference', icon: Sliders },
      { id: 'appearance', title: 'Appearance', icon: Palette },
      { id: 'social-auth', title: 'Social Authentication', icon: Key },
      { id: 'language', title: 'Language', icon: Languages }
    ]
  },
  {
    id: 'app',
    title: 'App Settings',
    icon: Smartphone,
    subsections: [
      { id: 'invoice', title: 'Invoice', icon: FileText },
      { id: 'printer', title: 'Printer', icon: Printer },
      { id: 'pos', title: 'POS', icon: ShoppingCart },
      { id: 'subscription', title: 'Subscription Plans', icon: Crown },
      { id: 'custom-fields', title: 'Custom Fields', icon: Edit }
    ]
  },
  {
    id: 'system',
    title: 'System Settings',
    icon: Zap,
    subsections: [
      { id: 'email', title: 'Email', icon: Mail },
      { id: 'sms', title: 'SMS', icon: MessageSquare },
      { id: 'otp', title: 'OTP', icon: Shield },
      { id: 'gdpr-cookies', title: 'GDPR Cookies', icon: Cookie }
    ]
  },
  {
    id: 'financial',
    title: 'Financial Settings',
    icon: CreditCard,
    subsections: [
      { id: 'payment-gateway', title: 'Payment Gateway', icon: Plug },
      { id: 'bank-accounts', title: 'Bank Accounts', icon: University },
      { id: 'tax-rates', title: 'Tax Rates', icon: Percent },
      { id: 'currencies', title: 'Currencies', icon: Coins }
    ]
  },
  {
    id: 'other',
    title: 'Other Settings',
    icon: Zap,
    subsections: [
      { id: 'storage', title: 'Storage', icon: Database },
      { id: 'ban-ip', title: 'Ban IP Address', icon: Ban }
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
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [selectedState, setSelectedState] = useState<string>('CA');
  const [availableStates, setAvailableStates] = useState<State[]>(countries[0].states);
  const [availableCities, setAvailableCities] = useState<string[]>(countries[0].states[0].cities);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Settings state
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe123',
    phone: '+1 555 123 4567',
    email: 'john.doe@email.com',
    address: '123 Main Street, Suite 400',
    country: 'US',
    state: 'CA',
    city: 'Los Angeles',
    postalCode: '90001',
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
                <Label htmlFor="state">State</Label>
                <Select value={profileData.state} onValueChange={handleStateChange}>
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
                <Label htmlFor="city">City</Label>
                <Select 
                  value={profileData.city} 
                  onValueChange={(value) => setProfileData(prev => ({ ...prev, city: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map(city => (
                      <SelectItem key={city} value={city}>
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