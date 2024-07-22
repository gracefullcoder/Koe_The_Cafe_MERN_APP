import react, { createContext, useContext, useEffect, useState } from "react";

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
      {!loading ? children : <h1>Loading...</h1>}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);


// import React, { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem("user");
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   useEffect(() => {
//     async function isAuthenticated() {
//       try {
//         let authUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/auth`;
//         const fetchUser = await fetch(authUrl, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         });
//         if (fetchUser.ok) {
//           let userData = await fetchUser.json();
//           if (userData.success) {
//             setUser(userData.user);
//             localStorage.setItem("user", JSON.stringify(userData.user));
//           } else {
//             setUser(null);
//             localStorage.removeItem("user");
//           }
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     isAuthenticated();
//   }, []);

//   const setUserState = (newUser) => {
//     setUser(newUser);
//     if (newUser) {
//       localStorage.setItem("user", JSON.stringify(newUser));
//     } else {
//       localStorage.removeItem("user");
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser: setUserState }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuthContext = () => useContext(AuthContext);
