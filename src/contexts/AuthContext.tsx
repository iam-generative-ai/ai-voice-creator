
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

// Creating a simple user store for demo purposes
// In a real app, this would be handled by Supabase
interface StoredUser extends User {
  password: string;
}

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
      // Simple validation
      if (!email || !password) {
        throw new Error('กรุณากรอกอีเมลและรหัสผ่าน');
      }
      
      // Get stored users from localStorage
      const storedUsersJson = localStorage.getItem('ai-voice-users');
      const storedUsers: StoredUser[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
      
      // Find user by email
      const foundUser = storedUsers.find(u => u.email === email);
      
      // Check if user exists and password matches
      if (!foundUser) {
        throw new Error('ไม่พบบัญชีผู้ใช้นี้ กรุณาลงทะเบียน');
      }
      
      if (foundUser.password !== password) {
        throw new Error('รหัสผ่านไม่ถูกต้อง');
      }
      
      // Successfully authenticated
      const userWithoutPassword = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name
      };
      
      setUser(userWithoutPassword);
      localStorage.setItem('ai-voice-user', JSON.stringify(userWithoutPassword));
      toast.success('เข้าสู่ระบบสำเร็จ');
      
      console.log("User logged in successfully:", userWithoutPassword);
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
      // Simple validation
      if (!email || !password || !name) {
        throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
      }
      
      // Get stored users
      const storedUsersJson = localStorage.getItem('ai-voice-users');
      const storedUsers: StoredUser[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
      
      // Check if email already exists
      if (storedUsers.some(u => u.email === email)) {
        throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
      }
      
      // Create new user
      const newUser: StoredUser = {
        id: 'user-' + Date.now().toString(),
        email,
        name,
        password
      };
      
      // Add to stored users
      storedUsers.push(newUser);
      localStorage.setItem('ai-voice-users', JSON.stringify(storedUsers));
      
      // Log in the user (without password)
      const userWithoutPassword = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      };
      
      setUser(userWithoutPassword);
      localStorage.setItem('ai-voice-user', JSON.stringify(userWithoutPassword));
      toast.success('ลงทะเบียนสำเร็จ');
      
      console.log("User registered successfully:", userWithoutPassword);
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
