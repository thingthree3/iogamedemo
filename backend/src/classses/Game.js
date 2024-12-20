import Player from "./entities/player/Player.js";
import {  CollData, collide, collisionCircleLine, Line } from "../../../shared/physics.js";
import { entitysToData } from "../utils/utils.js";
import LinkedList from "../../../shared/utils/LinkedList.js";
import Entity from "./entities/Entity.js";
import LevelLoader from "./LevelLoader.js";
import Constants from "../utils/Constants.js";

export default class Game {
  /**@type {LinkedList<Player>} */
  players = new LinkedList();
  /**@type {LinkedList<Entity>} */
  entities = new LinkedList();
  /**@type {SocketIO.Server} */
  server = null;
  /**@type {Set<Entity>[]} */
  staticEntityCollisionMatrix = null;
  // #engine = new PhysicsEngine();

  /**
   * @param {SocketIO.Server} server 
   */
  constructor(server) {
    this.server = server;
    this.lastTime = Date.now();
    this.FPS = Constants.Game.FPS;
    this.accumulator = 0;
    this.running = false;
    this.levelLoader = new LevelLoader(this);
    this.levelLoader.loadLevel("./backend/resources/level-data/demoLevel.tmx");
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

    while (this.accumulator >= Constants.Game.FPS) {
      this.update(Constants.Game.FPS);
      this.accumulator -= Constants.Game.FPS;
    }

    // Schedule the next loop iteration to match the desired update frequency
    setTimeout(() => this.loop(), Constants.Game.FPS);
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
    // for(const entity of this.entities){
    //   entity.value.update();
    // }
    this.entities.filter((e) => {
      e.update();
      return !e.isMarkedForDeletion;
    });
    this.#updatePhysics();
    
    // ----- broadcast data to clients -----

    // broadcast clients' data to all clients
    this.server.customEmit('playersPositionUpdate', this.players.toArray(Player.playerToData));
    this.server.customEmit("staticEntitiesPositionUpdate", this.entities.toArray(entitysToData));
  }

  #updatePhysics() {
    this.#calculateCollisions(this.#linkCollidableEntities());
    this.#unlinkCollidableEntities();
  }

  /**
   * @param {LinkedList<Entity>} collidables 
   */
  #calculateCollisions(collidables) {
    for(const node of collidables) {
      const entity1 = node.value;
      for(const entity2 of node.next) {
        
        // ignore static objects colliding(like two trees that don't move)
        if(entity1.isStatic && entity2.isStatic) return;
        this.#calculateToolCollision(entity1, entity2);
        const collision = collide(
          entity1.hitbox?.comp ?? [entity1.hitbox], 
          entity2.hitbox?.comp ?? [entity2.hitbox]
        );
        if(collision)
          CollData.Collisions.add(new CollData(entity1.hitbox, entity2.hitbox, collision.axis, collision.pen, collision.vertex));
      }
    }
    // console.log(i);
    CollData.Collisions.forEachValue(c => {
      c.penRes();
      c.collRes();
    });

    CollData.Collisions.clear();
  }

  /**
   * 
   * @param {Entity} entity1 
   * @param {Entity} entity2 
   */
  #calculateToolCollision(entity1, entity2){
    const isPlayer1 = entity1 instanceof Player, isPlayer2 = entity2 instanceof Player;
    if(isPlayer1 && entity1.tool.isInUse){
      if(collide((entity2.hitbox.comp ? entity2.hitbox.comp : [entity2.hitbox]), ([entity1.tool.hitbox])))
        entity2.hit(entity1, 10);
    }

    if(isPlayer2 && entity2.tool.isInUse){
      if(collide((entity1.hitbox.comp ? entity1.hitbox.comp : [entity1.hitbox]), ([entity2.tool.hitbox])))
        entity1.hit(entity2, 10);
    }
  }

  #updatePlayers(){
    // use filter instead of forEach to update and remove players at the same time O(n) vs O(2n)
    this.players.filter(Player.updateAndFilterPlayers);
  }
}