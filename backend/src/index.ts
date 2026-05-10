import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

// Import routes
import tourRoutes from './routes/tours';
import flightRoutes from './routes/flights';
import hotelRoutes from './routes/hotels';
import authRoutes from './routes/auth';
import bookingRoutes from './routes/bookings';
import voucherRoutes from './routes/vouchers';
import reviewRoutes from './routes/reviews';
import blogRoutes from './routes/blogs';
import aiRoutes from './routes/ai';
import { createChatRouter } from './routes/chat';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Serve static images
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// API Routes
app.use('/api/tours', tourRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chat', createChatRouter(io));

// Bookings Notifications (Directly in index.ts to fix 404 issue)
app.get('/api/bookings/unread-count', async (req: Request, res: Response) => {
    try {
        const count = await prisma.booking.count({
            where: { adminRead: false }
        });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch unread count' });
    }
});

app.get('/api/bookings/recent-list', async (req: Request, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
                id: true,
                customerName: true,
                itemName: true,
                type: true,
                createdAt: true,
                adminRead: true
            }
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recent list' });
    }
});

app.post('/api/bookings/mark-all-read', async (req: Request, res: Response) => {
    try {
        await prisma.booking.updateMany({
            where: { adminRead: false },
            data: { adminRead: true }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark bookings as read' });
    }
});

app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'API is working' });
});

app.get('/', (req: Request, res: Response) => {
  res.send('Backend API is running...');
});

// Socket.IO Chat Logic
io.on('connection', (socket) => {
  // Join a specific chat room
  socket.on('join_room', (roomId: number) => {
    socket.join(`room_${roomId}`);
  });

  // Send a message
  socket.on('send_message', async (data: { roomId: number; senderId: number; senderRole: string; content: string }) => {
    try {
      const message = await prisma.chatMessage.create({
        data: {
          roomId: data.roomId,
          senderId: data.senderId,
          senderRole: data.senderRole,
          content: data.content,
        },
      });

      // Update room's updatedAt
      await prisma.chatRoom.update({
        where: { id: data.roomId },
        data: { updatedAt: new Date() },
      });

      // Broadcast to all in the room
      io.to(`room_${data.roomId}`).emit('receive_message', message);

      // Notify admin panel of new message (for badge/notification)
      io.emit('new_message_notification', { roomId: data.roomId, message });
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    // cleanup if needed
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
