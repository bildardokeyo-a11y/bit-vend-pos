import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

const FinancialSettings = () => {
  const [financialSettings, setFinancialSettings] = useState({
    // Tax Settings
    taxEnabled: true,
    defaultTaxRate: 8.25,
    multipleTaxEnabled: false,
    
    // Discount Settings
    discountsEnabled: true,
    maxDiscountPercent: 50,
    
    // Payment Settings
    partialPaymentsEnabled: true,
    defaultPaymentTerms: '30'
  });

  const paymentTermsOptions = [
    { value: '0', label: 'Due on Receipt' },
    { value: '15', label: 'Net 15 Days' },
    { value: '30', label: 'Net 30 Days' },
    { value: '45', label: 'Net 45 Days' },
    { value: '60', label: 'Net 60 Days' }
  ];

  const handleSave = () => {
    localStorage.setItem('financialSettings', JSON.stringify(financialSettings));
    toast.success("Financial settings saved successfully!");
  };

  const handleCancel = () => {
    toast.info("Changes cancelled");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Financial Settings</h2>
        <p className="text-muted-foreground mt-1">Configure financial preferences.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form className="space-y-8">
            {/* Tax Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tax Configuration</h3>
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
                  <>
                    <div>
                      <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                      <Input
                        id="defaultTaxRate"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={financialSettings.defaultTaxRate}
                        onChange={(e) => setFinancialSettings(prev => ({ ...prev, defaultTaxRate: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="multipleTaxEnabled">Multiple Tax Rates</Label>
                        <p className="text-sm text-muted-foreground">Allow different tax rates for different items</p>
                      </div>
                      <Switch
                        id="multipleTaxEnabled"
                        checked={financialSettings.multipleTaxEnabled}
                        onCheckedChange={(checked) => setFinancialSettings(prev => ({ ...prev, multipleTaxEnabled: checked }))}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Discount Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Discount Configuration</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="discountsEnabled">Enable Discounts</Label>
                    <p className="text-sm text-muted-foreground">Allow discounts on transactions</p>
                  </div>
                  <Switch
                    id="discountsEnabled"
                    checked={financialSettings.discountsEnabled}
                    onCheckedChange={(checked) => setFinancialSettings(prev => ({ ...prev, discountsEnabled: checked }))}
                  />
                </div>
                {financialSettings.discountsEnabled && (
                  <div>
                    <Label htmlFor="maxDiscountPercent">Maximum Discount Percentage (%)</Label>
                    <Input
                      id="maxDiscountPercent"
                      type="number"
                      min="0"
                      max="100"
                      value={financialSettings.maxDiscountPercent}
                      onChange={(e) => setFinancialSettings(prev => ({ ...prev, maxDiscountPercent: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Payment Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Configuration</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="partialPaymentsEnabled">Partial Payments</Label>
                    <p className="text-sm text-muted-foreground">Allow customers to make partial payments</p>
                  </div>
                  <Switch
                    id="partialPaymentsEnabled"
                    checked={financialSettings.partialPaymentsEnabled}
                    onCheckedChange={(checked) => setFinancialSettings(prev => ({ ...prev, partialPaymentsEnabled: checked }))}
                  />
                </div>
                <div>
                  <Label htmlFor="defaultPaymentTerms">Default Payment Terms</Label>
                  <Select 
                    value={financialSettings.defaultPaymentTerms} 
                    onValueChange={(value) => setFinancialSettings(prev => ({ ...prev, defaultPaymentTerms: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTermsOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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

export default FinancialSettings;