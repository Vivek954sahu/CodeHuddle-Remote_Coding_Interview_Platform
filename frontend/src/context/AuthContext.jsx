import { createContext, useContext, useState } from "react";
import { loginUser, logoutUser, registerUser } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );

    const [loading, setLoading] = useState(false);
    
    const isAuthenticated = !!user;

    // Register
    const register = async (data) => {
        try {
            setLoading(true);

            const res = await registerUser(data);

            const { accessToken, user } = res.data.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("user", JSON.stringify(user));

            setUser(user);


        } catch (error) {

            throw error.response?.data?.message || "Sign up Failed!";

        } finally {

            setLoading(false);

        }
    };

    // Login
    const login = async (data) => {
        try {
            setLoading(true);

            const res = await loginUser(data);

            const { accessToken, user } = res.data.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("user", JSON.stringify(user));

            setUser(user);


        } catch (error) {

            throw error.response?.data?.message || "Login Failed!";

        } finally {

            setLoading(false);

        }
    };

    // Log out
    const logout = async() => {

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        setUser(null);

    }

    const value = {
        user,
        register,
        login,
        logout,
        loading,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);