import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import onConnection from './routes.js';
import Game from '../classses/Game.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {allowEIO3: true });

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => res.sendFile(join(__dirname, '/../../frontend/index.html')));
app.use('/frontend', express.static(__dirname + '/../../frontend/'));

const game = new Game(io);
io.on("connection", onConnection(game));

export {game, server};