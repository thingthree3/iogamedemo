import { Vector } from "../shared/physics.js";

export default class Player {
    isWritting = false;
    id = null;
    socket = io("http://localhost:3000");
    #x = 0;
    #y = 0;
    velocity = new Vector(0, 0);
    mousePosToSend = {
        x: 0,
        y: 0,
    }
    constructor(){

    }

    get x(){
        return this.#x;
    }
    get y(){
        return this.#y;
    }
    set x(x){
        const velocity = x - this.#x
        if(Math.abs(velocity) > 1)
            this.velocity.x = velocity;
        else this.velocity.x = 0;
        this.#x = x;
    }
    set y(y){
        const velocity = y - this.#y
        if(Math.abs(velocity) > 1)
            this.velocity.y = velocity;
        else this.velocity.y = 0;
        this.#y = y;
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    updatePosition(x,  y){
        this.x = x;
        this.y = y;
    }

    /**
     * @param {{x: number, y: number, rotation: number, id: number, type: number}[]} entities
     */
    update(entities){
        // console.log(this.velocity);
        const myself = entities.find(e => e.id === this.id);
        if(myself)
            this.updatePosition(myself.x, myself.y);
    }
}