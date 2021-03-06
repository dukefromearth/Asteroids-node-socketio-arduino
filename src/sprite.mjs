export default class Sprite {
    constructor(x, y, image, dimx, dimy, rows, cols, quantity, ang, scale, speed) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.dimx = dimx;
        this.dimy = dimy;
        this.quantity = quantity;
        this.ang = ang;
        this.curr_col = 0;
        this.curr_row = 0;
        this.cols = cols;
        this.rows = rows;
        this.last_update = 0;
        this.scale = scale || 1;
        this.width = dimx * this.scale;
        this.height = dimy * this.scale;
        this.minX = x - this.width / 2;
        this.maxX = x + this.width / 2;
        this.minY = y - this.height / 2;
        this.maxY = y + this.height / 2;
        this.speed = 1000/speed || 1000/30
        this.loop = false;
        this.alive = true;
        this.curr = 0;
    }
    updateMinMax() {
        this.minX = this.x - this.width / 2;
        this.maxX = this.x + this.width / 2;
        this.minY = this.y - this.height / 2;
        this.maxY = this.y + this.height / 2;
    }
    update() {
        this.x += Math.cos(this.ang) * 40;
        this.y += Math.sin(this.ang) * 40;
    }

    draw(ctx) {
        if (this.alive || this.loop) {
            if (Date.now() - this.last_update > 1000 / this.speed) {
                if ((this.curr_row + 1) * (this.curr_col + 1) >= this.quantity) {
                    this.curr_col = 0;
                    this.curr_row = 0;
                    if (!this.loop) this.alive = false;
                }
                else if (this.curr_col >= this.cols - 1) {
                    this.curr_col = 0;
                    this.curr_row += 1;
                }
                else {
                    this.curr_col++;
                }
                this.last_update = Date.now();
            }
            ctx.save();
            ctx.translate(this.x - this.width / 2, this.y - this.height / 2);
            ctx.rotate(this.ang);
            ctx.drawImage(this.image,
                this.curr_col * this.dimx,
                this.curr_row * this.dimy,
                this.dimx,
                this.dimy,
                0,
                0,
                this.dimx * this.scale,
                this.dimy * this.scale
            );
            ctx.restore();
        }
    }

}
