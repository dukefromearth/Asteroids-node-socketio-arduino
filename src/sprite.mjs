export default class Sprite {
    constructor(x, y, image, dimx, dimy, rows, cols, quantity, ang) {
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
        this.scale = 5;
        this.width = dimx * this.scale;
        this.height = dimy * this.scale;
        this.alive = true;
        this.curr = 0;
    }
    update() {
        this.x += Math.cos(this.ang) * 40;
        this.y += Math.sin(this.ang) * 40;
    }
    draw(ctx) {
        if (this.alive) {
            if (Date.now() - this.last_update > 1000 / 500) {
                if ((this.curr_row + 1) * (this.curr_col + 1) >= this.quantity) {
                    this.curr_col = 0;
                    this.curr_row = 0;
                    this.alive = false;
                }
                else if (this.curr_col >= this.cols - 1) {
                    this.curr_col = 0;
                    this.curr_row+=1;
                }
                else {
                    this.curr_col++;
                }
                console.log(this.curr_row, this.curr_col, this.curr++);
                this.last_update = Date.now();
            }
            ctx.save();
            ctx.translate(this.x - (this.dimx * this.scale) / 2, this.y - (this.dimy * this.scale) / 2);
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
