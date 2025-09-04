import React, { useState } from 'react';
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
  X
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

  const renderSettingsContent = () => {
    const sectionKey = `${activeSection}-${activeSubsection}`;
    
    switch (sectionKey) {
      case 'general-profile':
        return (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Avatar
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">JPG/PNG, max 2MB</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="johndoe123" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 555 123 4567" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john.doe@email.com" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="123 Main Street, Suite 400" />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select defaultValue="us">
                    <SelectTrigger>
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
                    <SelectTrigger>
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
                    <SelectTrigger>
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
                <Input id="postal" placeholder="90001" className="w-48" />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'general-security':
        return (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="********" />
              </div>
              
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="********" />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" placeholder="********" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
              
              <div>
                <Label htmlFor="securityQuestion">Security Question</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a question" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maiden">Mother's maiden name</SelectItem>
                    <SelectItem value="pet">First pet's name</SelectItem>
                  </SelectContent>
                </Select>
                <Input className="mt-2" placeholder="Answer" />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'general-notifications':
        return (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>System Alerts</Label>
                  <p className="text-sm text-muted-foreground">Important system notifications</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Daily Summary Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive daily summary reports</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        );
        
      case 'general-connected-apps':
        return (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Connected Apps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Google', connected: true },
                { name: 'Slack', connected: false },
                { name: 'Dropbox', connected: true },
                { name: 'Microsoft Teams', connected: false },
                { name: 'Stripe', connected: true },
                { name: 'PayPal', connected: false }
              ].map((app) => (
                <div key={app.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{app.name}</h4>
                    <Badge variant={app.connected ? "default" : "secondary"}>
                      {app.connected ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                  <Button variant={app.connected ? "destructive" : "default"} size="sm">
                    {app.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        );
        
      default:
        return (
          <Card className="bg-card border-border">
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
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-card border-r border-border transition-all duration-300 overflow-y-auto`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              {!sidebarCollapsed && (
                <h1 className="text-xl font-bold">Settings</h1>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {settingsSections.map((section) => (
                <div key={section.id}>
                  <Button
                    variant={activeSection === section.id ? "secondary" : "ghost"}
                    className="w-full justify-start mb-2"
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
                          className="w-full justify-start"
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
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {renderSettingsContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;