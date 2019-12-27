
export class InputHandler {
    constructor(game) {
        this.game = game;
        this.mouseX = null;
        this.mouseY = null;
    }
    
    onKeyDown(which) {
        const KEY_B = 66;
        const KEY_F = 70;
        const KEY_SPACE = 32;
        if (which === KEY_B) {
            this.game.historyHandler.goBack();
        }
        else if (which === KEY_F) {
            this.game.historyHandler.goForward();
        }
        else if (which === KEY_SPACE) {
            if (this.game.actionHandler.currentAction === "play") {
                this.game.tickHandler.processTick();
            }
        }
    }
    
    onMouseMove(x, y) {
        this.mouseX = x;
        this.mouseY = y;
        this.game.renderHandler.needsRedraw = true;
    }
    
    onMouseLeave() {
        this.mouseX = null;
        this.mouseY = null;
        this.game.renderHandler.needsRedraw = true;
    }
    
    onMouseDown(button) {
        const MOUSE_BUTTON_LEFT = 0;
        const MOUSE_BUTTON_MIDDLE = 1;
        const MOUSE_BUTTON_RIGHT = 2;
        
        if (button === MOUSE_BUTTON_LEFT) {
            this.game.actionHandler.performCurrentAction();
        }
        else if (button === MOUSE_BUTTON_MIDDLE) {
            if (this.game.actionHandler.currentAction === "play") {
                this.game.tickHandler.processTick();
            }
        }
        else if (button === MOUSE_BUTTON_RIGHT) {
            this.game.instance.removeHoveredNpc();
        }
    }
    
    onMouseScroll(delta) {
        if (delta > 0) {
            this.game.historyHandler.goForward();
        }
        else if (delta < 0) {
            this.game.historyHandler.goBack();
        }
    }
}
