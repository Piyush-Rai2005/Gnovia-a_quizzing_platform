import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import router from './router/route.js';
import connect from './database/conn.js';
import { setupMultiplayerSocket } from './Socket/multiserver.js';

dotenv.config();

const app = express();

/** app middlewares */
app.use(morgan('tiny'));
app.use(cors({
  origin: ['http://localhost:5173', process.env.FRONTEND_URL],
  credentials: true
}));
app.use(express.json());

/** Create server for both HTTP & Socket.IO */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
});

/** Setup socket handling */
setupMultiplayerSocket(io);

/** Routes */
app.get('/ping', (req, res) => res.send('pong'));

app.use('/api', router);
app.get('/', (req, res) => res.json('Get Request'));

/** Start server */
const port = process.env.PORT || 8000;

connect().then(() => {
  try {
    server.listen(port, () => {
      console.log(`✅ Server + WebSocket running at http://localhost:${port}`);
    });
  } catch (error) {
    console.log('❌ Cannot connect to the server');
  }
}).catch((error) => {
  console.log('❌ Invalid database connection');
});
