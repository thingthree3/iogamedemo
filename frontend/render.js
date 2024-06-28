import Game from "./Game.js";

/**
 * @returns {void}
 * @param {CanvasRenderingContext2D} ctx
 * @param {Game} game
 */
const drawPlayers = function(ctx, game) {
    ctx.fillStyle = "#ededed";
    ctx.textAlign = "center";
    ctx.fillStyle = "#808080"
    ctx.font = "15px Arial";
    for (const entity of game.entities){
        // ctx.fillRect(entity.x, entity.y, entity.x + 50,entity.y + 50);
        ctx.beginPath();
        ctx.arc(entity.x, entity.y, 20, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
        // if(player.image){
        //     ctx.drawImage(player.image, 0, 0, 12, 24, entity.mousePos.x - 25, entity.mousePos.y - 25, 36, 72);
        //     // ctx.drawImage(player.image, player.x - 25, player.y - 25);
        //     // console.log(player.x, player.y)
        // }
        if(entity.id == game.player.id) 
            ctx.fillText("YOU ARE HERE", entity.x, entity.y - 10);
    }
}

/**
 * @returns {void}
 * @param {CanvasRenderingContext2D} ctx
 * @param {Game} game 
 * @param {number} deltaTime
 */
const render = function(ctx, game, deltaTime) {
    drawPlayers(ctx, game);
}

export default render;