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
  Menu,
  ShoppingCart
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
      <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-black">
        {!collapsed && (
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-white/90 transition-colors">
            <span className="text-xl font-bold flex items-center">
              <span className="text-yellow-400">Bit Vend</span>
              <span className="text-white ml-1">POS</span>
              <ShoppingCart size={20} className="ml-2 text-yellow-400" />
            </span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 bg-black h-full overflow-hidden">
        <div className="h-full overflow-y-auto py-4 px-0 bg-black">
          {menuItems.map((section) => (
            <div key={section.title} className="mb-6">
              {!collapsed && (
                <div className="px-6 mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
              )}
              <ul className="space-y-1 px-3">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className={cn(
                          "w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                          isActive
                            ? "bg-gray-800 text-white"
                            : "text-white hover:text-white hover:bg-gray-800"
                        )}
                      >
                        <Icon size={18} className="flex-shrink-0 text-white" />
                        {!collapsed && (
                          <span className="ml-3 text-white">{item.label}</span>
                        )}
                        {collapsed && (
                          <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 shadow-lg">
                            {item.label}
                          </div>
                        )}
                      </Link>
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