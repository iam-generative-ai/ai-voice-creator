
import { StoredUser, User } from '@/types/auth';
import { logUserActivity } from './activityLogger';
import { toast } from 'sonner';

export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
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
    
    // Save to local storage
    localStorage.setItem('ai-voice-user', JSON.stringify(userWithoutPassword));
    
    // Log activity
    await logUserActivity(userWithoutPassword, 'login', 'เข้าสู่ระบบสำเร็จ');
    
    toast.success('เข้าสู่ระบบสำเร็จ');
    
    console.log("User logged in successfully:", userWithoutPassword);
    
    return userWithoutPassword;
  } catch (error) {
    console.error('Login error:', error);
    toast.error(error instanceof Error ? error.message : 'เข้าสู่ระบบไม่สำเร็จ');
    throw error;
  }
};

export const registerUser = async (email: string, password: string, name: string): Promise<User> => {
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
      isAdmin: storedUsers.length === 0, // First user is admin
      createdAt: new Date().toISOString()
    };
    
    // Add to stored users
    storedUsers.push(newUser);
    localStorage.setItem('ai-voice-users', JSON.stringify(storedUsers));
    
    // Return user without password
    const userWithoutPassword = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      isAdmin: newUser.isAdmin
    };
    
    // Save to local storage
    localStorage.setItem('ai-voice-user', JSON.stringify(userWithoutPassword));
    
    // Log activity
    await logUserActivity(userWithoutPassword, 'register', 'ลงทะเบียนสำเร็จ');
    
    toast.success('ลงทะเบียนสำเร็จ');
    
    console.log("User registered successfully:", userWithoutPassword);
    
    return userWithoutPassword;
  } catch (error) {
    console.error('Registration error:', error);
    toast.error(error instanceof Error ? error.message : 'ลงทะเบียนไม่สำเร็จ');
    throw error;
  }
};

export const logoutUser = async (user: User | null): Promise<void> => {
  try {
    // Log activity before logging out
    if (user) {
      await logUserActivity(user, 'logout', 'ออกจากระบบ');
    }
    
    // Mock logout - would be replaced with actual Supabase auth
    await new Promise(resolve => setTimeout(resolve, 500));
    
    localStorage.removeItem('ai-voice-user');
    toast.success('ออกจากระบบสำเร็จ');
    
    console.log("User logged out successfully");
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('ออกจากระบบไม่สำเร็จ');
    throw error;
  }
};

export const checkExistingSession = (): User | null => {
  try {
    const savedUser = localStorage.getItem('ai-voice-user');
    if (savedUser) {
      console.log("Found saved user session");
      return JSON.parse(savedUser);
    }
    console.log("No saved user session found");
    return null;
  } catch (error) {
    console.error('Session error:', error);
    localStorage.removeItem('ai-voice-user'); // Clear corrupted session if any
    return null;
  }
};
