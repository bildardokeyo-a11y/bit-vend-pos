import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { PRODUCTS } from '@/data/posData';

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'product' | 'setting' | 'page' | 'customer' | 'sale' | 'employee' | 'category' | 'brand';
  path?: string;
  data?: any;
}

// Settings search data
const settingsResults: SearchResult[] = [
  // Business Settings
  { id: 'business-info', title: 'Business Information', subtitle: 'Manage business details and logo', type: 'setting', path: '/settings?section=business&subsection=business-info' },
  { id: 'business-hours', title: 'Operating Hours', subtitle: 'Set business operating schedule', type: 'setting', path: '/settings?section=business&subsection=business-operating-hours' },
  { id: 'business-locations', title: 'Locations & Branches', subtitle: 'Manage business locations', type: 'setting', path: '/settings?section=business&subsection=business-locations' },
  
  // POS Terminal Settings
  { id: 'receipt-settings', title: 'Receipt Settings', subtitle: 'Configure receipt templates and printing', type: 'setting', path: '/settings?section=pos-terminal&subsection=receipt-settings' },
  { id: 'terminal-behavior', title: 'Terminal Behavior', subtitle: 'Terminal locking and behavior settings', type: 'setting', path: '/settings?section=pos-terminal&subsection=terminal-behavior' },
  { id: 'display-settings', title: 'Display Settings', subtitle: 'Screen timeout and customer display', type: 'setting', path: '/settings?section=pos-terminal&subsection=display-settings' },
  
  // User Management
  { id: 'user-management', title: 'User Management', subtitle: 'Manage system users and permissions', type: 'setting', path: '/settings?section=admin&subsection=user-management' },
  { id: 'roles-permissions', title: 'Roles & Permissions', subtitle: 'Configure user roles and access', type: 'setting', path: '/settings?section=admin&subsection=roles' },
  
  // System Settings
  { id: 'general-settings', title: 'General Settings', subtitle: 'Language, timezone, and preferences', type: 'setting', path: '/settings?section=system&subsection=general' },
  { id: 'backup-restore', title: 'Backup & Restore', subtitle: 'Data backup and recovery options', type: 'setting', path: '/settings?section=system&subsection=backup' },
  
  // Hardware Settings
  { id: 'receipt-printer', title: 'Receipt Printer', subtitle: 'Configure receipt printer settings', type: 'setting', path: '/settings?section=hardware&subsection=receipt-printer' },
  { id: 'barcode-scanner', title: 'Barcode Scanner', subtitle: 'Scanner configuration and setup', type: 'setting', path: '/settings?section=hardware&subsection=barcode-scanner' },
  
  // App Settings  
  { id: 'invoice-templates', title: 'Invoice Templates', subtitle: 'Customize invoice layouts', type: 'setting', path: '/settings?section=app&subsection=invoice-templates' },
  { id: 'email-templates', title: 'Email Templates', subtitle: 'Configure email notifications', type: 'setting', path: '/settings?section=system&subsection=email-templates' },
];

