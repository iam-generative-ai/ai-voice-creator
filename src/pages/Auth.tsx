
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Set document title
    document.title = 'เข้าสู่ระบบ | AI Voice Creator';
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-muted-foreground">กำลังตรวจสอบข้อมูล...</p>
        </div>
      </div>
    );
  }

  // If user is already authenticated, redirect to app
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/50 p-4 md:p-8 pt-20">
      <div className="hero-glow" />
      
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="text-center lg:text-left space-y-4 order-2 lg:order-1 animate-slide-up">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            เครื่องมือ AI พากษ์เสียงระดับมืออาชีพ
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="text-gradient">AI Voice Creator</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto lg:mx-0">
            สร้างเสียงพากษ์คุณภาพสูงด้วย AI ที่ฟังเป็นธรรมชาติ ปรับแต่งได้ตามต้องการ
          </p>
          <ul className="space-y-2 text-sm md:text-base text-muted-foreground mt-6 max-w-md mx-auto lg:mx-0">
            <li className="flex items-center">
              <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              รองรับหลากหลายภาษาทั่วโลก
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              น้ำเสียงเป็นธรรมชาติ ฟังเหมือนมนุษย์จริง
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              ปรับแต่งน้ำเสียง โทนเสียง และลักษณะการพูดได้
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              เลือกได้ทั้งเสียงผู้ชายและผู้หญิง
            </li>
          </ul>
        </div>
        
        <div className="order-1 lg:order-2">
          {isLogin ? (
            <LoginForm onToggleForm={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleForm={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
