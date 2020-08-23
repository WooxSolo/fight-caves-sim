import { Lvl22 } from "../entities/npcs/Lvl22";
import { Lvl45 } from "../entities/npcs/Lvl45";
import { Lvl90 } from "../entities/npcs/Lvl90";
import { Lvl180 } from "../entities/npcs/Lvl180";
import { Lvl360 } from "../entities/npcs/Lvl360";
import { Lvl702 } from "../entities/npcs/Lvl702";
import { Player } from "../entities/Player";

export class ActionHandler {
    constructor(game) {
        this.game = game;
        this.currentAction = null;
    }
    
    setCurrentAction(action) {
        this.currentAction = action;
    }
    
    performCurrentAction() {
        if (!this.currentAction) {
            return;
        }

        const { mouseX, mouseY } = { ...this.game.inputHandler };
        if (mouseX !== null && mouseY !== null) {
            const gridX = Math.floor(mouseX / his.game.renderHandler.cellWidth);
            const gridY = Math.floor((this.game.renderHandler.canvas.current.height - mouseY) / his.game.renderHandler.cellWidth);
            switch (this.currentAction) {
                case "placeLvl22":
                    this.game.instance.addNpc(new Lvl22(this.game.instance, gridX, gridY));
                    break;
                case "placeLvl45":
                    this.game.instance.addNpc(new Lvl45(this.game.instance, gridX, gridY));
                    break;
                case "placeLvl90":
                    this.game.instance.addNpc(new Lvl90(this.game.instance, gridX, gridY));
                    break;
                case "placeLvl180":
                    this.game.instance.addNpc(new Lvl180(this.game.instance, gridX, gridY));
                    break;
                case "placeLvl360":
                    this.game.instance.addNpc(new Lvl360(this.game.instance, gridX, gridY));
                    break;
                case "placeLvl702":
                    this.game.instance.addNpc(new Lvl702(this.game.instance, gridX, gridY));
                    break;
                case "placePlayer":
                    this.game.instance.setPlayer(new Player(this.game.instance, gridX, gridY));
                    break;
                case "play":
                    if (this.game.instance.player) {
                        this.game.instance.player.setDestination(gridX, gridY);
                    }
                    else {
                        this.game.instance.setPlayer(new Player(this.game.instance, gridX, gridY));
                    }
            }
        }

        this.game.renderHandler.needsRedraw = true;
    }
}
