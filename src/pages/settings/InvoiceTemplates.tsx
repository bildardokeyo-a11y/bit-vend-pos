import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

const InvoiceTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('general-1');

  const invoiceTemplates = [
    { id: 'general-1', name: 'General Invoice 1', category: 'general' },
    { id: 'general-2', name: 'General Invoice 2', category: 'general' },
    { id: 'general-3', name: 'General Invoice 3', category: 'general' },
    { id: 'general-4', name: 'General Invoice 4', category: 'general' },
    { id: 'general-5', name: 'General Invoice 5', category: 'general' }
  ];

  const receiptTemplates = [
    { id: 'receipt-1', name: 'Receipt Invoice 1', category: 'receipt' },
    { id: 'receipt-2', name: 'Receipt Invoice 2', category: 'receipt' },
    { id: 'receipt-3', name: 'Receipt Invoice 3', category: 'receipt' },
    { id: 'receipt-4', name: 'Receipt Invoice 4', category: 'receipt' }
  ];

  const handleSaveTemplate = () => {
    localStorage.setItem('selectedInvoiceTemplate', selectedTemplate);
    toast.success("Template saved successfully!");
  };

  const TemplateCard = ({ template }: { template: any }) => (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => setSelectedTemplate(template.id)}
    >
      <CardContent className="p-4">
        <div className="aspect-[3/4] bg-muted rounded-lg mb-3 flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Preview</div>
        </div>
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{template.name}</h3>
          {selectedTemplate === template.id && (
            <Check className="w-4 h-4 text-primary" />
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Invoice Templates</h2>
        <p className="text-muted-foreground mt-1">Choose a template style for your invoices.</p>
      </div>

      {/* Invoice Templates Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Invoice Templates</h3>
          <Badge variant="secondary">{invoiceTemplates.length} templates</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {invoiceTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>

      {/* Receipt Templates Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Receipt Templates</h3>
          <Badge variant="secondary">{receiptTemplates.length} templates</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {receiptTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleSaveTemplate} className="bg-success hover:bg-success/90">
          Save Template
        </Button>
      </div>
    </div>
  );
};

export default InvoiceTemplates;