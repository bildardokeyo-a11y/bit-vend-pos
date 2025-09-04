import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Check
} from 'lucide-react';

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

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [activeSubsection, setActiveSubsection] = useState('profile');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Storage for settings data
  const [settingsData, setSettingsData] = useState({
    // Company settings
    companyName: 'BitVend POS',
    companyAddress: '123 Business Street, City, State 12345',
    companyPhone: '+1 555 123 4567',
    companyEmail: 'info@bitvendpos.com',
    // Profile settings
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@bitvendpos.com',
    phone: '+1 555 987 6543',
    // System settings
    defaultCurrency: 'USD',
    taxRate: 8.5,
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    systemAlerts: true,
    dailySummary: false,
    // Security
    twoFactorAuth: false,
    // POS settings
    offlineMode: true,
    autoPrintReceipt: true,
    quickAddProducts: true,
    // Connected apps
    connectedApps: {
      google: true,
      slack: false,
      dropbox: true,
      teams: false,
      stripe: true,
      paypal: false
    }
  });

  const updateSettings = useCallback((path: string, value: any) => {
    setSettingsData(prev => ({
      ...prev,
      [path]: value
    }));
  }, []);

  const updateNestedSettings = useCallback((path: string, key: string, value: any) => {
    setSettingsData(prev => ({
      ...prev,
      [path]: {
        ...(prev[path as keyof typeof prev] as object),
        [key]: value
      }
    }));
  }, []);

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

  const renderSettingsContent = () => {
    const sectionKey = `${activeSection}-${activeSubsection}`;
    
    switch (sectionKey) {
      case 'general-profile':
        return (
          <Card className="bg-muted border-border transition-all duration-300 hover:shadow-lg hover:bg-muted/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-muted-foreground/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Avatar
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">JPG/PNG, max 2MB</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={settingsData.firstName}
                    onChange={(e) => updateSettings('firstName', e.target.value)}
                    className="transition-all hover:border-primary/50" 
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={settingsData.lastName}
                    onChange={(e) => updateSettings('lastName', e.target.value)}
                    className="transition-all hover:border-primary/50" 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="johndoe123" className="transition-all hover:border-primary/50" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={settingsData.phone}
                    onChange={(e) => updateSettings('phone', e.target.value)}
                    className="transition-all hover:border-primary/50" 
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={settingsData.email}
                    onChange={(e) => updateSettings('email', e.target.value)}
                    className="transition-all hover:border-primary/50" 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="123 Main Street, Suite 400" className="transition-all hover:border-primary/50" />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select defaultValue="us">
                    <SelectTrigger className="transition-all hover:border-primary/50">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select defaultValue="ca">
                    <SelectTrigger className="transition-all hover:border-primary/50">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ca">California</SelectItem>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="tx">Texas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Select defaultValue="la">
                    <SelectTrigger className="transition-all hover:border-primary/50">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="la">Los Angeles</SelectItem>
                      <SelectItem value="sf">San Francisco</SelectItem>
                      <SelectItem value="sd">San Diego</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="postal">Postal Code</Label>
                <Input id="postal" placeholder="90001" className="w-48 transition-all hover:border-primary/50" />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="hover:scale-105 transition-transform">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button className="hover:scale-105 transition-transform">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'general-security':
        return (
          <Card className="bg-muted border-border transition-all duration-300 hover:shadow-lg hover:bg-muted/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="********" className="transition-all hover:border-primary/50" />
              </div>
              
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="********" className="transition-all hover:border-primary/50" />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" placeholder="********" className="transition-all hover:border-primary/50" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border transition-all hover:bg-background/70">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch 
                  checked={settingsData.twoFactorAuth}
                  onCheckedChange={(checked) => updateSettings('twoFactorAuth', checked)}
                />
              </div>
              
              <div>
                <Label htmlFor="securityQuestion">Security Question</Label>
                <Select>
                  <SelectTrigger className="transition-all hover:border-primary/50">
                    <SelectValue placeholder="Select a question" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maiden">Mother's maiden name</SelectItem>
                    <SelectItem value="pet">First pet's name</SelectItem>
                  </SelectContent>
                </Select>
                <Input className="mt-2 transition-all hover:border-primary/50" placeholder="Answer" />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="hover:scale-105 transition-transform">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button className="hover:scale-105 transition-transform">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'general-notifications':
        return (
          <Card className="bg-muted border-border transition-all duration-300 hover:shadow-lg hover:bg-muted/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications' },
                { key: 'systemAlerts', label: 'System Alerts', desc: 'Important system notifications' },
                { key: 'dailySummary', label: 'Daily Summary Emails', desc: 'Receive daily summary reports' }
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border transition-all hover:bg-background/70">
                  <div>
                    <Label>{label}</Label>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <Switch 
                    checked={settingsData[key as keyof typeof settingsData] as boolean}
                    onCheckedChange={(checked) => updateSettings(key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        );
        
      case 'general-connected-apps':
        return (
          <Card className="bg-muted border-border transition-all duration-300 hover:shadow-lg hover:bg-muted/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Connected Apps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'google', name: 'Google' },
                { key: 'slack', name: 'Slack' },
                { key: 'dropbox', name: 'Dropbox' },
                { key: 'teams', name: 'Microsoft Teams' },
                { key: 'stripe', name: 'Stripe' },
                { key: 'paypal', name: 'PayPal' }
              ].map(({ key, name }) => (
                <div key={key} className="flex items-center justify-between p-4 border rounded-lg transition-all hover:shadow-md hover:scale-[1.02]">
                  <div>
                    <h4 className="font-medium">{name}</h4>
                    <Badge variant={settingsData.connectedApps[key as keyof typeof settingsData.connectedApps] ? "default" : "secondary"}>
                      {settingsData.connectedApps[key as keyof typeof settingsData.connectedApps] ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                  <Button 
                    variant={settingsData.connectedApps[key as keyof typeof settingsData.connectedApps] ? "destructive" : "default"} 
                    size="sm"
                    className="hover:scale-105 transition-transform"
                    onClick={() => updateNestedSettings('connectedApps', key, !settingsData.connectedApps[key as keyof typeof settingsData.connectedApps])}
                  >
                    {settingsData.connectedApps[key as keyof typeof settingsData.connectedApps] ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        );

      case 'website-company-settings':
        return (
          <Card className="bg-muted border-border transition-all duration-300 hover:shadow-lg hover:bg-muted/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName" 
                  value={settingsData.companyName}
                  onChange={(e) => updateSettings('companyName', e.target.value)}
                  className="transition-all hover:border-primary/50" 
                />
              </div>
              
              <div>
                <Label htmlFor="companyLogo">Company Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted-foreground/10 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input 
                  id="companyEmail" 
                  type="email" 
                  value={settingsData.companyEmail}
                  onChange={(e) => updateSettings('companyEmail', e.target.value)}
                  className="transition-all hover:border-primary/50" 
                />
              </div>
              
              <div>
                <Label htmlFor="companyPhone">Company Phone</Label>
                <Input 
                  id="companyPhone" 
                  type="tel" 
                  value={settingsData.companyPhone}
                  onChange={(e) => updateSettings('companyPhone', e.target.value)}
                  className="transition-all hover:border-primary/50" 
                />
              </div>
              
              <div>
                <Label htmlFor="companyAddress">Company Address</Label>
                <Textarea 
                  id="companyAddress" 
                  value={settingsData.companyAddress}
                  onChange={(e) => updateSettings('companyAddress', e.target.value)}
                  className="transition-all hover:border-primary/50" 
                />
              </div>
              
              <div>
                <Label htmlFor="website">Website URL</Label>
                <Input 
                  id="website" 
                  type="url" 
                  placeholder="https://www.bitvendpos.com" 
                  className="transition-all hover:border-primary/50" 
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="hover:scale-105 transition-transform">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button className="hover:scale-105 transition-transform" onClick={() => {
                  // Save company settings to localStorage for receipt
                  const companySettings = {
                    companyName: settingsData.companyName,
                    companyAddress: settingsData.companyAddress,
                    companyPhone: settingsData.companyPhone,
                    companyEmail: settingsData.companyEmail
                  };
                  localStorage.setItem('companySettings', JSON.stringify(companySettings));
                  console.log('Company settings saved!');
                }}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'website-system-settings':
        return (
          <Card className="bg-muted border-border transition-all duration-300 hover:shadow-lg hover:bg-muted/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" placeholder="BitVend POS Portal" className="transition-all hover:border-primary/50" />
              </div>
              
              <div>
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                <Select value={settingsData.defaultCurrency} onValueChange={(value) => updateSettings('defaultCurrency', value)}>
                  <SelectTrigger className="transition-all hover:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="timezone">Time Zone</Label>
                <Select defaultValue="est">
                  <SelectTrigger className="transition-all hover:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="est">GMT -5 (Eastern)</SelectItem>
                    <SelectItem value="pst">GMT -8 (Pacific)</SelectItem>
                    <SelectItem value="utc">GMT +0 (UTC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger className="transition-all hover:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="hover:scale-105 transition-transform">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button className="hover:scale-105 transition-transform">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'app-subscription':
        return (
          <Card className="bg-muted border-border transition-all duration-300 hover:shadow-lg hover:bg-muted/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Subscription Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {subscriptionPlans.map((plan, index) => (
                  <div 
                    key={index} 
                    className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
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
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        className={`w-full hover:scale-105 transition-transform ${
                          plan.popular ? 'bg-primary hover:bg-primary/90' : ''
                        }`}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.price ? 'Choose Plan' : 'Contact Sales'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-background/50 rounded-lg border">
                <h4 className="font-semibold mb-2">Current Plan: Professional</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Your subscription renews on January 15, 2025. You have used 5,432 of 10,000 transactions this month.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                    Manage Billing
                  </Button>
                  <Button size="sm" className="hover:scale-105 transition-transform">
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'app-pos':
        return (
          <Card className="bg-muted border-border transition-all duration-300 hover:shadow-lg hover:bg-muted/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                POS Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'offlineMode', label: 'Enable Offline Mode', desc: 'Allow POS to work without internet connection' },
                { key: 'autoPrintReceipt', label: 'Auto-Print Receipt', desc: 'Automatically print receipt after each sale' },
                { key: 'quickAddProducts', label: 'Quick Add Products', desc: 'Enable quick product addition during checkout' }
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border transition-all hover:bg-background/70">
                  <div>
                    <Label>{label}</Label>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <Switch 
                    checked={settingsData[key as keyof typeof settingsData] as boolean}
                    onCheckedChange={(checked) => updateSettings(key, checked)}
                  />
                </div>
              ))}
              
              <div>
                <Label htmlFor="defaultCustomer">Default Customer</Label>
                <Select defaultValue="walkin">
                  <SelectTrigger className="transition-all hover:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walkin">Walk-In Customer</SelectItem>
                    <SelectItem value="member">Member Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="defaultWarehouse">Default Warehouse</Label>
                <Select defaultValue="main">
                  <SelectTrigger className="transition-all hover:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Warehouse</SelectItem>
                    <SelectItem value="backup">Backup Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="hover:scale-105 transition-transform">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button className="hover:scale-105 transition-transform">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'financial-tax-rates':
        return (
          <Card className="bg-muted border-border transition-all duration-300 hover:shadow-lg hover:bg-muted/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Tax Rates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="defaultTax">Default Tax Rate (%)</Label>
                <Input 
                  id="defaultTax" 
                  type="number" 
                  value={settingsData.taxRate}
                  onChange={(e) => updateSettings('taxRate', parseFloat(e.target.value))}
                  className="transition-all hover:border-primary/50" 
                  step="0.1"
                />
              </div>
              
              <div>
                <Label htmlFor="taxName">Tax Name</Label>
                <Input id="taxName" placeholder="Sales Tax" className="transition-all hover:border-primary/50" />
              </div>
              
              <div>
                <Label htmlFor="taxType">Tax Type</Label>
                <Select defaultValue="exclusive">
                  <SelectTrigger className="transition-all hover:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inclusive">Inclusive</SelectItem>
                    <SelectItem value="exclusive">Exclusive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-4 bg-background/50 rounded-lg border">
                <h4 className="font-medium mb-2">Current Tax Configuration</h4>
                <p className="text-sm text-muted-foreground">
                  Sales Tax: {settingsData.taxRate}% (Exclusive)
                </p>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="hover:scale-105 transition-transform">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button className="hover:scale-105 transition-transform">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        );
        
      default:
        return (
          <Card className="bg-muted border-border transition-all duration-300 hover:shadow-lg hover:bg-muted/80">
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                Settings for {activeSection} - {activeSubsection} coming soon...
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-muted border-r border-border transition-all duration-300 overflow-y-auto`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              {!sidebarCollapsed && (
                <h1 className="text-xl font-bold">Settings</h1>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hover:scale-110 transition-transform"
              >
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {settingsSections.map((section) => (
                <div key={section.id}>
                  <Button
                    variant={activeSection === section.id ? "secondary" : "ghost"}
                    className="w-full justify-start mb-2 hover:scale-105 transition-all duration-300"
                    onClick={() => {
                      setActiveSection(section.id);
                      setActiveSubsection(section.subsections[0].id);
                    }}
                  >
                    <section.icon className="h-4 w-4 mr-2" />
                    {!sidebarCollapsed && section.title}
                  </Button>
                  
                  {!sidebarCollapsed && activeSection === section.id && (
                    <div className="ml-6 space-y-1">
                      {section.subsections.map((subsection) => (
                        <Button
                          key={subsection.id}
                          variant={activeSubsection === subsection.id ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start hover:scale-105 transition-all duration-300"
                          onClick={() => setActiveSubsection(subsection.id)}
                        >
                          <subsection.icon className="h-3 w-3 mr-2" />
                          {subsection.title}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-black">
          <div className="p-6">
            {renderSettingsContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;