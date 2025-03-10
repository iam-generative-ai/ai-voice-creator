
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Header from '@/components/app/Header';
import LoadingSpinner from '@/components/app/LoadingSpinner';
import ApplicationTitle from '@/components/app/ApplicationTitle';
import TabContainer from '@/components/app/TabContainer';

const AppPage = () => {
  const { isAuthenticated } = useAuth();
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
    return <LoadingSpinner message="กำลังตรวจสอบสิทธิ์การใช้งาน..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <ApplicationTitle />
          <TabContainer />
        </div>
      </main>
    </div>
  );
};

export default AppPage;
