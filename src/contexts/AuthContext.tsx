
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Note: This is a mock authentication context
// In a real application, this would integrate with Supabase Auth

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on load
    const checkSession = async () => {
      try {
        // In a real app, this would verify session with Supabase
        const savedUser = localStorage.getItem('ai-voice-user');
        if (savedUser) {
          console.log("Found saved user session");
          setUser(JSON.parse(savedUser));
        } else {
          console.log("No saved user session found");
        }
      } catch (error) {
        console.error('Session error:', error);
        localStorage.removeItem('ai-voice-user'); // Clear corrupted session if any
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Mock login - would be replaced with actual Supabase auth
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation
      if (!email || !password) {
        throw new Error('กรุณากรอกอีเมลและรหัสผ่าน');
      }
      
      // Mock successful login
      const mockUser = {
        id: 'user-' + Date.now().toString(),
        email,
        name: email.split('@')[0],
      };
      
      setUser(mockUser);
      localStorage.setItem('ai-voice-user', JSON.stringify(mockUser));
      toast.success('เข้าสู่ระบบสำเร็จ');
      
      console.log("User logged in successfully:", mockUser);
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'เข้าสู่ระบบไม่สำเร็จ');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      // Mock registration - would be replaced with actual Supabase auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation
      if (!email || !password || !name) {
        throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
      }
      
      // Mock successful registration
      const mockUser = {
        id: 'user-' + Date.now().toString(),
        email,
        name,
      };
      
      setUser(mockUser);
      localStorage.setItem('ai-voice-user', JSON.stringify(mockUser));
      toast.success('ลงทะเบียนสำเร็จ');
      
      console.log("User registered successfully:", mockUser);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'ลงทะเบียนไม่สำเร็จ');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Mock logout - would be replaced with actual Supabase auth
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      localStorage.removeItem('ai-voice-user');
      toast.success('ออกจากระบบสำเร็จ');
      
      console.log("User logged out successfully");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('ออกจากระบบไม่สำเร็จ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
