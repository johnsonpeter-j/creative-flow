'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, User, Settings, Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

interface SidebarItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    icon: <LayoutDashboard />,
    label: 'Dashboard',
    path: '/campaign',
  },
  {
    id: 'profile',
    icon: <User />,
    label: 'Profile',
    path: '/profile',
  },
  // {
  //   id: 'settings',
  //   icon: <Settings />,
  //   label: 'Settings',
  //   path: '/settings',
  // },
];

// Check if current path matches sidebar item
const isPathActive = (itemPath: string, currentPath: string): boolean => {
  if (currentPath === itemPath) return true;
  if (itemPath === '/campaign' && currentPath?.startsWith('/campaign')) return true;
  return false;
};

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'Your creative campaign has been approved',
      time: '2 minutes ago',
      read: false,
    },
    {
      id: '2',
      message: 'New creative template available',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      message: 'Brand guidelines updated',
      time: '3 hours ago',
      read: true,
    },
    {
      id: '4',
      message: 'Weekly report is ready',
      time: '1 day ago',
      read: true,
    },
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClearAll = () => {
    setNotifications([]);
    setIsNotificationOpen(false);
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div
      className="fixed left-0 top-0 h-full flex flex-col items-center justify-center gap-6 ml-5 z-50"
      style={{
        width: '80px',
        backgroundColor: 'transparent',
      }}
    >
      {/* <div className="relative" ref={notificationRef}>
        <button
          type="button"
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          className="relative flex items-center justify-center transition-all duration-200 group"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: isNotificationOpen
              ? 'rgba(198, 124, 78, 0.15)'
              : 'rgba(255, 255, 255, 0.9)',
            color: isNotificationOpen
              ? 'var(--color-frame)'
              : 'rgba(49, 49, 49, 0.7)',
            boxShadow: isNotificationOpen
              ? '0 4px 16px rgba(198, 124, 78, 0.25)'
              : '0 2px 8px rgba(49, 49, 49, 0.1)',
          }}
          onMouseEnter={(e) => {
            if (!isNotificationOpen) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.color = 'var(--color-frame)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(198, 124, 78, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isNotificationOpen) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.color = 'rgba(49, 49, 49, 0.7)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(49, 49, 49, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
          title="Notifications"
        >
          <div style={{ width: '24px', height: '24px' }}>
            <Bell />
          </div>
          {unreadCount > 0 && (
            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
        {isNotificationOpen && (
          <div className="absolute left-full top-0 ml-4 w-80 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => handleNotificationClick(notification.id)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-indigo-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                            !notification.read ? 'bg-indigo-600' : 'bg-transparent'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm ${
                              !notification.read
                                ? 'text-gray-900 font-medium'
                                : 'text-gray-600'
                            }`}
                          >
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div> */}
      {sidebarItems.map((item) => {
        const isActive = isPathActive(item.path, pathname || '');
        
        return (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className="relative flex items-center justify-center transition-all duration-200 group"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: isActive 
                ? 'rgba(198, 124, 78, 0.15)' 
                : 'rgba(255, 255, 255, 0.9)',
              color: isActive 
                ? 'var(--color-frame)' 
                : 'rgba(49, 49, 49, 0.7)',
              boxShadow: isActive
                ? '0 4px 16px rgba(198, 124, 78, 0.25)'
                : '0 2px 8px rgba(49, 49, 49, 0.1)',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                e.currentTarget.style.color = 'var(--color-frame)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(198, 124, 78, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.color = 'rgba(49, 49, 49, 0.7)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(49, 49, 49, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
            title={item.label}
          >
            <div style={{ width: '24px', height: '24px' }}>
              {item.icon}
            </div>
          </button>
        );
      })}

      <button
        onClick={logout}
        className="relative flex items-center justify-center transition-all duration-200 group"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: 'rgba(49, 49, 49, 0.7)',
          boxShadow: '0 2px 8px rgba(49, 49, 49, 0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
          e.currentTarget.style.color = 'var(--color-frame)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(198, 124, 78, 0.2)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
          e.currentTarget.style.color = 'rgba(49, 49, 49, 0.7)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(49, 49, 49, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        title="Logout"
      >
        <div style={{ width: '24px', height: '24px' }}>
          <LogOut />
        </div>
      </button>
    </div>
  );
}
