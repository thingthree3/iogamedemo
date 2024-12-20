import { deepFreeze } from "../../shared/utils/utils.js"
/**@param {object} obj */
const createUpwardRelationship = function(obj){  
    const propNames = Object.getOwnPropertyNames(obj);
    for (let i = 0; i < propNames.length; i++) {
        const propName = propNames[i];
        const value = obj[propName];
        if (value && typeof value === "object") {
            createUpwardRelationship(value).parent = obj;
        }
    }
    return obj;
};
export default deepFreeze({
    swords: {
        woodeSword: {
            hitbox: {type: "rectangle", width: 12, height: 24},
            hitboxImageCenterOffsetRotation: 0,
            hitboxImageOffsetDistance: 5,
            offsetRotation: 0,
            orbitalDistance: 20,
            rotationalVelocity: 0.1,
            type: "Tool",
            useCooldown: 1000,
        }
    },
    1: {}
});