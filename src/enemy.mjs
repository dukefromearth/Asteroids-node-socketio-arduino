import Laser from "./laser.mjs";
import Sprite from "./sprite.mjs";

export default class Enemy {
    constructor(x, y, ship, dimx, dimy, scale, gun2Sprite) {
        this.x = x;
        this.y = y;
        this.width = dimx * scale;
        this.height = dimy * scale;
        this.ship = ship;
        this.lasers = [];
        this.missiles = [];
        this.timeAtLastShot = 0;
        this.gun2 = gun2Sprite;
        this.particles = [];
        this.health = 1000;
        this.tx = x;
        this.ty = y;
        this.hp = 100;
        this.lastShotTime = Date.now();
    }
    update(player, canvas) {
        this.x += Math.cos(Math.atan2(player.y - this.y, player.x - this.x)) * 7;
        for(let i in this.missiles) {
            let missile = this.missiles[i];
            let ang = Math.atan2(player.y + player.height / 2 - missile.y, player.x + player.width / 2 - missile.x);
            missile.ang = ang;
            missile.x += Math.cos(missile.ang) * 8;
            missile.y += Math.sin(missile.ang) * 8;
            missile.updateMinMax();
            if(!missile.alive) this.missiles.splice(i,1);
        }
        if (Date.now() - this.lastShotTime > 300) {
            var newMissile = new Sprite(canvas.width / 2, 100, this.gun2.image, 400, 100, 1, 3, 3, 0, 0.15);;
            newMissile.x = this.x + this.width/2;
            newMissile.y = this.y + this.width;
            newMissile.ang = Math.atan2(player.y - this.y, player.x - this.x);
            newMissile.loop = true;
            this.missiles.push(newMissile);
            this.lastShotTime = Date.now();
        }
    }
    draw(ctx) {
        ctx.drawImage(this.ship, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        this.missiles.forEach(function (missile) {
            missile.draw(ctx);
        })
    }
}