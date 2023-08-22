import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    // onAuthStateChanged is a method provided by Firebase Authentication that allows you to set up a listener to monitor changes in the user's authentication state.
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log(user);
    });
    
    // clean up functions to avoid memory leaking in real-time operation
    return () => {
      unsub();
    };
  }, []);

  return (
    // Any component that we wrap inside provider will be able to use this value
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};


// This code defines an authentication context and provider in React. It creates an AuthContext using 
// React's createContext function. The AuthContextProvider component sets up an authentication state 
// using the useState and useEffect hooks from React.

// Overall, this code sets up an authentication context that provides access to the current user's 
// information throughout the application, and it automatically updates the user information when the
// authentication state changes.

// No need to worry about cookies, sessions. Firebase will handle everything

