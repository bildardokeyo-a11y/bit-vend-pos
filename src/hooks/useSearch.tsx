import { useState, useEffect, useCallback } from 'react';

import { PRODUCTS } from '@/data/posData';

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'product';
  path?: string;
  data?: any;
}

// Build search data from actual products
const productResults: SearchResult[] = PRODUCTS.map(p => ({
  id: String(p.id),
  title: p.name,
  subtitle: `${p.category} - $${p.price.toFixed(2)}`,
  type: 'product',
}));

export const useSearch = () => {
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

    const filtered = productResults.filter(item =>
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
  }, []);

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