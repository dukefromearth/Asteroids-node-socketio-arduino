export default class Laser{
    constructor(x, y, ang, speed, length, color, width){
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
    }
    update(){
        this.y -= this.speed;
        this.minX = this.x - this.width / 2;
        this.maxX = this.x + this.width / 2;
        this.minY = this.y - this.length / 2;
        this.maxY = this.y + this.length / 2;
    }
    draw(ctx){
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