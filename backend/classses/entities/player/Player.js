import Constants from "./PlayerConstants.js";
import { Ball, Vector } from "../../../../shared/physics.js";
import Entity from "../Entity.js";

export default class Player extends Entity {
    uverifiedKicktimer = 100;
    mousePosition = new Vector(0, 0);
    #movementKeys = new Map([
        ["up", false],
        ["down", false],
        ["right", false],
        ["left", false],
    ]);
    /**@type {SocketIO.Socket} */
    socket = null
    #hp = 100;
    #size = 20;
    #score = 0;

    #afkKickTimeout = 0;
    /**
     * @param {SocketIO.Socket} socket
     * @param {number} x
     * @param {number} y 
     */
    constructor(socket, x, y) {
        // this.maxHp = 100;
        super(new Ball(x, y, 20, 3), 0);
        this.socket = socket;
    }

    disconnect(){
        // console.log(`Player ${this.socket.id} disconnected`);
        this.socket?.disconnect();
        this.isMarkedForDeletion = true;
    }

    #handleMovementKey(){
        this.hitbox.acc.x = 0;
        this.hitbox.acc.y = 0;
        // make sure player isn't pressing two opposite keys at the same time
        if(this.#movementKeys.get("left") != this.#movementKeys.get("right")){
            if(this.#movementKeys.get("left"))
                this.hitbox.acc.x = -Constants.movementAcceleration;
            if(this.#movementKeys.get("right"))
                this.hitbox.acc.x = Constants.movementAcceleration;
        }
        
        // make sure player isn't pressing two opposite keys at the same time
        if(this.#movementKeys.get("up") == this.#movementKeys.get("down"))
            return;
        if(this.#movementKeys.get("up"))
            this.hitbox.acc.y = -Constants.movementAcceleration;
        if(this.#movementKeys.get("down"))
            this.hitbox.acc.y = Constants.movementAcceleration;
    }

    /**
     * 
     * @param {number} mouseX 
     * @param {number} mouseY 
     */
    setMousePosition(mouseX, mouseY){
        this.mousePosition.set(mouseX, mouseY);
    }

    /**
     * 
     * @param {{key: string, state: boolean}} param0 
     */
    setMovementKey({key, state}){
        const movementKey = Constants.movementKeyMap[key];
        if(movementKey != undefined)
            this.#movementKeys.set(movementKey, state);
    }

    update(){
        this.#handleMovementKey();
        this.hitbox.reposition();
    }
}

// // import Constants from "./PlayerConstants.js";
// import Matter from "matter-js";
// import Game from "../../../Game.js";
// import { Ball } from "../../../utils/physics.js";
// import Entity from "../Entity.js";
// import Constants from "./PlayerConstants.js"

// export default class Player extends Entity {
//     uverifiedKicktimer = 100
//     setMovementKey = new Map([
//         ["up", false],
//         ["down", false],
//         ["right", false],
//         ["left", false],
//     ]);
//     // /**@type {Ball} */
//     // #hitbox = new Ball(200, 200, 20, 1);
//     /**@type {Matter.Body} */
//     #hitbox = null;
//     /**@type {SocketIO.Socket} */
//     socket = null
//     #hp = 100;
//     #size = 20;
//     #score = 0;

//     #afkKickTimeout = 0;
//     /**
//      * @param {Game} game
//      * @param {SocketIO.Socket} socket 
//      */
//     constructor(socket, game) {
//         // this.maxHp = 100;
//         super();
//         this.#hitbox = game.getPhysicsEngine().createShape("circle", 200, 200, 20);
//         this.#hitbox.acceleration = Matter.Vector.create(0, 0);
//         this.#hitbox.acceleration
//         this.socket = socket;
//     }

//     update(){
//         if(this.setMovementKey.get(left)){
//             this.#hitbox.acceleration.x = -Constants.movementAcceleration;
//         }
//         if(this.setMovementKey.get(up)){
//             this.#hitbox.acceleration.y = -Constants.movementAcceleration;
//         }
//         if(this.setMovementKey.get(right)){
//             this.#hitbox.acceleration.x = Constants.movementAcceleration;
//         }
//         if(this.setMovementKey.get(down)){
//             this.#hitbox.acceleration.y = Constants.movementAcceleration;
//         }
//         if(!this.setMovementKey.get("left") && !this.setMovementKey.get("right")){
//             this.acc.x = 0;
//         }
//         if(!this.setMovementKey.get("up") && !this.setMovementKey.get("down")){
//             this.acc.y = 0;
//         }
//     }
// }