
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Note: This is a mock authentication context
// In a real application, this would integrate with Supabase Auth

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  getAllUsers: () => Promise<any[]>;
  getUserActivities: () => Promise<any[]>;
  addUser: (email: string, password: string, name: string, isAdmin: boolean) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
  makeAdmin: (userId: string) => Promise<void>;
  removeAdmin: (userId: string) => Promise<void>;
  logActivity: (action: string, details: string) => Promise<void>;
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
  isBlocked?: boolean;
  isAdmin?: boolean;
  createdAt: string;
}

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
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

  const logActivity = async (action: string, details: string) => {
    if (!user) return;
    
    try {
      // Get stored activities
      const storedActivitiesJson = localStorage.getItem('ai-voice-activities');
      const storedActivities: ActivityLog[] = storedActivitiesJson ? JSON.parse(storedActivitiesJson) : [];
      
      // Create new activity log
      const newActivity: ActivityLog = {
        id: 'activity-' + Date.now().toString(),
        userId: user.id,
        userName: user.name,
        action,
        details,
        timestamp: new Date().toISOString()
      };
      
      // Add to stored activities
      storedActivities.push(newActivity);
      localStorage.setItem('ai-voice-activities', JSON.stringify(storedActivities));
      
      console.log("Activity logged:", newActivity);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

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
      
      // Check if user is blocked
      if (foundUser.isBlocked) {
        throw new Error('บัญชีผู้ใช้นี้ถูกระงับการใช้งาน');
      }
      
      // Successfully authenticated
      const userWithoutPassword = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        isAdmin: foundUser.isAdmin || false
      };
      
      setUser(userWithoutPassword);
      localStorage.setItem('ai-voice-user', JSON.stringify(userWithoutPassword));
      
      // Log activity
      await logActivity('login', 'เข้าสู่ระบบสำเร็จ');
      
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
        password,
        isBlocked: false,
        isAdmin: storedUsers.length === 0, // First user is admin
        createdAt: new Date().toISOString()
      };
      
      // Add to stored users
      storedUsers.push(newUser);
      localStorage.setItem('ai-voice-users', JSON.stringify(storedUsers));
      
      // Log in the user (without password)
      const userWithoutPassword = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        isAdmin: newUser.isAdmin
      };
      
      setUser(userWithoutPassword);
      localStorage.setItem('ai-voice-user', JSON.stringify(userWithoutPassword));
      
      // Log activity
      await logActivity('register', 'ลงทะเบียนสำเร็จ');
      
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
      
      // Log activity before logging out
      if (user) {
        await logActivity('logout', 'ออกจากระบบ');
      }
      
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

  // Admin functions
  const getAllUsers = async () => {
    try {
      // Get stored users
      const storedUsersJson = localStorage.getItem('ai-voice-users');
      const storedUsers: StoredUser[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
      
      // Return users without passwords
      return storedUsers.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        isBlocked: user.isBlocked || false,
        isAdmin: user.isAdmin || false,
        createdAt: user.createdAt
      }));
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  };

  const getUserActivities = async () => {
    try {
      // Get stored activities
      const storedActivitiesJson = localStorage.getItem('ai-voice-activities');
      const storedActivities: ActivityLog[] = storedActivitiesJson ? JSON.parse(storedActivitiesJson) : [];
      
      // Return activities sorted by timestamp (newest first)
      return storedActivities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('Error getting activities:', error);
      throw error;
    }
  };

  const addUser = async (email: string, password: string, name: string, isAdmin: boolean) => {
    try {
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
        password,
        isBlocked: false,
        isAdmin,
        createdAt: new Date().toISOString()
      };
      
      // Add to stored users
      storedUsers.push(newUser);
      localStorage.setItem('ai-voice-users', JSON.stringify(storedUsers));
      
      // Log activity
      await logActivity('user-created', `เพิ่มผู้ใช้งานใหม่: ${name} (${email})`);
      
      console.log("User added successfully:", newUser);
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const removeUser = async (userId: string) => {
    try {
      // Get stored users
      const storedUsersJson = localStorage.getItem('ai-voice-users');
      const storedUsers: StoredUser[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
      
      // Find user
      const userToRemove = storedUsers.find(u => u.id === userId);
      if (!userToRemove) {
        throw new Error('ไม่พบผู้ใช้งานนี้');
      }
      
      // Remove user
      const updatedUsers = storedUsers.filter(u => u.id !== userId);
      localStorage.setItem('ai-voice-users', JSON.stringify(updatedUsers));
      
      // Log activity
      await logActivity('user-removed', `ลบผู้ใช้งาน: ${userToRemove.name} (${userToRemove.email})`);
      
      console.log("User removed successfully:", userToRemove);
    } catch (error) {
      console.error('Error removing user:', error);
      throw error;
    }
  };

  const blockUser = async (userId: string) => {
    try {
      // Get stored users
      const storedUsersJson = localStorage.getItem('ai-voice-users');
      const storedUsers: StoredUser[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
      
      // Find user
      const userIndex = storedUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('ไม่พบผู้ใช้งานนี้');
      }
      
      // Block user
      const userToBlock = storedUsers[userIndex];
      storedUsers[userIndex] = { ...userToBlock, isBlocked: true };
      localStorage.setItem('ai-voice-users', JSON.stringify(storedUsers));
      
      // Log activity
      await logActivity('account-blocked', `บล็อคผู้ใช้งาน: ${userToBlock.name} (${userToBlock.email})`);
      
      console.log("User blocked successfully:", userToBlock);
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  };

  const unblockUser = async (userId: string) => {
    try {
      // Get stored users
      const storedUsersJson = localStorage.getItem('ai-voice-users');
      const storedUsers: StoredUser[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
      
      // Find user
      const userIndex = storedUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('ไม่พบผู้ใช้งานนี้');
      }
      
      // Unblock user
      const userToUnblock = storedUsers[userIndex];
      storedUsers[userIndex] = { ...userToUnblock, isBlocked: false };
      localStorage.setItem('ai-voice-users', JSON.stringify(storedUsers));
      
      // Log activity
      await logActivity('account-unblocked', `ปลดบล็อคผู้ใช้งาน: ${userToUnblock.name} (${userToUnblock.email})`);
      
      console.log("User unblocked successfully:", userToUnblock);
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  };

  const makeAdmin = async (userId: string) => {
    try {
      // Get stored users
      const storedUsersJson = localStorage.getItem('ai-voice-users');
      const storedUsers: StoredUser[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
      
      // Find user
      const userIndex = storedUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('ไม่พบผู้ใช้งานนี้');
      }
      
      // Make admin
      const userToPromote = storedUsers[userIndex];
      storedUsers[userIndex] = { ...userToPromote, isAdmin: true };
      localStorage.setItem('ai-voice-users', JSON.stringify(storedUsers));
      
      // Log activity
      await logActivity('admin-granted', `เพิ่มสิทธิ์ผู้ดูแลให้: ${userToPromote.name} (${userToPromote.email})`);
      
      console.log("User promoted to admin successfully:", userToPromote);
    } catch (error) {
      console.error('Error making user admin:', error);
      throw error;
    }
  };

  const removeAdmin = async (userId: string) => {
    try {
      // Get stored users
      const storedUsersJson = localStorage.getItem('ai-voice-users');
      const storedUsers: StoredUser[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
      
      // Find user
      const userIndex = storedUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('ไม่พบผู้ใช้งานนี้');
      }
      
      // Remove admin
      const userToDemote = storedUsers[userIndex];
      storedUsers[userIndex] = { ...userToDemote, isAdmin: false };
      localStorage.setItem('ai-voice-users', JSON.stringify(storedUsers));
      
      // Log activity
      await logActivity('admin-revoked', `ถอดถอนสิทธิ์ผู้ดูแลของ: ${userToDemote.name} (${userToDemote.email})`);
      
      console.log("Admin rights removed successfully:", userToDemote);
    } catch (error) {
      console.error('Error removing admin rights:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin,
        login,
        register,
        logout,
        getAllUsers,
        getUserActivities,
        addUser,
        removeUser,
        blockUser,
        unblockUser,
        makeAdmin,
        removeAdmin,
        logActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
