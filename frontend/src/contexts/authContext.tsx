import { axiosInst } from "@/api/axios";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    token: string | null;
    user_id?: number;
    username?: string;
    isOrganizer?: boolean;
    login: (acces_token: string, refresh_token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface JwtPayload {
    [key: string]: any;
    sub?: string;
    id?: number;
    org?: boolean;
    exp?: number;
}

const parseJwt = (token: string): JwtPayload => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );

    return JSON.parse(jsonPayload) as JwtPayload;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("accesToken"),
    );


    const login = (acces_token: string, refresh_token: string) => {
        localStorage.setItem("accesToken", acces_token);
        localStorage.setItem("refreshToken", refresh_token);
        axiosInst.defaults.headers.Authorization = `Bearer ${acces_token}`;
        setToken(acces_token);
    };

    const logout = () => {
        localStorage.removeItem("accesToken");
        localStorage.removeItem("refreshToken");
        setToken(null);
    };

    const [contextValue, setContextValue] = useState<AuthContextType>({
        token, login, logout
    });


    useEffect(() => {
        const getTokenPayload = (): { user_id?: number; username?: string; isOrganizer?: boolean } => {
            if (!token) return {};
            try {
                const payload = parseJwt(token);
                return {
                    user_id: payload.id,
                    username: payload.sub,
                    isOrganizer: payload.org || false
                };
            } catch (error) {
                console.error('Failed to parse JWT', error);
                return {};
            }
        };

        setContextValue((prev) => ({ ...prev, ...getTokenPayload() }));

    }, [token]);


    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
