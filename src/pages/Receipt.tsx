import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Printer } from 'lucide-react';

const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, total, tax, subtotal, paymentMethod } = location.state || {};

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
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
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

      <Card className="print:shadow-none dark:bg-black dark:border-gray-800 print:bg-white print:text-black">
        <CardHeader className="text-center border-b dark:border-gray-800 print:border-gray-300">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-primary">TechStore Plus</h2>
            <p className="text-sm text-muted-foreground">Your Premium Electronics Retailer</p>
            <p className="text-xs text-muted-foreground">123 Tech Street, Digital City, DC 12345</p>
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
                  <p className="font-semibold text-green-500">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-green-500">${subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Tax (8%)</span>
              <span className="text-green-500">${tax?.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-green-500">${total?.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Payment Method: <span className="font-semibold">{paymentMethod}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Thank you for your purchase!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Receipt;