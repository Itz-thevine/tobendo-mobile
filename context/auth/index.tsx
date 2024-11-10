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
  isSeller?: boolean;
  setIsSeller: (isSelller?: boolean) => void;
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
  setIsSeller: () => {},
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
  const [isSeller, setIsSeller] = useState<boolean | undefined>(undefined);

  const [JWTtoken, setJWTtoken] = useState<string>('')

  const loadUserData = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const userToken = await AsyncStorage.getItem('userToken');
      const isSeller = await AsyncStorage.getItem('userIsSeller');
      let email: string | undefined;
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        email = parsedUser?.email;
        setUser(parsedUser);
        setIsAuthenticated(true);
        setJWTtoken(parsedUser?.access_token);
      }

      setEmail(email ?? '');
      setJWTtoken(userToken ?? '');
      setIsSeller(isSeller === 'true' ? true : false);
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
    loadUserData();
  }, [loadUserData]);

  const logout = useCallback(async () => {
    setIsAuthenticated(false);
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('userToken');
    setUser(null);
    setEmail('');
    setIsSeller(undefined);
    setJWTtoken('')
  }, [loadUserData]);

  const SetOTP = (otp: any) => {
    setOtp(otp)
  }

  const SetEmail = (email: string) => {
    setEmail(email)
  }

  const SetJWTtoken = async (token: string) => {
    await AsyncStorage.setItem('userToken', token);
    setJWTtoken(token)
  }
  const handleSetIsSeller = async (isSeller?: boolean) => {
    await AsyncStorage.setItem('userIsSeller', isSeller ? 'true' : 'false');
    setIsSeller(isSeller);
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
        },
        isSeller,
        setIsSeller: handleSetIsSeller,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
