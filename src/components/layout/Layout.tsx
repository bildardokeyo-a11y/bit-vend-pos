import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved theme preference
    const saved = localStorage.getItem('pos-theme');
    return saved === 'dark';
  });

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('pos-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('pos-theme', 'light');
    }
  }, [darkMode]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Topbar */}
      <Topbar
        collapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content */}
      <main className={cn("pos-content", sidebarCollapsed && "collapsed")}>
        <div className="animate-fadeInUp">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;