import SharedConstants from "../../../../../shared/Constants.js";
import BackendConstants from "./../../../utils/Constants.js";
import { Ball, Vector, Box, Rectangle } from "../../../../../shared/physics.js";
import { getRandomElement } from "../../../../../shared/utils/helperFunctions.js";
import Entity from "../Entity.js";
import { Tool } from "./Tools.js";
import Timer from "../../../../../shared/utils/Timer.js";
import toolsData from "../../../../resources/toolsData.json" assert { type: "json" };
import Game from "../../Game.js";
import Constants from "./../../../utils/Constants.js";

export default class Player extends Entity {
    uverifiedKicktimer = 100;
    actionKeys = new Map([
        ["up", false],
        ["down", false],
        ["right", false],
        ["left", false],
        ["rightClick", false],
        ["leftClick", false],
    ]);
    /**@type {Map<string, Timer>} */
    #timers = new Map([
        ["messageCoolDown", new Timer(1000 / Constants.Game.FPS * 5)],
    ]);
    /**@type {SocketIO.Socket} */
    socket = null
    rotation = 0;
    socketActivity = 20;
    // Game states
    gameStates = Object.freeze({
        PLAYING: Symbol("playing")
      });
    state = "normal";
    #hp = 100;
    #score = 0;
    /**@type {Tool} */
    tool = null;
    // /**@type {Map<string, Tool>} */
    // tools = new Map([
    //     ["axe", new Tool(0, 0, 0)],
    // ]);
    name = getRandomElement([
        "john doe",
        "jane doe",
        "joe doe",
        "jim doe",
        "jimmy doe",
        "james doe",
        "jack doe",
        "jason doe",
        "cookie doe",
    ]);

    #afkKickTimeout = 0;
    /**
     * @param {SocketIO.Socket} socket
     * @param {number} x
     * @param {number} y 
     */
    constructor(socket, x, y) {
        super(new Ball(x, y, SharedConstants.Player.hitboxRadius, 1000), false, 100);
        this.socket = socket;
        this.hitbox.friction = 0.15;
        this.hitbox.maxSpeed = 20;

        // this.#initTool();
        this.tool = new Tool(this);
        this.tool.set(toolsData.tools.swords);
        // this.tool = this.tools.get("axe");
    }

    disconnect(){
        // console.log(`Player ${this.socket.id} disconnected`);
        this.socket?.disconnect();
        this.isMarkedForDeletion = true;
    }

    /**
     * @param {Player} player 
     * @returns {boolean}
     */
    static updateAndFilterPlayers(player) {
        player.socketActivity--;
        // make sure the player isn't spamming server with requests
        // if (player.socketActivity >= BackendConstants.Player.MaxSocketActivity || player.socketActivity <= 0) {
        //   player.disconnect();
        //   console.log(`Player ${player.socket.id} disconnected due to ${player.socketActivity <= 0 ? "inactivity" : "spam" }`);
        //   return false;
        // }
        player.update();
        return !player.isMarkedForDeletion;
      }

    #handleMovementKey(){
        this.hitbox.acc.x = 0;
        this.hitbox.acc.y = 0;
        // make sure player isn't pressing two opposite keys at the same time
        if(this.actionKeys.get("left") != this.actionKeys.get("right")){
            if(this.actionKeys.get("left"))
                this.hitbox.acc.x = -BackendConstants.Player.movementAcceleration;
            if(this.actionKeys.get("right"))
                this.hitbox.acc.x = BackendConstants.Player.movementAcceleration;
        }
        
        // make sure player isn't pressing two opposite keys at the same time
        if(this.actionKeys.get("up") == this.actionKeys.get("down"))
            return;
        if(this.actionKeys.get("up"))
            this.hitbox.acc.y = -BackendConstants.Player.movementAcceleration;
        if(this.actionKeys.get("down"))
            this.hitbox.acc.y = BackendConstants.Player.movementAcceleration;
    }
    /**
     * @template {Entity} T
     * @param {T} entity 
     * @param {number} damage
     * @returns {boolean}
     */
    hit(entity, damage){
        if(super.hit(entity, damage)){
            this.state = "hit";
            setTimeout(() => this.state = "normal", 1009);
            return true;
        }
        return false;
    }

    /**
     * 
     * @param {Player} player 
     * @returns {{id: string; x: number; y: number; rotation: number; name: string; tool: { x: number; y: number; width: number; height: number; rotation: number; }}}
     */
    static playerToData(player) {
        return {
            id: player.socket.id,
            x: player.hitMoveOffsetX,
            y: player.hitMoveOffsetY,
            radius: player.hitbox.comp[0].r,
            rotation: player.rotation,
            name: player.name,
            state: player.state,
            tool: Player.playerToolHitboxToData(player.tool)
        };
    }

    /**
     * 
     * @param {Tool} tool
     * @returns 
     */
    static playerToolHitboxToData(tool) {
        return {
            x: tool.hitbox.pos.x,
            y: tool.hitbox.pos.y,
            width: tool.hitbox.width,
            height: tool.hitbox.height,
            rotation: tool.hitbox.angle,
            imageSprite: {
                x: tool.displayedImageCenterPosition.x,
                y: tool.displayedImageCenterPosition.y,
                rotation: tool.hitbox.angle
            }
        };
    }

    /**
     * @param {number} rotation
     */
    setPlayerRotation(rotation){
        // console.log(typeof this.rotation == "number");
        if(typeof this.rotation == "number")
            this.rotation = rotation;
    }

    /**
     * 
     * @param {{key: string, state: boolean}} param0 
     */
    setActionKey({key, state}){
        if(!(typeof state === "boolean")) return;
        if(!SharedConstants.Player.actionKeyMap.hasOwnProperty(key)) return;
        this.actionKeys.set(SharedConstants.Player.actionKeyMap[key], state);
        if(state && key === "mouse") this.tool.use();
    }

    update(){
        super.update();
        this.#handleMovementKey();
        this.tool.update();
        this.#timers.forEach((t) => t.update());
    }
}