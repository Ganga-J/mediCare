import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    const [user, setUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    const login = (jwt, userData) => {
        localStorage.setItem("token", jwt);
        setToken(jwt);
        setUser(userData || null);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        if (token) {
            const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
            const newSocket = io(socketUrl, {
                auth: { token },
            });
            newSocket.on("online users", setOnlineUsers);
            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        } else {
            setSocket(null);
            setOnlineUsers([]);
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, user, login, logout, onlineUsers, socket }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}