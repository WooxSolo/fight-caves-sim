
export const fightCavesWaveMonsters = [];
export const fightCavesRotation = [];
export const fightCavesPositions = [];

(function() {
    // Init the waves
    
    const monsters = [0, 0, 0, 0, 0, 0];
    const levels = [22, 45, 90, 180, 360, 702];
    for (let i = 0; i < 63; i++) {
        let found = false;
        for (let i2 = 0; i2 < monsters.length; i2++) {
            if (monsters[i2] === 2) {
                monsters[i2] = 0;
                monsters[i2 + 1]++;
                found = true;
                break;
            }
        }
        if (!found) {
            monsters[0]++;
        }
        
        const nextResult = [];
        for (let i2 = monsters.length - 1; i2 >= 0; i2--) {
            for (let i3 = 0; i3 < monsters[i2]; i3++) {
                nextResult.push(levels[i2]);
            }
        }
        fightCavesWaveMonsters.push(nextResult);
    }
    
    const result = [];
    for (let i = monsters.length - 1; i >= 0; i--) {
        for (let i2 = 0; i2 < monsters[i]; i2++) {
            result.push()
        }
    }
})();

(function() {    
    const positionKeyToCoords = {
        sw: {
            x: 10,
            y: 15
        },
        s: {
            x: 35,
            y: 15
        },
        se: {
            x: 50,
            y: 25
        },
        c: {
            x: 30,
            y: 30
        },
        nw: {
            x: 10,
            y: 50
        }
    };
    const rotation = ["se", "sw", "c", "nw", "sw", "se", "s", "nw", "c", "se", "sw", "s", "nw", "c", "s"];
    for (const r of rotation) {
        fightCavesRotation.push(positionKeyToCoords[r]);
    }
})();

export function getFightCavesWaveMonsters(waveNumber) {
    return fightCavesWaveMonsters[waveNumber - 1];
}

export function getFightCavesRotationPositions(waveNumber, rotation) {
    const result = [];
    const totalMonsters = getFightCavesWaveMonsters(waveNumber).length;
    for (let i = 0; i < totalMonsters; i++) {
        const index = (waveNumber - 1 + rotation + i) % fightCavesRotation.length;
        result.push(fightCavesRotation[index]);
    }
    return result;
}
