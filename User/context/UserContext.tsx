import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  fullName: string;
  email: string;
  photoURL?: string;
  gender: string;
  guardiansEmail: string;
  // Add other user details as needed
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  signOut: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_SERVER_URI}/user-info`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          if (response.status === 200) {
            const result = await response.json();
            setUser(result.user);
            await AsyncStorage.setItem("user", JSON.stringify(result.user));
          }
        }
      } catch (error) {
        console.error("Failed to load user from AsyncStorage:", error);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const saveUser = async () => {
      try {
        if (user) {
          await AsyncStorage.setItem("user", JSON.stringify(user));
        } else {
          await AsyncStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Failed to save user to AsyncStorage:", error);
      }
    };

    saveUser();
  }, [user]);

  const signOut = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/signout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.status === 200) {
        setUser(null);
        await AsyncStorage.removeItem("user");
        router.push("/signin");
      } else {
        console.error("Failed to sign out");
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
