import pkg from 'colors/safe.js';
import dotenv from 'dotenv';
import { game, server } from "./backend/server/server.js"
import tmx from "./backend/node-tmx-parser/index.js";

dotenv.config();
const debug = process.env.USER?.toLowerCase() === 'dev';
const port = process.env.PORT || 3000;

if (debug) console.log("Running in debug mode");
if (process.env.PORT == undefined) console.log(pkg.blue(`No port defined using default (${port})`));
server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
  game.start();
});

tmx.parseFile("./backend/Tiled-levelEditor/level-data/demoLevel.tmx", function(err, map) {
  if (err) {
    if(debug)
        throw err;
    console.log(err);
    return;
  }
    console.log(map.layers.find(layer => layer.name === "entities"));
});

// ---------- Commands ----------
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(text) {
    let command = getCommand(text.trim());
    const args = getArgs(text.trim());
    switch (command) {
        case 'exit':
            console.log(pkg.yellow("Closing server"));
            process.exit();
        case "kickall":
            console.log(pkg.yellow("Kicking all players"));
            game.players.filter(player => {
                player.disconnect();
                return false;
            });
            break;
        case "list":
            console.log(pkg.yellow(game.players.size() + " Players online"));
            game.players.forEach(player => {
                console.log(pkg.yellow("Name: " + player.name + " | Score:" + player.score + " | ID:" + player.socket.id + " | X: " + player.hitbox.pos.x + " | X: " + player.hitbox.pos.y));
            });
            break;
        case "kick":
            if (args.length > 0) {
                const id = parseFloat(args[0]);
                const player = game.players.findAndDelete(player => player.socket.id === id);
                if (player) {
                    player.disconnect();
                    console.log(pkg.yellow("Kicked player with id " + id));
                } else {
                    console.log(pkg.yellow("Error: ID " + id + " not found"));
                }
            } else {
                console.log(pkg.yellow("Error: Player id needed"));
            }
            break;
        case "name":
            if (args.length > 1) {
                let id = parseFloat(args[0]);
                if (id > 0) {
                    let player = PLAYER_LIST[id];
                    if (player != undefined) {
                        let name = "";
                        for (let i = 0; i < args.length - 1; i++) {
                            name += args[i + 1];
                            if (i < args.length - 1) {
                                name += " ";
                            }
                        }
                        player.name = name;
                    } else {
                        console.log(pkg.yellow("Error: ID " + id + " not found"));
                    }
                } else {
                    console.log(pkg.yellow("Error: Invalid ID"));
                }
            } else {
                console.log(pkg.yellow("Error: Player id and name needed"));
            }
            break;
        case "help":
            console.log(pkg.yellow("help              Show help"));
            console.log(pkg.yellow("exit              Stops the server"));
            console.log(pkg.yellow("list              List all players"));
            console.log(pkg.yellow("kickall           Kick all players"));
            console.log(pkg.yellow("kick <id>         Kick player"));
            console.log(pkg.yellow("name <id> <name>  Change name of player"));
            break;
        default:
            console.log(pkg.yellow("Unknown command type help for help"));
            break;
    }
});

function getCommand(text) {
    let command = "";
    for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) == ' ') {
            i = text.length;
        } else {
            command += text.charAt(i);
        }
    }
    return command.toLowerCase();
}

function getArgs(text) {
    let args = [];
    let arg = "";
    let j = false;
    text += " ";
    for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) == ' ') {
            if (!j) {
                j = true;
            } else {
                args.push(arg);
            }
            arg = "";
        } else {
            arg += text.charAt(i);
        }
    }
    return args;
}