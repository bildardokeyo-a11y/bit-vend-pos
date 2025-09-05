import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  CheckCircle,
  Star,
  Crown,
  Building2,
  ArrowRight,
  Zap,
  Shield,
  Users,
  BarChart3,
  CreditCard,
  Smartphone,
  Globe,
  Headphones,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MarketingLayout from '@/components/marketing/MarketingLayout';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small businesses just getting started',
      icon: Building2,
      monthlyPrice: 9,
      annualPrice: 7.5, // $90/year = $7.5/month
      popular: false,
      features: [
        'Up to 1,000 products',
        'Basic inventory tracking', 
        'Sales reporting',
        'M-Pesa payment integration',
        'Receipt printing',
        'Email support',
        '1 user account',
        'Cloud backup'
      ],
      limits: {
        products: '1,000',
        users: '1',
        storage: '1GB',
        support: 'Email'
      }
    },
    {
      id: 'standard',
      name: 'Standard',
      description: 'Great for growing businesses with multiple staff',
      icon: Star,
      monthlyPrice: 19,
      annualPrice: 15.83, // $190/year = $15.83/month
      popular: true,
      features: [
        'Up to 10,000 products',
        'Advanced inventory management',
        'Advanced sales & expense reports',
        'Multiple payment methods',
        'Staff management (up to 5 users)',
        'Low stock alerts',
        'Customer management',
        'Priority email support',
        'Multi-device access'
      ],
      limits: {
        products: '10,000',
        users: '5',
        storage: '5GB',
        support: 'Priority Email'
      }
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'Advanced features for scaling operations',
      icon: Crown,
      monthlyPrice: 39,
      annualPrice: 32.5, // $390/year = $32.5/month
      popular: false,
      features: [
        'Unlimited products',
        'Multi-branch support',
        'Advanced analytics & insights',
        'Custom receipt templates',
        'Supplier management', 
        'Staff performance tracking',
        'API access',
        'Priority chat support',
        'Advanced integrations',
        'Unlimited users'
      ],
      limits: {
        products: 'Unlimited',
        users: 'Unlimited',
        storage: '25GB',
        support: 'Priority Chat'
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Complete solution for large operations',
      icon: Crown,
      monthlyPrice: 79,
      annualPrice: 65.83, // $790/year = $65.83/month
      popular: false,
      features: [
        'Everything in Professional',
        'Unlimited branches',
        'Advanced user roles & permissions',
        'Custom integrations',
        'Dedicated account manager',
        'Priority phone support',
        'Custom training sessions',
        '99.9% uptime SLA',
        'Advanced security features',
        'Custom reporting'
      ],
      limits: {
        products: 'Unlimited',
        users: 'Unlimited', 
        storage: '100GB',
        support: '24/7 Phone'
      }
    }
  ];

  const faqs = [
    {
      question: 'Can I switch plans anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we\'ll prorate the billing.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and M-Pesa for Kenyan businesses. All payments are processed securely.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! All plans come with a 14-day free trial. No credit card required to start your trial.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely! You can cancel your subscription at any time. Your data will remain accessible for 30 days after cancellation.'
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes! Save up to 20% when you choose annual billing. The discount is applied automatically.'
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'We offer email support for all plans, with priority support for Standard and above. Enterprise customers get dedicated phone support.'
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    return isAnnual ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (!isAnnual) return 0;
    const annualTotal = plan.annualPrice * 12;
    const monthlyTotal = plan.monthlyPrice * 12;
    return Math.round(((monthlyTotal - annualTotal) / monthlyTotal) * 100);
  };

  return (
    <MarketingLayout>
      <div className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Pricing Plans
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Choose the Perfect Plan for Your Business
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Start with our free trial and scale as you grow. All plans include our core POS features, 
              secure payments, and cloud backup.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <Label htmlFor="billing-toggle" className={cn(!isAnnual && "text-foreground font-medium")}>
                Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
              />
              <Label htmlFor="billing-toggle" className={cn(isAnnual && "text-foreground font-medium")}>
                Annual
                <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Save up to 20%
                </Badge>
              </Label>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {plans.map((plan) => {
              const IconComponent = plan.icon;
              const price = getPrice(plan);
              const savings = getSavings(plan);
              
              return (
                <Card
                  key={plan.id}
                  className={cn(
                    "relative transition-all duration-300 hover:shadow-xl",
                    plan.popular && "ring-2 ring-primary shadow-xl scale-105 z-10"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className={cn(
                        "p-3 rounded-full",
                        plan.popular ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                    </div>
                    
                    <div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-foreground">
                          ${price.toFixed(price % 1 === 0 ? 0 : 2)}
                        </span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      {isAnnual && savings > 0 && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Save {savings}%
                        </Badge>
                      )}
                      {isAnnual && (
                        <p className="text-sm text-muted-foreground">
                          ${(price * 12).toFixed(0)} billed annually
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 border-t border-border">
                      <Button 
                        asChild
                        className={cn(
                          "w-full",
                          plan.popular ? "bg-primary hover:bg-primary/90" : ""
                        )}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        <Link to={`/auth?mode=signup&plan=${plan.id}`}>
                          Start Free Trial
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Feature Comparison */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Compare Plans
              </h2>
              <p className="text-xl text-muted-foreground">
                See what's included in each plan to make the best choice for your business.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-4 text-left font-semibold">Features</th>
                    {plans.map(plan => (
                      <th key={plan.id} className="border border-border p-4 text-center font-semibold">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-4 font-medium">Products</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="border border-border p-4 text-center">
                        {plan.limits.products}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-muted/20">
                    <td className="border border-border p-4 font-medium">Users</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="border border-border p-4 text-center">
                        {plan.limits.users}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border border-border p-4 font-medium">Storage</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="border border-border p-4 text-center">
                        {plan.limits.storage}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-muted/20">
                    <td className="border border-border p-4 font-medium">Support</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="border border-border p-4 text-center">
                        {plan.limits.support}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Got questions? We've got answers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using BitVend POS to streamline their operations 
              and boost sales. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link to="/auth?mode=signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link to="/contact">
                  Contact Sales
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default PricingPage;