const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Kanswbo Socket.io wa kan3tiweh sela7iya (CORS) bax React y9dar ytasel bih
const io = new Server(server, {
    cors: {
        origin: "*", // Mni ghandeployiw ghanbdlo hadi l-lien d Vercel
        methods: ["GET", "POST"]
    }
});

// Mni kaytasel xi wahed (PC awla Tele)
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Mni PC awla Tele kaydkhol l room
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Mni kaysiftu les données dyal WebRTC binathom
    socket.on('send-signal', (data) => {
        // Kansifto signal l-taraf l-akhar li f nafs l-room
        socket.to(data.roomId).emit('receive-signal', {
            signal: data.signal,
            sender: socket.id
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server khdam f port ${PORT}`);
});