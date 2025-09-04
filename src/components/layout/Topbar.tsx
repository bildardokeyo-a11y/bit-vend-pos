import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSearch } from '@/hooks/useSearch';
import { SearchDropdown } from '@/components/ui/search-dropdown';
import {
  Search,
  Plus,
  Calculator,
  Globe,
  Mail,
  Bell,
  Settings,
  User,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Custom hook for auto-hide tooltips
const useAutoHideTooltip = (delay = 2000) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    
    if (open) {
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Set new timeout to auto-hide
      const newTimeoutId = setTimeout(() => {
        setIsOpen(false);
      }, delay);
      
      setTimeoutId(newTimeoutId);
    } else {
      // Clear timeout if manually closed
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return { isOpen, handleOpenChange };
};

// ---------------- Theme Toggle ----------------
const goldenSun = "🌞", goldenMoon = "🌙";

interface TopbarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const Topbar: React.FC<TopbarProps> = ({
  collapsed,
  onToggleSidebar,
  darkMode,
  onToggleDarkMode,
}) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  
  const {
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
  } = useSearch();
  
  // Auto-hide tooltips
  const internetTooltip = useAutoHideTooltip(2000);
  const mailTooltip = useAutoHideTooltip(2000);
  const notificationTooltip = useAutoHideTooltip(2000);
  const settingsTooltip = useAutoHideTooltip(2000);
  const themeTooltip = useAutoHideTooltip(2000);
  const profileTooltip = useAutoHideTooltip(2000);

  useEffect(() => {
    const el = document.querySelector('.pos-content');
    const handleScroll = () => {
      const y = (el as HTMLElement | null)?.scrollTop ?? window.scrollY;
      setIsScrolled(y > 8);
    };

    // Initialize state on mount
    handleScroll();

    if (el) {
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <header className={cn(
      'pos-topbar transition-all duration-300',
      collapsed && 'collapsed',
      'bg-transparent backdrop-blur-md border-border/50'
    )}>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="lg:hidden"
        >
          <Menu size={20} />
        </Button>

        <div className="text-lg font-semibold text-foreground">Welcome</div>

        <SearchDropdown
          results={results}
          recentSearches={recentSearches}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onSelect={handleResultSelect}
          onRecentSelect={handleRecentSearchSelect}
          onClearRecent={clearRecentSearches}
        >
          <form onSubmit={handleSearchSubmit} className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              type="text"
              placeholder="Search products, sales, customers..."
              value={query}
              onChange={(e) => {
                e.stopPropagation();
                handleQueryChange(e.target.value);
              }}
              onFocus={(e) => {
                e.stopPropagation();
                if (query.length > 0 || recentSearches.length > 0) {
                  setIsOpen(true);
                }
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              className="pl-10 w-80 pos-input focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </form>
        </SearchDropdown>
      </div>

      <div className="flex items-center gap-3">
        <select className="px-3 py-1 rounded-md border bg-background text-foreground text-sm">
          <option>Freshmart</option>
          <option>Branch 1</option>
          <option>Branch 2</option>
        </select>

        <Button
          onClick={() => navigate('/products/add')}
          className="bg-orange-500 hover:bg-orange-600 text-white gap-2 transition-all duration-200 hover:scale-95 active:scale-90"
          size="sm"
        >
          <Plus size={16} />
          Add New
        </Button>

        <Button
          onClick={() => navigate('/checkout')}
          className="bg-blue-500 hover:bg-blue-600 text-white gap-2 transition-all duration-200 hover:scale-95 active:scale-90"
          size="sm"
        >
          <Calculator size={16} />
          POS
        </Button>

        <div className={cn("flex items-center gap-3", darkMode ? "text-white" : "text-black")}>
          <Tooltip open={internetTooltip.isOpen} onOpenChange={internetTooltip.handleOpenChange}>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 transition-all duration-200 hover:scale-90 active:scale-75"
                onClick={() => window.open('https://google.com', '_blank')}
              >
                <Globe size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 transition-all duration-300">
              Internet
            </TooltipContent>
          </Tooltip>
          
          <Tooltip open={mailTooltip.isOpen} onOpenChange={mailTooltip.handleOpenChange}>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 relative transition-all duration-200 hover:scale-90 active:scale-75"
                onClick={() => window.open('mailto:', '_blank')}
              >
                <Mail size={18} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 transition-all duration-300">
              Mail
            </TooltipContent>
          </Tooltip>
          
          <Tooltip open={notificationTooltip.isOpen} onOpenChange={notificationTooltip.handleOpenChange}>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 relative transition-all duration-200 hover:scale-90 active:scale-75"
                onClick={() => console.log('Open notifications')}
              >
                <Bell size={18} />
                <span className={cn("absolute -top-1 -right-1 bg-primary text-xs rounded-full w-4 h-4 flex items-center justify-center", darkMode ? "text-black" : "text-white")}>
                  5
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 transition-all duration-300">
              Notifications
            </TooltipContent>
          </Tooltip>
          
          <Tooltip open={settingsTooltip.isOpen} onOpenChange={settingsTooltip.handleOpenChange}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 transition-all duration-200 hover:scale-90 active:scale-75"
                onClick={() => navigate('/settings')}
              >
                <Settings size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 transition-all duration-300">
              Settings
            </TooltipContent>
          </Tooltip>
        </div>

        <Tooltip open={themeTooltip.isOpen} onOpenChange={themeTooltip.handleOpenChange}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleDarkMode}
              className={`p-2 transition-all duration-200 hover:scale-90 active:scale-75 ${darkMode ? 'theme-toggle-sun' : 'theme-toggle-moon'}`}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="text-lg">
                {darkMode ? goldenSun : goldenMoon}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 transition-all duration-300">
            {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </TooltipContent>
        </Tooltip>

        <Tooltip open={profileTooltip.isOpen} onOpenChange={profileTooltip.handleOpenChange}>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 transition-all duration-200 hover:scale-90 active:scale-75"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={18} className="text-primary" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  System Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log('Logout')}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent className="animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 transition-all duration-300">
            Profile
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
};

export default Topbar;