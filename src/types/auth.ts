
// Define our user and authentication types for reuse across components
export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
}

export interface StoredUser extends User {
  password: string;
  isBlocked?: boolean;
  isAdmin?: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  getAllUsers: () => Promise<any[]>;
  getUserActivities: () => Promise<ActivityLog[]>;
  addUser: (email: string, password: string, name: string, isAdmin: boolean) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
  makeAdmin: (userId: string) => Promise<void>;
  removeAdmin: (userId: string) => Promise<void>;
  logActivity: (action: string, details: string) => Promise<void>;
}
