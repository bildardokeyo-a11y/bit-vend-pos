import React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchResult } from '@/hooks/useSearch';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  UserCheck, 
  Tag, 
  Building2,
  Clock,
  X
} from 'lucide-react';

interface SearchDropdownProps {
  results: SearchResult[];
  recentSearches: string[];
  isOpen: boolean;
  onSelect: (result: SearchResult) => void;
  onRecentSelect: (search: string) => void;
  onClearRecent: () => void;
  children: React.ReactNode;
}

const getTypeIcon = (type: SearchResult['type']) => {
  const iconMap = {
    product: Package,
    customer: Users,
    sale: ShoppingCart,
    employee: UserCheck,
    category: Tag,
    brand: Building2,
  };
  
  const Icon = iconMap[type];
  return <Icon className="h-4 w-4" />;
};

const getTypeBadge = (type: SearchResult['type']) => {
  const colorMap = {
    product: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    customer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    sale: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    employee: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    category: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    brand: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  };

  return (
    <Badge variant="secondary" className={`text-xs ${colorMap[type]}`}>
      {type}
    </Badge>
  );
};

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  results,
  recentSearches,
  isOpen,
  onSelect,
  onRecentSelect,
  onClearRecent,
  children,
}) => {
  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <Command>
          <CommandList>
            {results.length > 0 && (
              <CommandGroup heading="Search Results">
                {results.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => onSelect(result)}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {getTypeIcon(result.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{result.title}</span>
                          {getTypeBadge(result.type)}
                        </div>
                        {result.subtitle && (
                          <span className="text-sm text-muted-foreground truncate">
                            {result.subtitle}
                          </span>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            
            {recentSearches.length > 0 && (
              <>
                {results.length > 0 && <CommandSeparator />}
                <CommandGroup>
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className="text-sm font-medium text-muted-foreground">Recent Searches</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClearRecent}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => onRecentSelect(search)}
                      className="flex items-center gap-2 p-2 cursor-pointer hover:bg-muted/50"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{search}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
            
            {results.length === 0 && recentSearches.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};