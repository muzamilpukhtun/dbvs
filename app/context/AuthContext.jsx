"use client"
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [Arid, setArid] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    const expiresAt = localStorage.getItem('expiresAt');
  
    if (token && userData && expiresAt) {
      if (Date.now() > parseInt(expiresAt)) {
        logout(); // Token expired
      } else {
        const parsedUser = JSON.parse(userData);
        setIsLoggedIn(true);
        setUser(parsedUser);
        setArid(parsedUser.arid); // Set Arid directly from parsed user data
      }
    }
  }, []);


   const getCookie = (name) => {
    if (typeof document !== 'undefined') {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(';').shift()
    }
    return null
  }

  const setCookie = (name, value, days) => {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    const expires = `expires=${date.toUTCString()}`
    document.cookie = `${name}=${value}; ${expires}; path=/`
  }

  const login = async (arid, password) => {
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ arid, password }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        const expiresAt = Date.now() + 10 * 24 * 60 * 60 * 1000; // 10 days

        // Fetch full profile
        const profileRes = await fetch(`/api/users/profile?arid=${arid}`);
        const profileData = await profileRes.json();
  
        if (!profileRes.ok) {
          return { success: false, error: 'Failed to retrieve user profile' };
        }
  
        // Store the complete profile data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(profileData));
        localStorage.setItem('expiresAt', expiresAt.toString());
  
        setIsLoggedIn(true);
        setUser(profileData);
        setArid(profileData.arid);
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Failed to login' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('expiresAt');
    setIsLoggedIn(false);
    setUser(null);
    setArid(null);
  };




  const signup = async (userData) => {
    try {
      const res = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.ok) {
        return login(userData.arid, userData.password);
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Failed to signup' };
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, signup, Arid }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}