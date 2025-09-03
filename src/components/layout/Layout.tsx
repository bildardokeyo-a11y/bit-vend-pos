import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

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
      <main className={cn('pos-content bg-background', sidebarCollapsed && 'collapsed')}>
        <div className="animate-fadeInUp">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
