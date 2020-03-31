export class Particles {
    constructor(quantity, canvas, img) {
        this.particles = [];
        this.img = img;
        console.log(img);
        this.init(quantity, canvas);
    }
    init(quantity, canvas) {
        let down = -3 * Math.PI / 2;
        for (let i = 0; i < quantity; i++) {
            let randX = Math.random() * canvas.width;
            let randY = Math.random() * canvas.height;
            this.particles.push(new Particle(randX, randY, down, Math.random() * 1 + 2, Math.random() * 3 + 2, 'black', canvas.height, canvas.width));
        }
    }
    draw(ctx, playerX, playerY) {
        ctx.save();
        var self = this;
        this.particles.forEach(function (p) {
            p.draw(ctx, playerX, playerY, self.img);
        });
        ctx.restore();
    }
}

export class Particle {
    constructor(x, y, ang, r, spd, clr, max_y, max_x) {
        this.x = x;
        this.y = y;
        this.ang = ang;
        this.r = r;
        this.spd = spd;
        this.clr = clr;
        this.max_y = max_y;
        this.max_x = max_x;
        this.width = r;
        this.height = r;
        this.repel = false;
        this.oRadius = Math.random() * 50 + 50;
        this.oAng = Math.random() * 2 * Math.PI - Math.PI;
        this.orbit = false;
        this.rAng = 0;
        this.minX = this.x - r / 2;
        this.maxX = this.x + r / 2;
        this.minY = this.y - r / 2;
        this.maxY = this.y + r / 2;
    }
    reset() {
        this.y = -Math.random() * this.max_y;
        this.x = Math.random() * this.max_x;
        this.ang = - 3 * Math.PI / 2;
        this.repel = false;
        this.orbit = false;
        this.clr = 'black';
        this.minX = this.x - this.r / 2;
        this.maxX = this.x + this.r / 2;
        this.minY = this.y - this.r / 2;
        this.maxY = this.y + this.r / 2;
    }
    update(playerX, playerY) {
        if (this.x >= 0 && this.x <= this.max_x && this.y >= 0 && this.y <= this.max_y) {
            let ang = this.ang;
            let spd = this.spd;
            if (this.orbit) {
                let dist = Math.sqrt(Math.pow(playerX - this.x, 2) + Math.pow(playerY - this.y, 2));
                if (dist > this.oRadius) ang = Math.atan2(playerY - this.y, playerX - this.x);
                else ang = this.oAng;
                spd = spd * 2;
                this.oAng += 0.1;
            } else if (this.repel) {
                ang = this.oAng;
                spd = spd * 5;
            }
            this.x += Math.cos(ang) * spd;
            this.y += Math.sin(ang) * spd;
            this.minX = this.x - this.r / 2;
            this.maxX = this.x + this.r / 2;
            this.minY = this.y - this.r / 2;
            this.maxY = this.y + this.r / 2;
        } else {
            this.reset();
        }
    }
    draw(ctx, playerX, playerY, img) {
        this.update(playerX, playerY);
        ctx.drawImage(img, this.x, this.y, 15, 15);
        // ctx.fillStyle = this.clr;
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        // ctx.fill();
    }
}