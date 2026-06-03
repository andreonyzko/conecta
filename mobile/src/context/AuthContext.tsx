import { AuthUser } from "@/types/AuthUser";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";

interface AuthContextType {
  user: AuthUser | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn(user: AuthUser): Promise<void>;
  signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  async function signIn(user: AuthUser) {
    setUser(user);
    await SecureStore.setItemAsync("auth_user", JSON.stringify(user));
  }

  async function signOut() {
    setUser(undefined);
    await SecureStore.deleteItemAsync("auth_user");
  }

  useEffect(() => {
    async function loadStoredUser() {
      try {
        const storedUser = await SecureStore.getItem("auth_user");
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (e) {
        console.log("Loading salved user error: " + e);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
