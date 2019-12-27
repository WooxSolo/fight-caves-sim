import { Npc } from "./Npc";
import { loadNpcImage } from "../../helpers/NpcHelpers";

export class Lvl45 extends Npc {
    constructor(instance, x, y) {
        super(instance, x, y);
        this.type = "lvl45";
        this.size = 2;
        this.width = 2;
        this.height = 2;
        this.isMelee = true;
        this.attackSpeed = 4;
        this.image = loadNpcImage(45, instance.game);
    }
}
