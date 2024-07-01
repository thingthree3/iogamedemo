import { Body } from "../../../shared/physics.js";
import LinkedList from "../../../shared/LinkedList.js";

export default class Entity {
    /**@type {Body} */
    hitbox = null;
    /**@type {LinkedList<Entity>} */
    isMarkedForDeletion = false;
    #hp = 100;
    /**
     * @param {Body} hitbox 
     * @param {number} type
     */
    constructor(hitbox, type = 1) {
        this.hitbox = hitbox;
        this.type = type;
    }
}
