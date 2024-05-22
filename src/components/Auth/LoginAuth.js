import { useState } from "react";

const useAuthentication = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null); // Add user role state

  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();

        setIsLoggedIn(true);
        setUserId(data.id);
        setUserRole(data.role); // Set user role

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error logging in:", error);
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setUserRole(null);
  };

  return { isLoggedIn, userId, userRole, login, logout };
};

export default useAuthentication;
