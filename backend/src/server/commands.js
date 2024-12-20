import Game from "../classses/Game.js";
/**
 * @param {Game} game
 */
export default function createCommands(game) {
    /**
     * @param {string} text 
     */
    return function(text) {
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
                for(const playerNode of game.players) {
                    console.log("90123u7");
                    console.log(pkg.yellow("Name: " + playerNode.value.name + " | Score:" + playerNode.value.score + " | ID:" + playerNode.value.socket.id + " | X: " + playerNode.value.hitbox.pos.x + " | X: " + playerNode.value.hitbox.pos.y));   
                }
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
            case "clients":
                console.log(game.server.sockets.sockets)
                // console.log(pkg.yellow(game.server.sockets.sockets + " Players online"));
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
    };
}
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