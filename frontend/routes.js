import Game from "./Game.js";

/**
 * @returns {void}
 * @param {Game} game 
 */
export default function createRoutes(game){
    game.player.socket.on("id", function(data) {
        if(game.player.id) {
            game.player.socket.disconnect();
            location.reload();
        }
        console.log("Your id is " + data.id);
        game.player.id = data.id;
        setTimeout(() => game.player.socket.emit("verify"), 100);
    });
    
    game.player.socket.on("positionUpdate", 
        /**
         * @param {{x: number, y: number, mousePos:{ x: number, y: number }id: number, type: number}[]} entities
         */
        function(entities) {
            game.entities = entities;
    });
};