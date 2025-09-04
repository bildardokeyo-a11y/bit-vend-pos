import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Upload, Edit, Trash2, Star, Save, X } from 'lucide-react';
import { toast } from 'sonner';

const SignatureTemplates = () => {
  const [signatures, setSignatures] = useState([
    { id: '1', name: 'John Doe Signature', isDefault: true, url: '/placeholder-signature.png' },
    { id: '2', name: 'Manager Signature', isDefault: false, url: '/placeholder-signature.png' }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSignature, setNewSignature] = useState({
    name: '',
    isDefault: false,
    file: null as File | null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size <= 2 * 1024 * 1024 && (file.type === 'image/jpeg' || file.type === 'image/png')) {
        setNewSignature(prev => ({ ...prev, file }));
        toast.success("Signature file selected!");
      } else {
        toast.error("File must be JPG or PNG and less than 2MB");
      }
    }
  };

  const handleSaveSignature = () => {
    if (!newSignature.name || !newSignature.file) {
      toast.error("Please provide a name and upload a signature");
      return;
    }

    const newSig = {
      id: Date.now().toString(),
      name: newSignature.name,
      isDefault: newSignature.isDefault,
      url: URL.createObjectURL(newSignature.file)
    };

    if (newSignature.isDefault) {
      setSignatures(prev => prev.map(sig => ({ ...sig, isDefault: false })));
    }

    setSignatures(prev => [...prev, newSig]);
    setNewSignature({ name: '', isDefault: false, file: null });
    setShowAddForm(false);
    toast.success("Signature added successfully!");
  };

  const setAsDefault = (id: string) => {
    setSignatures(prev => prev.map(sig => ({ ...sig, isDefault: sig.id === id })));
    toast.success("Default signature updated!");
  };

  const deleteSignature = (id: string) => {
    setSignatures(prev => prev.filter(sig => sig.id !== id));
    toast.success("Signature deleted!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Signature Templates</h2>
          <p className="text-muted-foreground mt-1">Manage digital signature templates.</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-primary">
          <Upload className="w-4 h-4 mr-2" />
          Add Signature
        </Button>
      </div>

      {/* Add Signature Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Signature</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="signatureName">Signature Name</Label>
              <Input
                id="signatureName"
                value={newSignature.name}
                onChange={(e) => setNewSignature(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter signature name"
              />
            </div>
            
            <div>
              <Label>Upload Signature</Label>
              <Button variant="outline" onClick={handleFileUpload} className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Choose File (JPG/PNG, max 2MB)
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="hidden"
              />
              {newSignature.file && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {newSignature.file.name}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="setDefault">Set as Default</Label>
                <p className="text-sm text-muted-foreground">Use this as the default signature</p>
              </div>
              <Switch
                id="setDefault"
                checked={newSignature.isDefault}
                onCheckedChange={(checked) => setNewSignature(prev => ({ ...prev, isDefault: checked }))}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveSignature} className="bg-success hover:bg-success/90">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Signature Gallery */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Signature Gallery</h3>
          <Badge variant="secondary">{signatures.length} signatures</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {signatures.map((signature) => (
            <Card key={signature.id} className="relative">
              <CardContent className="p-4">
                <div className="aspect-[3/1] bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  <img 
                    src={signature.url} 
                    alt={signature.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling!.textContent = 'Signature Preview';
                    }}
                  />
                  <div className="text-muted-foreground text-sm hidden">Signature Preview</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate">{signature.name}</h3>
                    {signature.isDefault && (
                      <Badge variant="default" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => setAsDefault(signature.id)}
                      disabled={signature.isDefault}
                    >
                      <Star className="w-3 h-3 mr-1" />
                      Set Default
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSignature(signature.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignatureTemplates;