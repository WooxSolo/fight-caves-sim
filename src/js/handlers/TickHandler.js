
export class TickHandler {
    constructor(game) {
        this.game = game;
        this.tickCounter = 0;
    }
    
    processTick() {
        this.game.historyHandler.push();
        
        this.tickCounter++;
        
        for (const npc of this.game.instance.npcs) {
            npc.target = this.game.instance.player; // Normally don't want this line, but just for Fight Caves
            npc.processTick(this.tickCounter);
        }
        if (this.game.instance.player) {
            this.game.instance.player.processTick(this.tickCounter);
        }
        
        this.game.renderHandler.needsRedraw = true;
    }
}
