import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Users,
  Database,
  Settings,
  BarChart3,
  DollarSign,
  Crown,
  Activity,
  Globe,
  Server,
  LogOut,
  Eye,
  UserCheck,
  CreditCard,
  Calendar,
  TrendingUp,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';
import SuperAdminContent from './SuperAdmin';
import ApplicationContent from './Application';
import LayoutContent from './LayoutPage';
import SystemUsersReferrals from '@/components/SystemUsersReferrals';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [adminSession, setAdminSession] = useState<any>(null);

  // Check admin authentication
  useEffect(() => {
    const session = localStorage.getItem('admin-session');
    if (!session) {
      navigate('/admin/login');
      return;
    }

    try {
      const parsedSession = JSON.parse(session);
      setAdminSession(parsedSession);
    } catch (error) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin-session');
    toast.success('Admin logged out successfully');
    navigate('/');
  };

  // Real-time system stats (these would come from actual system monitoring)
  const systemStats = [
    { name: 'Total Users', value: '0', icon: Users, color: 'text-blue-600' },
    { name: 'Active Subscriptions', value: '0', icon: Crown, color: 'text-purple-600' },
    { name: 'Monthly Revenue', value: '$0', icon: DollarSign, color: 'text-green-600' },
    { name: 'System Uptime', value: '100%', icon: Activity, color: 'text-orange-600' },
    { name: 'Database Size', value: '0 MB', icon: Database, color: 'text-indigo-600' },
    { name: 'API Calls Today', value: '0', icon: Globe, color: 'text-teal-600' }
  ];

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage system users and permissions',
      action: () => setActiveTab('users-referrals'),
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'System Settings',
      description: 'Configure application settings',
      action: () => setActiveTab('application'),
      icon: Settings,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Layout Management',
      description: 'Customize application layout',
      action: () => setActiveTab('layout'),
      icon: BarChart3,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Super Admin Tools',
      description: 'Advanced system administration',
      action: () => setActiveTab('super-admin'),
      icon: Shield,
      color: 'bg-red-500 hover:bg-red-600'
    }
  ];

  if (!adminSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Checking admin authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">BitVend Admin Panel</h1>
                <p className="text-xs text-muted-foreground">System Administration</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="destructive" className="px-3 py-1">
                <Shield className="h-3 w-3 mr-1" />
                Super Admin
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium">{adminSession.email}</p>
                <p className="text-xs text-muted-foreground">
                  Logged in: {new Date(adminSession.loginTime).toLocaleTimeString()}
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users-referrals">Users & Referrals</TabsTrigger>
            <TabsTrigger value="super-admin">Super Admin</TabsTrigger>
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Overview */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">System Overview</h2>
                <p className="text-muted-foreground">Monitor system health and user activity</p>
              </div>

              {/* System Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {systemStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={stat.name} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <Icon className={`h-8 w-8 ${stat.color}`} />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Card key={action.title} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={action.action}>
                        <CardContent className="p-6">
                          <div className="text-center space-y-3">
                            <div className={`w-12 h-12 rounded-full ${action.color} mx-auto flex items-center justify-center`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{action.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent System Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activity to display</p>
                    <p className="text-sm">System activity will appear here as users interact with the platform</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users-referrals">
            <SystemUsersReferrals />
          </TabsContent>

          <TabsContent value="super-admin">
            <SuperAdminContent />
          </TabsContent>

          <TabsContent value="application">
            <ApplicationContent />
          </TabsContent>

          <TabsContent value="layout">
            <LayoutContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;