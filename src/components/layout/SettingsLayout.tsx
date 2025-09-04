import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Bell, 
  Link as LinkIcon,
  Globe,
  Zap,
  Building,
  MapPin,
  Hash,
  Sliders,
  Palette,
  Key,
  Languages,
  Smartphone,
  FileText,
  Printer,
  ShoppingCart,
  Crown,
  Edit,
  Mail,
  MessageSquare,
  Shield,
  Cookie,
  CreditCard,
  Plug,
  University,
  Percent,
  Coins,
  Database,
  Ban,
  Users,
  UserCheck,
  Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';

const settingsSections = [
  {
    id: 'general',
    title: 'General Settings',
    icon: SettingsIcon,
    subsections: [
      { id: 'general-settings', title: 'General', icon: Building, path: '/settings/general' },
      { id: 'profile', title: 'Profile', icon: User, path: '/settings/profile' },
      { id: 'security', title: 'Security', icon: Lock, path: '/settings/security' },
      { id: 'notifications', title: 'Notifications', icon: Bell, path: '/settings/notifications' }
    ]
  },
  {
    id: 'website',
    title: 'Website Settings',
    icon: Globe,
    subsections: [
      { id: 'web-settings', title: 'Web Settings', icon: Globe, path: '/settings/web' },
      { id: 'system-settings', title: 'System Settings', icon: Zap, path: '/settings/system' }
    ]
  },
  {
    id: 'app',
    title: 'App Settings',
    icon: Smartphone,
    subsections: [
      { id: 'app-settings', title: 'App Settings', icon: Smartphone, path: '/settings/app' },
      { id: 'invoice-settings', title: 'Invoice Settings', icon: FileText, path: '/settings/invoice' },
      { id: 'invoice-templates', title: 'Invoice Templates', icon: FileText, path: '/settings/invoice-templates' }
    ]
  },
  {
    id: 'system',
    title: 'System Settings',
    icon: Zap,
    subsections: [
      { id: 'email-templates', title: 'Email Templates', icon: Mail, path: '/settings/email-templates' },
      { id: 'signature-templates', title: 'Signature Templates', icon: Edit, path: '/settings/signature-templates' }
    ]
  },
  {
    id: 'financial',
    title: 'Financial Settings',
    icon: CreditCard,
    subsections: [
      { id: 'financial-settings', title: 'Financial Settings', icon: CreditCard, path: '/settings/financial' }
    ]
  },
  {
    id: 'admin',
    title: 'User Management',
    icon: Users,
    subsections: [
      { id: 'users', title: 'Users', icon: Users, path: '/settings/users' },
      { id: 'roles', title: 'Roles & Permissions', icon: UserCheck, path: '/settings/roles' },
      { id: 'user-profile', title: 'User Profile', icon: User, path: '/settings/user-profile' },
      { id: 'permissions-matrix', title: 'Permissions Matrix', icon: Archive, path: '/settings/permissions-matrix' }
    ]
  },
  {
    id: 'other',
    title: 'Other Settings',
    icon: Zap,
    subsections: [
      { id: 'other-settings', title: 'Other Settings', icon: Zap, path: '/settings/other' }
    ]
  }
];

const SettingsLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your application settings and preferences</p>
        </div>
        
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {settingsSections.map((section) => (
              <div key={section.id} className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                  <section.icon className="w-4 h-4" />
                  {section.title}
                </div>
                <div className="space-y-1">
                  {section.subsections.map((subsection) => (
                    <NavLink
                      key={subsection.id}
                      to={subsection.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )
                      }
                    >
                      <subsection.icon className="w-4 h-4" />
                      {subsection.title}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;