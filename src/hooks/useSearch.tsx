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
];

// Build search data from actual products
const productResults: SearchResult[] = PRODUCTS.map(p => ({
  id: String(p.id),
  title: p.name,
  subtitle: `${p.category} - $${p.price.toFixed(2)}`,
  type: 'product',
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

  // Search function
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const filtered = allSearchData.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Sort results by type priority: settings > pages > products
    const sortedResults = filtered.sort((a, b) => {
      const typePriority = { 'setting': 0, 'page': 1, 'product': 2 };
      const aPriority = typePriority[a.type] ?? 3;
      const bPriority = typePriority[b.type] ?? 3;
      return aPriority - bPriority;
    });

    setResults(sortedResults.slice(0, 12)); // Show more results with settings
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