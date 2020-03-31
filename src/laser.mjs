export default class Laser {
    constructor(x, y, ang, speed, length, color, width) {
        this.x = x;
        this.y = y;
        this.ang = ang;
        this.speed = speed;
        this.length = length;
        this.color = color;
        this.width = width;
        this.minX = this.x - this.width / 2;
        this.maxX = this.x + this.width / 2;
        this.minY = this.y - this.length / 2;
        this.maxY = this.y + this.length / 2;
        this.bAng = 0.01;
        this.alive = true;
    }
    update() {
        this.y -= this.speed;//Math.tan(this.bAng += 0.02) * this.speed;
        this.x += Math.sin(this.bAng += 0.8) * 5;
        this.minX = this.x - this.width / 2;
        this.maxX = this.x + this.width / 2;
        this.minY = this.y - this.length / 2;
        this.maxY = this.y + this.length / 2;
    }
    draw(ctx) {
        if (this.alive) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = this.width;
            ctx.strokeStyle = this.color;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y - this.length);
            ctx.stroke();
            ctx.restore();
        }
    }
}