import { Actor } from "../Actor";

let totalNpcs = 0;

export class Npc extends Actor {
    constructor(instance, x, y) {
        super(instance, x, y);
        this.uniqueId = ++totalNpcs;
        this.spawnX = x;
        this.spawnY = y;
        this.canBeBlocked = true;
        this.type = null;
        this.isPendingRemoval = false;
    }
    
    processTick(gameTick) {
        if (this.isPendingRemoval) {
            if (this.blocksTiles) {
                for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width; x++) {
                        delete this.instance.blockedTiles[(this.x + x) + "," + (this.y + y)];
                    }
                }
            }
            return;
        }
        
        if (this.target) {
            if (this.intersectsWith(this.target)) {
                // TODO: Random walk
            }
            else {
                let canReach = false;
                canReach |= this.isMelee && this.isInMeleeDistanceTo(this.target);
                canReach |= !this.isMelee && this.distanceTo(this.target) <= this.maxAttackRange && this.target.hasLineOfSightTo(this);
                if (!canReach) {
                    const p = this.getNextTravellingPointToTarget(this.target, true);
                    this.move(p.x - this.x, p.y - this.y);
                }
                
                let canAttack = true;
                canAttack &= this.nextAttackTick <= gameTick;
                canAttack &= !this.intersectsWith(this.target);
                if (this.isMelee) {
                    canAttack &= this.isInMeleeDistanceTo(this.target);
                }
                else {
                    canAttack &= this.distanceTo(this.target) <= this.maxAttackRange && this.target.hasLineOfSightTo(this);
                }
                if (canAttack) {
                    // TODO: Simulate attack
                    this.lastAttackTick = gameTick;
                    this.nextAttackTick = gameTick + this.attackSpeed;
                }
            }
        }
        else {
            // TODO: Random walk
        }
    }
    
    getNextTravellingPointToTarget(target, stopAtMeleeDistance) {
        if (this.instance !== target.instance) {
            return null;
        }
        
        if (this.intersectsWith(target)) {
            if (stopAtMeleeDistance) {
                // Should normally be random direction, but we'll fix that later
                return {
                    x: this.x,
                    y: this.y
                };
            }
            else {
                return {
                    x: this.x,
                    y: this.y
                };
            }
        }
        
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const axisDistances = this.getAxisDistancesTo(target);
        if (stopAtMeleeDistance && axisDistances.x + axisDistances.y === 1) {
            // In melee distance already
            return {
                x: this.x,
                y: this.y
            };
        }
        
        if (this.x + dx < 0 || this.x + dx >= this.instance.map.width ||
            this.y + dy < 0 || this.y + dy >= this.instance.map.height)
        {
            // NPC is travelling out of bounds
            return {
                x: this.x,
                y: this.y
            };
        }
        
        const dxSig = Math.sign(dx);
        const dySig = Math.sign(dy);
        if (stopAtMeleeDistance && axisDistances.x === 1 && axisDistances.y === 1) {
			// When it needs to stop at melee distance, it will only attempt
			// to travel along the x axis when it is standing diagonally
            // from the target
            if (this.canTravelInDirection(dxSig, 0)) {
                return {
                    x: this.x + dxSig,
                    y: this.y
                };
            }
        }
        else {
            if (this.canTravelInDirection(dxSig, dySig)) {
                return {
                    x: this.x + dxSig,
                    y: this.y + dySig
                };
            }
            else if (dx !== 0 && this.canTravelInDirection(dxSig, 0)) {
                return {
                    x: this.x + dxSig,
                    y: this.y
                };
            }
            else if (dy !== 0 && this.canTravelInDirection(0, dySig)) {
                return {
                    x: this.x,
                    y: this.y + dySig
                };
            }
        }
        
        return {
            x: this.x,
            y: this.y
        };
    }
}
