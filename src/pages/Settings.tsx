import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { countries, Country, State } from '@/data/countries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useBusiness } from '@/contexts/BusinessContext';
import { cn } from '@/lib/utils';
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
  Upload,
  Save,
  X,
  Crown,
  Star,
  Check,
  ChevronDown,
  ChevronRight,
  Monitor,
  Receipt,
  Clock,
  Package,
  TrendingUp,
  Scan,
  Tag,
  Calculator,
  FileSpreadsheet,
  Users,
  UserCheck,
  Megaphone,
  BarChart,
  Archive,
  Download,
  CheckCircle,
  Cog,
  Cloud,
  Wrench,
  DollarSign,
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from "sonner";
import { showUploadToast, showAutoSaveToast } from '@/components/SettingsToast';

type SettingsSection = {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  subsections: {
    id: string;
    title: string;
    icon: React.ComponentType<any>;
  }[];
};

const settingsSections: SettingsSection[] = [
  {
    id: 'business',
    title: 'Business Settings',
    icon: Building,
    subsections: [
      { id: 'business-info', title: 'Business Information', icon: Building },
      { id: 'operating-hours', title: 'Operating Hours', icon: Clock },
      { id: 'locations', title: 'Locations & Branches', icon: MapPin }
    ]
  },
  {
    id: 'pos-terminal',
    title: 'POS Terminal',
    icon: Monitor,
    subsections: [
      { id: 'receipt-settings', title: 'Receipt Settings', icon: Receipt },
      { id: 'terminal-behavior', title: 'Terminal Behavior', icon: SettingsIcon },
      { id: 'cash-drawer', title: 'Cash Drawer', icon: DollarSign }
    ]
  },
  {
    id: 'inventory',
    title: 'Inventory Management',
    icon: Package,
    subsections: [
      { id: 'stock-management', title: 'Stock Management', icon: TrendingUp },
      { id: 'barcode-settings', title: 'Barcode Settings', icon: Scan },
      { id: 'pricing-rules', title: 'Pricing Rules', icon: Tag }
    ]
  },
  {
    id: 'tax-finance',
    title: 'Tax & Finance',
    icon: Calculator,
    subsections: [
      { id: 'tax-configuration', title: 'Tax Configuration', icon: Percent },
      { id: 'payment-methods', title: 'Payment Methods', icon: CreditCard },
      { id: 'accounting', title: 'Accounting Integration', icon: FileSpreadsheet }
    ]
  },
  {
    id: 'employees',
    title: 'Employee Management',
    icon: Users,
    subsections: [
      { id: 'employee-access', title: 'Access Control', icon: Lock },
      { id: 'roles-permissions', title: 'Roles & Permissions', icon: Shield },
      { id: 'time-tracking', title: 'Time Tracking', icon: Clock }
    ]
  },
  {
    id: 'customers',
    title: 'Customer Management',
    icon: UserCheck,
    subsections: [
      { id: 'customer-data', title: 'Customer Data', icon: Database },
      { id: 'loyalty-program', title: 'Loyalty Program', icon: Star },
      { id: 'marketing', title: 'Marketing & Promotions', icon: Megaphone }
    ]
  },
  {
    id: 'hardware',
    title: 'Hardware Integration',
    icon: Printer,
    subsections: [
      { id: 'receipt-printer', title: 'Receipt Printer', icon: Printer },
      { id: 'barcode-scanner', title: 'Barcode Scanner', icon: Scan },
      { id: 'payment-terminal', title: 'Payment Terminal', icon: CreditCard }
    ]
  },
  {
    id: 'reports',
    title: 'Reports & Analytics',
    icon: BarChart,
    subsections: [
      { id: 'report-settings', title: 'Report Settings', icon: FileText },
      { id: 'data-retention', title: 'Data Retention', icon: Archive },
      { id: 'export-options', title: 'Export Options', icon: Download }
    ]
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    icon: Shield,
    subsections: [
      { id: 'access-security', title: 'Access Security', icon: Lock },
      { id: 'audit-logging', title: 'Audit & Logging', icon: FileText },
      { id: 'compliance', title: 'Compliance Standards', icon: CheckCircle }
    ]
  },
  {
    id: 'system',
    title: 'System Configuration',
    icon: Cog,
    subsections: [
      { id: 'backup-sync', title: 'Backup & Sync', icon: Cloud },
      { id: 'integrations', title: 'Third-party Integrations', icon: Plug },
      { id: 'maintenance', title: 'System Maintenance', icon: Wrench }
    ]
  }
];

