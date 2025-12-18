'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logoutApi } from '@/api/auth.api';

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

export default function AppBar() {
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
  
  // Mock user data - replace with actual user data from context/API
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    profileImage: null, // Can be a URL string or null
  };

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isNotificationOpen || isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen, isProfileOpen]);

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

  const handleLogout = async () => {
    try {
      await logoutApi();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API call fails, redirect to login
      router.push('/');
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* App Name - Left */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Creative Flow
            </h1>
          </div>

          {/* Right Side - Icons */}
          <div className="flex items-center gap-4">
            {/* Notification Icon with Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 ${
                  isNotificationOpen ? 'text-indigo-600 bg-indigo-50' : ''
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {/* Notification badge */}
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50">
                  {/* Header */}
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

                  {/* Notification List */}
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
            </div>

            {/* User Icon with Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 ${
                  isProfileOpen ? 'text-indigo-600 bg-indigo-50' : ''
                }`}
                aria-label="User menu"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50">
                  {/* Profile Section */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      {/* Profile Image */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                        {userData.profileImage ? (
                          <img
                            src={userData.profileImage}
                            alt={userData.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span>{userData.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      {/* Name and Email */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {userData.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {userData.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
