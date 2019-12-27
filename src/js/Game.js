import { Instance } from "./world/Instance";
import { FightCavesMap } from "./world/maps/FightCavesMap";
import { HistoryHandler } from "./handlers/HistoryHandler";
import { InputHandler } from "./handlers/InputHandler";
import { ActionHandler } from "./handlers/ActionHandler";
import { RenderHandler } from "./handlers/RenderHandler";
import { TickHandler } from "./handlers/TickHandler";

export class Game {
    constructor(canvas) {
        this.instance = new Instance(this, new FightCavesMap());
        this.historyHandler = new HistoryHandler(this);
        this.inputHandler = new InputHandler(this);
        this.actionHandler = new ActionHandler(this);
        this.tickHandler = new TickHandler(this);
        this.renderHandler = new RenderHandler(this, canvas);
        this.renderHandler.startRendering();
    }
    
    reset() {
        this.instance.clearNpcs();
        this.instance.setPlayer(null);
        this.tickHandler.tickCounter = 0;
        this.historyHandler.reset();
        
        this.renderHandler.needsRedraw = true;
    }
}
