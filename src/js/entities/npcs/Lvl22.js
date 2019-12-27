import { Npc } from "./Npc";
import { loadNpcImage } from "../../helpers/NpcHelpers";

export class Lvl22 extends Npc {
    constructor(instance, x, y) {
        super(instance, x, y);
        this.type = "lvl22";
        this.size = 1;
        this.width = 1;
        this.height = 1;
        this.isMelee = true;
        this.attackSpeed = 4;
        this.image = loadNpcImage(22, instance.game);
    }
}
