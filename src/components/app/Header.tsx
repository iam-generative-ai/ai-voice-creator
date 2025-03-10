
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
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
  );
};

export default Header;
