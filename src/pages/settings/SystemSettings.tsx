import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Save, X, Server, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const SystemSettings = () => {
  const [systemSettings, setSystemSettings] = useState({
    // Email
    emailFromName: 'BitVend POS',
    emailFromAddress: 'noreply@bitvendpos.com',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    
    // Backup & Maintenance
    autoBackup: true,
    maintenanceMode: false
  });

  const logs = [
    { id: '1', date: '2024-01-15', type: 'Error', message: 'Payment gateway timeout', size: '2.3 KB' },
    { id: '2', date: '2024-01-14', type: 'Info', message: 'Daily backup completed', size: '1.1 KB' },
    { id: '3', date: '2024-01-14', type: 'Warning', message: 'Low inventory alert triggered', size: '0.8 KB' },
    { id: '4', date: '2024-01-13', type: 'Error', message: 'Database connection lost', size: '1.5 KB' }
  ];

  const handleSave = () => {
    localStorage.setItem('systemSettings', JSON.stringify(systemSettings));
    toast.success("System settings saved successfully!");
  };

  const handleCancel = () => {
    toast.info("Changes cancelled");
  };

  const handleTestEmail = () => {
    toast.info("Test email sent!");
  };

  const handleDownloadLog = (logId: string) => {
    toast.info(`Downloading log ${logId}...`);
  };

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'Error': return 'destructive';
      case 'Warning': return 'secondary';
      case 'Info': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">System Settings</h2>
        <p className="text-muted-foreground mt-1">System configuration and maintenance.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form className="space-y-8">
            {/* Email Configuration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Email Configuration</h3>
                <Button variant="outline" size="sm" onClick={handleTestEmail}>
                  Test Email
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emailFromName">From Name</Label>
                  <Input
                    id="emailFromName"
                    value={systemSettings.emailFromName}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, emailFromName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="emailFromAddress">From Address</Label>
                  <Input
                    id="emailFromAddress"
                    type="email"
                    value={systemSettings.emailFromAddress}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, emailFromAddress: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={systemSettings.smtpHost}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={systemSettings.smtpPort}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, smtpPort: parseInt(e.target.value) || 587 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={systemSettings.smtpUser}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={systemSettings.smtpPassword}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Backup & Maintenance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Backup & Maintenance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoBackup">Automatic Backup</Label>
                    <p className="text-sm text-muted-foreground">Enable daily automated backups</p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={systemSettings.autoBackup}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoBackup: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <div>
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Put system in maintenance mode</p>
                    </div>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* System Logs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">System Logs</h3>
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={getLogTypeColor(log.type) as any}>
                        {log.type}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">{log.message}</p>
                        <p className="text-xs text-muted-foreground">{log.date} • {log.size}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadLog(log.id)}>
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
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

export default SystemSettings;