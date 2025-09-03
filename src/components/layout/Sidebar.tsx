import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Shield,
  Layers,
  LayoutGrid,
  Calculator,
  Receipt,
  RotateCcw,
  FileText,
  TrendingUp,
  Package,
  Tags,
  Factory,
  Archive,
  ClipboardList,
  QrCode,
  TruckIcon,
  Warehouse,
  ArrowLeftRight,
  ClipboardCheck,
  DollarSign,
  List,
  HandCoins,
  Building2,
  ArrowRightLeft,
  PieChart,
  Scale,
  Waves,
  FileBarChart,
  Users,
  Briefcase,
  IdCard,
  Clock,
  Calendar,
  CreditCard,
  UserCog,
  UserCheck,
  Settings,
  Database,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Main',
      items: [
        { href: '/', icon: BarChart3, label: 'Dashboard' },
        { href: '/superadmin', icon: Shield, label: 'Super Admin' },
        { href: '/application', icon: Layers, label: 'Application' },
        { href: '/layout', icon: LayoutGrid, label: 'Layout' },
      ]
    },
    {
      title: 'Sales',
      items: [
        { href: '/checkout', icon: Calculator, label: 'POS (Checkout)' },
        { href: '/sales', icon: Receipt, label: 'Sales List' },
        { href: '/sales-return', icon: RotateCcw, label: 'Sales Return' },
        { href: '/quotation', icon: FileText, label: 'Quotation' },
        { href: '/purchases', icon: TrendingUp, label: 'Purchases' },
      ]
    },
    {
      title: 'Inventory',
      items: [
        { href: '/products', icon: Package, label: 'Products' },
        { href: '/categories', icon: Tags, label: 'Categories' },
        { href: '/brands', icon: Factory, label: 'Brands' },
        { href: '/units', icon: Archive, label: 'Units' },
        { href: '/variants', icon: ClipboardList, label: 'Variants' },
        { href: '/barcode', icon: QrCode, label: 'Print Barcode' },
      ]
    },
    {
      title: 'Stock',
      items: [
        { href: '/stock-in', icon: TruckIcon, label: 'Stock In' },
        { href: '/stock-out', icon: Warehouse, label: 'Stock Out' },
        { href: '/stock-transfer', icon: ArrowLeftRight, label: 'Stock Transfer' },
        { href: '/stock-return', icon: ClipboardCheck, label: 'Stock Return' },
        { href: '/stock-adjustment', icon: Layers, label: 'Stock Adjustment' },
      ]
    },
    {
      title: 'Finance & Accounts',
      items: [
        { href: '/expenses', icon: DollarSign, label: 'Expenses' },
        { href: '/expense-category', icon: List, label: 'Expense Category' },
        { href: '/income', icon: HandCoins, label: 'Income' },
        { href: '/income-category', icon: List, label: 'Income Category' },
        { href: '/bank-accounts', icon: Building2, label: 'Bank Accounts' },
        { href: '/money-transfer', icon: ArrowRightLeft, label: 'Money Transfer' },
        { href: '/balance-sheet', icon: BarChart3, label: 'Balance Sheet' },
        { href: '/trial-balance', icon: Scale, label: 'Trial Balance' },
        { href: '/cash-flow', icon: Waves, label: 'Cash Flow' },
        { href: '/account-statement', icon: FileBarChart, label: 'Account Statement' },
      ]
    },
    {
      title: 'People',
      items: [
        { href: '/customers', icon: Users, label: 'Customers' },
        { href: '/suppliers', icon: Briefcase, label: 'Suppliers' },
      ]
    },
    {
      title: 'HRM',
      items: [
        { href: '/employees', icon: IdCard, label: 'Employees' },
        { href: '/attendance', icon: Clock, label: 'Attendance' },
        { href: '/holidays', icon: Calendar, label: 'Holidays' },
        { href: '/payroll', icon: CreditCard, label: 'Payroll' },
      ]
    },
    {
      title: 'Reports',
      items: [
        { href: '/sales-report', icon: PieChart, label: 'Sales Report' },
        { href: '/stock-report', icon: Archive, label: 'Stock Report' },
        { href: '/purchase-report', icon: FileText, label: 'Purchase Report' },
        { href: '/expense-report', icon: DollarSign, label: 'Expense Report' },
      ]
    },
    {
      title: 'User Management',
      items: [
        { href: '/users', icon: UserCog, label: 'Users' },
        { href: '/roles', icon: UserCheck, label: 'Roles & Permissions' },
      ]
    },
    {
      title: 'Settings',
      items: [
        { href: '/general-settings', icon: Settings, label: 'General Settings' },
        { href: '/invoice-settings', icon: FileText, label: 'Invoice Settings' },
        { href: '/tax-settings', icon: Calculator, label: 'Tax Settings' },
        { href: '/backup', icon: Database, label: 'Backup & Restore' },
      ]
    },
  ];

  return (
    <div className={cn("pos-sidebar", collapsed && "collapsed")}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-black/10 bg-black dark:bg-black">
        {!collapsed && (
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-white/90 transition-colors">
            <span className="text-xl font-bold">
              <span style={{ color: '#FFD000' }}>Bit Vend</span>
              <span className="text-white"> POS</span>
            </span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-colors text-white"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 bg-gray-500 dark:bg-black h-full overflow-hidden">
        <div className="h-full overflow-y-auto py-4 px-0 bg-black pos-sidebar-scroll">
          {menuItems.map((section) => (
            <div key={section.title} className="mb-6">
              {!collapsed && (
                <div className="px-6 mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 dark:text-white uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
              )}
              <ul className="space-y-1 px-3">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = false; // Remove default highlighting
                  
                  return (
                    <li key={item.href}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // TODO: Navigate to page when implemented
                          console.log(`Navigating to ${item.label} - Page not yet built`);
                        }}
                        className={cn(
                          "w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-gray-800/80 before:to-gray-700/60 before:opacity-0 before:transition-opacity before:duration-300",
                          "hover:before:opacity-100 hover:shadow-lg hover:shadow-gray-900/30 hover:scale-[1.02] hover:translate-x-1",
                          isActive
                            ? "bg-gradient-to-r from-gray-800/60 to-gray-700/40 text-gray-200 shadow-lg shadow-gray-900/40 border-l-2 border-gray-600"
                            : "text-gray-300 hover:text-gray-200 hover:bg-gray-800/40"
                        )}
                      >
                        <Icon size={18} className="flex-shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                        {!collapsed && (
                          <span className="ml-3 relative z-10 transition-all duration-300 group-hover:font-semibold">{item.label}</span>
                        )}
                        {collapsed && (
                          <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900/95 backdrop-blur-sm border border-white/20 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 shadow-lg shadow-white/20">
                            {item.label}
                          </div>
                        )}
                        {/* Hover glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full transition-transform duration-700 group-hover:translate-x-full" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;