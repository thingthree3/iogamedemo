import { deepFreeze } from "./utils/helperFunctions.js";

export default deepFreeze({
    Player: {
        actionKeyMap: {
            ArrowDown: "down",
            ArrowLeft: "left",
            ArrowRight: "right",
            ArrowUp: "up",
            KeyW: "up",
            KeyA: "left",
            KeyD: "right",
            KeyS: "down",
            mouse: "mouse"
        },
        hitboxRadius: 20
    },
    EntityTypes: {
        PLAYER: 0,
        TREE: 1
    }
});