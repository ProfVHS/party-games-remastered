import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

import {
  cardsSockets,
  clickTheBombSockets,
  connectionSockets,
  minigameSockets,
  playerSockets,
  roomSockets,
  turnSockets
} from '@sockets';

dotenv.config();

const SOCKET_PORT = process.env.SOCKET_PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const app = express();
app.use(cors());

const socketServer = createServer(app);

const io = new Server(socketServer, {
  pingInterval: 5000, // Send a ping every 5 seconds
  pingTimeout: 3000, // Wait 3 seconds for a response
  cors: {
    origin: '*', // TODO: Change this to frontend URL in production
    methods: ['GET', 'POST'],
  },
});

const handleModulesOnConnection = async (socket: Socket) => {
  connectionSockets(socket);
  roomSockets(socket);
  turnSockets(socket);
  playerSockets(socket);
  minigameSockets(socket);
  clickTheBombSockets(socket);
  cardsSockets(socket);

  socket.on('error', (err) => {
    console.error(`Socket error: ${err}`);
  });
};

io.on('connection', handleModulesOnConnection);

socketServer.listen(SOCKET_PORT, () => {
  console.log(`Socket server is running on port ${SOCKET_PORT}`);
});

app.use('/public', express.static(path.join(process.cwd(), 'public')));
registerFont(path.join(process.cwd(), 'public', 'SpicyRice-Regular.ttf'), { family: 'SpicyRice' });

// Generate roomCode on image
app.get('/room-image/:roomCode.png', async (req, res) => {
  const { roomCode } = req.params;
  const width = 1200;
  const height = 630;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const baseImage = await loadImage(path.join(process.cwd(), 'public', 'preview.png'));

  ctx.drawImage(baseImage, 0, 0, width, height);

  // Add roomCode text on the image
  ctx.font = 'bold 80px SpicyRice';
  ctx.fillStyle = '#5A189A';
  ctx.textAlign = 'center';
  ctx.fillText(`${roomCode}`, width / 2, height - 70);

  const buffer = canvas.toBuffer('image/png');
  res.setHeader('Content-Type', 'image/png');
  res.send(buffer);
});

// Dynamic meta tags for room
app.get('/:roomCode', async (req, res, next) => {
  const { roomCode } = req.params;
  const backendUrl = `${req.protocol}://${req.get('host')}`;
  const filePath = path.join(process.cwd(), '..', 'frontend', 'dist', 'index.html');

  const ua = req.get('user-agent') || '';
  const isBot = /facebookexternalhit|Twitterbot|Discordbot|Slackbot|LinkedInBot|TelegramBot|WhatsApp|Googlebot/i.test(ua);

  if (!isBot) {
    return next();
  }

  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Could not read index.html', err);
      return res.status(500).send('Server error');
    }

    const dynamicMetaTags = `
        <head>
          <title>PartyGames - Room ${roomCode}</title>
          <meta property="og:title" content="PartyGames" />
          <meta property="og:description" content="Join to the room and play with your friends!" />
          <meta property="og:image" content="${backendUrl}/room-image/${roomCode}.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:url" content="${FRONTEND_URL}/${roomCode}" />
          <meta property="og:type" content="website" />
          
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="PartyGames" />
          <meta name="twitter:description" content="Join to the room and play with your friends!" />
          <meta name="twitter:image" content="${backendUrl}/room-image/${roomCode}.png" />
        </head>
    `;

    const updatedHtml = htmlData.replace(/<head>[\s\S]*?<\/head>/, dynamicMetaTags);

    res.send(updatedHtml);
  });
});

app.use(express.static(path.join(process.cwd(), '..', 'frontend', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), '..', 'frontend', 'dist', 'index.html'));
});
