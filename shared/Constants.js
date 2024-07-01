import { deepFreeze } from "../shared/utils.js";

const Constants = deepFreeze({
    playerConstants: {
        radius: 20
    },
    EntityTypes: {
        PLAYER: 0,
        TREE: 1
    }
});

export default Constants;