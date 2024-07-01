import { deepFreeze } from "../../../../shared/utils.js";

const Constants = deepFreeze({
    movementAcceleration: 0.1,
    movementKeyMap: {
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        KeyW: "up",
        KeyA: "left",
        KeyD: "right",
        KeyS: "down",
    }
});

export default Constants;