// Page search data
const pageResults: SearchResult[] = [
  { id: 'dashboard', title: 'Dashboard', subtitle: 'Overview and analytics', type: 'page', path: '/dashboard' },
  { id: 'products', title: 'Products', subtitle: 'Manage product inventory', type: 'page', path: '/products' },
  { id: 'customers', title: 'Customers', subtitle: 'Customer management', type: 'page', path: '/customers' },
  { id: 'sales', title: 'Sales', subtitle: 'Sales history and reports', type: 'page', path: '/sales' },
  { id: 'checkout', title: 'Checkout', subtitle: 'Point of sale terminal', type: 'page', path: '/checkout' },
  { id: 'inventory', title: 'Inventory', subtitle: 'Stock management', type: 'page', path: '/inventory' },
  { id: 'employees', title: 'Employees', subtitle: 'Staff management', type: 'page', path: '/employees' },
  { id: 'brands', title: 'Brands', subtitle: 'Brand management', type: 'page', path: '/brands' },
  { id: 'categories', title: 'Categories', subtitle: 'Product categories', type: 'page', path: '/categories' },
  { id: 'suppliers', title: 'Suppliers', subtitle: 'Supplier management', type: 'page', path: '/suppliers' },
  { id: 'variants', title: 'Variants', subtitle: 'Product variants', type: 'page', path: '/variants' },
  { id: 'units', title: 'Units', subtitle: 'Measurement units', type: 'page', path: '/units' },
  
  // Report Pages
  { id: 'sales-report', title: 'Sales Report', subtitle: 'Sales analytics and reporting', type: 'page', path: '/reports/sales' },
  { id: 'purchase-report', title: 'Purchase Report', subtitle: 'Purchase analytics and reporting', type: 'page', path: '/reports/purchase' },
  { id: 'expense-report', title: 'Expense Report', subtitle: 'Expense tracking and reporting', type: 'page', path: '/reports/expense' },
  { id: 'stock-report', title: 'Stock Report', subtitle: 'Inventory and stock reporting', type: 'page', path: '/reports/stock' },
  
  // Financial Pages
  { id: 'balance-sheet', title: 'Balance Sheet', subtitle: 'Financial balance sheet', type: 'page', path: '/financials/balance-sheet' },
  { id: 'cash-flow', title: 'Cash Flow', subtitle: 'Cash flow statement', type: 'page', path: '/financials/cash-flow' },
  { id: 'trial-balance', title: 'Trial Balance', subtitle: 'Trial balance report', type: 'page', path: '/financials/trial-balance' },
  { id: 'income', title: 'Income', subtitle: 'Income management', type: 'page', path: '/financials/income' },
  { id: 'expenses', title: 'Expenses', subtitle: 'Expense management', type: 'page', path: '/financials/expenses' },
  
  // Stock Management
  { id: 'stock-in', title: 'Stock In', subtitle: 'Stock receiving management', type: 'page', path: '/stock/in' },
  { id: 'stock-out', title: 'Stock Out', subtitle: 'Stock dispatch management', type: 'page', path: '/stock/out' },
  { id: 'stock-transfer', title: 'Stock Transfer', subtitle: 'Inter-branch stock transfer', type: 'page', path: '/stock/transfer' },
  { id: 'stock-adjustment', title: 'Stock Adjustment', subtitle: 'Stock level adjustments', type: 'page', path: '/stock/adjustment' },
  { id: 'stock-return', title: 'Stock Return', subtitle: 'Stock return management', type: 'page', path: '/stock/return' },
  
  // HR & Payroll
  { id: 'payroll', title: 'Payroll', subtitle: 'Employee payroll management', type: 'page', path: '/hr/payroll' },
  { id: 'attendance', title: 'Attendance', subtitle: 'Employee attendance tracking', type: 'page', path: '/hr/attendance' },
  { id: 'holidays', title: 'Holidays', subtitle: 'Holiday management', type: 'page', path: '/hr/holidays' },
  
  // Other Pages
  { id: 'purchases', title: 'Purchases', subtitle: 'Purchase order management', type: 'page', path: '/purchases' },
  { id: 'quotation', title: 'Quotation', subtitle: 'Price quotation management', type: 'page', path: '/quotation' },
  { id: 'sales-return', title: 'Sales Return', subtitle: 'Sales return processing', type: 'page', path: '/sales-return' },
  { id: 'account-statement', title: 'Account Statement', subtitle: 'Account statement reports', type: 'page', path: '/account-statement' },
  { id: 'money-transfer', title: 'Money Transfer', subtitle: 'Fund transfer management', type: 'page', path: '/money-transfer' },
  { id: 'receipt', title: 'Receipt', subtitle: 'Receipt management', type: 'page', path: '/receipt' },
  { id: 'barcode', title: 'Barcode', subtitle: 'Barcode generation and printing', type: 'page', path: '/barcode' },
  { id: 'backup', title: 'Backup', subtitle: 'Data backup management', type: 'page', path: '/backup' },
];

