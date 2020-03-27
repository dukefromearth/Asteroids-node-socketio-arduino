export default class Asteroid {
    constructor(x, y, width, height, speed, ast_img, explode_sprite) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.img = ast_img;
        this.explode_sprite = explode_sprite;
        this.alive = true;
        this.ang = 0;
        this.ang_rotation = Math.random() * 0.2 - 0.1;
        this.scale = Math.random() * 2;
        this.width = width * this.scale;
        this.height = height * this.scale;
        this.minX = this.x - this.width / 2;
        this.maxX = this.x + this.width / 2;
        this.minY = this.y - this.height / 2;
        this.maxY = this.y + this.height / 2;
    }
    update() {
        this.y += this.speed;
        this.minX = this.x - this.width / 2;
        this.maxX = this.x + this.width / 2;
        this.minY = this.y - this.height / 2;
        this.maxY = this.y + this.height / 2;
        this.explode_sprite.y += this.speed;
    }
    draw(ctx) {
        if (!this.alive) {
            this.explode_sprite.draw(ctx);
        } else {
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(this.ang);
            this.ang += this.ang_rotation;
            ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        }
    }
}