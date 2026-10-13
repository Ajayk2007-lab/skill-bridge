import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('sb_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sb_auth_token') ? true : false;
  });

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('sb_user_profile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('sb_user_profile');
    }
  }, [userProfile]);

  const loginUser = (email, name = 'Candidate') => {
    const profile = {
      name,
      email,
      targetRole: 'Full Stack Engineer',
      level: 'Undergraduate Senior',
      verifiedScore: 82
    };
    localStorage.setItem('sb_auth_token', 'jwt_sb_' + Date.now());
    setUserProfile(profile);
    setIsAuthenticated(true);
  };

  const logoutUser = () => {
    localStorage.removeItem('sb_auth_token');
    localStorage.removeItem('sb_user_profile');
    setUserProfile(null);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ userProfile, isAuthenticated, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);