import react, { createContext, useContext, useEffect, useState } from "react";
import PreLoad from "../components/preload/PreLoad";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function isAuthenticated() {
      try {
        let authUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/auth`;
        const fetchUser = await fetch(authUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (fetchUser.ok) {
          let userData = await fetchUser.json();
          if(userData.success){
            setUser(userData.user);
          }else{
            setUser(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    isAuthenticated();
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {!loading ? children : <PreLoad />}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);