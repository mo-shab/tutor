'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Define the shape of the user object and the context
interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (fullName: string, email: string, password: string) => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Check for user session on initial load
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/users/me', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include', // *** FIX: Send cookies with the request ***
                });

                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkUserSession();
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include', // Good practice to include this
        });
        const data = await res.json();
        if (res.ok) {
            setUser(data.user);
            router.push('/dashboard');
        } else {
            throw new Error(data.message || 'Login failed');
        }
    };

    const register = async (fullName: string, email: string, password: string) => {
        const res = await fetch('http://localhost:8000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password }),
        });
        const data = await res.json();
        if (res.ok) {
            router.push('/login');
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    };

    const logout = async () => {
        await fetch('http://localhost:8000/api/auth/logout', {
            method: 'POST',
            credentials: 'include', // *** FIX: Send cookies with the request ***
        });
        setUser(null);
        router.push('/login');
    };

    // Show a global loader while checking for session
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-slate-500" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

// Create a custom hook for easy context access
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}