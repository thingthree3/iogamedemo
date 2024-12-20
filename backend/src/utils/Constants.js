import { deepFreeze } from "./../../../shared/utils/helperFunctions.js";
// might turn thius into a json file, im not sure yet
export default deepFreeze({
    Player: {
        movementAcceleration: 0.1,
        MaxSocketActivity: 1000,
        hitOffsetMoveAmout: 20
    },
    Game: {
        FPS: 1000 / 60
    }
});
