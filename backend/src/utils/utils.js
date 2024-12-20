import Entity from "../classses/entities/Entity.js";

/**
 * 
 * @param {Entity} entity 
 * @returns {{type: number; x: number; y: number; rotation: number; }}
 */
const entitysToData = entity => {
    // console.log(entity.hitbox.r)
    return  {
        radius: entity.hitbox.comp[0].r,
        type: entity.type,
        x: entity.hitMoveOffsetX,
        y: entity.hitMoveOffsetY,
        rotation: entity.hitbox.angle,
    };
};

export { entitysToData };