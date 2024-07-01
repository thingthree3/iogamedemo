import Player from "./entities/player/Player.js";
import {  CollData, collide } from "../../shared/physics.js";
import { playerToData, filterAndUpdatePlayers } from "../utils/playerUtils.js";
import { entitysToData } from "../utils/utils.js";
import LinkedList from "../../shared/LinkedList.js";
import Entity from "./entities/Entity.js";
import LevelLoader from "./LevelLoader.js";

export default class Game {
  /**@type {LinkedList<Player>} */
  players = new LinkedList();
  /**@type {LinkedList<Entity>} */
  entities = new LinkedList();
  /**@type {SocketIO.Server} */
  server = null;
  // #engine = new PhysicsEngine();

  /**
   * @param {SocketIO.Server} server 
   */
  constructor(server) {
    this.server = server;
    this.lastTime = Date.now();
    this.accumulator = 0;
    this.fps = 1000 / 60; // 60 updates per second

    // Game states
    this.gameStates = Object.freeze({
      PLAYING: Symbol("playing")
    });
  
    this.running = false;
    this.levelLoader = new LevelLoader(this);
    this.levelLoader.loadLevel("./backend/level-data/demoLevel.tmx")
  }

  addEntity(entity) {
    this.entities.add(entity);
  }

  addPlayer(player) {
      this.players.add(player);
  }


  /**
   * @description 
   * @returns {LinkedList<Entity>}
   */
  #linkCollidableEntities(){
    return LinkedList.link(this.players, this.entities);
  }

  #unlinkCollidableEntities(){
    this.players.unlink();
  }

  loop() {
    if (!this.running) return;

    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    while (this.accumulator >= this.fps) {
      this.update(this.fps);
      this.accumulator -= this.fps;
    }

    // Schedule the next loop iteration to match the desired update frequency
    setTimeout(() => this.loop(), this.fps);
  }

  start() {
    this.running = true;
    this.loop();
  }

  stop() {
    this.running = false;
  }

  update(deltaTime) {
    this.#updatePlayers();
    this.#updatePhysics();
    
    // ----- broadcast data to clients -----

    // broadcast clients' data to all clients
    this.server.emit('playersPositionUpdate', this.players.toArray(playerToData));
    this.server.emit("staticEntitiesPositionUpdate", this.entities.toArray(entitysToData));
  }

  #updatePhysics() {
    this.#calculateCollisions(this.#linkCollidableEntities());
    this.#unlinkCollidableEntities();
  }

  /**
   * @param {LinkedList<Entity>} collidables 
   */
  #calculateCollisions(collidables) {
    collidables.forEachNode(node => {
      LinkedList.forEachNode(node, node2 => {
        const collision = collide(node.value.hitbox, node2.value.hitbox);
          if(collision){
            CollData.Collisions.add(new CollData(node.value.hitbox, node2.value.hitbox, collision.axis, collision.pen, collision.vertex));
          }
      });
    });

    CollData.Collisions.forEach(c => {
      c.penRes();
      c.collRes();
    });

    CollData.Collisions.clear();
  }

  #updatePlayers(){
    // use filter instead of forEach to update and remove players at the same time
    this.players.filter(filterAndUpdatePlayers);
  }
}