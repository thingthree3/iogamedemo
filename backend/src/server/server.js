import express from 'express';
// import * as BrotliPromise from '../../../brotliFixer.cjs';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import onConnection from './routes.js';
import Game from '../classses/Game.js';

// const brotli = await BrotliPromise.default;
const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
    console.log(req.url);
    return res.sendFile(join(__dirname, '/../../../frontend/index.html'));
});
app.use('/frontend', express.static(__dirname + '/../../../frontend/'));
app.use('/shared', express.static(__dirname + '/../../../shared/'));

const game = new Game(io);
/**
 * @param {string} routeName 
 * @param {Object} data 
 */
io.customEmit = function(routeName, data) {
    if(!data) {
        io.emit(routeName);
        return;
    }
    // io.emit(routeName, brotli.compress(Buffer.from(JSON.stringify(data))));
    io.emit(routeName, Buffer.from(JSON.stringify(data)));
};
io.on("connection", onConnection(game));
// console.log(brotli.compress(Buffer.from(JSON.stringify({message: "Connected"}))));
export {game, server};