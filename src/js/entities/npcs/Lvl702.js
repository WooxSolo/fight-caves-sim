import { Npc } from "./Npc";
import { loadNpcImage } from "../../helpers/NpcHelpers";

export class Lvl702 extends Npc {
    constructor(instance, x, y) {
        super(instance, x, y);
        this.type = "lvl702";
        this.size = 5;
        this.width = 5;
        this.height = 5;
        this.maxAttackRange = 15;
        this.attackSpeed = 8;
        this.image = loadNpcImage(702, instance.game);
    }
}
