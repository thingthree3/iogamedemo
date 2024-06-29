import Player from "./entities/player/Player.js";
import { Body, CollData, collide } from "../../shared/physics.js";
import { playerToData, filterAndUpdatePlayers } from "../utils/playerUtils.js";
import LinkedList from "../../shared/LinkedList.js";
import Entity from "./entities/Entity.js";
// import PhysicsEngine from "./physicsEngine.js";

export default class Game {
  /**@type {LinkedList<Player>} */
  players = new LinkedList();
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
    this.fps = 1000 / 90; // 90 updates per second

    // Game states
    this.gameStates = Object.freeze({
      PLAYING: Symbol("playing")
    });
  
    this.running = false;
  }

  addPlayer(player) {
      this.players.add(player);
  }
  
  // getPhysicsEngine() {
  //   return this.#engine;
  // }

  /**
   * @description 
   * @returns {LinkedList<Entity>}
   */
  #linkCollidableEntities(){
    return LinkedList.link(this.players, Entity.Entities);
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

  update(deltaTime) {
    this.#updatePlayers();
    this.#updatePhysics();
  }

  #updatePhysics() {
    // const entities = this.#linkCollidableEntities();
    this.players.forEachNode(node => {
      LinkedList.forEachNode(node, node2 => {
          if(collide(node.value.hitbox, node2.value.hitbox)){
            let bestSat = collide(node.value.hitbox, node2.value.hitbox);
            CollData.Collisions.add(new CollData(node.value.hitbox, node2.value.hitbox, bestSat.axis, bestSat.pen, bestSat.vertex));
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

    // broadcast data to clients, update this for mutiple servers, ei atlana europe
    const data = this.players.toArray(playerToData);
    this.server.emit('positionUpdate', data);
  }

  // removePlayer(player) {
  //   this.#players.findAndDelete(player, player => player.socket.id === player.socket.id);
  // }

  start() {
    this.running = true;
    this.loop();
  }

  stop() {
    this.running = false;
  }
}