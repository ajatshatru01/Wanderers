import { useState, createContext } from "react";

export const AuthContext = createContext();

function Authorization({ children }) {
    const [user, setUser] = useState(()=>{
        const stored = sessionStorage.getItem("user");
        return stored? JSON.parse(stored): null;
    });

    const login = (userData) =>{
        setUser(userData);
        sessionStorage.setItem("user", JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem("user");
    }

    return (
        <AuthContext.Provider value = {{user, login, logout}} >
            {children}
        </AuthContext.Provider>
    )
}

export default Authorization;