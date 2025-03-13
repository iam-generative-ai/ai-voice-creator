
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { 
  login as authLogin, 
  register as authRegister, 
  logout as authLogout,
  checkSession 
} from '@/services/authService';
import { 
  getAllUsers as fetchAllUsers,
  addUser as createUser,
  removeUser as deleteUser,
  blockUser as blockUserService,
  unblockUser as unblockUserService,
  makeAdmin as makeAdminService,
  removeAdmin as removeAdminService,
  initializeDefaultAdmin
} from '@/services/userService';
import { 
  logActivity as logUserActivity,
  getUserActivities as fetchUserActivities 
} from '@/utils/activityLogger';

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
    const initialize = async () => {
      try {
        // Check for user session
        const savedUser = await checkSession();
        if (savedUser) {
          setUser(savedUser);
        }
        
        // Initialize default admin if no users exist
        initializeDefaultAdmin();
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const loggedInUser = await authLogin(email, password);
      setUser(loggedInUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const registeredUser = await authRegister(email, password, name);
      setUser(registeredUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authLogout(user);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logActivity = async (action: string, details: string) => {
    await logUserActivity(user, action, details);
  };

  // Admin functions wrapped with current user context
  const getAllUsers = async () => {
    return await fetchAllUsers();
  };

  const getUserActivities = async () => {
    return await fetchUserActivities();
  };

  const addUser = async (email: string, password: string, name: string, isAdmin: boolean) => {
    await createUser(user, email, password, name, isAdmin);
  };

  const removeUser = async (userId: string) => {
    await deleteUser(user, userId);
  };

  const blockUser = async (userId: string) => {
    await blockUserService(user, userId);
  };

  const unblockUser = async (userId: string) => {
    await unblockUserService(user, userId);
  };

  const makeAdmin = async (userId: string) => {
    await makeAdminService(user, userId);
  };

  const removeAdmin = async (userId: string) => {
    await removeAdminService(user, userId);
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
