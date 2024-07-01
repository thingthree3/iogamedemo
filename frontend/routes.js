import Game from "./Game.js";

/**
 * @returns {void}
 * @param {Game} game 
 */
export default function createRoutes(game){
    game.player.socket.on("id", function(data) {
        console.log("id", data.id);
        if(game.player.id) {
            game.player.socket.disconnect();
            location.reload();
        }
        console.log("Your id is " + data.id);
        game.player.id = data.id;
        setTimeout(() => game.player.socket.emit("verify", data.id), 2000);
    });
    
    game.player.socket.on("playersPositionUpdate", players => game.setPlayers(players));
    game.player.socket.on("staticEntitiesPositionUpdate", entities => game.setEntities(entities));
    // either reload or notify the client that the could not be verified and ask them reload the page themselves XD
    game.player.socket.on("reload", () => location.reload());
};