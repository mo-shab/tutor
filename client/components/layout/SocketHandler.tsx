// client/components/layout/SocketHandler.tsx
'use client';

import { useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';

export default function SocketHandler() {
    const { socket } = useSocket();
    const { logout } = useAuth();

    useEffect(() => {
        if (!socket) return;

        const handleForceLogout = () => {
            alert("Your account status has been changed by an administrator. You will now be logged out.");
            logout();
        };

        socket.on('forceLogout', handleForceLogout);

        return () => {
            socket.off('forceLogout', handleForceLogout);
        };
    }, [socket, logout]);

    // This component does not render anything
    return null;
}
