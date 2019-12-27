import * as React from "react";
import { Game } from "../Game";
import { fightCavesRotation, fightCavesWaveMonsters, getFightCavesRotationPositions, getFightCavesWaveMonsters } from "../helpers/FightCavesHelpers";

export class MainView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.historyInput = React.createRef();
        this.game = new Game(this.canvas);
        this.wave = 1;
        this.rotation = 0;
    }
    
    componentDidMount() {
        this.game.renderHandler.startRendering();
        
        this.canvas.current.addEventListener("wheel", this.onMouseScroll.bind(this), { passive: false });
    }
    
    componentWillUnmount() {
        this.game.renderHandler.stopRendering();
        
        this.canvas.current.removeEventListener("wheel");
    }
    
    onActionChange(event) {
        this.game.actionHandler.setCurrentAction(event.target.value);
    }
    
    onMouseMove(event) {
        const rect = this.canvas.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.game.inputHandler.onMouseMove(x, y);
    }
    
    onMouseLeave(event) {
        this.game.inputHandler.onMouseLeave();
    }
    
    onMouseDown(event) {
        this.game.inputHandler.onMouseDown(event.button);
    }
    
    onMouseScroll(event) {
        this.game.inputHandler.onMouseScroll(event.deltaY);
        event.preventDefault();
        return false;
    }
    
    onContextMenu(event) {
        event.preventDefault();
        return false;
    }
    
    onKeyDown(event) {
        this.game.inputHandler.onKeyDown(event.which);
    }
    
    onWaveChange(event) {
        this.wave = parseInt(event.target.value);
    }
    
    onRotationChange(event) {
        this.rotation = parseInt(event.target.value);
    }
    
    loadWave() {
        this.game.reset();
        this.game.instance.loadNpcs(getFightCavesWaveMonsters(this.wave), getFightCavesRotationPositions(this.wave, this.rotation));
    }
    
    reset() {
        this.historyInput.current.value = "";
        this.game.reset();
    }
    
    saveHistory() {
        this.historyInput.current.value = this.game.historyHandler.getSerializedHistory();
        this.historyInput.current.select();
        document.execCommand("copy");
    }
    
    loadHistory() {
        this.game.historyHandler.loadSerializedHistory(this.historyInput.current.value);
        this.canvas.current.focus();
    }
    
    render() {
        const game = this.game;
        const instance = game.instance;
        const cellWidth = game.renderHandler.cellWidth;
        return (
            <div>
                <div style={{marginBottom: "5px"}}>
                    <select onChange={this.onActionChange.bind(this)}>
                        <option>- Choose action -</option>
                        <option value="placeLvl22">Place lvl 22</option>
                        <option value="placeLvl45">Place lvl 45</option>
                        <option value="placeLvl90">Place lvl 90</option>
                        <option value="placeLvl180">Place lvl 180</option>
                        <option value="placeLvl360">Place lvl 360</option>
                        <option value="placePlayer">Place player</option>
                        <option value="play">Play!</option>
                    </select>
                    <select onChange={this.onWaveChange.bind(this)}>
                        {fightCavesWaveMonsters.map((v, index) => {
                            return <option key={index} value={index + 1}>Wave {index + 1}</option>
                        })}
                    </select>
                    <select onChange={this.onRotationChange.bind(this)}>
                        {fightCavesRotation.map((v, index) => {
                            return <option key={index} value={index}>Rotation {index + 1}</option>
                        })}
                    </select>
                    <button onClick={this.loadWave.bind(this)}>Load wave</button>
                    <button onClick={this.reset.bind(this)}>Reset</button>
                    <input type="text" ref={this.historyInput} style={{marginLeft:"10px"}} />
                    <button onClick={this.saveHistory.bind(this)}>Copy history</button>
                    <button onClick={this.loadHistory.bind(this)}>Load history</button>
                </div>
                <div>
                    <canvas
                        width={instance.map.width * cellWidth}
                        height={instance.map.height * cellWidth}
                        ref={this.canvas}
                        onMouseMove={this.onMouseMove.bind(this)}
                        onMouseLeave={this.onMouseLeave.bind(this)}
                        onMouseDown={this.onMouseDown.bind(this)}
                        onContextMenu={this.onContextMenu.bind(this)}
                        onKeyDown={this.onKeyDown.bind(this)}
                        tabIndex={1}
                    />
                </div>
            </div>
        );
    }
}
