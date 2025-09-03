import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { ScrollArea } from '@/components/ui/scroll-area';

type LayoutProps = { children?: React.ReactNode };

const Layout: React.FC<LayoutProps> = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('pos-theme');
    return saved === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('pos-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('pos-theme', 'light');
    }
  }, [darkMode]);

  const toggleSidebar = () => setSidebarCollapsed((p) => !p);
  const toggleDarkMode = () => setDarkMode((p) => !p);

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <Topbar
        collapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      <main className={cn('pos-content bg-background dark:bg-black overflow-y-hidden', sidebarCollapsed && 'collapsed')}>
        <ScrollArea className="h-full">
          <div className="animate-fadeInUp">
            <Outlet />
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

export default Layout;
