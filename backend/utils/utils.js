/**
 * 
 * @param {Entity} entity 
 * @returns {{type: number; x: number; y: number; angle: number; }}
 */
const entitysToData = entity => {
    // console.log(entity.hitbox.r)
    return  {
        radius: entity.hitbox.comp[0].r,
        type: entity.type,
        x: entity.hitbox.pos.x,
        y: entity.hitbox.pos.y,
        angle: entity.hitbox.angle,
    };
};

export { entitysToData };