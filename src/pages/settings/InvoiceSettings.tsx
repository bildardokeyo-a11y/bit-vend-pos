import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

const InvoiceSettings = () => {
  const [invoiceSettings, setInvoiceSettings] = useState({
    invoicePrefix: 'INV-',
    startingNumber: 1000,
    defaultNotes: '',
    termsConditions: '',
    showTaxDetails: true,
    displayLogo: true,
    footerText: ''
  });

  const handleSave = () => {
    localStorage.setItem('invoiceSettings', JSON.stringify(invoiceSettings));
    toast.success("Invoice settings saved successfully!");
  };

  const handleCancel = () => {
    toast.info("Changes cancelled");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Invoice Settings</h2>
        <p className="text-muted-foreground mt-1">Configure your default invoice behavior and layout.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form className="space-y-8">
            {/* Invoice Numbering */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Invoice Numbering</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    value={invoiceSettings.invoicePrefix}
                    onChange={(e) => setInvoiceSettings(prev => ({ ...prev, invoicePrefix: e.target.value }))}
                    placeholder="INV-"
                  />
                </div>
                <div>
                  <Label htmlFor="startingNumber">Starting Number</Label>
                  <Input
                    id="startingNumber"
                    type="number"
                    value={invoiceSettings.startingNumber}
                    onChange={(e) => setInvoiceSettings(prev => ({ ...prev, startingNumber: parseInt(e.target.value) || 1000 }))}
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>

            {/* Default Invoice Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Default Invoice Notes</h3>
              <div>
                <Label htmlFor="defaultNotes">Default Notes</Label>
                <Textarea
                  id="defaultNotes"
                  rows={4}
                  value={invoiceSettings.defaultNotes}
                  onChange={(e) => setInvoiceSettings(prev => ({ ...prev, defaultNotes: e.target.value }))}
                  placeholder="Enter default notes that will appear on all invoices..."
                />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Terms & Conditions</h3>
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
            </div>

            {/* Invoice Layout Defaults */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Invoice Layout Defaults</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showTaxDetails">Show Tax Details</Label>
                    <p className="text-sm text-muted-foreground">Display tax breakdown on invoices</p>
                  </div>
                  <Switch
                    id="showTaxDetails"
                    checked={invoiceSettings.showTaxDetails}
                    onCheckedChange={(checked) => setInvoiceSettings(prev => ({ ...prev, showTaxDetails: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="displayLogo">Display Logo on Invoice</Label>
                    <p className="text-sm text-muted-foreground">Show company logo on invoices</p>
                  </div>
                  <Switch
                    id="displayLogo"
                    checked={invoiceSettings.displayLogo}
                    onCheckedChange={(checked) => setInvoiceSettings(prev => ({ ...prev, displayLogo: checked }))}
                  />
                </div>
                <div>
                  <Label htmlFor="footerText">Footer Text</Label>
                  <Textarea
                    id="footerText"
                    rows={3}
                    value={invoiceSettings.footerText}
                    onChange={(e) => setInvoiceSettings(prev => ({ ...prev, footerText: e.target.value }))}
                    placeholder="Enter footer text for invoices..."
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
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceSettings;