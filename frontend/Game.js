import { Vector } from "../shared/physics.js";
import Constants from "../shared/Constants.js";
import Player from "./Player.js";

export default class Game {
    /**@type {{x: number, y: number, angle: number, type: number}[]} */
    #entities = [];
    /**@type {{x: number, y: number, id: number, angle: number, mousePos: {x: number, y: number}}[]} */
    #players = [];
    player = new Player();
    /**@type {{[key: string]: HTMLImageElement}} */
    imageData = null;
    #scrollAreaHeight
    #scrollAreaWidth
    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height){
        this.screenWidth = width;
        this.screenHeight = height;
        this.#scrollAreaHeight = height / 5;
        this.#scrollAreaWidth = width / 5;
        this.offsetX = 0;
        this.offsetY = 0;
        setInterval(() => {
            this.update();
        }, 1000 / 90);
        // this.imageData = imageData;
    }

    /**
     * @returns {void}
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
        this.#draw(ctx);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    #draw(ctx){
        // draw background
        ctx.drawImage(this.imageData['background'], 0 - this.offsetX, 0 - this.offsetY, this.imageData['background'].width, this.imageData['background'].height);
        this.#drawEntities(ctx);
        this.#scrollWindow();
        this.drawPlayers(ctx);
    }

    /**
     * @returns {void}
     * @param {CanvasRenderingContext2D} ctx
     */
    drawPlayers(ctx) {
        ctx.fillStyle = "#ededed";
        ctx.textAlign = "center";
        ctx.fillStyle = "#808080"
        ctx.font = "15px Arial";
        for (const player of this.#players){
            if(player.id == this.player.id) {
                ctx.fillText("YOU ARE HERE", player.x - this.offsetX, player.y - this.offsetY);
                ctx.drawImage(this.imageData['player'], player.x - this.offsetX, player.y - this.offsetY, 20, 20);
            }else{
                ctx.beginPath();        
                ctx.arc(player.x - this.offsetX, player.y - this.offsetY, Constants.playerConstants.radius, 0, 2*Math.PI);
                ctx.fill();
                ctx.closePath();
            }
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    #drawEntities(ctx) {
        ctx.save();
        ctx.fillStyle = "red";
        for(const entity of this.#entities) {
            ctx.beginPath();
            // ctx.arc(entity.x - this.offsetX, entity.y - this.offsetY, entity.radius ?? 20, 0, 2*Math.PI);
            ctx.fill();
            ctx.closePath();
        }
        ctx.restore();
    }

    #scrollWindow(){
        // if(
        //     ( (this.player.x + Constants.playerConstants.radius - this.offsetX >= this.screenWidth - this.#scrollAreaWidth) && this.player.velocity.x > 0 ) ||
        //     ((this.player.x - this.offsetX <= this.#scrollAreaWidth) && this.player.velocity.x < 0)
        // ){
        //     this.offsetX += this.player.velocity.x;
        // }

        // bad code ik :<
        if((this.player.y + Constants.playerConstants.radius - this.offsetY >= this.screenHeight - this.#scrollAreaHeight)){
            
            this.offsetY -= ((this.screenHeight - this.#scrollAreaHeight) -(this.player.y + Constants.playerConstants.radius - this.offsetY));
        }
        if(this.player.y - this.offsetY <= this.#scrollAreaHeight){
            
            this.offsetY += (this.player.y - this.offsetY - this.#scrollAreaHeight);
        }


        if((this.player.x + Constants.playerConstants.radius - this.offsetX >= this.screenWidth - this.#scrollAreaWidth)){
            
            this.offsetX -= ((this.screenWidth - this.#scrollAreaWidth) -(this.player.x + Constants.playerConstants.radius - this.offsetX));
        }
        if(this.player.x - this.offsetX <= this.#scrollAreaWidth){
            
            this.offsetX += (this.player.x - this.offsetX - this.#scrollAreaWidth);
        }
    }

    /**
     * 
     * @param {{x: number, y: number, id: number, angle: number, mousePos: {x: number, y: number}}[]} players 
     */
    setPlayers(players){
        this.#players = players;
    }

    /**
     * 
     * @param {{x: number, y: number, angle: number, type: number}[]} entities 
     */
    setEntities(entities){
        this.#entities = entities;
    }
    update(){
        this.player.update(this.#players);
    }

};