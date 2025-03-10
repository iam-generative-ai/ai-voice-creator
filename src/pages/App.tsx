
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import VoiceIframe from '@/components/VoiceIframe';
import VoiceHistory from '@/components/VoiceHistory';
import UserSettings from '@/components/UserSettings';
import { History, Settings, Mic } from 'lucide-react';

const AppPage = () => {
  const { isAuthenticated, user, logout } = useAuth();
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
          <h1 className="text-xl font-semibold">
            <span className="text-gradient">AI Voice Creator</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline-block">
              สวัสดี, {user?.name || 'ผู้ใช้งาน'}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => logout()}
            >
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2 text-balance">เครื่องมือ AI พากษ์เสียง</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              สร้างเสียงพากษ์คุณภาพสูงด้วย AI ที่ฟังเป็นธรรมชาติ เลือกภาษา ปรับโทนเสียง และลักษณะการพูดได้ตามต้องการ
            </p>
          </div>

          <Card className="bg-card/70 backdrop-blur-sm border border-primary/10 shadow-lg animate-fade-in">
            <CardContent className="p-0">
              <Tabs defaultValue="voice-generator" className="w-full">
                <div className="p-4 border-b border-border/60">
                  <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full">
                    <TabsTrigger value="voice-generator" className="flex items-center">
                      <Mic className="h-4 w-4 mr-2" />
                      พากษ์เสียง
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center">
                      <History className="h-4 w-4 mr-2" />
                      ประวัติการใช้งาน
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      ตั้งค่า
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="voice-generator" className="p-4 pt-0 focus:outline-none">
                  <VoiceIframe />
                </TabsContent>
                
                <TabsContent value="history" className="p-6 focus:outline-none">
                  <VoiceHistory />
                </TabsContent>
                
                <TabsContent value="settings" className="p-6 focus:outline-none">
                  <UserSettings />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AppPage;
