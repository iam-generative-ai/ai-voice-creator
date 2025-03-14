
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

const DesktopNav = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const currentPath = location.pathname;

  return (
    <div className="hidden md:flex items-center justify-between w-full">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink 
                className={navigationMenuTriggerStyle()} 
                active={currentPath === "/"}
              >
                หน้าแรก
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/ai-voice-creator">
              <NavigationMenuLink 
                className={navigationMenuTriggerStyle()} 
                active={currentPath === "/ai-voice-creator"}
              >
                รายละเอียดบริการ
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {isAuthenticated && (
            <NavigationMenuItem>
              <Link to="/app">
                <NavigationMenuLink 
                  className={navigationMenuTriggerStyle()} 
                  active={currentPath === "/app"}
                >
                  แอปพลิเคชัน
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}
          {isAdmin && (
            <NavigationMenuItem>
              <Link to="/admin">
                <NavigationMenuLink 
                  className={navigationMenuTriggerStyle()} 
                  active={currentPath === "/admin"}
                >
                  ผู้ดูแลระบบ
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-muted-foreground">
              สวัสดี, {user?.name || 'ผู้ใช้งาน'}
            </span>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              ออกจากระบบ
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" asChild>
              <Link to="/auth">เข้าสู่ระบบ</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">ทดลองใช้ฟรี</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default DesktopNav;
