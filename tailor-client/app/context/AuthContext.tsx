'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import api from '@/lib/axios'
import { setAccessToken } from '@/lib/axios'

type User = {
  id: string
  name: string
  email: string
  isProfileCompleted: boolean
  fullName: string;
  shopName: string;
  tailorType: "both" | "stitch" | "alteration"; // or string if flexible
  phone: string;
  userPhoto: string;
  shopPhoto: string;
  role: "owner" | "staff" | "other";
  activeBoutique?: string;        // _id of currently active boutique
  boutiques?: string[];           // list of boutique _ids the owner has
  boutique?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)


useEffect(() => {
  const fetchUser = async () => {
    try {
    const res = await api.get("/api/user/get-user", {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err: any) {
      setUser(null);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setAccessToken(null);
      }
      if (err.response?.status === 403 && err.response?.data?.message === "Account disabled") {
        alert("Your account has been deactivated. Please contact the owner.");
        window.location.href = "/auth";
      }
    } finally {
      setLoading(false);
    }
  };
  fetchUser();
}, []);

const logout = async () => {
    setAccessToken(null)
    setUser(null)
    try {
      await api.post("/api/auth/logout", {}, { withCredentials: true })
    } catch (err) {
      console.error("Logout API failed", err)
    } finally {
      setAccessToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  return ctx ?? {
    user: null,
    loading: true,
    setUser: () => {},
    logout: async () => {}
  }
}

