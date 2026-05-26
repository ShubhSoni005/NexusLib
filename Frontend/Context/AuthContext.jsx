import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nl_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    // Basic mock authentication: any valid email is accepted.
    // If name is not registered, extract it from email or default to "Student".
    const baseName = email.split('@')[0];
    const formattedName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
    
    const loggedUser = {
      email,
      name: formattedName,
      role: 'student'
    };
    
    setUser(loggedUser);
    localStorage.setItem('nl_user', JSON.stringify(loggedUser));
    return { success: true };
  };

  const signup = (name, email, password) => {
    const newUser = {
      email,
      name: name || 'Student',
      role: 'student'
    };
    
    setUser(newUser);
    localStorage.setItem('nl_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nl_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