// Build search data from actual products
const productResults: SearchResult[] = PRODUCTS.map(p => ({
  id: String(p.id),
  title: p.name,
  subtitle: `${p.category} - $${p.price.toFixed(2)}`,
  type: 'product',
  path: `/products/view/${p.id}`,
}));

// Debounce utility
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('pos-recent-searches');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);

  // Debounce search query to prevent freezing
  const debouncedQuery = useDebounce(query, 300);

  // Combine all search data
  const allSearchData = useMemo(() => [
    ...settingsResults,
    ...pageResults,
    ...productResults,
  ], []);

  // Save recent searches to localStorage
  useEffect(() => {
    localStorage.setItem('pos-recent-searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Smart search function with scoring
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    
    const scoredResults = allSearchData.map(item => {
      const title = item.title.toLowerCase();
      const subtitle = (item.subtitle || '').toLowerCase();
      let score = 0;

      // Exact match in title gets highest score
      if (title === query) score += 100;
      
      // Title starts with query gets high score
      if (title.startsWith(query)) score += 80;
      
      // Title contains query as whole word gets good score
      if (title.includes(` ${query} `) || title.includes(`-${query}-`) || title.includes(`_${query}_`)) score += 60;
      
      // Title contains query anywhere gets medium score
      if (title.includes(query)) score += 40;
      
      // Subtitle starts with query gets medium score
      if (subtitle.startsWith(query)) score += 30;
      
      // Subtitle contains query as whole word gets lower score
      if (subtitle.includes(` ${query} `) || subtitle.includes(`-${query}-`) || subtitle.includes(`_${query}_`)) score += 20;
      
      // Subtitle contains query anywhere gets lowest score
      if (subtitle.includes(query)) score += 10;

      // Word boundary matching for partial words (e.g., "report" matches "Sales Report")
      const words = query.split(' ');
      words.forEach(word => {
        if (word.length >= 2) {
          const titleWords = title.split(/[\s\-_]+/);
          const subtitleWords = subtitle.split(/[\s\-_]+/);
          
          titleWords.forEach(titleWord => {
            if (titleWord.startsWith(word)) score += 15;
            if (titleWord.includes(word)) score += 5;
          });
          
          subtitleWords.forEach(subtitleWord => {
            if (subtitleWord.startsWith(word)) score += 8;
            if (subtitleWord.includes(word)) score += 3;
          });
        }
      });

      return { ...item, score };
    }).filter(item => item.score > 0);

    // Sort by score first, then by type priority
    const sortedResults = scoredResults.sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      
      const typePriority = { 'setting': 0, 'page': 1, 'product': 2 };
      const aPriority = typePriority[a.type] ?? 3;
      const bPriority = typePriority[b.type] ?? 3;
      return aPriority - bPriority;
    });

    setResults(sortedResults.slice(0, 15)); // Show more results with smart search
  }, [allSearchData]);

  // Perform search when debounced query changes
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  // Handle query change (no longer directly triggers search)
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setIsOpen(newQuery.length > 0);
  }, []);

  // Handle search submit
  const handleSearch = useCallback((searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    // Add to recent searches
    setRecentSearches(prev => {
      const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5);
      return updated;
    });

    performSearch(searchQuery);
  }, [query, performSearch]);

  // Handle result selection
  const handleResultSelect = useCallback((result: SearchResult) => {
    setQuery(result.title);
    setIsOpen(false);
    
    // Add to recent searches
    setRecentSearches(prev => {
      const updated = [result.title, ...prev.filter(s => s !== result.title)].slice(0, 5);
      return updated;
    });

    // Navigate to result path if available
    if (result.path) {
      navigate(result.path);
    }
  }, [navigate]);

  // Handle recent search selection
  const handleRecentSearchSelect = useCallback((recentSearch: string) => {
    setQuery(recentSearch);
    performSearch(recentSearch);
    setIsOpen(true);
  }, [performSearch]);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  return {
    query,
    results,
    recentSearches,
    isOpen,
    setIsOpen,
    handleQueryChange,
    handleSearch,
    handleResultSelect,
    handleRecentSearchSelect,
    clearRecentSearches,
  };
};