'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Shield, UserCircle, Home, Settings, LogOut, MessageSquare, Bell, Calendar, AlertCircle, Users, Wrench } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';
import { NotificationsDropdown } from '@/components/NotificationsDropdown';
import { ChatDialog } from '@/components/ChatDialog';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, userData, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!user || (userData && userData.role !== 'student')) {
      router.push('/portals/student');
    }
  }, [user, userData, router]);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (userData.role !== 'student') {
    // This shouldn't render because the useEffect should redirect,
    // but it's a safety measure
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/portals/student');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl">My Domain Student Living</span>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationsDropdown />
            <ChatDialog />
            <Separator orientation="vertical" className="h-8" />
            <Avatar>
              <AvatarImage src={user?.photoURL || undefined} />
              <AvatarFallback>{userData.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="w-64 border-r bg-background">
          <nav className="space-y-1 p-4">
            <Link href="/student">
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/student/maintenance">
              <Button variant="ghost" className="w-full justify-start">
                <Wrench className="mr-2 h-4 w-4" />
                Maintenance
              </Button>
            </Link>
            <Link href="/student/complaints">
              <Button variant="ghost" className="w-full justify-start">
                <AlertCircle className="mr-2 h-4 w-4" />
                Complaints
              </Button>
            </Link>
            <Link href="/student/guests">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Guest Management
              </Button>
            </Link>
            <Link href="/student/sleepovers">
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Sleepover Requests
              </Button>
            </Link>
            <Separator className="my-4" />
            <Link href="/student/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 