
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { createDefaultAdminIfNeeded, getAllUsersFromStorage, addUserToStorage, removeUserFromStorage, updateUserBlockStatus, updateUserAdminStatus } from '@/services/userService';
import { loginUser, registerUser, logoutUser, checkExistingSession } from '@/services/authService';
import { logUserActivity, getUserActivitiesFromStorage } from '@/services/activityLogger';

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
    const initializeAuth = async () => {
      try {
        // Check if there's an existing session
        const existingUser = checkExistingSession();
        if (existingUser) {
          setUser(existingUser);
        }
        
        // Initialize default admin if needed
        createDefaultAdminIfNeeded();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Wrap the service functions to handle user state
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await loginUser(email, password);
      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const registeredUser = await registerUser(email, password, name);
      setUser(registeredUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser(user);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Admin functions
  const getAllUsers = async () => {
    return await getAllUsersFromStorage();
  };

  const getUserActivities = async () => {
    return await getUserActivitiesFromStorage();
  };

  const addUser = async (email: string, password: string, name: string, isAdmin: boolean) => {
    await addUserToStorage(user, email, password, name, isAdmin);
  };

  const removeUser = async (userId: string) => {
    await removeUserFromStorage(user, userId);
  };

  const blockUser = async (userId: string) => {
    await updateUserBlockStatus(user, userId, true);
  };

  const unblockUser = async (userId: string) => {
    await updateUserBlockStatus(user, userId, false);
  };

  const makeAdmin = async (userId: string) => {
    await updateUserAdminStatus(user, userId, true);
  };

  const removeAdmin = async (userId: string) => {
    await updateUserAdminStatus(user, userId, false);
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
        logActivity: (action: string, details: string) => logUserActivity(user, action, details),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
