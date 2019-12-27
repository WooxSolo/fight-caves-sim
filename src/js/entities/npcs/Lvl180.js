import { Npc } from "./Npc";
import { loadNpcImage } from "../../helpers/NpcHelpers";

export class Lvl180 extends Npc {
    constructor(instance, x, y) {
        super(instance, x, y);
        this.type = "lvl180";
        this.size = 4;
        this.width = 4;
        this.height = 4;
        this.isMelee = true;
        this.attackSpeed = 4;
        this.image = loadNpcImage(180, instance.game);
    }
}
