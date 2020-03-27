import Sprite from "./sprite.mjs";

export default class VirtualWand {
    constructor(x, y, color, shot_img) {
        this.x = x;
        this.y = y;
        this.wandX = 0;
        this.wandY = 0;
        this.wandZ = 0;
        this.wandEndX = 0;
        this.wandEndY = 0;
        this.color = color;
        this.shots = [];
        this.ang = 0;
        this.shot_img = shot_img;
        this.shots.push(new Sprite(x, y, shot_img, 256, 256, 4, 8, 32));
    }
    update(wand) {
        this.wandX = wand.x;
        this.wandY = wand.y;
        this.wandZ = wand.z;
        this.wandEndX = wand.x * 8 + this.x;
        this.wandEndY = wand.y * 8 + this.y;
        this.ang = Math.atan2(this.wandEndY - this.y, this.wandEndX - this.x);
    }
    shoot() {
        if (this.shots.length > 100) this.shots.shift();
        this.shots.push(new Sprite(this.wandEndX, this.wandEndY, this.shot_img, 256, 256, 4, 8, 32, this.ang));
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.wandEndX, this.wandEndY);
        ctx.stroke();
        this.shots.forEach(function (shot) {
            if (shot.alive) {
                shot.update();
                shot.draw(ctx);
            }
        });
    }
}

