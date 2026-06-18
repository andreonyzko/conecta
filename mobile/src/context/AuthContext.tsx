import { AuthUser } from "@/types/AuthUser";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router"
import { authService } from "@/services/AuthService";

interface AuthContextType {
  user: AuthUser | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  login(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<AuthUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user;

  async function login(email: string, password: string) {
    const {user, token} = await authService.login(email, password);
    setUser(user);
    await SecureStore.setItemAsync("auth_user", JSON.stringify(user));
    await SecureStore.setItemAsync("token", token);
    router.replace("/");
  }

  async function signOut() {
    setUser(undefined);
    await SecureStore.deleteItemAsync("auth_user");
    await SecureStore.deleteItemAsync("token");
    router.replace("/");
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
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
