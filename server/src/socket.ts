// server/src/socket.ts
import { Server, Socket } from 'socket.io';

// Export the map so it can be accessed by other services
export const userSocketMap = new Map<string, string>(); // Map<userId, socketId>

export const initializeSocketIO = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`A user connected: ${socket.id}`);

        const userId = socket.handshake.query.userId as string;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User ${userId} mapped to socket ${socket.id}`);
        }

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            // Remove user from the map on disconnect
            for (const [key, value] of userSocketMap.entries()) {
                if (value === socket.id) {
                    userSocketMap.delete(key);
                    break;
                }
            }
        });
    });
};
