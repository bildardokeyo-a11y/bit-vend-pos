import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Save, X } from 'lucide-react';
import { toast } from 'sonner';

const GeneralSettings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    // Company Info
    companyName: 'BitVend POS',
    companyEmail: 'support@bitvendpos.com',
    companyPhone: '+1 555-123-4567',
    companyAddress: '123 Business Street\nSuite 400\nNew York, NY 10001',
    country: 'US',
    
    // Preferences
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'America/New_York',
    currency: 'USD',
    
    // Branding
    logo: null as File | null,
    favicon: null as File | null,
    themeColor: '#3b82f6'
  });

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ];

  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' }
  ];

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' }
  ];

  const handleSave = () => {
    localStorage.setItem('generalSettings', JSON.stringify(generalSettings));
    toast.success("General settings saved successfully!");
  };

  const handleCancel = () => {
    toast.info("Changes cancelled");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">General Settings</h2>
        <p className="text-muted-foreground mt-1">Configure business and system details.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form className="space-y-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company Information</h3>
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
                  <Label htmlFor="companyEmail">Company Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={generalSettings.companyEmail}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyEmail: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="companyPhone">Company Phone</Label>
                  <Input
                    id="companyPhone"
                    value={generalSettings.companyPhone}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyPhone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={generalSettings.country} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, country: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="companyAddress">Company Address</Label>
                <Textarea
                  id="companyAddress"
                  rows={3}
                  value={generalSettings.companyAddress}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyAddress: e.target.value }))}
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preferences</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={generalSettings.language} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={generalSettings.dateFormat} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, dateFormat: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dateFormats.map(format => (
                        <SelectItem key={format.value} value={format.value}>{format.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map(tz => (
                        <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={generalSettings.currency} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(curr => (
                        <SelectItem key={curr.value} value={curr.value}>{curr.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Branding */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Branding</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logo">Company Logo</Label>
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>
                <div>
                  <Label htmlFor="favicon">Favicon</Label>
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Favicon
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="themeColor">Theme Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={generalSettings.themeColor}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, themeColor: e.target.value }))}
                    className="w-16 h-10"
                  />
                  <Input
                    value={generalSettings.themeColor}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, themeColor: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-success hover:bg-success/90">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;