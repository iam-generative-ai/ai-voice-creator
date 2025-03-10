
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Header } from '@/components/app/Header';
import { LoadingSpinner } from '@/components/app/LoadingSpinner';
import { MainTabs } from '@/components/app/MainTabs';

const AppPage = () => {
  const { isAuthenticated } = useAuth();
  const [contentLoaded, setContentLoaded] = useState(false);

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
    return <LoadingSpinner message="กำลังตรวจสอบสิทธิ์การใช้งาน..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2 text-balance">เครื่องมือ AI พากษ์เสียง</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              สร้างเสียงพากษ์คุณภาพสูงด้วย AI ที่ฟังเป็นธรรมชาติ เลือกภาษา ปรับโทนเสียง และลักษณะการพูดได้ตามต้องการ
            </p>
          </div>

          <MainTabs />
        </div>
      </main>
    </div>
  );
};

export default AppPage;

