
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-7xl font-bold text-gradient">404</h1>
          <p className="text-xl text-muted-foreground">ไม่พบหน้าที่คุณต้องการ</p>
        </div>
        
        <div className="bg-card/70 backdrop-blur-sm border border-border p-6 rounded-lg shadow-lg">
          <p className="text-muted-foreground mb-6">
            ลิงก์นี้อาจไม่ถูกต้อง หรือหน้าที่คุณกำลังมองหาอาจถูกย้ายหรือลบไปแล้ว
          </p>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/">กลับไปหน้าหลัก</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
