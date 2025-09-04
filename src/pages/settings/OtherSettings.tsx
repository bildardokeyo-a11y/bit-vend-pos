import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Save, X, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const OtherSettings = () => {
  const [otherSettings, setOtherSettings] = useState({
    // Localization
    defaultLanguage: 'en',
    multiLanguageEnabled: false,
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // Integrations
    googleMapsApiKey: '',
    thirdPartyTokens: [
      { id: '1', name: 'PayPal API', token: 'pk_test_...' },
      { id: '2', name: 'Stripe Key', token: 'sk_test_...' }
    ]
  });

  const [newToken, setNewToken] = useState({ name: '', token: '' });
  const [showAddToken, setShowAddToken] = useState(false);

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' }
  ];

  const handleSave = () => {
    localStorage.setItem('otherSettings', JSON.stringify(otherSettings));
    toast.success("Other settings saved successfully!");
  };

  const handleCancel = () => {
    toast.info("Changes cancelled");
  };

  const handleAddToken = () => {
    if (!newToken.name || !newToken.token) {
      toast.error("Please provide both name and token");
      return;
    }

    const token = {
      id: Date.now().toString(),
      name: newToken.name,
      token: newToken.token
    };

    setOtherSettings(prev => ({
      ...prev,
      thirdPartyTokens: [...prev.thirdPartyTokens, token]
    }));

    setNewToken({ name: '', token: '' });
    setShowAddToken(false);
    toast.success("Token added successfully!");
  };

  const handleRemoveToken = (id: string) => {
    setOtherSettings(prev => ({
      ...prev,
      thirdPartyTokens: prev.thirdPartyTokens.filter(token => token.id !== id)
    }));
    toast.success("Token removed!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Other Settings</h2>
        <p className="text-muted-foreground mt-1">Miscellaneous configuration options.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form className="space-y-8">
            {/* Localization */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Localization</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <Select 
                    value={otherSettings.defaultLanguage} 
                    onValueChange={(value) => setOtherSettings(prev => ({ ...prev, defaultLanguage: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="multiLanguage">Multi-Language Support</Label>
                    <p className="text-sm text-muted-foreground">Enable multiple language support</p>
                  </div>
                  <Switch
                    id="multiLanguage"
                    checked={otherSettings.multiLanguageEnabled}
                    onCheckedChange={(checked) => setOtherSettings(prev => ({ ...prev, multiLanguageEnabled: checked }))}
                  />
                </div>
                {otherSettings.multiLanguageEnabled && (
                  <div>
                    <Label>Upload Language Pack</Label>
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Language File (.json)
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Notifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifs">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifs"
                    checked={otherSettings.emailNotifications}
                    onCheckedChange={(checked) => setOtherSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifs">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifs"
                    checked={otherSettings.smsNotifications}
                    onCheckedChange={(checked) => setOtherSettings(prev => ({ ...prev, smsNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifs">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send push notifications</p>
                  </div>
                  <Switch
                    id="pushNotifs"
                    checked={otherSettings.pushNotifications}
                    onCheckedChange={(checked) => setOtherSettings(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Integrations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Integrations</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="googleMapsApi">Google Maps API Key</Label>
                  <Input
                    id="googleMapsApi"
                    type="password"
                    value={otherSettings.googleMapsApiKey}
                    onChange={(e) => setOtherSettings(prev => ({ ...prev, googleMapsApiKey: e.target.value }))}
                    placeholder="Enter Google Maps API key"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Third-Party API Tokens</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowAddToken(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Token
                    </Button>
                  </div>
                  
                  {showAddToken && (
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="tokenName">Token Name</Label>
                          <Input
                            id="tokenName"
                            value={newToken.name}
                            onChange={(e) => setNewToken(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., PayPal API"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tokenValue">Token Value</Label>
                          <Input
                            id="tokenValue"
                            type="password"
                            value={newToken.token}
                            onChange={(e) => setNewToken(prev => ({ ...prev, token: e.target.value }))}
                            placeholder="Enter token"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowAddToken(false)}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleAddToken}>
                          Add Token
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {otherSettings.thirdPartyTokens.map((token) => (
                      <div key={token.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{token.name}</span>
                            <Badge variant="secondary">Active</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {token.token.substring(0, 10)}...
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRemoveToken(token.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
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

export default OtherSettings;