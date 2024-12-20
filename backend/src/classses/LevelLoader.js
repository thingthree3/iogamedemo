import { Ball, Box } from "../../../shared/physics.js";
import Game from "./Game.js";
import Entity from "./entities/Entity.js";
import tmx, { ImageLayer, Map, ObjectLayer, TileLayer, TmxObject } from "../node-tmx-parser/index.js";
import EntityData from "../../resources/level-data/EntityLoadData.json" assert { type: "json" };

export default class LevelLoader {
    static CHUNK_SIZE = 5; // 25 tiles for a 5x5 chunk
    /**
     * 
     * @param {Game} game 
     */
    constructor(game){
        this.game = game;
    }
    /**
     * @param {string} file
     */
    loadLevel(file){
        tmx.parseFile(file, (err, map) => {
            if(err)//static_collisions
                throw err
            if(map.height % LevelLoader.CHUNK_SIZE !== 0 || map.width % LevelLoader.CHUNK_SIZE !== 0){
                throw new Error(`
                    Level size must be a multiple of ${LevelLoader.CHUNK_SIZE}, 
                    in both x and y dimensions. width: ${map.width} height: ${map.height}.
                    map loaded: ${file}
                `);
            }
            // |
            // V bad code :<<<
            this.game.staticEntityCollisionMatrix = new Array((map.width * map.height) / Math.pow(LevelLoader.CHUNK_SIZE, 2)).fill(new Set());
            
            for(const layer of map.layers){
                switch(layer.name){
                    case "entities":
                        this.#loadEntityLayer(layer, map);
                    break;
                    case "static_collisions":
                        this.#loadStaticCollisions(layer, map);
                    break;
                    // case "objectgroup":
                    //   this.#loadEntities(layer);
                    //   break;
                }
            }
        });
    }

    /**
     * @todo fix this somehow XD, make it mroe generic and DRY
     * @param {TmxObject} entityData 
     * @param {Map} map
     * @param {boolean} isStatic 
     * @returns {Entity}
     */
    #loadEntity(entityData, map, isStatic = false){
        switch(entityData.type){
            case "circle":
                // idk why we need this 'offsetAmount' but it works
                const offsetAmount = entityData.width > map.tileWidth || entityData.height > map.tileHeight ? 0 : map.tileHeight;
                return new Entity(new Ball(entityData.x + entityData.width / 2, entityData.y + entityData.height / 2 - offsetAmount, entityData.properties.radius, 0), false, 20000);
            // case "wall":
            //     return new Entity(new Box(entityData.x, entityData.y, entityData.width, entityData.height, entityData.width, 0));
          }

          throw new Error(`Unknown entity: ${entityData.name}, of type: ${entityData.type} failed to load into game. EntityData: ${JSON.stringify(entityData)}`);
    }
    

    /**
     * 
     * @param {ObjectLayer} entitiesLayer 
     * @param {Map} map 
     */
    #loadEntityLayer(entitiesLayer, map) {
        for(const entityData of entitiesLayer.objects){
            // remove this if statement once we fix the #loadEntity()
            if(entityData.type === "circle")
                this.game.addEntity(this.#loadEntity(entityData, map));
        }
      }

      /**
       * 
       * @param {TileLayer} layer 
       * @param {Map} map 
       */
      #loadStaticCollisions(layer, map){
        for(const key of Object.keys(layer.tiles)){
            const   index = parseInt(key),
                    x = index % map.width,
                    y = Math.floor(index / map.width),
                    chunkIndexX = Math.floor(x / LevelLoader.CHUNK_SIZE),
                    chunkIndexY = Math.floor(y / LevelLoader.CHUNK_SIZE) * map.width / LevelLoader.CHUNK_SIZE;
            this.game.staticEntityCollisionMatrix[ chunkIndexX + chunkIndexY ].add(
                new Entity(new Box(x, y, map.tileWidth, map.tileHeight, map.tileWidth, 0), true)
            );
        }
    }

}