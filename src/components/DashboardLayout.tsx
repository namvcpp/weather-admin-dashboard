"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Droplets, 
  Cloud, 
  BarChart2, 
  Map, 
  Bell, 
  Settings, 
  UserCircle 
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  
  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Flood Data', href: '/dashboard/flood', icon: <Droplets size={20} /> },
    { name: 'Weather', href: '/dashboard/weather', icon: <Cloud size={20} /> },
    { name: 'Statistics', href: '/dashboard/stats', icon: <BarChart2 size={20} /> },
    { name: 'Maps', href: '/dashboard/maps', icon: <Map size={20} /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="dashboard-sidebar w-64 bg-card hidden md:block">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold text-primary">Flood & Weather</h1>
          <p className="text-sm text-secondary-foreground">Admin Dashboard</p>
        </div>
        <nav className="mt-6">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center px-4 py-3 hover:bg-secondary ${pathname === item.href ? 'bg-secondary text-primary' : ''}`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-border">
          <div className="flex items-center">
            <UserCircle className="mr-2" />
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-secondary-foreground">admin@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="dashboard-header bg-card flex justify-between items-center">
          <button className="md:hidden p-2">
            <LayoutDashboard size={20} />
          </button>
          <div className="text-lg font-medium md:hidden">Flood & Weather Dashboard</div>
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-secondary mr-2">
              <Bell size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-secondary">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
