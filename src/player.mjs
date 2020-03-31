import Laser from "./laser.mjs";

export default class Player {
    constructor(x, y, ship, dimx, dimy, scale, gun2Sprite) {
        this.x = x;
        this.y = y;
        this.width = dimx * scale;
        this.height = dimy * scale;
        this.ship = ship;
        this.lasers = [];
        this.timeAtLastShot = 0;
        this.gun2 = gun2Sprite;
        this.particles = [];
        this.enemy = false;
    }
    update(wand, canvas) {
        if (wand.y < 0 && this.x - this.width / 2 > 0) {
            this.x -= Math.abs(wand.y) / 2;
        }
        else if (wand.y > 0 && this.x + this.width / 2 < canvas.width) {
            this.x += Math.abs(wand.y) / 2;
        }
        if (wand.x < 0 && this.y - this.height / 2 > 0) {
            this.y -= Math.abs(wand.x) / 2;
        }
        else if (wand.x > 0 && this.y + this.width / 2 < canvas.width) {
            this.y += Math.abs(wand.x) / 2;
        }
        if (!wand.b1 && Date.now() - this.timeAtLastShot > 100) {
            this.lasers.push(new Laser(this.x - this.width / 2.9, this.y - this.height / 2, 0, 15, 50, 'aqua', 3));
            this.lasers.push(new Laser(this.x + this.width / 2.9, this.y - this.height / 2, 0, 15, 50, 'aqua', 3));
            this.timeAtLastShot = Date.now();
        }
        if (!wand.b2 && Date.now() - this.timeAtLastShot > 100) {
            this.particles.particles.forEach(function (p) {
                if (p.orbit) {
                    p.orbit = false;
                    p.repel = true;
                }
            })
        }
    }
    draw(ctx) {
        if(!this.enemy) this.particles.draw(ctx, this.x, this.y);
        ctx.drawImage(this.ship, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        this.lasers.forEach(function (laser) {
            laser.update();
            laser.draw(ctx);
        })
    }
}