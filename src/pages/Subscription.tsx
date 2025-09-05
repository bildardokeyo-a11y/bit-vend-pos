import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Star, CreditCard, Smartphone, Building2, Crown, Lock, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const subscriptionPlans = [
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 9,
    period: 'month',
    description: 'Best for small shops',
    icon: Building2,
    popular: false,
    features: [
      'Basic inventory & sales tracking',
      'Mpesa payments enabled',
      'Simple reports',
      'Email support'
    ]
  },
  {
    id: 'standard',
    name: 'Standard Plan',
    price: 19,
    period: 'month',
    description: 'Perfect for growing businesses',
    icon: Star,
    popular: true,
    features: [
      'Everything in Starter',
      'Multi-user accounts (cashiers/staff)',
      'Advanced sales & expense reports',
      'Low stock alerts',
      'Priority email support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 39,
    period: 'month',
    description: 'Advanced features for scaling',
    icon: Crown,
    popular: false,
    features: [
      'Everything in Standard',
      'Multi-branch support',
      'Customer & supplier management',
      'Customizable receipts & invoices',
      'Priority chat support'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 79,
    period: 'month',
    description: 'Complete solution for large operations',
    icon: Crown,
    popular: false,
    features: [
      'Everything in Pro',
      'Unlimited branches & users',
      'API & advanced integrations',
      'Dedicated account manager',
      '24/7 priority support'
    ]
  }
];

const paymentMethods = [
  {
    id: 'card',
    name: 'Bank Card',
    description: 'Visa, Mastercard, American Express',
    icon: CreditCard,
    available: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pay with your PayPal account',
    icon: CreditCard,
    available: true
  },
  {
    id: 'mpesa',
    name: 'M-Pesa',
    description: 'Mobile money payments',
    icon: Smartphone,
    available: true
  }
];

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('standard');
  const [selectedPayment, setSelectedPayment] = useState<string>('card');
  const [currentPlan] = useState<string>('starter'); // Current active plan
  const [showCvv, setShowCvv] = useState<boolean>(false);
  
  // Payment form data
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });
  
  const [paypalData, setPaypalData] = useState({
    email: ''
  });
  
  const [mpesaData, setMpesaData] = useState({
    phoneNumber: '',
    pin: ''
  });

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handlePaymentSelect = (paymentId: string) => {
    setSelectedPayment(paymentId);
  };

  const handleSubscribe = () => {
    const plan = subscriptionPlans.find(p => p.id === selectedPlan);
    const payment = paymentMethods.find(p => p.id === selectedPayment);
    
    // Validate payment data based on selected method
    let isValid = false;
    let paymentInfo = '';
    
    switch (selectedPayment) {
      case 'card':
        isValid = !!(cardData.cardNumber && cardData.expiryMonth && cardData.expiryYear && 
                    cardData.cvv && cardData.cardholderName);
        paymentInfo = `Card ending in ${cardData.cardNumber.slice(-4)}`;
        break;
      case 'paypal':
        isValid = paypalData.email.includes('@');
        paymentInfo = `PayPal account ${paypalData.email}`;
        break;
      case 'mpesa':
        isValid = !!(mpesaData.phoneNumber && mpesaData.pin);
        paymentInfo = `M-Pesa ${mpesaData.phoneNumber}`;
        break;
    }
    
    if (!isValid) {
      toast.error('Please fill in all required payment details');
      return;
    }
    
    if (plan && payment) {
      toast.success(`Subscription to ${plan.name} ($${plan.price}/month) via ${paymentInfo} is ready for backend processing`);
      console.log('Payment Data Ready:', {
        plan: plan.id,
        paymentMethod: selectedPayment,
        paymentData: selectedPayment === 'card' ? cardData : 
                     selectedPayment === 'paypal' ? paypalData : mpesaData
      });
    }
  };

  const handleCancelSubscription = () => {
    toast.info('Subscription cancellation will be implemented with backend integration');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Subscription Plans</h1>
        <p className="text-muted-foreground">Choose the perfect plan for your business needs</p>
      </div>

      {/* Current Plan Status */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Current Plan: Starter Plan
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Next billing date: January 15, 2024
              </p>
            </div>
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              Active
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {subscriptionPlans.map((plan) => {
          const IconComponent = plan.icon;
          const isCurrentPlan = plan.id === currentPlan;
          const isSelected = plan.id === selectedPlan;
          
          return (
            <Card 
              key={plan.id}
              className={cn(
                "relative cursor-pointer transition-all duration-300 hover:shadow-lg",
                isCurrentPlan && "border-success bg-success/5",
                isSelected && !isCurrentPlan && "border-primary bg-primary/5",
                plan.popular && "ring-2 ring-primary shadow-xl scale-105"
              )}
              onClick={() => !isCurrentPlan && handlePlanSelect(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-success text-success-foreground px-3 py-1">
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className={cn(
                    "p-3 rounded-full",
                    isCurrentPlan ? "bg-success/20 text-success" :
                    isSelected ? "bg-primary/20 text-primary" :
                    "bg-muted text-muted-foreground"
                  )}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                </div>
                
                <div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-sm text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  {isCurrentPlan ? (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelSubscription();
                      }}
                    >
                      Manage Plan
                    </Button>
                  ) : (
                    <Button 
                      variant={isSelected ? "default" : "outline"} 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlanSelect(plan.id);
                      }}
                    >
                      {isSelected ? "Selected" : "Select Plan"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Methods */}
      {selectedPlan !== currentPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Payment Method</CardTitle>
            <p className="text-sm text-muted-foreground">
              Select your preferred payment method for the subscription
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                const isSelected = method.id === selectedPayment;
                
                return (
                  <div
                    key={method.id}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-all",
                      isSelected 
                        ? "border-primary bg-primary/5 ring-1 ring-primary" 
                        : "border-border hover:border-muted-foreground",
                      !method.available && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => method.available && handlePaymentSelect(method.id)}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={cn(
                        "h-6 w-6",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )} />
                      <div>
                        <div className="font-medium text-foreground">{method.name}</div>
                        <div className="text-sm text-muted-foreground">{method.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment Form Fields */}
            {selectedPayment === 'card' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">Secure Payment</span>
                </div>
                
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.cardNumber}
                    onChange={(e) => {
                      // Format card number with spaces
                      const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                      if (value.replace(/\s/g, '').length <= 16) {
                        setCardData(prev => ({ ...prev, cardNumber: value }));
                      }
                    }}
                    maxLength={19}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      placeholder="John Doe"
                      value={cardData.cardholderName}
                      onChange={(e) => setCardData(prev => ({ ...prev, cardholderName: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="expiryMonth">Month</Label>
                      <Select 
                        value={cardData.expiryMonth} 
                        onValueChange={(value) => setCardData(prev => ({ ...prev, expiryMonth: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                              {String(i + 1).padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="expiryYear">Year</Label>
                      <Select 
                        value={cardData.expiryYear} 
                        onValueChange={(value) => setCardData(prev => ({ ...prev, expiryYear: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="YY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return (
                              <SelectItem key={year} value={String(year).slice(-2)}>
                                {String(year).slice(-2)}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <div className="relative">
                        <Input
                          id="cvv"
                          type={showCvv ? "text" : "password"}
                          placeholder="123"
                          value={cardData.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 4) {
                              setCardData(prev => ({ ...prev, cvv: value }));
                            }
                          }}
                          maxLength={4}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCvv(!showCvv)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showCvv ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedPayment === 'paypal' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded text-xs flex items-center justify-center font-bold">P</div>
                  <span className="text-sm font-medium">PayPal Payment</span>
                </div>
                
                <div>
                  <Label htmlFor="paypalEmail">PayPal Email Address</Label>
                  <Input
                    id="paypalEmail"
                    type="email"
                    placeholder="your-email@example.com"
                    value={paypalData.email}
                    onChange={(e) => setPaypalData(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    You'll be redirected to PayPal to complete the payment
                  </p>
                </div>
              </div>
            )}

            {selectedPayment === 'mpesa' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-green-600 text-white rounded text-xs flex items-center justify-center font-bold">M</div>
                  <span className="text-sm font-medium">M-Pesa Payment</span>
                </div>
                
                <div>
                  <Label htmlFor="mpesaPhone">M-Pesa Phone Number</Label>
                  <Input
                    id="mpesaPhone"
                    placeholder="+254 700 000 000"
                    value={mpesaData.phoneNumber}
                    onChange={(e) => setMpesaData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="mpesaPin">M-Pesa PIN</Label>
                  <Input
                    id="mpesaPin"
                    type="password"
                    placeholder="Enter your 4-digit PIN"
                    value={mpesaData.pin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) {
                        setMpesaData(prev => ({ ...prev, pin: value }));
                      }
                    }}
                    maxLength={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your PIN is encrypted and secure
                  </p>
                </div>
              </div>
            )}

            {/* Subscribe Button */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {selectedPlan && (
                  <>Selected: {subscriptionPlans.find(p => p.id === selectedPlan)?.name} - ${subscriptionPlans.find(p => p.id === selectedPlan)?.price}/month</>
                )}
              </div>
              <Button 
                onClick={handleSubscribe}
                disabled={selectedPlan === currentPlan}
                size="lg"
                className="min-w-[120px]"
              >
                Subscribe Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Comparison Note */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-foreground">Need Help Choosing?</h3>
            <p className="text-sm text-muted-foreground">
              All plans include secure data storage, regular backups, and mobile app access. 
              Upgrade or downgrade anytime.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscription;