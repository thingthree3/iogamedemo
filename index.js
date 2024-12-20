import * as pp from './brotliFixer.cjs';
import pkg from 'colors/safe.js';
import dotenv from 'dotenv';
import createCommands from "./backend/src/server/commands.js"
import { game, server } from "./backend/src/server/server.js"
import seedrandom from 'seedrandom';

dotenv.config();
const debug = process.env.USER?.toLowerCase() === 'dev';
const port = process.env.PORT || 3000;

// this makes Math.random() more random
seedrandom(Date.now().toString() + "my favorite number is 42", { global: true });

if (debug) console.log("Running in debug mode");
if (process.env.PORT == undefined) console.log(pkg.blue(`No port defined using default (${port})`));
server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
  game.start();
});

// ---------- Commands ----------
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', createCommands(game));