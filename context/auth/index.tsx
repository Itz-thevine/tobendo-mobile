import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href } from 'expo-router';
import { otpType } from '@/hooks/api/user/sendUserOtp';

type continueProps = {
  route?: Href;
  otpType?: otpType;
  set?: (setProps?: Omit<continueProps, 'set'>) => void;
};
// Define the shape of the context value
type AuthContextType = {
  isAuthenticated: boolean;
  user: any;
  login: (user: any) => void;
  logout: () => void;
  SetOTP: (otp: any) => void;
  otp: any;
  SetEmail: (otp: any) => void;
  email: string;
  JWTtoken: string;
  SetJWTtoken: (token: any) => void;
  continue?: continueProps,
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  SetOTP: () => {},   
  otp: () => {},   
  email: '',
  SetEmail: () => {},
  JWTtoken: '',
  SetJWTtoken: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null >(null);
  const [otp, setOtp] = useState();
  const [email, setEmail] = useState<string>('');
  const [continueProps, setContinueProps] = useState<continueProps | undefined>(undefined);

  const [JWTtoken, setJWTtoken] = useState<string>('')

  const loadUserData = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const email = await AsyncStorage.getItem('email');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser);
        setIsAuthenticated(true);
        setJWTtoken(parsedUser?.access_token);
      }
      if(email){
        setEmail(email);
      }
    } catch (error) {
      console.error('Failed to load user data', error);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const login = useCallback(async (user: any) => {
    setIsAuthenticated(true);
    setUser(user);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await AsyncStorage.setItem('email', email);
    loadUserData();
  }, [loadUserData]);

  const logout = useCallback(async () => {
    setIsAuthenticated(false);
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('email');
    setUser(null);
    setEmail('');
    loadUserData();
  }, [loadUserData]);

  const SetOTP = (otp: any) => {
    setOtp(otp)
  }

  const SetEmail = (email: string) => {
    setEmail(email)
  }

  const SetJWTtoken = (token: string) => {
    setJWTtoken(token)
  }

  return (
    <AuthContext.Provider value={{
        isAuthenticated, 
        user, 
        login, 
        logout, 
        SetOTP, 
        otp, 
        email , 
        SetEmail,
        JWTtoken, 
        SetJWTtoken,
        continue: {
          ...continueProps,
          set: setContinueProps,
        }
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
