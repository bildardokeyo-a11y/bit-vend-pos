import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  QrCode, 
  Search, 
  Printer, 
  Download,
  Package,
  Settings,
  Grid3x3
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  category: string;
}

const Barcode = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [barcodeSettings, setBarcodeSettings] = useState({
    format: 'CODE128',
    width: 2,
    height: 100,
    showText: true,
    fontSize: 12,
    includePrice: true,
    includeProductName: true,
    labelsPerRow: 3,
    paperSize: 'A4'
  });

  const [products] = useState<Product[]>([

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  );

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const generateBarcode = (code: string) => {
    // In a real app, this would generate an actual barcode using a library like JsBarcode
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="50" xmlns="http://www.w3.org/2000/svg">
        <g>
          ${code.split('').map((digit, i) => 
            `<rect x="${i * 15}" y="0" width="${parseInt(digit) % 2 === 0 ? '10' : '5'}" height="40" fill="black"/>`
          ).join('')}
          <text x="100" y="50" text-anchor="middle" font-size="12">${code}</text>
        </g>
      </svg>
    `)}`;
  };

  const printBarcodes = () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product to print barcodes.');
      return;
    }

    const selectedProductsData = products.filter(p => selectedProducts.includes(p.id));
    
    // Create print content
    const printContent = `
      <html>
        <head>
          <title>Barcode Labels</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .barcode-grid { 
              display: grid; 
              grid-template-columns: repeat(${barcodeSettings.labelsPerRow}, 1fr);
              gap: 10px;
            }
            .barcode-label {
              border: 1px solid #ccc;
              padding: 10px;
              text-align: center;
              page-break-inside: avoid;
            }
            .barcode-image { width: 100%; max-width: 200px; }
            .product-info { font-size: ${barcodeSettings.fontSize}px; margin-top: 5px; }
            @media print { 
              body { margin: 0; }
              .barcode-label { border: 1px solid #000; }
            }
          </style>
        </head>
        <body>
          <div class="barcode-grid">
            ${selectedProductsData.map(product => `
              <div class="barcode-label">
                <img src="${generateBarcode(product.barcode)}" alt="Barcode" class="barcode-image" />
                ${barcodeSettings.showText ? `<div class="barcode-text">${product.barcode}</div>` : ''}
                ${barcodeSettings.includeProductName ? `<div class="product-info"><strong>${product.name}</strong></div>` : ''}
                <div class="product-info">SKU: ${product.sku}</div>
                ${barcodeSettings.includePrice ? `<div class="product-info">$${product.price.toFixed(2)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;

    // Open print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const exportBarcodes = () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product to export barcodes.');
      return;
    }
    
    // In a real implementation, this would generate a PDF or image file
    alert(`Exporting ${selectedProducts.length} barcodes as ${barcodeSettings.format} format...`);
  };

  return (
    <div className="space-y-6 p-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Barcode Generator</h1>
          <p className="text-muted-foreground">Generate and print barcodes for your products</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={exportBarcodes}>
            <Download size={16} />
            Export
          </Button>
          <Button className="gap-2" onClick={printBarcodes}>
            <Printer size={16} />
            Print Selected
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package size={20} />
                  Select Products ({selectedProducts.length} selected)
                </CardTitle>
                <Button variant="outline" size="sm" onClick={toggleAll}>
                  {selectedProducts.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => toggleProduct(product.id)}
                    >
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProduct(product.id)}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          SKU: {product.sku} • Barcode: {product.barcode}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{product.category}</Badge>
                          <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <img 
                          src={generateBarcode(product.barcode)} 
                          alt="Barcode preview"
                          className="w-16 h-8 object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barcode Settings */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={20} />
                Barcode Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="format">Barcode Format</Label>
                <select
                  id="format"
                  value={barcodeSettings.format}
                  onChange={(e) => setBarcodeSettings(prev => ({ ...prev, format: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="CODE128">CODE128</option>
                  <option value="UPC-A">UPC-A</option>
                  <option value="EAN-13">EAN-13</option>
                  <option value="CODE39">CODE39</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    min="1"
                    max="5"
                    value={barcodeSettings.width}
                    onChange={(e) => setBarcodeSettings(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    min="50"
                    max="200"
                    value={barcodeSettings.height}
                    onChange={(e) => setBarcodeSettings(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="fontSize">Font Size</Label>
                <Input
                  id="fontSize"
                  type="number"
                  min="8"
                  max="20"
                  value={barcodeSettings.fontSize}
                  onChange={(e) => setBarcodeSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                />
              </div>

              <div>
                <Label htmlFor="labelsPerRow">Labels Per Row</Label>
                <select
                  id="labelsPerRow"
                  value={barcodeSettings.labelsPerRow}
                  onChange={(e) => setBarcodeSettings(prev => ({ ...prev, labelsPerRow: parseInt(e.target.value) }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showText"
                    checked={barcodeSettings.showText}
                    onCheckedChange={(checked) => setBarcodeSettings(prev => ({ ...prev, showText: !!checked }))}
                  />
                  <Label htmlFor="showText">Show barcode text</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeProductName"
                    checked={barcodeSettings.includeProductName}
                    onCheckedChange={(checked) => setBarcodeSettings(prev => ({ ...prev, includeProductName: !!checked }))}
                  />
                  <Label htmlFor="includeProductName">Include product name</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includePrice"
                    checked={barcodeSettings.includePrice}
                    onCheckedChange={(checked) => setBarcodeSettings(prev => ({ ...prev, includePrice: !!checked }))}
                  />
                  <Label htmlFor="includePrice">Include price</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode size={20} />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedProducts.length > 0 ? (
                <div className="text-center">
                  {(() => {
                    const firstProduct = products.find(p => p.id === selectedProducts[0]);
                    if (!firstProduct) return null;
                    
                    return (
                      <div className="border p-4 rounded">
                        <img 
                          src={generateBarcode(firstProduct.barcode)} 
                          alt="Barcode preview"
                          className="mx-auto mb-2"
                          style={{ 
                            width: `${barcodeSettings.width * 100}px`,
                            height: `${barcodeSettings.height}px`
                          }}
                        />
                        {barcodeSettings.showText && (
                          <div style={{ fontSize: `${barcodeSettings.fontSize}px` }}>
                            {firstProduct.barcode}
                          </div>
                        )}
                        {barcodeSettings.includeProductName && (
                          <div className="font-medium mt-1" style={{ fontSize: `${barcodeSettings.fontSize}px` }}>
                            {firstProduct.name}
                          </div>
                        )}
                        <div style={{ fontSize: `${barcodeSettings.fontSize}px` }}>
                          SKU: {firstProduct.sku}
                        </div>
                        {barcodeSettings.includePrice && (
                          <div style={{ fontSize: `${barcodeSettings.fontSize}px` }}>
                            ${firstProduct.price.toFixed(2)}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Grid3x3 size={48} className="mx-auto mb-2 opacity-50" />
                  Select products to see preview
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Barcode;