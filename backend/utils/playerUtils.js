import Player from "../classses/entities/player/Player.js";

/**
 * 
 * @param {Player} player 
 * @returns 
 */
const playerToData = player => {
    return {
      id: player.socket.id,
      x: player.hitbox.pos.x,
      y: player.hitbox.pos.y,
      mousePos: player.mousePosition,
      rotationAngle: player.hitbox.angle
    };
};

/**
 * @param {Player} player 
 * @returns {boolean}
 */
const filterAndUpdatePlayers = player => {
    player.update();
    return !player.isMarkedForDeletion;
};

export { filterAndUpdatePlayers, playerToData };