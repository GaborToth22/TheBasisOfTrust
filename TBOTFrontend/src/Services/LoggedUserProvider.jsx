import React, { createContext, useState, useContext, useEffect } from 'react';

const LoggedUserContext = createContext();

export const LoggedUserProvider = ({ children }) => {
    const [loggedUser, setLoggedUser] = useState(() => {
        try {
            const userJSON = localStorage.getItem('loggedUser');
            return userJSON ? JSON.parse(userJSON) : null;
          } catch (error) {
            console.error('Error parsing loggedUser data from localStorage:', error);
            return null;
          }
        });
        
      useEffect(() => {
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
      }, [loggedUser]);

  return (
    <LoggedUserContext.Provider value={{ loggedUser, setLoggedUser }}>
      {children}
    </LoggedUserContext.Provider>
  );
};

export const useLoggedUser = () => useContext(LoggedUserContext);
