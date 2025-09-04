import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'product' | 'customer' | 'sale' | 'employee' | 'category' | 'brand';
  path: string;
  data?: any;
}

// Mock data for search results
const mockSearchData: SearchResult[] = [
  // Products
  { id: '1', title: 'Premium Espresso Blend', subtitle: 'Coffee - $24.99', type: 'product', path: '/products/1' },
  { id: '2', title: 'Organic Green Tea', subtitle: 'Tea - $18.50', type: 'product', path: '/products/2' },
  { id: '3', title: 'Gourmet Chocolate Cake', subtitle: 'Dessert - $45.00', type: 'product', path: '/products/3' },
  { id: '4', title: 'Vintage Wine Selection', subtitle: 'Beverages - $89.99', type: 'product', path: '/products/4' },
  
  // Customers
  { id: '5', title: 'John Smith', subtitle: 'Customer - john@email.com', type: 'customer', path: '/customers/5' },
  { id: '6', title: 'Sarah Johnson', subtitle: 'Customer - sarah@email.com', type: 'customer', path: '/customers/6' },
  { id: '7', title: 'Mike Wilson', subtitle: 'Customer - mike@email.com', type: 'customer', path: '/customers/7' },
  
  // Sales
  { id: '8', title: 'Sale #001234', subtitle: 'Today - $156.50', type: 'sale', path: '/sales/001234' },
  { id: '9', title: 'Sale #001233', subtitle: 'Yesterday - $89.99', type: 'sale', path: '/sales/001233' },
  { id: '10', title: 'Sale #001232', subtitle: '2 days ago - $234.75', type: 'sale', path: '/sales/001232' },
  
  // Employees
  { id: '11', title: 'Alice Brown', subtitle: 'Manager - Finance', type: 'employee', path: '/employees/11' },
  { id: '12', title: 'Bob Davis', subtitle: 'Cashier - Sales', type: 'employee', path: '/employees/12' },
  
  // Categories
  { id: '13', title: 'Coffee', subtitle: 'Category - 15 products', type: 'category', path: '/categories/coffee' },
  { id: '14', title: 'Tea', subtitle: 'Category - 8 products', type: 'category', path: '/categories/tea' },
  { id: '15', title: 'Desserts', subtitle: 'Category - 12 products', type: 'category', path: '/categories/desserts' },
  
  // Brands
  { id: '16', title: 'Premium Blend Co.', subtitle: 'Brand - 6 products', type: 'brand', path: '/brands/premium-blend' },
  { id: '17', title: 'Organic Gardens', subtitle: 'Brand - 4 products', type: 'brand', path: '/brands/organic-gardens' },
];

export const useSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('pos-recent-searches');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);

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

    const filtered = mockSearchData.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setResults(filtered.slice(0, 8)); // Limit to 8 results
  }, []);

  // Handle query change
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    performSearch(newQuery);
    setIsOpen(newQuery.length > 0);
  }, [performSearch]);

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

    // Navigate to result
    navigate(result.path);
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