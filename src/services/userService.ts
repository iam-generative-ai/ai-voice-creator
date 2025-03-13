
import { StoredUser, User } from "@/types/auth";
import { STORAGE_KEYS, DEFAULT_ADMIN } from "@/config/auth";
import { logActivity } from "@/utils/activityLogger";

export const getStoredUsers = (): StoredUser[] => {
  const storedUsersJson = localStorage.getItem(STORAGE_KEYS.USERS);
  return storedUsersJson ? JSON.parse(storedUsersJson) : [];
};

export const saveStoredUsers = (users: StoredUser[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const initializeDefaultAdmin = (): void => {
  const storedUsers = getStoredUsers();
  
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
    saveStoredUsers([newAdmin]);
    console.log("Created default admin user");
  }
};

export const getAllUsers = async () => {
  try {
    // Get stored users
    const storedUsers = getStoredUsers();
    
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

export const addUser = async (currentUser: User | null, email: string, password: string, name: string, isAdmin: boolean) => {
  try {
    // Simple validation
    if (!email || !password || !name) {
      throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
    
    // Get stored users
    const storedUsers = getStoredUsers();
    
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
    saveStoredUsers(storedUsers);
    
    // Log activity
    if (currentUser) {
      await logActivity(currentUser, 'user-created', `เพิ่มผู้ใช้งานใหม่: ${name} (${email})`);
    }
    
    console.log("User added successfully:", newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const removeUser = async (currentUser: User | null, userId: string) => {
  try {
    // Get stored users
    const storedUsers = getStoredUsers();
    
    // Find user
    const userToRemove = storedUsers.find(u => u.id === userId);
    if (!userToRemove) {
      throw new Error('ไม่พบผู้ใช้งานนี้');
    }
    
    // Remove user
    const updatedUsers = storedUsers.filter(u => u.id !== userId);
    saveStoredUsers(updatedUsers);
    
    // Log activity
    if (currentUser) {
      await logActivity(currentUser, 'user-removed', `ลบผู้ใช้งาน: ${userToRemove.name} (${userToRemove.email})`);
    }
    
    console.log("User removed successfully:", userToRemove);
  } catch (error) {
    console.error('Error removing user:', error);
    throw error;
  }
};

export const blockUser = async (currentUser: User | null, userId: string) => {
  try {
    // Get stored users
    const storedUsers = getStoredUsers();
    
    // Find user
    const userIndex = storedUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('ไม่พบผู้ใช้งานนี้');
    }
    
    // Block user
    const userToBlock = storedUsers[userIndex];
    storedUsers[userIndex] = { ...userToBlock, isBlocked: true };
    saveStoredUsers(storedUsers);
    
    // Log activity
    if (currentUser) {
      await logActivity(currentUser, 'account-blocked', `บล็อคผู้ใช้งาน: ${userToBlock.name} (${userToBlock.email})`);
    }
    
    console.log("User blocked successfully:", userToBlock);
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
};

export const unblockUser = async (currentUser: User | null, userId: string) => {
  try {
    // Get stored users
    const storedUsers = getStoredUsers();
    
    // Find user
    const userIndex = storedUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('ไม่พบผู้ใช้งานนี้');
    }
    
    // Unblock user
    const userToUnblock = storedUsers[userIndex];
    storedUsers[userIndex] = { ...userToUnblock, isBlocked: false };
    saveStoredUsers(storedUsers);
    
    // Log activity
    if (currentUser) {
      await logActivity(currentUser, 'account-unblocked', `ปลดบล็อคผู้ใช้งาน: ${userToUnblock.name} (${userToUnblock.email})`);
    }
    
    console.log("User unblocked successfully:", userToUnblock);
  } catch (error) {
    console.error('Error unblocking user:', error);
    throw error;
  }
};

export const makeAdmin = async (currentUser: User | null, userId: string) => {
  try {
    // Get stored users
    const storedUsers = getStoredUsers();
    
    // Find user
    const userIndex = storedUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('ไม่พบผู้ใช้งานนี้');
    }
    
    // Make admin
    const userToPromote = storedUsers[userIndex];
    storedUsers[userIndex] = { ...userToPromote, isAdmin: true };
    saveStoredUsers(storedUsers);
    
    // Log activity
    if (currentUser) {
      await logActivity(currentUser, 'admin-granted', `เพิ่มสิทธิ์ผู้ดูแลให้: ${userToPromote.name} (${userToPromote.email})`);
    }
    
    console.log("User promoted to admin successfully:", userToPromote);
  } catch (error) {
    console.error('Error making user admin:', error);
    throw error;
  }
};

export const removeAdmin = async (currentUser: User | null, userId: string) => {
  try {
    // Get stored users
    const storedUsers = getStoredUsers();
    
    // Find user
    const userIndex = storedUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('ไม่พบผู้ใช้งานนี้');
    }
    
    // Remove admin
    const userToDemote = storedUsers[userIndex];
    storedUsers[userIndex] = { ...userToDemote, isAdmin: false };
    saveStoredUsers(storedUsers);
    
    // Log activity
    if (currentUser) {
      await logActivity(currentUser, 'admin-revoked', `ถอดถอนสิทธิ์ผู้ดูแลของ: ${userToDemote.name} (${userToDemote.email})`);
    }
    
    console.log("Admin rights removed successfully:", userToDemote);
  } catch (error) {
    console.error('Error removing admin rights:', error);
    throw error;
  }
};
