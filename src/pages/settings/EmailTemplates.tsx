import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Eye, RotateCcw, Save, X } from 'lucide-react';
import { toast } from 'sonner';

const EmailTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('invoice');
  const [showPreview, setShowPreview] = useState(false);

  const templates = [
    { id: 'invoice', name: 'Invoice Email', icon: Mail },
    { id: 'payment', name: 'Payment Receipt', icon: Mail },
    { id: 'subscription', name: 'Subscription Renewal', icon: Mail },
    { id: 'password', name: 'Password Reset', icon: Mail },
    { id: 'notification', name: 'Notification', icon: Mail }
  ];

  const [templateContent, setTemplateContent] = useState({
    invoice: {
      subject: 'Invoice #{{invoice_number}} from {{company_name}}',
      body: `Dear {{customer_name}},

Thank you for your business! Please find attached invoice #{{invoice_number}} for the amount of {{invoice_amount}}.

Invoice Details:
- Invoice Number: {{invoice_number}}
- Date: {{invoice_date}}
- Amount: {{invoice_amount}}
- Due Date: {{due_date}}

Payment Instructions:
{{payment_instructions}}

If you have any questions, please don't hesitate to contact us.

Best regards,
{{company_name}}
{{company_email}}`
    },
    payment: {
      subject: 'Payment Received - Receipt #{{receipt_number}}',
      body: `Dear {{customer_name}},

We have successfully received your payment. Thank you!

Payment Details:
- Receipt Number: {{receipt_number}}
- Amount Paid: {{payment_amount}}
- Payment Date: {{payment_date}}
- Payment Method: {{payment_method}}

Best regards,
{{company_name}}`
    }
  });

  const variables = [
    { name: '{{customer_name}}', description: 'Customer full name' },
    { name: '{{company_name}}', description: 'Company name' },
    { name: '{{invoice_number}}', description: 'Invoice number' },
    { name: '{{invoice_amount}}', description: 'Invoice total amount' },
    { name: '{{invoice_date}}', description: 'Invoice date' },
    { name: '{{due_date}}', description: 'Payment due date' },
    { name: '{{payment_amount}}', description: 'Payment amount' },
    { name: '{{receipt_number}}', description: 'Receipt number' }
  ];

  const currentTemplate = templateContent[selectedTemplate as keyof typeof templateContent] || templateContent.invoice;

  const handleSave = () => {
    localStorage.setItem('emailTemplates', JSON.stringify(templateContent));
    toast.success("Email template saved successfully!");
  };

  const handleReset = () => {
    // Reset to default template
    toast.info("Template reset to default");
  };

  const handleSubjectChange = (value: string) => {
    setTemplateContent(prev => ({
      ...prev,
      [selectedTemplate]: {
        ...prev[selectedTemplate as keyof typeof prev] || { subject: '', body: '' },
        subject: value
      }
    }));
  };

  const handleBodyChange = (value: string) => {
    setTemplateContent(prev => ({
      ...prev,
      [selectedTemplate]: {
        ...prev[selectedTemplate as keyof typeof prev] || { subject: '', body: '' },
        body: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Email Templates</h2>
        <p className="text-muted-foreground mt-1">Customize system email templates.</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Template Sidebar */}
        <div className="col-span-3 space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Templates</h3>
          {templates.map((template) => (
            <Button
              key={template.id}
              variant={selectedTemplate === template.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedTemplate(template.id)}
            >
              <template.icon className="w-4 h-4 mr-2" />
              {template.name}
            </Button>
          ))}
          
          {/* Variables Sidebar */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Available Variables</h3>
            <div className="space-y-2">
              {variables.map((variable) => (
                <div key={variable.name} className="text-xs">
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">{variable.name}</code>
                  <p className="text-muted-foreground mt-1">{variable.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="col-span-9">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                {templates.find(t => t.id === selectedTemplate)?.name}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                  <Eye className="w-4 h-4 mr-2" />
                  {showPreview ? 'Hide Preview' : 'Preview'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Default
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  value={currentTemplate.subject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  placeholder="Enter email subject..."
                />
              </div>
              
              <div>
                <Label htmlFor="body">Email Body</Label>
                <Textarea
                  id="body"
                  rows={16}
                  value={currentTemplate.body}
                  onChange={(e) => handleBodyChange(e.target.value)}
                  placeholder="Enter email body..."
                  className="font-mono text-sm"
                />
              </div>

              {showPreview && (
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-semibold mb-2">Preview</h4>
                  <div className="space-y-2">
                    <div><strong>Subject:</strong> {currentTemplate.subject}</div>
                    <div className="border-t pt-2">
                      <pre className="whitespace-pre-wrap text-sm">{currentTemplate.body}</pre>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-success hover:bg-success/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplates;