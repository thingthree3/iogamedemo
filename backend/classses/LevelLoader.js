import { Ball } from "../../shared/physics.js";
import Game from "./Game.js";
import Entity from "./entities/Entity.js";
import tmx from "../node-tmx-parser/index.js";

export default class LevelLoader {

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
            // console.log(map);
            if(err)//static_collisions
                throw err;
            for(const layer of map.layers){
                switch(layer.name){
                    case "entities":
                        this.#loadEntities(layer, map);
                    break;
                    // case "objectgroup":
                    //   this.#loadEntities(layer);
                    //   break;
                }
            }
        });
    }

    #loadEntities(entitiesLayer, map) {
        for(const entity of entitiesLayer.objects){
          switch(entity.type){
            case "circle":
                // idk why we need this 'offsetAmount' but it works
                const offsetAmount = entity.width > map.tileWidth || entity.height > map.tileHeight ? 0 : map.tileHeight;
              this.game.addEntity(new Entity(new Ball(entity.x + entity.width / 2, entity.y + entity.height / 2 - offsetAmount, entity.properties.radius, 0)));
              break;
            // case "rectangle":
            //   this.addEntity(new Entity(new Body(entity.x, entity.y, entity.width, entity.height)));
            //   break;
          }
        }
      }

}