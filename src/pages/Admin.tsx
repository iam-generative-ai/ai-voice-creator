
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UserManagement from '@/components/admin/UserManagement';
import ActivityLogs from '@/components/admin/ActivityLogs';
import { toast } from 'sonner';

const AdminPage = () => {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    // Ensure authentication state is stable before showing content
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // If not authenticated, redirect to auth page
  if (!isAuthenticated && contentLoaded) {
    toast.error("กรุณาเข้าสู่ระบบเพื่อใช้งาน");
    return <Navigate to="/auth" replace />;
  }

  // If authenticated but not admin, redirect to app page
  if (isAuthenticated && !isAdmin && contentLoaded) {
    toast.error("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
    return <Navigate to="/app" replace />;
  }

  // Show loading while checking auth state
  if (!contentLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-muted-foreground">กำลังตรวจสอบสิทธิ์การใช้งาน...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="glass-morphism sticky top-0 z-10 border-b border-primary/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">
              <span className="text-gradient">ระบบผู้ดูแล</span>
            </h1>
            <Button variant="outline" size="sm" asChild>
              <a href="/app">กลับไปหน้าหลัก</a>
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline-block">
              ผู้ดูแลระบบ: {user?.name || 'ผู้ดูแล'}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">ระบบจัดการผู้ใช้งาน</h2>
            <p className="text-muted-foreground">
              จัดการผู้ใช้งานทั้งหมดในระบบ ตรวจสอบประวัติการใช้งาน และปรับสิทธิ์การเข้าถึง
            </p>
          </div>

          <Card className="bg-card/70 backdrop-blur-sm border border-primary/10 shadow-lg animate-fade-in">
            <CardContent className="p-0">
              <Tabs defaultValue="users" className="w-full">
                <div className="p-4 border-b border-border/60">
                  <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full">
                    <TabsTrigger value="users">รายชื่อผู้ใช้งาน</TabsTrigger>
                    <TabsTrigger value="activity">ประวัติการใช้งาน</TabsTrigger>
                    <TabsTrigger value="settings">ตั้งค่าระบบ</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="users" className="p-6 focus:outline-none">
                  <UserManagement />
                </TabsContent>
                
                <TabsContent value="activity" className="p-6 focus:outline-none">
                  <ActivityLogs />
                </TabsContent>
                
                <TabsContent value="settings" className="p-6 focus:outline-none">
                  <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-2">ตั้งค่าระบบ</h3>
                    <p className="text-muted-foreground mb-4">ปรับแต่งการตั้งค่าระบบจัดการผู้ใช้งาน</p>
                    <Button 
                      variant="outline"
                      onClick={() => toast.info('ฟีเจอร์นี้จะเปิดใช้งานเร็วๆ นี้')}
                    >
                      ตั้งค่าระบบ
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
