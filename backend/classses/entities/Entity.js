import { Body } from "../../utils/physics.js";
import LinkedList from "../../utils/LinkedList.js";

export default class Entity {
    // /**@type {LinkedList<Entity>} */
    // static Entities = new LinkedList();
    /**@type {Body} */
    hitbox = null;
    /**@type {LinkedList<Entity>} */
    static #maxSpeed = 10;
    isMarkedForDeletion = false;
    #hp = 100;
    // /**
    //  * 
    //  * @param {number} x 
    //  * @param {number} y 
    //  * @param {number} id 
    //  */
    // constructor(x, y, id) {
    // }
    /**
     * @param {Body} hitbox 
     */
    constructor(hitbox) {
        this.hitbox = hitbox;
        // Entity.Entities.add(this);
    }

    // /**
    //  * @returns {Body}
    //  */
    // getHitbox() {
    //     return this.hitbox;
    // }
}
