import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Printer } from 'lucide-react';

const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, total, tax, subtotal, paymentMethod } = location.state || {};
  
  // Get company details from localStorage (set from settings)
  const [companyInfo, setCompanyInfo] = useState({
    name: 'BitVend POS',
    address: '123 Business Street, City, State 12345',
    phone: '+1 555 123 4567',
    email: 'info@bitvendpos.com'
  });

  useEffect(() => {
    // Load company info from localStorage if available
    const savedCompanyInfo = localStorage.getItem('companySettings');
    if (savedCompanyInfo) {
      const parsed = JSON.parse(savedCompanyInfo);
      setCompanyInfo({
        name: parsed.companyName || 'BitVend POS',
        address: parsed.companyAddress || '123 Business Street, City, State 12345',
        phone: parsed.companyPhone || '+1 555 123 4567',
        email: parsed.companyEmail || 'info@bitvendpos.com'
      });
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!cart) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No receipt data found</p>
            <Button onClick={() => navigate('/checkout')} className="mt-4">
              Back to Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 print:p-0 print:max-w-full">
      <style>{`@media print { body * { visibility: hidden !important; } #receipt-print, #receipt-print * { visibility: visible !important; } #receipt-print { position: absolute; left: 0; top: 0; width: 100%; padding: 0.5in; background: white !important; color: black !important; } }`}</style>
      <div className="flex items-center gap-4 mb-6 print:hidden">
        <Button
          variant="outline"
          onClick={() => navigate('/checkout')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Checkout
        </Button>
        <Button
          onClick={handlePrint}
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Print Receipt
        </Button>
      </div>

      <Card id="receipt-print" className="print:shadow-none dark:bg-black dark:border-gray-800 print:bg-white print:text-black">
        <CardHeader className="text-center border-b dark:border-gray-800 print:border-gray-300">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-primary">{companyInfo.name}</h2>
            <p className="text-sm text-muted-foreground">Point of Sale System</p>
            <p className="text-xs text-muted-foreground">{companyInfo.address}</p>
            <p className="text-xs text-muted-foreground">Phone: {companyInfo.phone} | Email: {companyInfo.email}</p>
          </div>
          <CardTitle className="text-2xl">Payment Receipt</CardTitle>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Items Purchased</h3>
            <div className="space-y-3">
              {cart.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${item.product.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold print:text-black text-foreground">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-b border-dashed border-gray-300 dark:border-gray-600 py-3 my-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="print:text-black text-foreground">${subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax (8%)</span>
                <span className="print:text-black">${tax?.toFixed(2)}</span>
              </div>
              <div className="border-t border-dashed border-gray-300 dark:border-gray-600 pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="print:text-black text-foreground">${total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center border-t border-dashed border-gray-300 dark:border-gray-600 pt-4">
            <p className="text-sm text-muted-foreground">
              Payment Method: <span className="font-semibold">{paymentMethod}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Thank you for your purchase!
            </p>
            <div className="mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-xs text-muted-foreground">
                Visit us at: <span className="font-semibold">www.Bitvendpos.com</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Receipt;