import { Body } from "../../../../shared/physics.js";
import Constants from "../../utils/Constants.js";

export default class Entity {
    static #hitAnimationFrames = 20;
    static #maxMoveHitOffsetPercent = 10;
    /**@type {Body} */
    hitbox = null;
    isMarkedForDeletion = false;
    #currentFrame = 0;
    #moveAngle = -1;
    health;
    hitCooldownIsActive = false;
    /**
     * @param {Body} hitbox 
     * @param {number} type
     */
    constructor(hitbox, isStatic = false, health = -1) {
        this.hitbox = hitbox;
        this.isStatic = isStatic;
        this.health = health;
    }

    alterHealth(amount) {
        this.health += amount;
        if (this.health <= 0)
            this.isMarkedForDeletion = true;
    }

    /**
     * @param {Entity} entity 
     * @param {number} damage
     * @returns {boolean}
     */
    hit(entity, damage) {
        if(this.hitCooldownIsActive) return false;
        this.hitCooldownIsActive = true;
        this.alterHealth(-damage);
        this.#moveAngle = Math.atan2(entity.hitbox.pos.y - this.hitbox.pos.y, entity.hitbox.pos.x - this.hitbox.pos.x);
        this.#currentFrame = Entity.#hitAnimationFrames;
        setTimeout(() => this.hitCooldownIsActive = false, 1000);
    }

    get hitAnimationIsActive() {
        return this.#currentFrame > 0;
    }

    #getMoveAmout() {
        if(Constants[this.constructor.name]?.["hitOffsetMoveAmout"] !== undefined)
            return Constants[this.constructor.name]["hitOffsetMoveAmout"] / (Entity.#maxMoveHitOffsetPercent - this.#currentFrame + 1);
        // use value if it exists, otherwise calculate the move amount based on the hitbox dimensions and type
        const moveAmout = this.hitbox.constructor.name === "Ball" ? this.hitbox.comp[0].r * 2 : Math.min(this.hitbox.width, this.hitbox.height);
        return moveAmout / (Entity.#maxMoveHitOffsetPercent - this.#currentFrame + 1);
    }
    
    /**
     * @returns {number}
     */
    get hitMoveOffsetX() {
        return this.hitbox.pos.x + (this.#getMoveAmout() * (this.hitAnimationIsActive ? Math.cos(this.#moveAngle) : 0));
    }

    /**
     * @returns {number}
     */
    get hitMoveOffsetY() {
        return this.hitbox.pos.y + (this.#getMoveAmout() * (this.hitAnimationIsActive ? Math.sin(this.#moveAngle) : 0));
    }

    update() {
        this.hitbox.reposition();
        if (this.hitAnimationIsActive){
            this.#currentFrame--;
            if (this.#currentFrame -1 === 0)
                this.#moveAngle = -1;
        }
    }
}
