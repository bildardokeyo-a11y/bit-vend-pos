import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

const AppSettings = () => {
  const [appSettings, setAppSettings] = useState({
    // Login & Security
    twoFactorEnabled: false,
    captchaEnabled: true,
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // Theme
    darkMode: false,
    themeColor: '#3b82f6'
  });

  const themeColors = [
    { value: '#3b82f6', label: 'Blue', color: '#3b82f6' },
    { value: '#10b981', label: 'Green', color: '#10b981' },
    { value: '#f59e0b', label: 'Orange', color: '#f59e0b' },
    { value: '#ef4444', label: 'Red', color: '#ef4444' },
    { value: '#8b5cf6', label: 'Purple', color: '#8b5cf6' },
    { value: '#06b6d4', label: 'Cyan', color: '#06b6d4' }
  ];

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
    toast.success("App settings saved successfully!");
  };

  const handleCancel = () => {
    toast.info("Changes cancelled");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">App Settings</h2>
        <p className="text-muted-foreground mt-1">Manage system preferences.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form className="space-y-8">
            {/* Login & Security */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Login & Security</h3>
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
                    <Label htmlFor="captcha">CAPTCHA Protection</Label>
                    <p className="text-sm text-muted-foreground">Enable CAPTCHA for login forms</p>
                  </div>
                  <Switch
                    id="captcha"
                    checked={appSettings.captchaEnabled}
                    onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, captchaEnabled: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifs">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifs"
                    checked={appSettings.emailNotifications}
                    onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifs">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifs"
                    checked={appSettings.smsNotifications}
                    onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, smsNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifs">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications</p>
                  </div>
                  <Switch
                    id="pushNotifs"
                    checked={appSettings.pushNotifications}
                    onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Theme */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Theme</h3>
              <div className="space-y-4">
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
                <div>
                  <Label htmlFor="themeColor">Theme Color</Label>
                  <Select 
                    value={appSettings.themeColor} 
                    onValueChange={(value) => setAppSettings(prev => ({ ...prev, themeColor: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {themeColors.map(color => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border" 
                              style={{ backgroundColor: color.color }}
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default AppSettings;