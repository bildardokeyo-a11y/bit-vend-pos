import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Crown, CreditCard, Smartphone, Banknote, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock product data
const products = [
  {
    id: 1,
    name: "Premium Espresso Blend",
    description: "Artisanal dark roast",
    price: 24.99,
    category: "Coffee"
  },
  {
    id: 2,
    name: "Organic Green Tea",
    description: "Hand-picked leaves",
    price: 18.50,
    category: "Tea"
  },
  {
    id: 3,
    name: "Gourmet Chocolate Cake",
    description: "Belgian chocolate",
    price: 45.00,
    category: "Dessert"
  },
  {
    id: 4,
    name: "Vintage Wine Selection",
    description: "Reserve collection",
    price: 89.99,
    category: "Beverages"
  },
  {
    id: 5,
    name: "Artisan Croissant",
    description: "Buttery perfection",
    price: 12.99,
    category: "Pastry"
  },
  {
    id: 6,
    name: "Truffle Collection",
    description: "Hand-crafted luxury",
    price: 65.00,
    category: "Confectionery"
  }
];

const categories = ["All", "Coffee", "Tea", "Dessert", "Beverages", "Pastry", "Confectionery"];

const Checkout = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<Array<{product: any, quantity: number}>>(() => {
    const saved = localStorage.getItem('pos-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [animatingButtons, setAnimatingButtons] = useState<Set<number>>(new Set());
  const [animatingCartItems, setAnimatingCartItems] = useState<Set<number>>(new Set());

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pos-cart', JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: any) => {
    // Animate the + button
    setAnimatingButtons(prev => new Set([...prev, product.id]));
    setTimeout(() => {
      setAnimatingButtons(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 300);

    setCart((prev) => {
      const exists = prev.find((item) => item.product.id === product.id)
      
      // If item exists, animate the cart item
      if (exists) {
        setAnimatingCartItems(prevSet => new Set([...prevSet, product.id]));
        setTimeout(() => {
          setAnimatingCartItems(prevSet => {
            const newSet = new Set(prevSet);
            newSet.delete(product.id);
            return newSet;
          });
        }, 500);
      }
      
      const next = exists
        ? prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { product, quantity: 1 }]
      localStorage.setItem('pos-cart', JSON.stringify(next))
      return next
    })
  };
  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + tax;

  const isPaymentValid = () => {
    if (paymentMethod === "Card") {
      return cardNumber.trim() !== "" && expiry.trim() !== "" && cvv.trim() !== "";
    }
    if (paymentMethod === "Mobile") {
      return mpesaPhone.trim() !== "";
    }
    return true; // Cash payment doesn't need validation
  };

  const handlePayment = () => {
    if (!isPaymentValid()) {
      return; // Prevent navigation if payment details are incomplete
    }
    
    navigate('/receipt', {
      state: {
        cart,
        total: finalTotal,
        tax,
        subtotal: cartTotal,
        paymentMethod
      }
    });
  };

  return (
    <div className="flex h-full bg-background">
      {/* Products Section */}
      <div className="flex-1 p-6 bg-gradient-to-br from-white to-gray-50 dark:bg-gradient-to-br dark:from-black dark:to-black">
        <div className="mb-6">
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
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center border flex-shrink-0">
                      <div className="w-16 h-16 bg-muted-foreground/20 rounded"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{product.description}</p>
                      <p className="text-lg font-bold text-green-500 mt-1">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <Button
                      onClick={() => addToCart(product)}
                      size="sm"
                      className={cn(
                        "bg-warning hover:bg-warning/90 text-warning-foreground rounded-lg h-8 w-8 p-0 group-hover:scale-110 transition-all duration-200 shadow-md border-0",
                        animatingButtons.has(product.id) && "animate-pulse scale-125"
                      )}
                    >
                      <Plus className="h-4 w-4 font-bold" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-96 bg-card dark:bg-black border-l border-border p-6 flex flex-col">
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
               <div 
                 key={index} 
                 className={cn(
                   "flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group",
                   animatingCartItems.has(item.product.id) && "scale-110"
                 )}
               >
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full hover:scale-110 transition-transform duration-200"
                      onClick={() => {
                        // Animate cart item
                        setAnimatingCartItems(prev => new Set([...prev, item.product.id]));
                        setTimeout(() => {
                          setAnimatingCartItems(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(item.product.id);
                            return newSet;
                          });
                        }, 200);
                        
                        setCart((prev) => {
                          const target = prev.find((ci) => ci.product.id === item.product.id)
                          let next = prev
                          if (target && target.quantity > 1) {
                            next = prev.map((cartItem) =>
                              cartItem.product.id === item.product.id
                                ? { ...cartItem, quantity: cartItem.quantity - 1 }
                                : cartItem
                            )
                          } else {
                            next = prev.filter((cartItem) => cartItem.product.id !== item.product.id)
                          }
                          localStorage.setItem('pos-cart', JSON.stringify(next))
                          return next
                        })
                      }}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm text-muted-foreground min-w-[2rem] text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full hover:scale-110 transition-transform duration-200"
                      onClick={() => {
                        // Animate cart item
                        setAnimatingCartItems(prev => new Set([...prev, item.product.id]));
                        setTimeout(() => {
                          setAnimatingCartItems(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(item.product.id);
                            return newSet;
                          });
                        }, 200);
                        
                        setCart((prev) => {
                          const next = prev.map((cartItem) =>
                            cartItem.product.id === item.product.id
                              ? { ...cartItem, quantity: cartItem.quantity + 1 }
                              : cartItem
                          )
                          localStorage.setItem('pos-cart', JSON.stringify(next))
                          return next
                        })
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="font-semibold text-green-500 group-hover:scale-105 transition-transform duration-200">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}

        <Separator className="my-4" />

        {/* Cart Summary */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-green-500">${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Tax (8%)</span>
            <span className="text-green-500">${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-green-500">${finalTotal.toFixed(2)}</span>
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
          disabled={cart.length === 0 || !isPaymentValid()}
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