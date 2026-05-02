import { createActor } from "@/backend";
import type { UserProfile } from "@/types";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoggingIn: boolean;
  principal: string | null;
  profile: UserProfile | null;
  login: () => void;
  logout: () => void;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  isInitializing: true,
  isLoggingIn: false,
  principal: null,
  profile: null,
  login: () => {},
  logout: () => {},
  refetchProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    identity,
  } = useInternetIdentity();
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const principal = identity?.getPrincipal().toString() ?? null;

  useEffect(() => {
    if (!isAuthenticated || !actor) {
      setProfile(null);
      return;
    }
    actor
      .getCallerUserProfile()
      .then((p) => setProfile(p ?? null))
      .catch(() => setProfile(null));
  }, [isAuthenticated, actor]);

  const refetchProfile = async () => {
    if (!actor) return;
    try {
      const p = await actor.getCallerUserProfile();
      setProfile(p ?? null);
    } catch {
      setProfile(null);
    }
  };

  const logout = () => {
    clear();
    queryClient.clear();
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitializing,
        isLoggingIn,
        principal,
        profile,
        login,
        logout,
        refetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
