
import { StoredUser, User } from '@/types/auth';
import { logUserActivity } from './activityLogger';
import { DEFAULT_ADMIN } from '@/config/auth';

export const createDefaultAdminIfNeeded = (): void => {
  // Check if there are any users in the system
  // If not, create the default admin user
  const storedUsersJson = localStorage.getItem('ai-voice-users');
  const storedUsers: StoredUser[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
  
  if (storedUsers.length === 0) {
    // Create default admin user
    const newAdmin: StoredUser = {
      id: 'user-admin-' + Date.now().toString(),
      email: DEFAULT_ADMIN.email,
      name: DEFAULT_ADMIN.name,
      password: DEFAULT_ADMIN.password,
      isBlocked: false,
      isAdmin: true,
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('ai-voice-users', JSON.stringify([newAdmin]));
    console.log("Created default admin user");
  }
};

export const getAllUsersFromStorage = async (): Promise<User[]> => {
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

export const addUserToStorage = async (currentUser: User | null, email: string, password: string, name: string, isAdmin: boolean): Promise<void> => {
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
    if (currentUser) {
      await logUserActivity(currentUser, 'user-created', `เพิ่มผู้ใช้งานใหม่: ${name} (${email})`);
    }
    
    console.log("User added successfully:", newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const removeUserFromStorage = async (currentUser: User | null, userId: string): Promise<void> => {
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
    if (currentUser) {
      await logUserActivity(currentUser, 'user-removed', `ลบผู้ใช้งาน: ${userToRemove.name} (${userToRemove.email})`);
    }
    
    console.log("User removed successfully:", userToRemove);
  } catch (error) {
    console.error('Error removing user:', error);
    throw error;
  }
};

export const updateUserBlockStatus = async (currentUser: User | null, userId: string, shouldBlock: boolean): Promise<void> => {
  try {
    // Get stored users
    const storedUsersJson = localStorage.getItem('ai-voice-users');
    const storedUsers: StoredUser[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
    
    // Find user
    const userIndex = storedUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('ไม่พบผู้ใช้งานนี้');
    }
    
    // Update block status
    const userToUpdate = storedUsers[userIndex];
    storedUsers[userIndex] = { ...userToUpdate, isBlocked: shouldBlock };
    localStorage.setItem('ai-voice-users', JSON.stringify(storedUsers));
    
    // Log activity
    if (currentUser) {
      const action = shouldBlock ? 'account-blocked' : 'account-unblocked';
      const details = shouldBlock 
        ? `บล็อคผู้ใช้งาน: ${userToUpdate.name} (${userToUpdate.email})`
        : `ปลดบล็อคผู้ใช้งาน: ${userToUpdate.name} (${userToUpdate.email})`;
      
      await logUserActivity(currentUser, action, details);
    }
    
    console.log(`User ${shouldBlock ? 'blocked' : 'unblocked'} successfully:`, userToUpdate);
  } catch (error) {
    console.error(`Error ${shouldBlock ? 'blocking' : 'unblocking'} user:`, error);
    throw error;
  }
};

export const updateUserAdminStatus = async (currentUser: User | null, userId: string, shouldBeAdmin: boolean): Promise<void> => {
  try {
    // Get stored users
    const storedUsersJson = localStorage.getItem('ai-voice-users');
    const storedUsers: StoredUser[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
    
    // Find user
    const userIndex = storedUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('ไม่พบผู้ใช้งานนี้');
    }
    
    // Update admin status
    const userToUpdate = storedUsers[userIndex];
    storedUsers[userIndex] = { ...userToUpdate, isAdmin: shouldBeAdmin };
    localStorage.setItem('ai-voice-users', JSON.stringify(storedUsers));
    
    // Log activity
    if (currentUser) {
      const action = shouldBeAdmin ? 'admin-granted' : 'admin-revoked';
      const details = shouldBeAdmin 
        ? `เพิ่มสิทธิ์ผู้ดูแลให้: ${userToUpdate.name} (${userToUpdate.email})`
        : `ถอดถอนสิทธิ์ผู้ดูแลของ: ${userToUpdate.name} (${userToUpdate.email})`;
      
      await logUserActivity(currentUser, action, details);
    }
    
    console.log(`User admin status ${shouldBeAdmin ? 'granted' : 'revoked'} successfully:`, userToUpdate);
  } catch (error) {
    console.error(`Error ${shouldBeAdmin ? 'granting' : 'revoking'} admin status:`, error);
    throw error;
  }
};
