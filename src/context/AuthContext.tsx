import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { StorageService, STORAGE_KEYS } from '@/services/storageService';
import { DEMO_USERS } from '@/utils/mockData';
import { LoginFormData, RegisterFormData } from '@/utils/validators';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (data: LoginFormData) => Promise<User>;
  register: (data: RegisterFormData) => Promise<User>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  forgotPassword: (email: string) => Promise<boolean>;
  updateProfile: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REGISTERED_USERS_KEY = 'edusphere_v1_registered_users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Default to the demo student or saved session
    const savedSession = StorageService.get<User | null>(STORAGE_KEYS.SESSION, null);
    if (savedSession) return savedSession;
    // By default, start logged in as the Admin or Student for immediate interactive exploration
    return DEMO_USERS[0]; // Admin by default for full privileges
  });

  useEffect(() => {
    if (user) {
      StorageService.set(STORAGE_KEYS.SESSION, user);
    } else {
      StorageService.remove(STORAGE_KEYS.SESSION);
    }
  }, [user]);

  const login = async (data: LoginFormData): Promise<User> => {
    // Check registered users first
    const registeredUsers = StorageService.get<User[]>(REGISTERED_USERS_KEY, []);
    const allUsers = [...DEMO_USERS, ...registeredUsers];

    const found = allUsers.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (!found) {
      // Allow demo login if email matches demo format or throw error
      throw new Error('Invalid email or password. You may use one of the 1-click demo accounts.');
    }

    setUser(found);
    return found;
  };

  const register = async (data: RegisterFormData): Promise<User> => {
    const registeredUsers = StorageService.get<User[]>(REGISTERED_USERS_KEY, []);
    const allUsers = [...DEMO_USERS, ...registeredUsers];

    if (allUsers.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
      bio: `Enthusiastic ${data.role} member of EduSphere.`,
      enrolledCourseIds: [],
      assignedCourseIds: [],
    };

    StorageService.set(REGISTERED_USERS_KEY, [...registeredUsers, newUser]);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    StorageService.remove(STORAGE_KEYS.SESSION);
  };

  const switchDemoRole = (role: UserRole) => {
    const demo = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setUser(demo);
  };

  const forgotPassword = async (_email: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    return true;
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user ? user.role : null,
        login,
        register,
        logout,
        switchDemoRole,
        forgotPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
