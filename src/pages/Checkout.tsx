import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Crown, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock product data
const products = [
  {
    id: 1,
    name: "Premium Espresso Blend",
    description: "Artisanal dark roast",
    price: 24.99,
    icon: "☕",
    category: "Coffee"
  },
  {
    id: 2,
    name: "Organic Green Tea",
    description: "Hand-picked leaves",
    price: 18.50,
    icon: "🍃",
    category: "Tea"
  },
  {
    id: 3,
    name: "Gourmet Chocolate Cake",
    description: "Belgian chocolate",
    price: 45.00,
    icon: "🍰",
    category: "Dessert"
  },
  {
    id: 4,
    name: "Vintage Wine Selection",
    description: "Reserve collection",
    price: 89.99,
    icon: "🍷",
    category: "Beverages"
  },
  {
    id: 5,
    name: "Artisan Croissant",
    description: "Buttery perfection",
    price: 12.99,
    icon: "🥐",
    category: "Pastry"
  },
  {
    id: 6,
    name: "Truffle Collection",
    description: "Hand-crafted luxury",
    price: 65.00,
    icon: "🍫",
    category: "Confectionery"
  }
];

const categories = ["All", "Coffee", "Tea", "Dessert", "Beverages", "Pastry", "Confectionery"];

const Checkout = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<Array<{product: any, quantity: number}>>([]);
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [cardNumber, setCardNumber] = useState("1234 5678 9012 3456");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState("");

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + tax;

  const handlePayment = () => {
    if (paymentMethod === "Mobile") {
      // Dummy M-Pesa integration
      alert(`M-Pesa payment request sent to ${mpesaPhone || "254712345678"}. Please check your phone to complete payment of $${finalTotal.toFixed(2)}`);
    } else {
      alert(`Payment of $${finalTotal.toFixed(2)} processed successfully!`);
    }
  };

  return (
    <div className="flex h-full bg-background">
      {/* Products Section */}
      <div className="flex-1 p-6 bg-gradient-to-br from-white to-gray-50 dark:bg-gradient-to-br dark:from-black dark:to-black">
        <div className="flex items-center gap-2 mb-6">
          <Crown className="h-6 w-6 text-warning" />
          <h1 className="text-2xl font-bold text-black dark:text-white">Products</h1>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "rounded-full",
                selectedCategory === category && "bg-primary text-primary-foreground"
              )}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="product-card group cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{product.icon}</div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <p className="text-lg font-bold text-success mt-1">${product.price}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => addToCart(product)}
                    size="sm"
                    className="bg-warning hover:bg-warning/90 text-warning-foreground rounded-full h-8 w-8 p-0 group-hover:scale-110 transition-transform shadow-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-96 bg-card border-l border-border p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Cart</h2>
          <Badge variant="secondary" className="rounded-full">
            {cart.reduce((total, item) => total + item.quantity, 0)} items
          </Badge>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}

        <Separator className="my-4" />

        {/* Cart Summary */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-success">${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <Label className="text-base font-semibold mb-3 block">Payment Method</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={paymentMethod === "Card" ? "default" : "outline"}
              onClick={() => setPaymentMethod("Card")}
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Card
            </Button>
            <Button
              variant={paymentMethod === "Mobile" ? "default" : "outline"}
              onClick={() => setPaymentMethod("Mobile")}
              className="flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4" />
              Mobile
            </Button>
            <Button
              variant={paymentMethod === "Cash" ? "default" : "outline"}
              onClick={() => setPaymentMethod("Cash")}
              className="flex items-center gap-2"
            >
              <Banknote className="h-4 w-4" />
              Cash
            </Button>
          </div>
        </div>

        {/* Payment Form */}
        {paymentMethod === "Card" && (
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry</Label>
                <Input
                  id="expiry"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "Mobile" && (
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="mpesaPhone">M-Pesa Phone Number</Label>
              <Input
                id="mpesaPhone"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                placeholder="254712345678"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              A payment request will be sent to your phone. Please enter your M-Pesa PIN to complete the transaction.
            </div>
          </div>
        )}

        {/* Complete Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={cart.length === 0}
          className="w-full font-semibold py-3"
          style={{
            background: 'hsl(var(--orange-accent))',
            color: 'white'
          }}
        >
          Complete Payment • ${finalTotal.toFixed(2)}
        </Button>
      </div>
    </div>
  );
};

export default Checkout;