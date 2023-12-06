import React, { useContext, createContext, useEffect, useState } from "react";
import { getUsername } from "../utils/assistantCanister";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [username, setUsername] = useState("");

  const retreiveUsername = async () => {
    if (window.auth.principalText && window.auth.isAuthenticated) {
      const username = await getUsername(window.auth.principalText);
      console.log(username);
      setUsername(username);
    }
  };

  useEffect(() => {
    retreiveUsername();
  }, [window.auth.principalText, window.auth.isAuthenticated]);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
