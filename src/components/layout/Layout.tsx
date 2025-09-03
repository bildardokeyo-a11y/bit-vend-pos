import React, { useState, useEffect, useRef } from 'react';
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

  // Auto-hide scrollbars: mark when scrolling
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = document.documentElement;
    let timeout: number | undefined;

    const onScroll = () => {
      root.setAttribute('data-scrolling', 'true');
      if (timeout) window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        root.removeAttribute('data-scrolling');
      }, 800);
    };

    const mainEl = mainRef.current;

    window.addEventListener('scroll', onScroll, { passive: true });
    mainEl?.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      mainEl?.removeEventListener('scroll', onScroll);
      if (timeout) window.clearTimeout(timeout);
    };
  }, []);

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
      <main ref={mainRef} className={cn('pos-content bg-background dark:bg-black', sidebarCollapsed && 'collapsed')}>
        <div className="animate-fadeInUp">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
