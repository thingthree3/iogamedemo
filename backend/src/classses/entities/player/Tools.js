import { Rectangle, Circle, Body, Vector } from "../../../../../shared/physics.js";
import Timer from "../../../../../shared/utils/Timer.js";
import Player from "./Player.js";
import LinkedList from "../../../../../shared/utils/LinkedList.js";

export class Equipable {
    /**@type {Player} */
    player;
    // possibly add another timer for a switch-to delay  
    useCooldown = new Timer();
    /**@type {Body} */
    hitbox;
    orbitationalRotation = 0;
    isInUse = false;
    /**@type {Vector} */
    displayedImageCenterPosition;
    /** 
    * @type {Readonly<{
    * hitbox: {type: "circle", radius: number} | {type: "rectangle", width: number, height: number} | {type: "polygon", points: Array<{x: number, y: number}>},
    * hitboxImageCenterOffsetRotation: number,
    * hitboxImageOffsetDistance: number,
    * orbitalDistance: number,
    * offsetRotation: number,
    * rotationalVelocity: number,
    * type: string,
    * useCooldown: number,
    * }>}
    */
    data;
    /**
     * 
     * @param {Player} player 
     */
    constructor(player) {
        this.player = player;
        this.displayedImageCenterPosition = player.hitbox.pos;
    }
    
    /**
     * 
     * @param {{x: number, y: number, type: "circle", radius: number} | {x: number, y: number, type: "rectangle", width: number, height: number} | {type: "polygon", x: number, y: number, points: Array<{x: number, y: number}>}} hitboxData 
     * @returns {Body}
     */
    static #createHitbox(hitboxData) {
        switch(hitboxData.type) {
            case "rectangle":
                // re think this because we can repersent a rectangle with just a line/4-points with some extra maths
                return new Rectangle(0, 0, hitboxData.width, hitboxData.height, hitboxData.width);
            case "circle":
                return new Circle(0, 0, hitboxData.radius);
            // case "polygon": // TODO implement this just in case
            //     return new Polygon(0, 0, hitboxData.polygon);
        }
        return null;
    }
    use() {
        this.isInUse = true;
    }

    /**
    * 
    * @param {Readonly<{
    * hitbox: {type: "circle", radius: number} | {type: "rectangle", width: number, height: number} | {type: "polygon", points: Array<{x: number, y: number}>},
    * hitboxImageCenterOffsetRotation: number,
    * hitboxImageOffsetDistance: number,
    * orbitalDistance: number,
    * offsetRotation: number,
    * rotationalVelocity: number,
    * type: string,
    * useCooldown: number,
    * }>} data 
    */
    set(data){
        if(!data) return;
        this.data = data;
        this.hitbox = Equipable.#createHitbox(data.hitbox);
        this.useCooldown.setNewTimer(data.useCooldown);
    }

    update() {
        // console.log("parent updates tool")
        this.useCooldown.update(1);
    }
}

export class Tool extends Equipable {
    animationDirectionModifier = -1; // tools have both a up and down animation(swinging)
    rotation = 0;
    /**
     * 
     * @param {Player} player 
     */
    constructor(player) {
        super(player);
    }

    /**
     * 
     * @param {Readonly<{
    * hitbox: {type: "circle", radius: number} | {type: "rectangle", width: number, height: number} | {type: "polygon", points: Array<{x: number, y: number}>},
    * hitboxImageCenterOffsetAngle,
    * hitboxImageOffsetDistance: number,
    * orbitalDistance: number,
    * offsetRotation: number,
    * rotationalVelocity: number,
    * type: string,
    * useCooldown: number,
    * }>} data 
    * @returns {void}
    */    
   set(data) {
       if(!data) return;
        super.set(data);
    }

    use() {
        if(this.isInUse) return;
        super.use();
        this.animationDirectionModifier = -1; // -1 = moving tool upwards, 1 = moving tool downwards
        const animationTime = Math.floor(this.data.useCooldown / 2);
        // switch the animation to the downwards direction after half the cooldown
        this.useCooldown.setNewTimer(animationTime, false, () => {
            this.animationDirectionModifier = 1;
            this.useCooldown.setNewTimer(animationTime, false, () => this.reset());
        });
    }

    reset() {
        this.isInUse = false;
        this.animationDirectionModifier = -1;
        this.rotation = 0;
        this.orbitationalRotation = 0;
        if(this.player.actionKeys.get("mouse"))
            setTimeout(() => this.use(), 200)
    }

    update() {
        // console.log(this.isInUse)
        // if(!this.isInUse) return;
        super.update();
        // rotation the clients image
        // this.rotation += this.rotationalVelocity * this.animationDirectionModifier;
        this.#updatePosition();
    }

    //      |
    // ---- V ---- probably a better way to do this XD
    #updatePosition() {
        // console.log(this.data.orbitationalRotation, this.data.maxOrbitalDistance, this.data.rotation, this.data.maxRotation)
        if(this.isInUse && this.orbitationalRotation > this.data.maxOrbitalDistance && this.rotation > this.data.maxRotation) {
            this.rotation += this.data.rotationalVelocity * this.animationDirectionModifier;
            this.orbitationalRotation += this.data.orbitationalRotationVelocity * this.animationDirectionModifier;
        }
        const   orbitalAngle = this.player.rotation + this.data.offsetRotation + this.orbitationalRotation,
                hitboxRotation = this.rotation + this.data.hitboxImageCenterOffsetRotation + this.player.rotation;
        this.displayedImageCenterPosition =  this.player.hitbox.pos.add(new Vector(
            this.data.orbitalDistance * Math.cos(orbitalAngle), 
            this.data.orbitalDistance * Math.sin(orbitalAngle)
        ));
        this.hitbox.pos = new Vector(
            this.displayedImageCenterPosition.x + this.data.hitboxImageOffsetDistance * Math.cos(hitboxRotation),
            this.displayedImageCenterPosition.y + this.data.hitboxImageOffsetDistance * Math.sin(hitboxRotation)
        );
        this.hitbox.angle = hitboxRotation;
        this.hitbox.getVertices(this.hitbox.angle);
    }
}

export class Gun extends Equipable {
    constructor() {
        
    }
}