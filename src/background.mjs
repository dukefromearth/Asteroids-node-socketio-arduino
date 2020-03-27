export default class Background {
    constructor(imgs, canvas) {
        this.canWidth = canvas.width;
        this.canHeight = canvas.height;
        this.imgs = imgs;
        this.speed = 1;
        this.imgHeights = [];
        this.init();
    }
    init() {
        for (let i in this.imgs) {
            this.imgHeights.push(i);
        }
    }
    draw(ctx) {
        ctx.drawImage(this.imgs[0], 0, 0, this.canWidth, this.canHeight);
        for (let i = 1; i < this.imgs.length; i++) {
            // draw image 1 
            ctx.drawImage(this.imgs[i], 0, this.imgHeights[i], this.canWidth, this.canHeight);
            // draw image 2 
            ctx.drawImage(this.imgs[i], 0, this.imgHeights[i] - this.canHeight, this.canWidth, this.canHeight);
            this.imgHeights[i] += i * this.speed;
            if (this.imgHeights[i] >= this.canHeight) this.imgHeights[i] = 0;
        }
    }
}

