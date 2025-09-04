import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Upload, Save, X } from 'lucide-react';
import { toast } from 'sonner';

const WebSettings = () => {
  const [webSettings, setWebSettings] = useState({
    // Site Info
    siteTitle: 'BitVend POS System',
    siteDescription: 'Modern point of sale system for retail businesses',
    siteKeywords: 'POS, point of sale, retail, inventory, business',
    
    // SEO
    seoEnabled: true,
    googleAnalyticsCode: '',
    facebookPixelId: '',
    
    // Media
    banner: null as File | null,
    favicon: null as File | null
  });

  const handleSave = () => {
    localStorage.setItem('webSettings', JSON.stringify(webSettings));
    toast.success("Web settings saved successfully!");
  };

  const handleCancel = () => {
    toast.info("Changes cancelled");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Web Settings</h2>
        <p className="text-muted-foreground mt-1">Configure frontend and web settings.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form className="space-y-8">
            {/* Site Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Site Information</h3>
              <div>
                <Label htmlFor="siteTitle">Site Title</Label>
                <Input
                  id="siteTitle"
                  value={webSettings.siteTitle}
                  onChange={(e) => setWebSettings(prev => ({ ...prev, siteTitle: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  rows={3}
                  value={webSettings.siteDescription}
                  onChange={(e) => setWebSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="siteKeywords">Site Keywords</Label>
                <Input
                  id="siteKeywords"
                  value={webSettings.siteKeywords}
                  onChange={(e) => setWebSettings(prev => ({ ...prev, siteKeywords: e.target.value }))}
                  placeholder="Comma separated keywords"
                />
              </div>
            </div>

            {/* SEO */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">SEO & Analytics</h3>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="seoEnabled">Enable SEO</Label>
                  <p className="text-sm text-muted-foreground">Enable search engine optimization features</p>
                </div>
                <Switch
                  id="seoEnabled"
                  checked={webSettings.seoEnabled}
                  onCheckedChange={(checked) => setWebSettings(prev => ({ ...prev, seoEnabled: checked }))}
                />
              </div>
              <div>
                <Label htmlFor="googleAnalyticsCode">Google Analytics Code</Label>
                <Input
                  id="googleAnalyticsCode"
                  value={webSettings.googleAnalyticsCode}
                  onChange={(e) => setWebSettings(prev => ({ ...prev, googleAnalyticsCode: e.target.value }))}
                  placeholder="GA-XXXXXXXXX-X"
                />
              </div>
              <div>
                <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                <Input
                  id="facebookPixelId"
                  value={webSettings.facebookPixelId}
                  onChange={(e) => setWebSettings(prev => ({ ...prev, facebookPixelId: e.target.value }))}
                  placeholder="Facebook Pixel ID"
                />
              </div>
            </div>

            {/* Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Media</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="banner">Site Banner</Label>
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Banner
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

export default WebSettings;