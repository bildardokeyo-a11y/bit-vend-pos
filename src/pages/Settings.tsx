import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  Settings as SettingsIcon, 
  Building2, 
  Users, 
  Receipt, 
  DollarSign, 
  Database, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  CreditCard, 
  Percent, 
  Calendar, 
  UserPlus, 
  Crown,
  Upload,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/use-toast';
import { countries } from '@/data/countries';
import { useBusiness } from '@/contexts/BusinessContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface Business {
  id: string;
  businessName: string;
  businessType: string;
  taxId: string;
  businessLicense: string;
  phone: string;
  email: string;
  logoUrl: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
}

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings, updateSettings } = useSettings();
  const { 
    businesses, 
    addBusiness, 
    updateBusiness, 
    deleteBusiness, 
    currentBusiness, 
    switchBusiness 
  } = useBusiness();
  const { hasFeature } = useSubscription();

  // State management
  const [activeSection, setActiveSection] = useState('general');
  const [activeSubsection, setActiveSubsection] = useState('general');
  const [expandedSections, setExpandedSections] = useState<string[]>(['general']);
  const [editId, setEditId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  // Default business form
  const getDefaultBusinessForm = () => ({
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
      sunday: { open: '09:00', close: '17:00', closed: true }
    }
  });

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
        operatingHours: business.operatingHours || {
          monday: { open: '09:00', close: '17:00', closed: false },
          tuesday: { open: '09:00', close: '17:00', closed: false },
          wednesday: { open: '09:00', close: '17:00', closed: false },
          thursday: { open: '09:00', close: '17:00', closed: false },
          friday: { open: '09:00', close: '17:00', closed: false },
          saturday: { open: '09:00', close: '17:00', closed: false },
          sunday: { open: '09:00', close: '17:00', closed: true }
        }
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
      operatingHours: currentBusiness.operatingHours || {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '09:00', close: '17:00', closed: false },
        sunday: { open: '09:00', close: '17:00', closed: true }
      }
    } : getDefaultBusinessForm();
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(settings);

  // Update settings form when settings change
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Toast helpers
  const showUploadToast = (message: string) => {
    toast({
      title: "Success",
      description: message,
    });
  };

  // Section configuration
  const defaultSubsections = {
    general: 'general',
    business: 'business-list',
    invoice: 'invoice-general',
    tax: 'tax-rates',
    backup: 'backup-restore',
    security: 'security-general'
  };

  const settingsSections = [
    {
      key: 'general',
      title: 'General',
      icon: SettingsIcon,
      subsections: [
        { key: 'general', title: 'General Settings', icon: SettingsIcon },
        { key: 'appearance', title: 'Appearance', icon: Palette },
        { key: 'notifications', title: 'Notifications', icon: Bell },
        { key: 'language', title: 'Language & Region', icon: Globe }
      ]
    },
    {
      key: 'business',
      title: 'Business',
      icon: Building2,
      subsections: [
        { key: 'business-list', title: 'Business List', icon: Building2 },
        { key: 'business-details', title: 'Business Details', icon: FileText },
        { key: 'business-location', title: 'Location', icon: MapPin },
        { key: 'business-contact', title: 'Contact Information', icon: Phone },
        { key: 'business-operating-hours', title: 'Operating Hours', icon: Clock }
      ]
    },
    {
      key: 'invoice',
      title: 'Invoice',
      icon: Receipt,
      subsections: [
        { key: 'invoice-general', title: 'General Settings', icon: Receipt },
        { key: 'invoice-template', title: 'Template', icon: FileText },
        { key: 'invoice-numbering', title: 'Numbering', icon: FileText }
      ]
    },
    {
      key: 'tax',
      title: 'Tax',
      icon: Percent,
      subsections: [
        { key: 'tax-rates', title: 'Tax Rates', icon: Percent },
        { key: 'tax-settings', title: 'Tax Settings', icon: DollarSign }
      ]
    },
    {
      key: 'backup',
      title: 'Backup & Restore',
      icon: Database,
      subsections: [
        { key: 'backup-restore', title: 'Backup & Restore', icon: Database }
      ]
    },
    {
      key: 'security',
      title: 'Security',
      icon: Shield,
      subsections: [
        { key: 'security-general', title: 'General Security', icon: Shield },
        { key: 'security-users', title: 'User Management', icon: Users }
      ]
    }
  ];

  // Handle section toggle
  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionKey) 
        ? prev.filter(key => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  // Handle section change
  const handleSectionChange = (newSection: string) => {
    setActiveSection(newSection);
    setActiveSubsection(defaultSubsections[newSection as keyof typeof defaultSubsections] || 'general');
  };

  // Handle logo upload
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setBusinessForm({...businessForm, logoUrl: result});
      };
      reader.readAsDataURL(file);
      
      showUploadToast('Logo uploaded successfully!');
    }
  };

  // Handle business form submission
  const handleBusinessSubmit = () => {
    if (editId) {
      updateBusiness(editId, businessForm);
      setEditId(null);
      showUploadToast('Business updated successfully!');
    } else {
      const newBusiness = {
        ...businessForm,
        id: Date.now().toString()
      };
      addBusiness(newBusiness);
      showUploadToast('Business added successfully!');
    }
    setBusinessForm(getDefaultBusinessForm());
    setActiveSubsection('business-list');
  };

  // Handle business edit
  const handleBusinessEdit = (business: Business) => {
    setEditId(business.id);
    setBusinessForm(business);
    setActiveSubsection('business-details');
  };

  // Handle business delete
  const handleBusinessDelete = (businessId: string) => {
    setBusinessToDelete(businessId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (businessToDelete) {
      deleteBusiness(businessToDelete);
      showUploadToast('Business deleted successfully!');
      setBusinessToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  // Handle settings save
  const handleSettingsSave = () => {
    updateSettings(settingsForm);
    showUploadToast('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-card border-r border-border p-6 min-h-screen">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <SettingsIcon className="h-6 w-6" />
              Settings
            </h1>
            <p className="text-muted-foreground">Manage your application preferences</p>
          </div>

          <div className="space-y-2">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSections.includes(section.key);
              const isActiveSection = activeSection === section.key;

              return (
                <div key={section.key} className="space-y-1">
                  <Button
                    variant={isActiveSection ? "secondary" : "ghost"}
                    className="w-full justify-between h-auto p-3"
                    onClick={() => {
                      toggleSection(section.key);
                      handleSectionChange(section.key);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{section.title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>

                  {isExpanded && (
                    <div className="ml-4 space-y-1 animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
                      {section.subsections?.map((subsection, subIndex) => {
                        const SubIcon = subsection.icon;
                        const isActiveSubsection = activeSubsection === subsection.key;

                        return (
                          <Button
                            key={subsection.key}
                            variant={isActiveSubsection ? "secondary" : "ghost"}
                            size="sm"
                            className="w-full justify-start h-auto p-2 animate-fadeInUp"
                            style={{ animationDelay: `${subIndex * 0.05}s` }}
                            onClick={() => setActiveSubsection(subsection.key)}
                          >
                            <SubIcon className="h-3 w-3 mr-2" />
                            {subsection.title}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* General Settings */}
          {activeSection === 'general' && activeSubsection === 'general' && (
            <div className="space-y-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <div>
                <h1 className="text-2xl font-bold text-foreground">General Settings</h1>
                <p className="text-muted-foreground">Configure your application preferences</p>
              </div>

              <Card className="animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
                <CardHeader>
                  <CardTitle>Application Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currency">Default Currency</Label>
                      <Select 
                        value={settingsForm.currency} 
                        onValueChange={(value) => setSettingsForm({...settingsForm, currency: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select 
                        value={settingsForm.dateFormat} 
                        onValueChange={(value) => setSettingsForm({...settingsForm, dateFormat: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="autoSave" 
                      checked={settingsForm.autoSave}
                      onCheckedChange={(checked) => setSettingsForm({...settingsForm, autoSave: checked})}
                    />
                    <Label htmlFor="autoSave">Enable auto-save</Label>
                  </div>
                  <Button onClick={handleSettingsSave}>Save Settings</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Business List */}
          {activeSection === 'business' && activeSubsection === 'business-list' && (
            <div className="space-y-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Business Management</h1>
                  <p className="text-muted-foreground">Manage your business locations and details</p>
                </div>
                <Button 
                  onClick={() => {
                    setEditId(null);
                    setBusinessForm(getDefaultBusinessForm());
                    setActiveSubsection('business-details');
                  }}
                  disabled={!hasFeature('multi_branch_support') && businesses.length >= 1}
                  className="animate-slideInRight"
                  style={{ animationDelay: '0.4s' }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Business
                </Button>
              </div>

              <div className="grid gap-4">
                {businesses.map((business, index) => (
                  <Card key={business.id} className="animate-slideInLeft" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {business.logoUrl && (
                            <img 
                              src={business.logoUrl} 
                              alt={business.businessName}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                              {business.businessName}
                              {currentBusiness?.id === business.id && (
                                <Badge variant="secondary">Current</Badge>
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground">{business.businessType}</p>
                            <p className="text-sm text-muted-foreground">{business.city}, {business.state}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {currentBusiness?.id !== business.id && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => switchBusiness(business.id)}
                            >
                              Switch
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleBusinessEdit(business)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleBusinessDelete(business.id)}
                            disabled={businesses.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {!hasFeature('multi_branch_support') && businesses.length >= 1 && (
                  <div className="p-4 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center">
                    <Crown className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-foreground mb-2">
                      Want to manage multiple businesses?
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/subscription')}
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Pro
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Business Details */}
          {activeSection === 'business' && activeSubsection === 'business-details' && (
            <div className="space-y-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {editId ? 'Edit Business Details' : 'Add New Business'}
                  </h1>
                  <p className="text-muted-foreground">Configure your business information</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setActiveSubsection('business-list')}
                >
                  Back to List
                </Button>
              </div>

              <Card className="animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={businessForm.businessName}
                        onChange={(e) => setBusinessForm({...businessForm, businessName: e.target.value})}
                        placeholder="Enter business name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select 
                        value={businessForm.businessType} 
                        onValueChange={(value) => setBusinessForm({...businessForm, businessType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                          <SelectItem value="wholesale">Wholesale</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="taxId">Tax ID</Label>
                      <Input
                        id="taxId"
                        value={businessForm.taxId}
                        onChange={(e) => setBusinessForm({...businessForm, taxId: e.target.value})}
                        placeholder="Enter tax ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessLicense">Business License</Label>
                      <Input
                        id="businessLicense"
                        value={businessForm.businessLicense}
                        onChange={(e) => setBusinessForm({...businessForm, businessLicense: e.target.value})}
                        placeholder="Enter business license"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-2">
                        <Input
                          id="logoUrl"
                          value={businessForm.logoUrl}
                          onChange={(e) => setBusinessForm({...businessForm, logoUrl: e.target.value})}
                          placeholder="https://example.com/logo.png or upload image"
                        />
                        {(logoPreview || businessForm.logoUrl) && (
                          <div className="flex items-center gap-2 p-2 border rounded">
                            <img 
                              src={logoPreview || businessForm.logoUrl} 
                              alt="Logo preview"
                              className="w-8 h-8 rounded object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                            <span className="text-xs text-muted-foreground">Logo preview</span>
                          </div>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        type="button"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={handleBusinessSubmit}>
                      {editId ? 'Update Business' : 'Add Business'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setEditId(null);
                        setBusinessForm(getDefaultBusinessForm());
                        setActiveSubsection('business-list');
                      }}
                    >
                      Cancel
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
                  {Object.entries(businessForm.operatingHours || {}).map(([day, hours], index) => (
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
                              ...(businessForm.operatingHours || {}),
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
                                  ...(businessForm.operatingHours || {}),
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
                                  ...(businessForm.operatingHours || {}),
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
                  <Button onClick={handleBusinessSubmit}>Save Operating Hours</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other sections would go here... */}
          {activeSection !== 'general' && activeSection !== 'business' && (
            <div className="space-y-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Coming Soon</h1>
                <p className="text-muted-foreground">This section is under development</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Business</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this business? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;