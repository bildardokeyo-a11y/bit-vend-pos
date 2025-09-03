import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className={cn(
      'pos-topbar transition-all duration-300',
      collapsed && 'collapsed',
      darkMode 
        ? 'bg-black/70 backdrop-blur-md border-border/50' 
        : 'bg-white/70 backdrop-blur-md border-border/50'
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

        <form onSubmit={handleSearch} className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            type="text"
            placeholder="Search products, sales, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-80 pos-input"
          />
        </form>
      </div>

      <div className="flex items-center gap-3">
        <select className="px-3 py-1 rounded-md border bg-background text-foreground text-sm">
          <option>Freshmart</option>
          <option>Branch 1</option>
          <option>Branch 2</option>
        </select>

        <Button
          onClick={() => navigate('/products/add')}
          className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
          size="sm"
        >
          <Plus size={16} />
          Add New
        </Button>

        <Button
          onClick={() => navigate('/checkout')}
          className="bg-blue-500 hover:bg-blue-600 text-white gap-2"
          size="sm"
        >
          <Calculator size={16} />
          POS
        </Button>

        <div className={cn("flex items-center gap-3", darkMode ? "text-white" : "text-black")}>
          <Button variant="ghost" size="sm" className="p-2">
            <Globe size={18} />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 relative">
            <Mail size={18} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </Button>
          <Button variant="ghost" size="sm" className="p-2 relative">
            <Bell size={18} />
            <span className={cn("absolute -top-1 -right-1 bg-primary text-xs rounded-full w-4 h-4 flex items-center justify-center", darkMode ? "text-black" : "text-white")}>
              5
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
            onClick={() => navigate('/settings')}
          >
            <Settings size={18} />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleDarkMode}
          className={`p-2 ${darkMode ? 'theme-toggle-sun' : 'theme-toggle-moon'}`}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="text-lg">
            {darkMode ? goldenSun : goldenMoon}
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
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
      </div>
    </header>
  );
};

export default Topbar;