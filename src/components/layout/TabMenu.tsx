
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Mic, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const TabMenu = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();
  const currentPath = location.pathname;

  // Define menu items based on authentication state
  const menuItems = [
    {
      name: "หน้าแรก",
      path: "/",
      icon: Home,
      showAlways: true
    },
    {
      name: "บริการ",
      path: "/ai-voice-creator",
      icon: Mic,
      showAlways: true
    },
    {
      name: "แอปพลิเคชัน",
      path: "/app",
      icon: Settings,
      showWhen: isAuthenticated
    },
    {
      name: isAuthenticated ? "บัญชี" : "เข้าสู่ระบบ",
      path: isAuthenticated ? "/app" : "/auth",
      icon: User,
      showAlways: true
    },
    {
      name: "ผู้ดูแล",
      path: "/admin",
      icon: Settings,
      showWhen: isAdmin
    }
  ];

  // Filter items based on authentication state
  const visibleItems = menuItems.filter(item => 
    item.showAlways || item.showWhen
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border md:hidden">
      <div className="flex justify-around items-center h-16">
        {visibleItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs px-1",
              currentPath === item.path 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-center truncate max-w-[70px]">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TabMenu;