const subscriptionPlans = [
  {
    name: 'Starter',
    price: 29,
    period: 'month',
    features: ['Up to 1,000 transactions/month', 'Basic inventory management', 'Email support', '1 POS terminal'],
    popular: false
  },
  {
    name: 'Professional',
    price: 79,
    period: 'month',
    features: ['Up to 10,000 transactions/month', 'Advanced inventory & reporting', 'Priority support', 'Up to 3 POS terminals', 'Multi-location support'],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 199,
    period: 'month',
    features: ['Unlimited transactions', 'Advanced analytics & AI insights', '24/7 phone support', 'Unlimited POS terminals', 'Custom integrations', 'Dedicated account manager'],
    popular: false
  },
  {
    name: 'Custom',
    price: null,
    period: 'contact',
    features: ['Everything in Enterprise', 'Custom development', 'On-premise deployment options', 'White-label solution', 'SLA guarantees'],
    popular: false
  }
];

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { businesses, currentBusiness, addBusiness, updateBusiness, deleteBusiness } = useBusiness();
  
  // Get URL parameters
  const urlSection = searchParams.get('section');
  const urlSubsection = searchParams.get('subsection');
  const editBusinessId = searchParams.get('edit');
  const isAddMode = searchParams.get('mode') === 'add';
  
  const [activeSection, setActiveSection] = useState(urlSection || 'business');
  const [activeSubsection, setActiveSubsection] = useState(urlSubsection || 'business-info');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    [urlSection || 'business']: true
  });
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [availableStates, setAvailableStates] = useState<State[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uniqueCountries = React.useMemo(() => {
    const map = new Map<string, Country>();
    for (const c of countries) {
      if (!map.has(c.code)) map.set(c.code, c);
    }
    return Array.from(map.values());
  }, []);
  
  // Initialize business settings based on URL parameters or current business
  useEffect(() => {
    if (isAddMode) {
      // Reset form for new business
      setBusinessSettings(prev => ({
        ...prev,
        businessName: '',
        businessType: 'retail',
        taxId: '',
        businessLicense: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
        logoUrl: '' // Clear logo for new business
      }));
    } else if (editBusinessId) {
      // Load business data for editing
      const businessToEdit = businesses.find(b => b.id === editBusinessId);
      if (businessToEdit) {
        setBusinessSettings(prev => ({
          ...prev,
          businessName: businessToEdit.businessName,
          businessType: businessToEdit.businessType,
          taxId: businessToEdit.taxId || '',
          businessLicense: businessToEdit.businessLicense || '',
          phone: businessToEdit.phone || '',
          email: businessToEdit.email || '',
          address: businessToEdit.address || '',
          city: businessToEdit.city || '',
          state: businessToEdit.state || '',
          postalCode: businessToEdit.postalCode || '',
          country: businessToEdit.country || 'US',
          logoUrl: businessToEdit.logoUrl || '' // Ensure logo is loaded
        }));
      }
    } else if (currentBusiness) {
      // Load current business data
      setBusinessSettings(prev => ({
        ...prev,
        businessName: currentBusiness.businessName,
        businessType: currentBusiness.businessType,
        taxId: currentBusiness.taxId || '',
        businessLicense: currentBusiness.businessLicense || '',
        phone: currentBusiness.phone || '',
        email: currentBusiness.email || '',
        address: currentBusiness.address || '',
        city: currentBusiness.city || '',
        state: currentBusiness.state || '',
        postalCode: currentBusiness.postalCode || '',
        country: currentBusiness.country || 'US',
        logoUrl: currentBusiness.logoUrl || '' // Ensure logo is loaded
      }));
    }
  }, [isAddMode, editBusinessId, currentBusiness, businesses]);
  
  // Legacy state variables for compatibility
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    email: '',
    address: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    avatar: null as File | null
  });
  
  const [companyData, setCompanyData] = useState({
    name: 'BitVend POS',
    email: 'support@bitvendpos.com',
    phone: '+1 555-123-4567',
    address: '123 Business Street\nSuite 400\nNew York, NY 10001',
    website: 'https://www.bitvendpos.com',
    logo: null as File | null
  });
  
  const [switches, setSwitches] = useState({
    twoFactor: false,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    systemAlerts: true,
    dailySummary: false,
    offlineMode: true,
    autoPrintReceipt: true,
    quickAddProducts: true,
    cookieConsent: true,
    otpLogin: true,
    otpTransactions: false,
    googleLogin: true,
    facebookLogin: false,
    linkedinLogin: false
  });

  // Additional legacy state
  const [invoiceSettings, setInvoiceSettings] = useState({
    invoicePrefix: 'INV-',
    startingNumber: 1000,
    defaultNotes: '',
    termsConditions: '',
    showTaxDetails: true,
    displayLogo: true,
    footerText: ''
  });

  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    const saved = localStorage.getItem('pos-app-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        return settings.receiptTemplate || 'classic-receipt';
      } catch {
        return 'classic-receipt';
      }
    }
    return 'classic-receipt';
  });
  
  const [signatures, setSignatures] = useState([
    { id: '1', name: 'John Doe Signature', isDefault: true, url: '/placeholder-signature.png' }
  ]);

  const [users, setUsers] = useState([
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: true }
  ]);

  const [roles, setRoles] = useState([
    { id: '1', name: 'Admin', description: 'Full system access', userCount: 2, permissions: ['all'] }
  ]);

  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'BitVend POS',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'America/New_York',
    currency: 'USD'
  });

  const [webSettings, setWebSettings] = useState({
    siteTitle: 'BitVend POS System',
    seoEnabled: true,
    googleAnalyticsCode: ''
  });

  const [appSettings, setAppSettings] = useState({
    twoFactorEnabled: false,
    darkMode: false,
    themeColor: '#3b82f6'
  });

  const [systemSettings, setSystemSettings] = useState({
    emailFromName: 'BitVend POS',
    autoBackup: true,
    maintenanceMode: false
  });

  const [financialSettings, setFinancialSettings] = useState({
    taxEnabled: true,
    defaultTaxRate: 8.25,
    discountsEnabled: true,
    partialPaymentsEnabled: true
  });

  const [otherSettings, setOtherSettings] = useState({
    defaultLanguage: 'en',
    emailNotifications: true,
    googleMapsApiKey: ''
  });
  const [businessSettings, setBusinessSettings] = useState({
    // Basic Business Info
    businessName: 'BitVend POS',
    businessType: 'retail',
    taxId: '',
    businessLicense: '',
    phone: '+1 555-123-4567',
    email: 'contact@bitvendpos.com',
    website: 'https://www.bitvendpos.com',
    logoUrl: '',
    
    // Address
    address: '123 Business Street',
    city: 'New York',
    state: 'NY',
    country: 'US',
    postalCode: '10001',
    
    // Operating Hours
    operatingHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '12:00', close: '16:00', closed: false }
    },
    
    // Preferences
    currency: 'USD',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'en-US'
  });

  const [posTerminalSettings, setPosTerminalSettings] = useState({
    // Receipt Settings
    receiptHeader: 'Thank you for your business!',
    receiptFooter: 'Please come again',
    showBarcode: true,
    showQRCode: false,
    autoPrintReceipt: true,
    receiptCopies: 1,
    showCustomerInfo: false,
    showTaxBreakdown: true,
    
    // Terminal Behavior
    autoLockTime: 15, // minutes
    requirePINForVoids: true,
    requirePINForDiscounts: true,
    requirePINForRefunds: true,
    allowOfflineMode: true,
    syncInterval: 5, // minutes
    
    // Display Settings
    screenTimeout: 30, // seconds
    showCustomerDisplay: false,
    displayBrightness: 80,
    
    // Cash Drawer
    cashDrawerKickCode: '\x1B\x70\x00\x19\xFA',
    openDrawerForCash: true,
    openDrawerForCheck: false,
    requireCountAtClose: true
  });

  const [inventorySettings, setInventorySettings] = useState({
    // Stock Management
    enableLowStockAlerts: true,
    lowStockThreshold: 10,
    enableNegativeInventory: false,
    autoReorderEnabled: false,
    defaultReorderQuantity: 50,
    
    // Barcode Settings
    defaultBarcodeType: 'UPC-A',
    autogenerateBarcodes: true,
    barcodePrefix: '2',
    
    // Category & Product Settings
    requireProductCategories: true,
    allowDuplicateProductNames: false,
    trackSerialNumbers: false,
    enableBatchTracking: false,
    
    // Pricing
    allowZeroPricing: false,
    roundPrices: true,
    priceRoundingMethod: 'nearest_cent', // nearest_cent, round_up, round_down
    
    // Import/Export
    autoBackupInventory: true,
    backupFrequency: 'daily' // daily, weekly, monthly
  });

  const [taxSettings, setTaxSettings] = useState({
    // Tax Configuration
    enableTax: true,
    taxInclusivePricing: false,
    
    // Tax Rates
    defaultTaxRate: 8.25,
    taxRates: [
      { id: '1', name: 'Standard Rate', rate: 8.25, isDefault: true },
      { id: '2', name: 'Food Items', rate: 4.0, isDefault: false },
      { id: '3', name: 'Luxury Items', rate: 12.5, isDefault: false }
    ],
    
    // Tax Exemptions
    enableTaxExemptions: true,
    requireExemptionID: true,
    exemptionTypes: ['nonprofit', 'government', 'reseller', 'senior'],
    
    // Reporting
    taxReportingPeriod: 'monthly', // weekly, monthly, quarterly
    autoGenerateTaxReports: false,
    taxJurisdiction: 'state'
  });

  const [paymentSettings, setPaymentSettings] = useState({
    // Accepted Payment Methods
    acceptCash: true,
    acceptCreditCard: true,
    acceptDebitCard: true,
    acceptCheck: false,
    acceptGiftCard: true,
    acceptMobile: true,
    acceptCrypto: false,
    
    // Cash Handling
    enableCashDenominations: true,
    countCashAtOpen: true,
    countCashAtClose: true,
    requireExactChange: false,
    
    // Credit Card Processing
    creditCardProcessor: 'stripe', // stripe, square, paypal
    enableTipping: true,
    tipSuggestions: [15, 18, 20, 25],
    allowCustomTip: true,
    tipOnCardPayments: true,
    
    // Payment Security
    requireSignatureAmount: 25.00,
    requirePINAmount: 50.00,
    enablePaymentEncryption: true,
    
    // Partial Payments
    allowPartialPayments: true,
    allowSplitPayments: true,
    minimumPartialAmount: 5.00,
    
    // Refunds & Returns
    allowRefunds: true,
    refundTimeLimit: 30, // days
    requireReceiptForRefund: true,
    allowStoreCredit: true
  });

  const [employeeSettings, setEmployeeSettings] = useState({
    // Access Control
    requireEmployeeLogin: true,
    enableTimeTracking: true,
    allowMultipleLogins: false,
    sessionTimeout: 30, // minutes
    
    // Permissions
    roles: [
      {
        id: '1',
        name: 'Manager',
        permissions: {
          sales: { create: true, read: true, update: true, delete: true },
          inventory: { create: true, read: true, update: true, delete: true },
          reports: { read: true, export: true },
          settings: { read: true, update: true },
          employees: { create: true, read: true, update: true, delete: false },
          discounts: { apply: true, create: true },
          voids: { authorize: true },
          refunds: { authorize: true }
        }
      },
      {
        id: '2',
        name: 'Cashier',
        permissions: {
          sales: { create: true, read: true, update: false, delete: false },
          inventory: { create: false, read: true, update: false, delete: false },
          reports: { read: false, export: false },
          settings: { read: false, update: false },
          employees: { create: false, read: false, update: false, delete: false },
          discounts: { apply: false, create: false },
          voids: { authorize: false },
          refunds: { authorize: false }
        }
      }
    ],
    
    // Time Tracking
    requireClockIn: true,
    enableBreakTracking: true,
    overtimeThreshold: 40, // hours per week
    
    // Security
    requirePINLength: 4,
    enableBiometrics: false,
    lockAfterFailedAttempts: 3
  });

  const [customerSettings, setCustomerSettings] = useState({
    // Customer Management
    requireCustomerInfo: false,
    enableLoyaltyProgram: true,
    loyaltyPointsRate: 1, // points per dollar
    loyaltyRedemptionRate: 100, // points per dollar off
    
    // Customer Data
    collectEmail: true,
    collectPhone: true,
    collectAddress: false,
    collectBirthdate: false,
    
    // Marketing
    enableEmailMarketing: false,
    enableSMSMarketing: false,
    marketingOptInRequired: true,
    
    // Discounts & Promotions
    enableCustomerDiscounts: true,
    enableSeniorDiscount: true,
    seniorDiscountRate: 10,
    enableStudentDiscount: false,
    studentDiscountRate: 5,
    
    // Privacy
    dataRetentionPeriod: 365, // days
    enableGDPRCompliance: true,
    allowDataExport: true
  });

  const [hardwareSettings, setHardwareSettings] = useState({
    // Receipt Printer
    printerType: 'thermal', // thermal, impact, inkjet
    printerModel: 'Epson TM-T88V',
    printerConnection: 'USB', // USB, Ethernet, Bluetooth
    paperWidth: '80mm',
    autoCutEnabled: true,
    
    // Barcode Scanner
    scannerEnabled: true,
    scannerType: 'laser', // laser, 2d_imager, ccd
    scannerConnection: 'USB',
    enableScanBeep: true,
    scanPrefix: '',
    scanSuffix: '',
    
    // Cash Drawer
    cashDrawerEnabled: true,
    drawerConnection: 'RJ12',
    pulseWidth: 120, // milliseconds
    
    // Customer Display
    customerDisplayEnabled: false,
    displayType: 'LCD', // LCD, LED, VFD
    displayLines: 2,
    displayCharsPerLine: 20,
    
    // Scale Integration
    scaleEnabled: false,
    scaleType: 'serial',
    scaleBaudRate: 9600,
    
    // Card Reader
    cardReaderEnabled: true,
    cardReaderType: 'EMV', // EMV, MSR, Contactless
    enableContactless: true,
    enableChip: true,
    enableSwipe: true
  });

  const [reportSettings, setReportSettings] = useState({
    // Report Generation
    autoGenerateReports: true,
    reportFrequency: 'daily', // daily, weekly, monthly
    reportTime: '23:59',
    
    // Report Types
    enableSalesReports: true,
    enableInventoryReports: true,
    enableEmployeeReports: true,
    enableTaxReports: true,
    enableCustomerReports: true,
    
    // Data Retention
    salesDataRetention: 1095, // days (3 years)
    inventoryDataRetention: 365, // days (1 year)
    employeeDataRetention: 2555, // days (7 years)
    
    // Export Settings
    defaultExportFormat: 'PDF', // PDF, Excel, CSV
    includeGraphs: true,
    companyLogoOnReports: true,
    
    // Email Reports
    emailReportsEnabled: false,
    reportEmailRecipients: [],
    emailReportFormat: 'PDF'
  });

  const [securitySettings, setSecuritySettings] = useState({
    // Authentication
    requireStrongPasswords: true,
    passwordMinLength: 8,
    passwordRequireSymbols: true,
    passwordRequireNumbers: true,
    passwordExpiryDays: 90,
    
    // Session Management
    maxSessionTime: 8, // hours
    idleTimeout: 30, // minutes
    requireReauth: false,
    
    // Audit & Logging
    enableAuditLog: true,
    logAllTransactions: true,
    logEmployeeActions: true,
    logSystemChanges: true,
    auditLogRetention: 2555, // days (7 years)
    
    // Data Protection
    enableDataEncryption: true,
    encryptionLevel: 'AES-256',
    enableBackupEncryption: true,
    
    // Network Security
    enableSSL: true,
    allowRemoteAccess: false,
    enableVPN: false,
    firewallEnabled: true,
    
    // Compliance
    pciComplianceEnabled: true,
    hipaaComplianceEnabled: false,
    soxComplianceEnabled: false
  });

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  const handleSubsectionClick = useCallback((sectionId: string, subsectionId: string) => {
    setActiveSection(sectionId);
    setActiveSubsection(subsectionId);
    
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: true
    }));
  }, []);
  
  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    setSelectedCountry(countryCode);
    setAvailableStates(country?.states || []);
    setSelectedState('');
    setAvailableCities([]);
    setProfileData(prev => ({ ...prev, country: countryCode, state: '', city: '' }));
  };
  
  const handleStateChange = (stateCode: string) => {
    const state = availableStates.find(s => s.code === stateCode);
    setSelectedState(stateCode);
    setAvailableCities(state?.cities || []);
    setProfileData(prev => ({ ...prev, state: stateCode, city: '' }));
  };
  
  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      setProfileData(prev => ({ ...prev, avatar: file }));
      toast.success("Avatar uploaded successfully!");
    } else {
      toast.error("File size must be less than 2MB");
    }
  };
  
  const handleSwitchChange = (key: string, value: boolean) => {
    setSwitches(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = () => {
    const sectionKey = `${activeSection}-${activeSubsection}`;
    
    if (sectionKey === 'pos-terminal-receipt-settings') {
      // Save receipt template settings
      const savedSettings = localStorage.getItem('pos-app-settings');
      let currentSettings = { receiptTemplate: 'classic-receipt' };
      
      if (savedSettings) {
        try {
          currentSettings = JSON.parse(savedSettings);
        } catch (e) {
          console.error('Error parsing settings:', e);
        }
      }
      
      const updatedSettings = { 
        ...currentSettings, 
        receiptTemplate: selectedTemplate 
      };
      
      localStorage.setItem('pos-app-settings', JSON.stringify(updatedSettings));
      toast.success("Receipt template applied successfully!");
      return;
    }
    
    if (sectionKey === 'business-business-info') {
      if (isAddMode) {
        // Add new business
        const newBusinessId = addBusiness(businessSettings);
        toast.success("Business added successfully!");
        // Navigate back to dashboard or close settings
        navigate('/dashboard');
      } else if (editBusinessId) {
        // Update existing business
        updateBusiness(editBusinessId, businessSettings);
        toast.success("Business updated successfully!");
        // Navigate back to dashboard or close settings
        navigate('/dashboard');
      } else {
        // Update current business
        if (currentBusiness) {
          updateBusiness(currentBusiness.id, businessSettings);
          toast.success("Business settings saved successfully!");
        }
        // Navigate back to dashboard or close settings
        navigate('/dashboard');
      }
    } else {
      // Save company data to localStorage for receipt
      const companySettings = {
        companyName: companyData.name,
        companyAddress: companyData.address,
        companyPhone: companyData.phone,
        companyEmail: companyData.email
      };
      localStorage.setItem('companySettings', JSON.stringify(companySettings));
      toast.success("Settings saved successfully!");
      // Navigate back to dashboard or close settings
      navigate('/dashboard');
    }
  };
  
  const handleCancel = () => {
    toast.info("Changes cancelled");
    // Navigate back to dashboard or close settings
    navigate('/dashboard');
  };

  const renderContent = () => {
    const sectionKey = `${activeSection}-${activeSubsection}`;
    
    switch (sectionKey) {
      // Business Settings
      case 'business-business-info':
        // Show business listing if not in add/edit mode
        if (!isAddMode && !editBusinessId) {
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Business Management</h3>
                <Button 
                  onClick={() => navigate('/settings?section=business&subsection=business-info&mode=add')}
                  className="gap-2"
                >
                  <Plus size={16} />
                  Add Business
                </Button>
              </div>
              
              <div className="grid gap-4">
                {businesses.map((business) => (
                  <Card key={business.id} className={cn(
                    "p-4",
                    currentBusiness?.id === business.id && "ring-2 ring-primary"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex items-center justify-center border transition-all duration-300 hover:scale-105 logo-preview">
                          {business.logoUrl ? (
                            <img src={business.logoUrl} alt={`${business.businessName} logo`} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                          ) : (
                            <Building className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold truncate">{business.businessName}</h4>
                            {currentBusiness?.id === business.id && (
                              <Badge variant="default">Current</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground capitalize truncate">
                            {business.businessType} • {business.address}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {business.phone} • {business.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/settings?section=business&subsection=business-info&edit=${business.id}`)}
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        {businesses.length > 1 && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
                                deleteBusiness(business.id);
                                toast.success('Business deleted successfully!');
                              }
                            }}
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        }
        
        // Show business form for add/edit mode
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/settings?section=business&subsection=business-info')}
              >
                <X size={16} className="mr-2" />
                Back to Business List
              </Button>
              <h3 className="text-lg font-semibold">
                {isAddMode ? 'Add New Business' : 'Edit Business Information'}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={businessSettings.businessName}
                  onChange={(e) => setBusinessSettings(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="Your Business Name"
                />
              </div>
              <div>
                <Label htmlFor="businessLogo">Business Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg border-2 border-dashed overflow-hidden bg-muted flex items-center justify-center transition-all duration-300 hover:scale-105 logo-preview">
                    {businessSettings.logoUrl ? (
                      <img src={businessSettings.logoUrl} alt={`${businessSettings.businessName} logo`} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                    ) : (
                      <Building className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          const dataUrl = reader.result as string;
                          setBusinessSettings(prev => ({ ...prev, logoUrl: dataUrl }));
                          
                          // Auto-save the logo to the current business immediately
                          if (editBusinessId) {
                            updateBusiness(editBusinessId, { logoUrl: dataUrl });
                            showAutoSaveToast();
                          } else if (currentBusiness) {
                            updateBusiness(currentBusiness.id, { logoUrl: dataUrl });
                            showAutoSaveToast();
                          }
                          
                          showUploadToast("Logo uploaded and saved successfully!");
                        };
                        reader.onerror = () => toast.error("Failed to read the image file");
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Select 
                  value={businessSettings.businessType} 
                  onValueChange={(value) => setBusinessSettings(prev => ({ ...prev, businessType: value }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail Store</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="service">Service Business</SelectItem>
                    <SelectItem value="grocery">Grocery Store</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="taxId">Tax ID / EIN</Label>
                <Input
                  id="taxId"
                  value={businessSettings.taxId}
                  onChange={(e) => setBusinessSettings(prev => ({ ...prev, taxId: e.target.value }))}
                  placeholder="XX-XXXXXXX"
                />
              </div>
              <div>
                <Label htmlFor="businessLicense">Business License #</Label>
                <Input
                  id="businessLicense"
                  value={businessSettings.businessLicense}
                  onChange={(e) => setBusinessSettings(prev => ({ ...prev, businessLicense: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="businessPhone">Business Phone</Label>
                <Input
                  id="businessPhone"
                  value={businessSettings.phone}
                  onChange={(e) => setBusinessSettings(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="businessEmail">Business Email</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={businessSettings.email}
                  onChange={(e) => setBusinessSettings(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Business Address</Label>
              <Input
                id="address"
                value={businessSettings.address}
                onChange={(e) => setBusinessSettings(prev => ({ ...prev, address: e.target.value }))}
                className="mb-2"
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Input
                  placeholder="City"
                  value={businessSettings.city}
                  onChange={(e) => setBusinessSettings(prev => ({ ...prev, city: e.target.value }))}
                />
                <Input
                  placeholder="State"
                  value={businessSettings.state}
                  onChange={(e) => setBusinessSettings(prev => ({ ...prev, state: e.target.value }))}
                />
                <Input
                  placeholder="ZIP Code"
                  value={businessSettings.postalCode}
                  onChange={(e) => setBusinessSettings(prev => ({ ...prev, postalCode: e.target.value }))}
                />
                <Select 
                  value={businessSettings.country} 
                  onValueChange={(value) => setBusinessSettings(prev => ({ ...prev, country: value }))}
                >
                  <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
                  <SelectContent className="z-50 bg-popover border border-border shadow-md max-h-[200px] overflow-y-auto">
                    {uniqueCountries.map((country) => (
                      <SelectItem key={`${country.code}-${country.name}`} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-between space-x-4 pt-4 border-t">
              {/* Delete button - only show in edit mode, not add mode */}
              {editBusinessId && !isAddMode && (
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
                      deleteBusiness(editBusinessId);
                      toast.success('Business deleted successfully!');
                      navigate('/settings?section=business&subsection=business-info');
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Business
                </Button>
              )}
              
              <div className="flex space-x-4 ml-auto">
                <Button variant="outline" onClick={() => navigate('/settings?section=business&subsection=business-info')} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground">
                  <X className="w-4 h-4 mr-2" />Cancel
                </Button>
                <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  {isAddMode ? 'Add Business' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        );

      case 'business-operating-hours':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Operating Hours</h3>
            <div className="space-y-4">
              {Object.entries(businessSettings.operatingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-24 font-medium capitalize">{day}</div>
                  <Checkbox
                    checked={!hours.closed}
                    onCheckedChange={(checked) => 
                      setBusinessSettings(prev => ({
                        ...prev,
                        operatingHours: {
                          ...prev.operatingHours,
                          [day]: { ...hours, closed: !checked }
                        }
                      }))
                    }
                  />
                  <span className="text-sm">Open</span>
                  {!hours.closed && (
                    <>
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) =>
                          setBusinessSettings(prev => ({
                            ...prev,
                            operatingHours: {
                              ...prev.operatingHours,
                              [day]: { ...hours, open: e.target.value }
                            }
                          }))
                        }
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) =>
                          setBusinessSettings(prev => ({
                            ...prev,
                            operatingHours: {
                              ...prev.operatingHours,
                              [day]: { ...hours, close: e.target.value }
                            }
                          }))
                        }
                        className="w-32"
                      />
                    </>
                  )}
                  {hours.closed && <span className="text-muted-foreground">Closed</span>}
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save Changes</Button>
            </div>
          </div>
        );

      // POS Terminal Settings - Receipt Templates
      case 'pos-terminal-receipt-settings':
        const receiptTemplates = [
          {
            id: 'classic-receipt',
            name: 'Classic Receipt',
            description: 'Traditional receipt layout with business header',
            preview: (
              <div className="bg-background text-foreground p-4 text-xs border rounded shadow-sm min-h-[300px]">
                <div className="text-center border-b border-border pb-2 mb-3">
                  <h2 className="font-bold text-sm text-foreground">BitVend POS</h2>
                  <p className="text-xs text-muted-foreground">123 Business Street</p>
                  <p className="text-xs text-muted-foreground">New York, NY 10001</p>
                  <p className="text-xs text-muted-foreground">Phone: (555) 123-4567</p>
                </div>
                
                <div className="mb-3 text-foreground">
                  <div className="flex justify-between">
                    <span>Receipt #: 00001</span>
                    <span>Date: 2024-01-15</span>
                  </div>
                  <div>Time: 10:30 AM</div>
                  <div>Cashier: Alice Johnson</div>
                </div>
                
                <div className="border-b border-border pb-2 mb-2">
                  <div className="flex justify-between font-medium text-foreground">
                    <span>Item</span>
                    <span>Total</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>iPhone 13 x1</span>
                    <span>$699.00</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>AirPods Pro x1</span>
                    <span>$249.00</span>
                  </div>
                </div>
                
                <div className="space-y-1 text-foreground">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>$948.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>$94.80</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>$1,042.80</span>
                  </div>
                </div>
                
                <div className="text-center mt-3 pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">Thank you for your business!</p>
                  <p className="text-xs text-muted-foreground">Please come again</p>
                </div>
              </div>
            )
          },
          {
            id: 'modern-receipt',
            name: 'Modern Receipt',
            description: 'Clean, modern design with enhanced spacing',
            preview: (
              <div className="bg-background text-foreground p-6 text-sm border rounded shadow-sm min-h-[300px]">
                <div className="text-center mb-6">
                  <h2 className="font-bold text-xl text-primary">BitVend POS</h2>
                  <div className="h-px bg-primary w-16 mx-auto mt-2 mb-3"></div>
                  <p className="text-muted-foreground">123 Business Street, NY 10001</p>
                  <p className="text-muted-foreground">(555) 123-4567</p>
                </div>
                
                <div className="mb-4 bg-muted/50 p-3 rounded">
                  <div className="grid grid-cols-2 gap-2 text-foreground">
                    <div>Receipt: #00001</div>
                    <div>Date: 2024-01-15</div>
                    <div>Time: 10:30 AM</div>
                    <div>Cashier: Alice</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between font-semibold pb-2 border-b border-border text-foreground">
                    <span>Item Description</span>
                    <span>Amount</span>
                  </div>
                  <div className="space-y-2 mt-2 text-foreground">
                    <div className="flex justify-between">
                      <span>iPhone 13 × 1</span>
                      <span>$699.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AirPods Pro × 1</span>
                      <span>$249.00</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1 border-t border-border pt-2 text-foreground">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>$948.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>$94.80</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>$1,042.80</span>
                  </div>
                </div>
                
                <div className="text-center mt-6 pt-4 border-t border-primary">
                  <p className="font-medium text-primary">Thank you for shopping with us!</p>
                </div>
              </div>
            )
          },
          {
            id: 'minimal-receipt',
            name: 'Minimal Receipt',
            description: 'Ultra-clean design with minimal elements',
            preview: (
              <div className="bg-background text-foreground p-4 text-sm border rounded shadow-sm min-h-[300px] font-mono">
                <div className="text-center mb-4">
                  <h2 className="font-bold text-foreground">BITVEND POS</h2>
                  <p className="text-xs text-muted-foreground">123 Business Street</p>
                  <p className="text-xs text-muted-foreground">New York, NY 10001</p>
                </div>
                
                <div className="text-center mb-4 text-xs text-foreground">
                  <p>Receipt: 00001 | 2024-01-15 10:30 AM</p>
                  <p>Cashier: Alice Johnson</p>
                </div>
                
                <div className="mb-3 text-foreground">
                  <p>iPhone 13                    $699.00</p>
                  <p>AirPods Pro                  $249.00</p>
                </div>
                
                <div className="border-t border-dashed border-border pt-2 text-foreground">
                  <p>Subtotal                     $948.00</p>
                  <p>Tax                           $94.80</p>
                  <p className="font-bold">TOTAL                      $1,042.80</p>
                </div>
                
                <div className="text-center mt-4 pt-2 border-t border-dashed border-border text-xs text-muted-foreground">
                  <p>THANK YOU</p>
                </div>
              </div>
            )
          },
          {
            id: 'detailed-receipt',
            name: 'Detailed Receipt',
            description: 'Comprehensive receipt with all transaction details',
            preview: (
              <div className="bg-background text-foreground p-4 text-xs border rounded shadow-sm min-h-[300px]">
                <div className="text-center border-b-2 border-border pb-2 mb-3">
                  <h2 className="font-bold text-lg text-foreground">BitVend POS System</h2>
                  <p className="text-muted-foreground">123 Business Street, Suite 400</p>
                  <p className="text-muted-foreground">New York, NY 10001</p>
                  <p className="text-muted-foreground">Phone: (555) 123-4567</p>
                  <p className="text-muted-foreground">Email: info@bitvendpos.com</p>
                </div>
                
                <div className="mb-3 bg-muted/50 p-2 rounded">
                  <div className="flex justify-between text-foreground">
                    <span><strong>Receipt #:</strong> 00001</span>
                    <span><strong>Register:</strong> 01</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span><strong>Date:</strong> 2024-01-15</span>
                    <span><strong>Time:</strong> 10:30:15 AM</span>
                  </div>
                  <div className="text-foreground"><strong>Cashier:</strong> Alice Johnson (ID: 001)</div>
                  <div className="text-foreground"><strong>Customer:</strong> John Doe</div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between font-bold border-b border-border text-foreground">
                    <span>Item</span>
                    <span>Qty</span>
                    <span>Price</span>
                    <span>Total</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>iPhone 13</span>
                    <span>1</span>
                    <span>$699.00</span>
                    <span>$699.00</span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-2">SKU: IP13-001</div>
                  <div className="flex justify-between text-foreground">
                    <span>AirPods Pro</span>
                    <span>1</span>
                    <span>$249.00</span>
                    <span>$249.00</span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-2">SKU: AP-PRO-001</div>
                </div>
                
                <div className="space-y-1 border-t border-border pt-2 text-foreground">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>$948.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Rate (10%):</span>
                    <span>$94.80</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t border-border pt-1">
                    <span>TOTAL:</span>
                    <span>$1,042.80</span>
                  </div>
                </div>
                
                <div className="mt-3 text-center border-t border-border pt-2 text-foreground">
                  <p><strong>Payment Method:</strong> Credit Card</p>
                  <p><strong>Card:</strong> **** **** **** 1234</p>
                  <p className="mt-2 text-muted-foreground">Thank you for your business!</p>
                  <p className="text-muted-foreground">Visit us at www.bitvendpos.com</p>
                </div>
              </div>
            )
          },
          {
            id: 'thermal-receipt',
            name: 'Thermal Printer',
            description: 'Optimized for thermal receipt printers',
            preview: (
              <div className="bg-background text-foreground p-3 text-xs border rounded shadow-sm min-h-[300px] max-w-[200px] mx-auto font-mono">
                <div className="text-center mb-2">
                  <h2 className="font-bold text-foreground">BITVEND POS</h2>
                  <p className="text-muted-foreground">123 Business St</p>
                  <p className="text-muted-foreground">New York, NY 10001</p>
                  <p className="text-muted-foreground">Tel: (555) 123-4567</p>
                </div>
                
                <div className="text-center mb-2 border-t border-b border-dashed border-border py-1 text-foreground">
                  <p>Receipt: 00001</p>
                  <p>2024-01-15 10:30 AM</p>
                  <p>Cashier: Alice</p>
                </div>
                
                <div className="mb-2 text-foreground">
                  <p>iPhone 13</p>
                  <p className="text-right">$699.00</p>
                  <p>AirPods Pro</p>
                  <p className="text-right">$249.00</p>
                </div>
                
                <div className="border-t border-dashed border-border pt-1 text-foreground">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>$948.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>$94.80</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>TOTAL:</span>
                    <span>$1,042.80</span>
                  </div>
                </div>
                
                <div className="text-center mt-2 pt-1 border-t border-dashed border-border text-xs text-muted-foreground">
                  <p>* THANK YOU *</p>
                  <p>* PLEASE COME AGAIN *</p>
                </div>
              </div>
            )
          }
        ];

        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Receipt Templates</h3>
            <p className="text-muted-foreground mb-6">Choose a receipt template for your point of sale system. Click on any template to preview and select it.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {receiptTemplates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedTemplate === template.id 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : 'hover:ring-1 hover:ring-primary/50'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="mb-4">
                      <div className="h-64 overflow-hidden rounded-lg border bg-gray-50 flex items-center justify-center">
                        <div className="scale-75 origin-top">
                          {template.preview}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-lg">{template.name}</h4>
                        {selectedTemplate === template.id && (
                          <div className="p-1 bg-primary rounded-full">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Receipt Settings</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="receiptHeader">Receipt Header</Label>
                  <Textarea
                    id="receiptHeader"
                    value={posTerminalSettings.receiptHeader}
                    onChange={(e) => setPosTerminalSettings(prev => ({ ...prev, receiptHeader: e.target.value }))}
                    placeholder="Thank you for your business!"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="receiptFooter">Receipt Footer</Label>
                  <Textarea
                    id="receiptFooter"
                    value={posTerminalSettings.receiptFooter}
                    onChange={(e) => setPosTerminalSettings(prev => ({ ...prev, receiptFooter: e.target.value }))}
                    placeholder="Please come again"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Barcode on Receipt</Label>
                      <p className="text-sm text-muted-foreground">Display transaction barcode</p>
                    </div>
                    <Switch
                      checked={posTerminalSettings.showBarcode}
                      onCheckedChange={(checked) => setPosTerminalSettings(prev => ({ ...prev, showBarcode: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-Print Receipt</Label>
                      <p className="text-sm text-muted-foreground">Automatically print after payment</p>
                    </div>
                    <Switch
                      checked={posTerminalSettings.autoPrintReceipt}
                      onCheckedChange={(checked) => setPosTerminalSettings(prev => ({ ...prev, autoPrintReceipt: checked }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="receiptCopies">Number of Receipt Copies</Label>
                  <Input
                    id="receiptCopies"
                    type="number"
                    min="1"
                    max="5"
                    value={posTerminalSettings.receiptCopies}
                    onChange={(e) => setPosTerminalSettings(prev => ({ ...prev, receiptCopies: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-6 border-t">
              <div className="text-sm text-muted-foreground">
                Selected: <span className="font-medium">{receiptTemplates.find(t => t.id === selectedTemplate)?.name || 'None'}</span>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground">
                  <X className="w-4 h-4 mr-2" />Cancel
                </Button>
                <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground">
                  <Save className="w-4 h-4 mr-2" />Apply Template
                </Button>
              </div>
            </div>
          </div>
        );

      case 'pos-terminal-cash-drawer':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Cash Drawer Settings</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Open for Cash Payments</Label>
                    <p className="text-sm text-muted-foreground">Auto-open drawer for cash sales</p>
                  </div>
                  <Switch
                    checked={posTerminalSettings.openDrawerForCash}
                    onCheckedChange={(checked) => setPosTerminalSettings(prev => ({ ...prev, openDrawerForCash: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Count at Close</Label>
                    <p className="text-sm text-muted-foreground">Count cash when closing drawer</p>
                  </div>
                  <Switch
                    checked={posTerminalSettings.requireCountAtClose}
                    onCheckedChange={(checked) => setPosTerminalSettings(prev => ({ ...prev, requireCountAtClose: checked }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="kickCode">Cash Drawer Kick Code</Label>
                <Input
                  id="kickCode"
                  value={posTerminalSettings.cashDrawerKickCode}
                  onChange={(e) => setPosTerminalSettings(prev => ({ ...prev, cashDrawerKickCode: e.target.value }))}
                  placeholder="\\x1B\\x70\\x00\\x19\\xFA"
                />
                <p className="text-sm text-muted-foreground mt-1">ESC/POS command to open cash drawer</p>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save Changes</Button>
            </div>
          </div>
        );

      // Tax Configuration
      case 'tax-finance-tax-configuration':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Tax Configuration</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Enable Tax Calculations</Label>
                  <p className="text-sm text-muted-foreground">Apply tax to all transactions</p>
                </div>
                <Switch
                  checked={taxSettings.enableTax}
                  onCheckedChange={(checked) => setTaxSettings(prev => ({ ...prev, enableTax: checked }))}
                />
              </div>
              
              {taxSettings.enableTax && (
                <>
                  <div className="space-y-3">
                    <Label>Tax Rates</Label>
                    {taxSettings.taxRates.map((rate) => (
                      <div key={rate.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex-1">
                          <Input
                            value={rate.name}
                            onChange={(e) => setTaxSettings(prev => ({
                              ...prev,
                              taxRates: prev.taxRates.map(r => 
                                r.id === rate.id ? { ...r, name: e.target.value } : r
                              )
                            }))}
                            placeholder="Tax Rate Name"
                          />
                        </div>
                        <div className="w-24">
                          <Input
                            type="number"
                            step="0.01"
                            value={rate.rate}
                            onChange={(e) => setTaxSettings(prev => ({
                              ...prev,
                              taxRates: prev.taxRates.map(r => 
                                r.id === rate.id ? { ...r, rate: parseFloat(e.target.value) || 0 } : r
                              )
                            }))}
                            placeholder="Rate %"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={rate.isDefault}
                            onCheckedChange={(checked) => setTaxSettings(prev => ({
                              ...prev,
                              taxRates: prev.taxRates.map(r => ({
                                ...r,
                                isDefault: r.id === rate.id ? !!checked : false
                              }))
                            }))}
                          />
                          <span className="text-sm">Default</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      Add Tax Rate
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Tax Inclusive Pricing</Label>
                        <p className="text-sm text-muted-foreground">Prices include tax</p>
                      </div>
                      <Switch
                        checked={taxSettings.taxInclusivePricing}
                        onCheckedChange={(checked) => setTaxSettings(prev => ({ ...prev, taxInclusivePricing: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Tax Exemptions</Label>
                        <p className="text-sm text-muted-foreground">Allow tax-exempt sales</p>
                      </div>
                      <Switch
                        checked={taxSettings.enableTaxExemptions}
                        onCheckedChange={(checked) => setTaxSettings(prev => ({ ...prev, enableTaxExemptions: checked }))}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save Changes</Button>
            </div>
          </div>
        );

      // Payment Methods
      case 'tax-finance-payment-methods':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'acceptCash', label: 'Cash', icon: DollarSign },
                  { key: 'acceptCreditCard', label: 'Credit Card', icon: CreditCard },
                  { key: 'acceptDebitCard', label: 'Debit Card', icon: CreditCard },
                  { key: 'acceptCheck', label: 'Check', icon: FileText },
                  { key: 'acceptGiftCard', label: 'Gift Card', icon: Star },
                  { key: 'acceptMobile', label: 'Mobile Pay', icon: Smartphone }
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <Label>{label}</Label>
                    </div>
                    <Switch
                      checked={paymentSettings[key as keyof typeof paymentSettings] as boolean}
                      onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, [key]: checked }))}
                    />
                  </div>
                ))}
              </div>

              {paymentSettings.acceptCreditCard && (
                <div className="space-y-3 p-4 border rounded-lg">
                  <h4 className="font-medium">Credit Card Settings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Processor</Label>
                      <Select 
                        value={paymentSettings.creditCardProcessor} 
                        onValueChange={(value) => setPaymentSettings(prev => ({ ...prev, creditCardProcessor: value }))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Signature Required Amount ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={paymentSettings.requireSignatureAmount}
                        onChange={(e) => setPaymentSettings(prev => ({ ...prev, requireSignatureAmount: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Tipping</Label>
                      <p className="text-sm text-muted-foreground">Allow customers to add tips</p>
                    </div>
                    <Switch
                      checked={paymentSettings.enableTipping}
                      onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, enableTipping: checked }))}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save Changes</Button>
            </div>
          </div>
        );

      // Keep existing legacy cases for compatibility
      case 'general-profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6 transition-transform duration-200">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <Button 
                  variant="outline" 
                  className="mr-2 transition-transform duration-200" 
                  onClick={handleAvatarUpload}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Avatar
                </Button>
                <p className="text-sm text-muted-foreground mt-1">JPG or PNG. Max 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={profileData.firstName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="John"
                  className="dark:placeholder:text-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={profileData.lastName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Doe"
                  className="dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={profileData.username}
                  onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="johndoe123"
                  className="dark:placeholder:text-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 555 123 4567"
                  className="dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john.doe@email.com"
                className="dark:placeholder:text-gray-500"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                value={profileData.address}
                onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Main Street, Suite 400"
                className="dark:placeholder:text-gray-500"
                rows={3} 
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={profileData.country} onValueChange={handleCountryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                   <SelectContent className="z-50 bg-card dark:bg-settings-form">
                     {countries.map(country => (
                       <SelectItem key={country.code} value={country.code}>
                         {country.name}
                       </SelectItem>
                     ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select value={profileData.state} onValueChange={handleStateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-card dark:bg-settings-form">
                    {availableStates.map(state => (
                      <SelectItem key={`${state.code}-${state.name}`} value={state.code}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Select 
                  value={profileData.city} 
                  onValueChange={(value) => setProfileData(prev => ({ ...prev, city: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-card dark:bg-settings-form">
                    {availableCities.map(city => (
                      <SelectItem key={`${profileData.state}-${city}`} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="postal">Postal Code</Label>
              <Input 
                id="postal" 
                value={profileData.postalCode}
                onChange={(e) => setProfileData(prev => ({ ...prev, postalCode: e.target.value }))}
                placeholder="90001"
                className="dark:placeholder:text-gray-500"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="border-cancel text-cancel hover:bg-cancel/10 dark:border-cancel dark:text-cancel dark:hover:bg-cancel/10 transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-success hover:bg-success/90 text-success-foreground transition-transform duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        );
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6 transition-transform duration-200">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <Button 
                  variant="outline" 
                  className="mr-2 transition-transform duration-200" 
                  onClick={handleAvatarUpload}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Avatar
                </Button>
                <p className="text-sm text-muted-foreground mt-1">JPG or PNG. Max 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={profileData.firstName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="John"
                  className="dark:placeholder:text-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={profileData.lastName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Doe"
                  className="dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={profileData.username}
                  onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="johndoe123"
                  className="dark:placeholder:text-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 555 123 4567"
                  className="dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john.doe@email.com"
                className="dark:placeholder:text-gray-500"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                value={profileData.address}
                onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Main Street, Suite 400"
                className="dark:placeholder:text-gray-500"
                rows={3} 
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={profileData.country} onValueChange={handleCountryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                   <SelectContent className="z-50 bg-card dark:bg-settings-form">
                     {countries.map(country => (
                       <SelectItem key={country.code} value={country.code}>
                         {country.name}
                       </SelectItem>
                     ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select value={profileData.state} onValueChange={handleStateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-card dark:bg-settings-form">
                    {availableStates.map(state => (
                      <SelectItem key={`${state.code}-${state.name}`} value={state.code}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Select 
                  value={profileData.city} 
                  onValueChange={(value) => setProfileData(prev => ({ ...prev, city: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-card dark:bg-settings-form">
                    {availableCities.map(city => (
                      <SelectItem key={`${profileData.state}-${city}`} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="postal">Postal Code</Label>
              <Input 
                id="postal" 
                value={profileData.postalCode}
                onChange={(e) => setProfileData(prev => ({ ...prev, postalCode: e.target.value }))}
                placeholder="90001"
                className="dark:placeholder:text-gray-500"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="border-cancel text-cancel hover:bg-cancel/10 dark:border-cancel dark:text-cancel dark:hover:bg-cancel/10 transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-success hover:bg-success/90 text-success-foreground transition-transform duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        );

      case 'website-company-settings':
        return (
          <div className="space-y-6">
            <div className="transition-transform duration-200">
              <Label htmlFor="companyName">Company Name</Label>
              <Input 
                id="companyName" 
                value={companyData.name}
                onChange={(e) => setCompanyData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="BitVend POS" 
              />
            </div>
            
            <div className="transition-transform duration-200">
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input 
                id="companyEmail" 
                type="email" 
                value={companyData.email}
                onChange={(e) => setCompanyData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="support@bitvendpos.com" 
              />
            </div>
            
            <div className="transition-transform duration-200">
              <Label htmlFor="companyPhone">Company Phone</Label>
              <Input 
                id="companyPhone" 
                type="tel" 
                value={companyData.phone}
                onChange={(e) => setCompanyData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 555-123-4567" 
              />
            </div>
            
            <div className="transition-transform duration-200">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Textarea 
                id="companyAddress" 
                value={companyData.address}
                onChange={(e) => setCompanyData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Business Street, Suite 400, New York, NY 10001" 
                rows={4}
              />
            </div>
            
            <div className="transition-transform duration-200">
              <Label htmlFor="website">Website URL</Label>
              <Input 
                id="website" 
                type="url" 
                value={companyData.website}
                onChange={(e) => setCompanyData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://www.bitvendpos.com" 
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="border-cancel text-cancel hover:bg-cancel/10 dark:border-cancel dark:text-cancel dark:hover:bg-cancel/10 transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-success hover:bg-success/90 text-success-foreground transition-transform duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        );

      case 'app-subscription':
        return (
          <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {subscriptionPlans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                    plan.popular 
                      ? 'border-primary bg-primary/5 shadow-lg' 
                      : 'border-border bg-background/50 hover:border-primary/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      {plan.price ? (
                        <>
                          <span className="text-3xl font-bold">${plan.price}</span>
                          <span className="text-muted-foreground">/{plan.period}</span>
                        </>
                      ) : (
                        <span className="text-lg font-semibold">Contact Us</span>
                      )}
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full transition-transform ${
                        plan.popular ? 'bg-success hover:bg-success/90' : ''
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.price ? 'Choose Plan' : 'Contact Sales'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // General Settings Cases
      case 'general-general-settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">General Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={generalSettings.companyName}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={generalSettings.language} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Web Settings Cases  
      case 'website-web-settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Web Settings</h3>
            <div>
              <Label htmlFor="siteTitle">Site Title</Label>
              <Input
                id="siteTitle"
                value={webSettings.siteTitle}
                onChange={(e) => setWebSettings(prev => ({ ...prev, siteTitle: e.target.value }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="seoEnabled">Enable SEO</Label>
                <p className="text-sm text-muted-foreground">Enable search engine optimization</p>
              </div>
              <Switch
                id="seoEnabled"
                checked={webSettings.seoEnabled}
                onCheckedChange={(checked) => setWebSettings(prev => ({ ...prev, seoEnabled: checked }))}
              />
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // App Settings Cases
      case 'app-app-settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">App Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for account access</p>
                </div>
                <Switch
                  id="twoFactor"
                  checked={appSettings.twoFactorEnabled}
                  onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, twoFactorEnabled: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Use dark color scheme</p>
                </div>
                <Switch
                  id="darkMode"
                  checked={appSettings.darkMode}
                  onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, darkMode: checked }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Invoice Settings
      case 'app-invoice-settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Invoice Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                <Input
                  id="invoicePrefix"
                  value={invoiceSettings.invoicePrefix}
                  onChange={(e) => setInvoiceSettings(prev => ({ ...prev, invoicePrefix: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="startingNumber">Starting Number</Label>
                <Input
                  id="startingNumber"
                  type="number"
                  value={invoiceSettings.startingNumber}
                  onChange={(e) => setInvoiceSettings(prev => ({ ...prev, startingNumber: parseInt(e.target.value) || 1000 }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="termsConditions">Terms & Conditions</Label>
              <Textarea
                id="termsConditions"
                rows={6}
                value={invoiceSettings.termsConditions}
                onChange={(e) => setInvoiceSettings(prev => ({ ...prev, termsConditions: e.target.value }))}
                placeholder="Enter your terms and conditions..."
              />
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Invoice Templates
      case 'app-invoice-templates':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Invoice Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['general-1', 'general-2', 'general-3', 'invoice-1', 'invoice-2'].map((templateId) => (
                <Card 
                  key={templateId}
                  className={`cursor-pointer transition-all ${selectedTemplate === templateId ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedTemplate(templateId)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-3 flex items-center justify-center">
                      <div className="text-muted-foreground text-sm">Preview</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{templateId}</h4>
                      {selectedTemplate === templateId && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground">
                  <X className="w-4 h-4 mr-2" />Cancel
                </Button>
                <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground">
                  <Save className="w-4 h-4 mr-2" />Save Template
                </Button>
              </div>
            </div>
          </div>
        );

      // Email Templates
      case 'system-email-templates':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Email Templates</h3>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-3 space-y-2">
                <h4 className="font-medium">Templates</h4>
                {['Invoice', 'Payment Receipt', 'Notification'].map((template) => (
                  <Button key={template} variant="ghost" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    {template}
                  </Button>
                ))}
              </div>
              <div className="col-span-9">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject Line</Label>
                    <Input id="subject" placeholder="Enter email subject..." />
                  </div>
                  <div>
                    <Label htmlFor="body">Email Body</Label>
                    <Textarea id="body" rows={12} placeholder="Enter email body..." />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save Template</Button>
            </div>
          </div>
        );

      // Signature Templates
      case 'system-signature-templates':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Signature Templates</h3>
              <Button><Upload className="w-4 h-4 mr-2" />Add Signature</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {signatures.map((signature) => (
                <Card key={signature.id}>
                  <CardContent className="p-4">
                    <div className="aspect-[3/1] bg-muted rounded-lg mb-3 flex items-center justify-center">
                      <div className="text-muted-foreground text-sm">Signature Preview</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{signature.name}</h4>
                      {signature.isDefault && <Badge variant="default">Default</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      // System Settings
      case 'website-system-settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">System Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emailFromName">Email From Name</Label>
                <Input
                  id="emailFromName"
                  value={systemSettings.emailFromName}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, emailFromName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="autoBackup">Auto Backup</Label>
                <Switch
                  checked={systemSettings.autoBackup}
                  onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoBackup: checked }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Financial Settings
      case 'financial-financial-settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Financial Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="taxEnabled">Enable Tax Calculations</Label>
                  <p className="text-sm text-muted-foreground">Apply tax to transactions</p>
                </div>
                <Switch
                  id="taxEnabled"
                  checked={financialSettings.taxEnabled}
                  onCheckedChange={(checked) => setFinancialSettings(prev => ({ ...prev, taxEnabled: checked }))}
                />
              </div>
              {financialSettings.taxEnabled && (
                <div>
                  <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                  <Input
                    id="defaultTaxRate"
                    type="number"
                    value={financialSettings.defaultTaxRate}
                    onChange={(e) => setFinancialSettings(prev => ({ ...prev, defaultTaxRate: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Users Management
      case 'admin-users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Users</h3>
              <Button><User className="w-4 h-4 mr-2" />Add User</Button>
            </div>
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{user.role}</Badge>
                    <Switch checked={user.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // Roles & Permissions  
      case 'admin-roles':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Roles & Permissions</h3>
              <Button><Shield className="w-4 h-4 mr-2" />Add Role</Button>
            </div>
            <div className="space-y-2">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{role.name}</div>
                    <div className="text-sm text-muted-foreground">{role.description}</div>
                  </div>
                  <Badge variant="secondary">{role.userCount} users</Badge>
                </div>
              ))}
            </div>
          </div>
        );

      // Other Settings
      case 'other-other-settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Other Settings</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="defaultLanguage">Default Language</Label>
                <Select value={otherSettings.defaultLanguage} onValueChange={(value) => setOtherSettings(prev => ({ ...prev, defaultLanguage: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="googleMapsApi">Google Maps API Key</Label>
                <Input
                  id="googleMapsApi"
                  type="password"
                  value={otherSettings.googleMapsApiKey}
                  onChange={(e) => setOtherSettings(prev => ({ ...prev, googleMapsApiKey: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Business Settings - Operating Hours
      case 'business-operating-hours':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Operating Hours</h3>
            <div className="space-y-4">
              {Object.entries(businessSettings.operatingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-24 font-medium capitalize">{day}</div>
                  <Checkbox
                    checked={!hours.closed}
                    onCheckedChange={(checked) => {
                      setBusinessSettings(prev => ({
                        ...prev,
                        operatingHours: {
                          ...prev.operatingHours,
                          [day]: { ...hours, closed: !checked }
                        }
                      }));
                    }}
                  />
                  {!hours.closed && (
                    <>
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => {
                          setBusinessSettings(prev => ({
                            ...prev,
                            operatingHours: {
                              ...prev.operatingHours,
                              [day]: { ...hours, open: e.target.value }
                            }
                          }));
                        }}
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => {
                          setBusinessSettings(prev => ({
                            ...prev,
                            operatingHours: {
                              ...prev.operatingHours,
                              [day]: { ...hours, close: e.target.value }
                            }
                          }));
                        }}
                        className="w-32"
                      />
                    </>
                  )}
                  {hours.closed && <span className="text-muted-foreground">Closed</span>}
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Business Settings - Locations
      case 'business-locations':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Locations & Branches</h3>
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground"><Plus className="w-4 h-4 mr-2" />Add Location</Button>
            </div>
            <div className="grid gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Main Location</h4>
                    <p className="text-sm text-muted-foreground">{businessSettings.address}, {businessSettings.city}</p>
                  </div>
                  <Badge variant="default">Primary</Badge>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'pos-terminal-terminal-behavior':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Terminal Behavior</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="autoLockTime">Auto-lock Time (minutes)</Label>
                <Input
                  id="autoLockTime"
                  type="number"
                  value={posTerminalSettings.autoLockTime}
                  onChange={(e) => setPosTerminalSettings(prev => ({ ...prev, autoLockTime: parseInt(e.target.value) }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require PIN for Voids</Label>
                  <p className="text-sm text-muted-foreground">Require manager PIN to void transactions</p>
                </div>
                <Switch
                  checked={posTerminalSettings.requirePINForVoids}
                  onCheckedChange={(checked) => setPosTerminalSettings(prev => ({ ...prev, requirePINForVoids: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Offline Mode</Label>
                  <p className="text-sm text-muted-foreground">Continue processing when internet is unavailable</p>
                </div>
                <Switch
                  checked={posTerminalSettings.allowOfflineMode}
                  onCheckedChange={(checked) => setPosTerminalSettings(prev => ({ ...prev, allowOfflineMode: checked }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      case 'pos-terminal-cash-drawer':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Cash Drawer Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Open Drawer for Cash Payments</Label>
                  <p className="text-sm text-muted-foreground">Automatically open cash drawer for cash transactions</p>
                </div>
                <Switch
                  checked={posTerminalSettings.openDrawerForCash}
                  onCheckedChange={(checked) => setPosTerminalSettings(prev => ({ ...prev, openDrawerForCash: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Count at Close</Label>
                  <p className="text-sm text-muted-foreground">Require cash count when closing register</p>
                </div>
                <Switch
                  checked={posTerminalSettings.requireCountAtClose}
                  onCheckedChange={(checked) => setPosTerminalSettings(prev => ({ ...prev, requireCountAtClose: checked }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Inventory Settings
      case 'inventory-stock-management':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Stock Management</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when items are running low</p>
                </div>
                <Switch
                  checked={inventorySettings.enableLowStockAlerts}
                  onCheckedChange={(checked) => setInventorySettings(prev => ({ ...prev, enableLowStockAlerts: checked }))}
                />
              </div>
              <div>
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={inventorySettings.lowStockThreshold}
                  onChange={(e) => setInventorySettings(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Negative Inventory</Label>
                  <p className="text-sm text-muted-foreground">Allow selling when stock is zero or negative</p>
                </div>
                <Switch
                  checked={inventorySettings.enableNegativeInventory}
                  onCheckedChange={(checked) => setInventorySettings(prev => ({ ...prev, enableNegativeInventory: checked }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      case 'inventory-barcode-settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Barcode Settings</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="barcodeType">Default Barcode Type</Label>
                <Select value={inventorySettings.defaultBarcodeType} onValueChange={(value) => setInventorySettings(prev => ({ ...prev, defaultBarcodeType: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPC-A">UPC-A</SelectItem>
                    <SelectItem value="EAN-13">EAN-13</SelectItem>
                    <SelectItem value="Code 128">Code 128</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-generate Barcodes</Label>
                  <p className="text-sm text-muted-foreground">Automatically generate barcodes for new products</p>
                </div>
                <Switch
                  checked={inventorySettings.autogenerateBarcodes}
                  onCheckedChange={(checked) => setInventorySettings(prev => ({ ...prev, autogenerateBarcodes: checked }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      case 'inventory-pricing-rules':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Pricing Rules</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Zero Pricing</Label>
                  <p className="text-sm text-muted-foreground">Allow products to have zero price</p>
                </div>
                <Switch
                  checked={inventorySettings.allowZeroPricing}
                  onCheckedChange={(checked) => setInventorySettings(prev => ({ ...prev, allowZeroPricing: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Round Prices</Label>
                  <p className="text-sm text-muted-foreground">Automatically round prices to nearest cent</p>
                </div>
                <Switch
                  checked={inventorySettings.roundPrices}
                  onCheckedChange={(checked) => setInventorySettings(prev => ({ ...prev, roundPrices: checked }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Tax & Finance Settings
      case 'tax-finance-tax-configuration':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Tax Configuration</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Tax</Label>
                  <p className="text-sm text-muted-foreground">Apply taxes to transactions</p>
                </div>
                <Switch
                  checked={taxSettings.enableTax}
                  onCheckedChange={(checked) => setTaxSettings(prev => ({ ...prev, enableTax: checked }))}
                />
              </div>
              <div>
                <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                <Input
                  id="defaultTaxRate"
                  type="number"
                  step="0.01"
                  value={taxSettings.defaultTaxRate}
                  onChange={(e) => setTaxSettings(prev => ({ ...prev, defaultTaxRate: parseFloat(e.target.value) }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Tax Inclusive Pricing</Label>
                  <p className="text-sm text-muted-foreground">Prices include tax</p>
                </div>
                <Switch
                  checked={taxSettings.taxInclusivePricing}
                  onCheckedChange={(checked) => setTaxSettings(prev => ({ ...prev, taxInclusivePricing: checked }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      case 'tax-finance-payment-methods':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Payment Methods</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="font-medium">Accepted Payment Types</h4>
                <div className="space-y-2">
                  {Object.entries(paymentSettings).filter(([key]) => key.startsWith('accept')).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label className="capitalize">{key.replace('accept', '').replace(/([A-Z])/g, ' $1')}</Label>
                      <Switch
                        checked={Boolean(value)}
                        onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, [key]: checked }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Payment Processing</h4>
                <div>
                  <Label htmlFor="processor">Credit Card Processor</Label>
                  <Select value={paymentSettings.creditCardProcessor} onValueChange={(value) => setPaymentSettings(prev => ({ ...prev, creditCardProcessor: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      case 'tax-finance-accounting':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Accounting Integration</h3>
            <div className="space-y-4">
              <div className="grid gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileSpreadsheet className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">QuickBooks Integration</h4>
                      <p className="text-sm text-muted-foreground">Sync transactions with QuickBooks</p>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <University className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Xero Integration</h4>
                      <p className="text-sm text-muted-foreground">Sync transactions with Xero</p>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );

      // Employee Management
      case 'employees-employee-access':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Access Control</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Employee Login</Label>
                  <p className="text-sm text-muted-foreground">Employees must log in to use the system</p>
                </div>
                <Switch
                  checked={employeeSettings.requireEmployeeLogin}
                  onCheckedChange={(checked) => setEmployeeSettings(prev => ({ ...prev, requireEmployeeLogin: checked }))}
                />
              </div>
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={employeeSettings.sessionTimeout}
                  onChange={(e) => setEmployeeSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="pinLength">Required PIN Length</Label>
                <Input
                  id="pinLength"
                  type="number"
                  value={employeeSettings.requirePINLength}
                  onChange={(e) => setEmployeeSettings(prev => ({ ...prev, requirePINLength: parseInt(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      case 'employees-roles-permissions':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Roles & Permissions</h3>
              <Button><Plus className="w-4 h-4 mr-2" />Add Role</Button>
            </div>
            <div className="space-y-4">
              {employeeSettings.roles.map((role) => (
                <Card key={role.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{role.name}</h4>
                    <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-1" />Edit</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Sales: {role.permissions.sales.create ? 'Full Access' : 'Read Only'}</div>
                    <div>Inventory: {role.permissions.inventory.create ? 'Full Access' : 'Limited'}</div>
                    <div>Reports: {role.permissions.reports.read ? 'Yes' : 'No'}</div>
                    <div>Settings: {role.permissions.settings.update ? 'Yes' : 'No'}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'employees-time-tracking':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Time Tracking</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Clock In</Label>
                  <p className="text-sm text-muted-foreground">Employees must clock in before using the system</p>
                </div>
                <Switch
                  checked={employeeSettings.requireClockIn}
                  onCheckedChange={(checked) => setEmployeeSettings(prev => ({ ...prev, requireClockIn: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Break Tracking</Label>
                  <p className="text-sm text-muted-foreground">Track employee breaks and lunch periods</p>
                </div>
                <Switch
                  checked={employeeSettings.enableBreakTracking}
                  onCheckedChange={(checked) => setEmployeeSettings(prev => ({ ...prev, enableBreakTracking: checked }))}
                />
              </div>
              <div>
                <Label htmlFor="overtime">Overtime Threshold (hours per week)</Label>
                <Input
                  id="overtime"
                  type="number"
                  value={employeeSettings.overtimeThreshold}
                  onChange={(e) => setEmployeeSettings(prev => ({ ...prev, overtimeThreshold: parseInt(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Customer Management
      case 'customers-customer-data':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Customer Data Management</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Customer Info</Label>
                  <p className="text-sm text-muted-foreground">Make customer information mandatory for all sales</p>
                </div>
                <Switch
                  checked={customerSettings.requireCustomerInfo}
                  onCheckedChange={(checked) => setCustomerSettings(prev => ({ ...prev, requireCustomerInfo: checked }))}
                />
              </div>
              <h4 className="font-medium">Collect Customer Data</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label>Email Address</Label>
                  <Switch
                    checked={customerSettings.collectEmail}
                    onCheckedChange={(checked) => setCustomerSettings(prev => ({ ...prev, collectEmail: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Phone Number</Label>
                  <Switch
                    checked={customerSettings.collectPhone}
                    onCheckedChange={(checked) => setCustomerSettings(prev => ({ ...prev, collectPhone: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Address</Label>
                  <Switch
                    checked={customerSettings.collectAddress}
                    onCheckedChange={(checked) => setCustomerSettings(prev => ({ ...prev, collectAddress: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Birth Date</Label>
                  <Switch
                    checked={customerSettings.collectBirthdate}
                    onCheckedChange={(checked) => setCustomerSettings(prev => ({ ...prev, collectBirthdate: checked }))}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      case 'customers-loyalty-program':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Loyalty Program</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Loyalty Program</Label>
                  <p className="text-sm text-muted-foreground">Allow customers to earn and redeem loyalty points</p>
                </div>
                <Switch
                  checked={customerSettings.enableLoyaltyProgram}
                  onCheckedChange={(checked) => setCustomerSettings(prev => ({ ...prev, enableLoyaltyProgram: checked }))}
                />
              </div>
              <div>
                <Label htmlFor="pointsRate">Points per Dollar Spent</Label>
                <Input
                  id="pointsRate"
                  type="number"
                  value={customerSettings.loyaltyPointsRate}
                  onChange={(e) => setCustomerSettings(prev => ({ ...prev, loyaltyPointsRate: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="redemptionRate">Points per Dollar Off</Label>
                <Input
                  id="redemptionRate"
                  type="number"
                  value={customerSettings.loyaltyRedemptionRate}
                  onChange={(e) => setCustomerSettings(prev => ({ ...prev, loyaltyRedemptionRate: parseInt(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      case 'customers-marketing':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Marketing & Promotions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Email Marketing</Label>
                  <p className="text-sm text-muted-foreground">Send promotional emails to customers</p>
                </div>
                <Switch
                  checked={customerSettings.enableEmailMarketing}
                  onCheckedChange={(checked) => setCustomerSettings(prev => ({ ...prev, enableEmailMarketing: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable SMS Marketing</Label>
                  <p className="text-sm text-muted-foreground">Send promotional SMS to customers</p>
                </div>
                <Switch
                  checked={customerSettings.enableSMSMarketing}
                  onCheckedChange={(checked) => setCustomerSettings(prev => ({ ...prev, enableSMSMarketing: checked }))}
                />
              </div>
              <h4 className="font-medium">Customer Discounts</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Senior Discount</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={customerSettings.seniorDiscountRate}
                      onChange={(e) => setCustomerSettings(prev => ({ ...prev, seniorDiscountRate: parseInt(e.target.value) }))}
                      className="w-20"
                    />
                    <span>%</span>
                    <Switch
                      checked={customerSettings.enableSeniorDiscount}
                      onCheckedChange={(checked) => setCustomerSettings(prev => ({ ...prev, enableSeniorDiscount: checked }))}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Hardware Integration
      case 'hardware-receipt-printer':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Receipt Printer Configuration</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="printerType">Printer Type</Label>
                <Select value={hardwareSettings.printerType} onValueChange={(value) => setHardwareSettings(prev => ({ ...prev, printerType: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thermal">Thermal Printer</SelectItem>
                    <SelectItem value="impact">Impact Printer</SelectItem>
                    <SelectItem value="inkjet">Inkjet Printer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="printerModel">Printer Model</Label>
                <Input
                  id="printerModel"
                  value={hardwareSettings.printerModel}
                  onChange={(e) => setHardwareSettings(prev => ({ ...prev, printerModel: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="connection">Connection Type</Label>
                <Select value={hardwareSettings.printerConnection} onValueChange={(value) => setHardwareSettings(prev => ({ ...prev, printerConnection: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USB">USB</SelectItem>
                    <SelectItem value="Ethernet">Ethernet</SelectItem>
                    <SelectItem value="Bluetooth">Bluetooth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Cut Enabled</Label>
                  <p className="text-sm text-muted-foreground">Automatically cut receipt paper after printing</p>
                </div>
                <Switch
                  checked={hardwareSettings.autoCutEnabled}
                  onCheckedChange={(checked) => setHardwareSettings(prev => ({ ...prev, autoCutEnabled: checked }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      case 'hardware-barcode-scanner':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Barcode Scanner Configuration</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Scanner</Label>
                  <p className="text-sm text-muted-foreground">Enable barcode scanning functionality</p>
                </div>
                <Switch
                  checked={hardwareSettings.scannerEnabled}
                  onCheckedChange={(checked) => setHardwareSettings(prev => ({ ...prev, scannerEnabled: checked }))}
                />
              </div>
              <div>
                <Label htmlFor="scannerType">Scanner Type</Label>
                <Select value={hardwareSettings.scannerType} onValueChange={(value) => setHardwareSettings(prev => ({ ...prev, scannerType: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laser">Laser Scanner</SelectItem>
                    <SelectItem value="2d_imager">2D Imager</SelectItem>
                    <SelectItem value="ccd">CCD Scanner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Scan Beep</Label>
                  <p className="text-sm text-muted-foreground">Play sound when barcode is scanned</p>
                </div>
                <Switch
                  checked={hardwareSettings.enableScanBeep}
                  onCheckedChange={(checked) => setHardwareSettings(prev => ({ ...prev, enableScanBeep: checked }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      case 'hardware-payment-terminal':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Payment Terminal Configuration</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Card Reader</Label>
                  <p className="text-sm text-muted-foreground">Enable card payment processing</p>
                </div>
                <Switch
                  checked={hardwareSettings.cardReaderEnabled}
                  onCheckedChange={(checked) => setHardwareSettings(prev => ({ ...prev, cardReaderEnabled: checked }))}
                />
              </div>
              <div>
                <Label htmlFor="cardReaderType">Card Reader Type</Label>
                <Select value={hardwareSettings.cardReaderType} onValueChange={(value) => setHardwareSettings(prev => ({ ...prev, cardReaderType: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMV">EMV Chip Reader</SelectItem>
                    <SelectItem value="MSR">Magnetic Stripe Reader</SelectItem>
                    <SelectItem value="Contactless">Contactless/NFC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Chip</Label>
                  <Switch
                    checked={hardwareSettings.enableChip}
                    onCheckedChange={(checked) => setHardwareSettings(prev => ({ ...prev, enableChip: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Enable Swipe</Label>
                  <Switch
                    checked={hardwareSettings.enableSwipe}
                    onCheckedChange={(checked) => setHardwareSettings(prev => ({ ...prev, enableSwipe: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Enable Contactless</Label>
                  <Switch
                    checked={hardwareSettings.enableContactless}
                    onCheckedChange={(checked) => setHardwareSettings(prev => ({ ...prev, enableContactless: checked }))}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Reports & Analytics
      case 'reports-report-settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Report Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Generate Reports</Label>
                  <p className="text-sm text-muted-foreground">Automatically generate daily reports</p>
                </div>
                <Switch
                  checked={reportSettings.autoGenerateReports}
                  onCheckedChange={(checked) => setReportSettings(prev => ({ ...prev, autoGenerateReports: checked }))}
                />
              </div>
              <div>
                <Label htmlFor="reportFrequency">Report Frequency</Label>
                <Select value={reportSettings.reportFrequency} onValueChange={(value) => setReportSettings(prev => ({ ...prev, reportFrequency: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="exportFormat">Default Export Format</Label>
                <Select value={reportSettings.defaultExportFormat} onValueChange={(value) => setReportSettings(prev => ({ ...prev, defaultExportFormat: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Excel">Excel</SelectItem>
                    <SelectItem value="CSV">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      case 'reports-data-retention':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Data Retention Policy</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="salesRetention">Sales Data Retention (days)</Label>
                <Input
                  id="salesRetention"
                  type="number"
                  value={reportSettings.salesDataRetention}
                  onChange={(e) => setReportSettings(prev => ({ ...prev, salesDataRetention: parseInt(e.target.value) }))}
                />
                <p className="text-sm text-muted-foreground">Keep sales data for this many days</p>
              </div>
              <div>
                <Label htmlFor="inventoryRetention">Inventory Data Retention (days)</Label>
                <Input
                  id="inventoryRetention"
                  type="number"
                  value={reportSettings.inventoryDataRetention}
                  onChange={(e) => setReportSettings(prev => ({ ...prev, inventoryDataRetention: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="employeeRetention">Employee Data Retention (days)</Label>
                <Input
                  id="employeeRetention"
                  type="number"
                  value={reportSettings.employeeDataRetention}
                  onChange={(e) => setReportSettings(prev => ({ ...prev, employeeDataRetention: parseInt(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      case 'reports-export-options':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Export Options</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Include Graphs in Exports</Label>
                  <p className="text-sm text-muted-foreground">Include charts and graphs in exported reports</p>
                </div>
                <Switch
                  checked={reportSettings.includeGraphs}
                  onCheckedChange={(checked) => setReportSettings(prev => ({ ...prev, includeGraphs: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Company Logo on Reports</Label>
                  <p className="text-sm text-muted-foreground">Include company logo in exported reports</p>
                </div>
                <Switch
                  checked={reportSettings.companyLogoOnReports}
                  onCheckedChange={(checked) => setReportSettings(prev => ({ ...prev, companyLogoOnReports: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Reports</Label>
                  <p className="text-sm text-muted-foreground">Automatically email reports to recipients</p>
                </div>
                <Switch
                  checked={reportSettings.emailReportsEnabled}
                  onCheckedChange={(checked) => setReportSettings(prev => ({ ...prev, emailReportsEnabled: checked }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // Security & Compliance
      case 'security-access-security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Access Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Strong Passwords</Label>
                  <p className="text-sm text-muted-foreground">Enforce strong password requirements</p>
                </div>
                <Switch
                  checked={securitySettings.requireStrongPasswords}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireStrongPasswords: checked }))}
                />
              </div>
              <div>
                <Label htmlFor="passwordLength">Minimum Password Length</Label>
                <Input
                  id="passwordLength"
                  type="number"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="sessionTime">Max Session Time (hours)</Label>
                <Input
                  id="sessionTime"
                  type="number"
                  value={securitySettings.maxSessionTime}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxSessionTime: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="idleTimeout">Idle Timeout (minutes)</Label>
                <Input
                  id="idleTimeout"
                  type="number"
                  value={securitySettings.idleTimeout}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, idleTimeout: parseInt(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      case 'security-audit-logging':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Audit & Logging</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Audit Log</Label>
                  <p className="text-sm text-muted-foreground">Log all system activities for security auditing</p>
                </div>
                <Switch
                  checked={securitySettings.enableAuditLog}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enableAuditLog: checked }))}
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Log Types</h4>
                <div className="flex items-center justify-between">
                  <Label>Log All Transactions</Label>
                  <Switch
                    checked={securitySettings.logAllTransactions}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, logAllTransactions: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Log Employee Actions</Label>
                  <Switch
                    checked={securitySettings.logEmployeeActions}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, logEmployeeActions: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Log System Changes</Label>
                  <Switch
                    checked={securitySettings.logSystemChanges}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, logSystemChanges: checked }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="auditRetention">Audit Log Retention (days)</Label>
                <Input
                  id="auditRetention"
                  type="number"
                  value={securitySettings.auditLogRetention}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, auditLogRetention: parseInt(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      case 'security-compliance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Compliance Standards</h3>
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">PCI DSS Compliance</h4>
                    <p className="text-sm text-muted-foreground">Payment Card Industry Data Security Standard</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={securitySettings.pciComplianceEnabled ? "default" : "secondary"}>
                      {securitySettings.pciComplianceEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={securitySettings.pciComplianceEnabled}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, pciComplianceEnabled: checked }))}
                    />
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">HIPAA Compliance</h4>
                    <p className="text-sm text-muted-foreground">Health Insurance Portability and Accountability Act</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={securitySettings.hipaaComplianceEnabled ? "default" : "secondary"}>
                      {securitySettings.hipaaComplianceEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={securitySettings.hipaaComplianceEnabled}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, hipaaComplianceEnabled: checked }))}
                    />
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">SOX Compliance</h4>
                    <p className="text-sm text-muted-foreground">Sarbanes-Oxley Act</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={securitySettings.soxComplianceEnabled ? "default" : "secondary"}>
                      {securitySettings.soxComplianceEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={securitySettings.soxComplianceEnabled}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, soxComplianceEnabled: checked }))}
                    />
                  </div>
                </div>
              </Card>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      // System Configuration
      case 'system-backup-sync':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Backup & Sync Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Backup</Label>
                  <p className="text-sm text-muted-foreground">Automatically backup system data</p>
                </div>
                <Switch
                  checked={systemSettings.autoBackup}
                  onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoBackup: checked }))}
                />
              </div>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Cloud Backup</h4>
                    <p className="text-sm text-muted-foreground">Secure cloud backup service</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Connected</Badge>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Local Backup</h4>
                    <p className="text-sm text-muted-foreground">Backup to local storage</p>
                  </div>
                  <Button variant="outline" size="sm">Setup</Button>
                </div>
              </Card>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel} className="bg-cancel hover:bg-cancel-hover text-cancel-foreground"><X className="w-4 h-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-save hover:bg-save-hover text-save-foreground"><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        );

      case 'system-integrations':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Third-party Integrations</h3>
            <div className="grid gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Plug className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Shopify Integration</h4>
                    <p className="text-sm text-muted-foreground">Sync inventory with Shopify store</p>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Mailchimp Integration</h4>
                    <p className="text-sm text-muted-foreground">Sync customer data with Mailchimp</p>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BarChart className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Google Analytics</h4>
                    <p className="text-sm text-muted-foreground">Track website and app analytics</p>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'system-maintenance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">System Maintenance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable maintenance mode for system updates</p>
                </div>
                <Switch
                  checked={systemSettings.maintenanceMode}
                  onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                />
              </div>
              <div className="grid gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">System Health Check</h4>
                      <p className="text-sm text-muted-foreground">Run comprehensive system diagnostics</p>
                    </div>
                    <Button>Run Check</Button>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Clear Cache</h4>
                      <p className="text-sm text-muted-foreground">Clear system cache and temporary files</p>
                    </div>
                    <Button variant="outline">Clear Cache</Button>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Database Optimization</h4>
                      <p className="text-sm text-muted-foreground">Optimize database performance</p>
                    </div>
                    <Button variant="outline">Optimize</Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );

      // Add other cases as needed...
      default:
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                Settings for {activeSection} - {activeSubsection} will be available soon.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="flex">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png"
          className="hidden"
        />
        
        {/* Sidebar */}
        <div className="settings-sidebar w-80 bg-card dark:bg-settings-form border-r border-border p-6 min-h-screen overflow-y-auto max-h-screen">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your POS system configuration</p>
          </div>
          
          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">{settingsSections.map((section) => (
              <div key={section.id} className="transition-transform duration-200">
                <Button
                  variant="ghost"
                  data-variant="ghost"
                  className="w-full justify-between p-3 h-auto text-foreground"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center">
                    <section.icon className="w-4 h-4 mr-3 text-foreground" />
                    <span className="font-medium text-foreground">{section.title}</span>
                  </div>
                  {expandedSections[section.id] ? (
                    <ChevronDown className="w-4 h-4 text-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-foreground" />
                  )}
                </Button>
                
                {expandedSections[section.id] && (
                  <div className="ml-6 mt-2 space-y-1">
                    {section.subsections.map((subsection) => (
                      <Button
                        key={subsection.id}
                        variant={
                          activeSection === section.id && activeSubsection === subsection.id
                            ? "secondary"
                            : "ghost"
                        }
                        data-variant={
                          activeSection === section.id && activeSubsection === subsection.id
                            ? "secondary"
                            : "ghost"
                        }
                        className="w-full justify-start p-2 h-auto text-sm text-foreground transition-transform duration-200"
                        onClick={() => handleSubsectionClick(section.id, subsection.id)}
                      >
                        <subsection.icon className="w-3 h-3 mr-2 text-foreground" />
                        <span className="text-foreground">{subsection.title}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <Card className="bg-settings-card border-border hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-foreground text-xl">
                {settingsSections
                  .find(s => s.id === activeSection)
                  ?.subsections.find(sub => sub.id === activeSubsection)
                  ?.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-settings-form p-6 rounded-lg">
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;