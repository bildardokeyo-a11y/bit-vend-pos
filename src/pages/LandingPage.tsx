import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Star,
  Users,
  Shield,
  Zap,
  BarChart3,
  CreditCard,
  Smartphone,
  Globe,
  ArrowRight,
  Play,
  TrendingUp,
  Lock,
  Clock,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LandingPage = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time insights into your sales, inventory, and customer behavior with comprehensive reporting.'
    },
    {
      icon: CreditCard,
      title: 'Multiple Payment Options',
      description: 'Accept cash, cards, mobile money (M-Pesa), and digital payments seamlessly.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Works perfectly on any device - desktop, tablet, or mobile for on-the-go management.'
    },
    {
      icon: Users,
      title: 'Multi-User Support',
      description: 'Add cashiers, managers, and staff with role-based permissions and access control.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',  
      description: 'Bank-level security with encrypted data, secure payments, and regular backups.'
    },
    {
      icon: Globe,
      title: 'Multi-Branch Ready',
      description: 'Manage multiple locations from one dashboard with centralized inventory and reporting.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Retail Store Owner',
      company: 'Fashion Forward',
      content: 'BitVend POS transformed our business operations. Sales tracking is effortless and the analytics help us make better decisions.',
      rating: 5
    },
    {
      name: 'James Kiprotich',
      role: 'Restaurant Manager', 
      company: 'Savanna Grill',
      content: 'The M-Pesa integration is seamless. Our customers love the payment flexibility and we process orders 3x faster.',
      rating: 5
    },
    {
      name: 'Maria Santos',
      role: 'Pharmacy Owner',
      company: 'HealthPlus Pharmacy',
      content: 'Inventory management has never been easier. Low stock alerts save us from stockouts and the reporting is comprehensive.',
      rating: 5
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Businesses Trust Us' },
    { number: '500M+', label: 'Transactions Processed' },
    { number: '99.9%', label: 'Uptime Guarantee' },
    { number: '24/7', label: 'Customer Support' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] [mask-image:radial-gradient(white,transparent_70%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="mx-auto bg-primary/10 text-primary border-primary/20 px-4 py-2">
              🚀 Now with M-Pesa Integration
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              The Modern
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> POS System </span>
              for Growing Businesses
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Streamline your operations with our cloud-based POS system. Accept payments, manage inventory, 
              track sales, and grow your business with powerful analytics - all in one platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="px-8 py-6 text-lg">
                <Link to="/auth">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg gap-2">
                <Play className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground pt-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Everything You Need to Run Your Business
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From inventory management to advanced analytics, our POS system has all the tools 
              you need to streamline operations and boost profits.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Loved by Business Owners Everywhere
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their businesses with BitVend POS.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join thousands of businesses already using BitVend POS to streamline operations, 
              boost sales, and delight customers. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="px-8 py-6 text-lg">
                <Link to="/auth">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg border-white/20 text-white hover:bg-white/10">
                <Link to="/contact">
                  Contact Sales
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-white/80 pt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Setup in 5 minutes
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Award-winning support
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Bank-level security
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;