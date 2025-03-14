import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

const VoiceIframe = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const loadIframe = () => {
    setIframeLoaded(false);
    setIframeError(false);
    setRetryCount(prev => prev + 1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!iframeLoaded) {
        setIframeError(true);
        console.error("Iframe failed to load within timeout period");
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [iframeLoaded, retryCount]);

  return (
    <div className="w-full h-full min-h-[720px] relative rounded-lg overflow-hidden">
      {iframeError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted p-4 rounded-lg">
          <p className="text-muted-foreground mb-4">ไม่สามารถโหลดเครื่องมือได้ กรุณาลองใหม่อีกครั้ง</p>
          <Button onClick={loadIframe}>ลองใหม่</Button>
        </div>
      ) : !iframeLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
            <p className="text-muted-foreground">กำลังโหลดเครื่องมือ AI พากษ์เสียง...</p>
          </div>
        </div>
      )}
      <iframe 
        key={`iframe-${retryCount}`}
        src="https://speechsynthesis.online/"
        className={`w-full h-full min-h-[720px] border-0 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
        title="AI Voice Generator"
        allow="microphone; clipboard-write; clipboard-read; download"
        sandbox="allow-same-origin allow-scripts allow-forms allow-downloads allow-popups"
        onLoad={() => {
          console.log("Iframe loaded successfully");
          setIframeLoaded(true);
        }}
        onError={() => {
          console.error("Error loading iframe");
          setIframeError(true);
        }}
      />
    </div>
  );
};

const AppPage = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!e.currentTarget.activeElement?.getAttribute('data-allow-refresh')) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isAuthenticated && contentLoaded) {
    toast.error("กรุณาเข้าสู่ระบบเพื่อใช้งาน");
    return <Navigate to="/auth" replace />;
  }

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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-20 pb-20">
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
                    <TabsTrigger value="voice-generator">พากษ์เสียง</TabsTrigger>
                    <TabsTrigger value="history">ประวัติการใช้งาน</TabsTrigger>
                    <TabsTrigger value="settings">ตั้งค่า</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="voice-generator" className="p-4 pt-0 focus:outline-none">
                  <VoiceIframe />
                </TabsContent>
                
                <TabsContent value="history" className="p-6 focus:outline-none">
                  <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-2">ประวัติการใช้งาน</h3>
                    <p className="text-muted-foreground mb-4">ประวัติการพากษ์เสียงของคุณจะแสดงที่นี่</p>
                    <Button 
                      variant="outline"
                      onClick={() => toast.info('ฟีเจอร์นี้จะเปิดใช้งานเร็วๆ นี้')}
                    >
                      เรียกดูประวัติทั้งหมด
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="p-6 focus:outline-none">
                  <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-2">ตั้งค่า</h3>
                    <p className="text-muted-foreground mb-4">การตั้งค่าต่างๆ สำหรับบัญชีของคุณ</p>
                    <Button 
                      variant="outline"
                      onClick={() => toast.info('ฟีเจอร์นี้จะเปิดใช้งานเร็วๆ นี้')}
                    >
                      จัดการบัญชี
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

export default AppPage;
