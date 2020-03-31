/* 
Art provided by 
https://opengameart.org/users/ashishlko11 
LuminousDragonGames - https://opengameart.org/content/parallax-space-scene-seamlessly-scrolls-too
wubitog and Skorpio ( http://opengameart.org/users/skorpio
https://opengameart.org/users/jasper
*/
import VirtualWand from './virtualWand.mjs';
import Sprite from './sprite.mjs';
import Background from './background.mjs';
import Player from './player.mjs';
import Asteroid from './asteroid.mjs';
import { Particle, Particles } from './particles.mjs';
import Enemy from './enemy.mjs';

const socket = io();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = Math.min(window.innerWidth - 17, window.innerHeight - 17);
canvas.height = canvas.width;

//Images
const backgroundParallax = getImagesReturnArr("bkgd_", 7);
const ship = document.getElementById('ship');
const ship2 = document.getElementById('ship2');
const ast_explode = document.getElementById('ast_explode2');
const asteroid = document.getElementById('asteroid');
const particleImg = document.getElementById('particle');
const missilesImg = document.getElementById('missiles');
const explosions2 = document.getElementById('explosions2');

//Game assets
const player = new Player(canvas.width / 2, canvas.height - 100, ship, 392, 338, 0.15);
const missileSprite = new Sprite(canvas.width / 2, 100, missilesImg, 400, 100, 1, 3, 3, 0, 0.15);
const enemy = new Enemy(canvas.width / 2, 100, ship2, 392, 338, 0.25, missileSprite);
const background = new Background(backgroundParallax, canvas);
var wand = {};
var asteroids = [];
var lastAsteroid = 0;
var astTree = new rbush;
var laserTree = new rbush;
var particleTree = new rbush;
var particleTree2 = new rbush;
var missileTree = new rbush;
var particles = new Particles(10, canvas, particleImg);
player.particles = particles;
var score = 0;
var distance = 0;
var explosions = [];

socket.emit('new player');

function getAsteroid() {
    let randX = Math.random() * canvas.width;
    const explode_sprite = new Sprite(randX, -200, ast_explode, 200, 200, 1, 9, 9, Math.random() * Math.PI);
    return new Asteroid(randX, -200, 68, 68, Math.random() * 10 + 5, asteroid, explode_sprite)
}

function getImagesReturnArr(name, qty) {
    let imgs = [];
    for (let i = 0; i < qty; i++) {
        let imgName = name + i;
        imgs.push(document.getElementById(imgName))
    }
    return imgs;
}

function getMinMax(object) {
    if (!object || !object.x || !object.y || !object.width || !object.height) throw ("Invalid object in minmax");
    return {
        minX: object.x - object.width / 2,
        maxX: object.x + object.width / 2,
        minY: object.y - object.height / 2,
        maxY: object.y + object.height / 2
    }
}

//Triggers when we recieve a new hit from the server
socket.on('wand', function (wand_from_server) {
    wand = wand_from_server;
});

const run = () => {
    astTree.clear();
    astTree.load(asteroids);
    missileTree.clear();
    missileTree.load(enemy.missiles);
    laserTree.clear();
    laserTree.load(player.lasers);
    particleTree.clear();
    particleTree.load(player.particles.particles);
    let pTree = [];
    for (let i in player.particles.particles) {
        let p = player.particles.particles[i];
        if (p.repel || p.orbit) pTree.push(p);
    }
    particleTree2.clear();
    particleTree2.load(pTree);
    background.draw(ctx);
    player.update(wand, canvas);
    player.draw(ctx);
    if (distance > 1000) {
        if (enemy.hp <= 0) {
                explosions.push(new Sprite(Math.random() * canvas.width, Math.random() * canvas.height, explosions2, 640, 640, 1, 15, 15, 0, Math.random() * 1, 15));
        } else {
            enemy.draw(ctx);
            enemy.update(player, canvas);
        }
    }
    for (let i in explosions) {
        let e = explosions[i];
        if (e.alive) e.draw(ctx);
        else delete explosions[i];
    }
    if (laserTree.collides(getMinMax(enemy))) {
        let c = laserTree.search(getMinMax(enemy));
        for (let i in c) {
            let c2 = c[i];
            if (c2.alive) {
                score += 10;
                enemy.hp -= 10;
                explosions.push(new Sprite(c2.x, c2.y, explosions2, 640, 640, 1, 15, 15, 0, 0.25, 15));
            }
            c[i].alive = false;
            delete c[i];
        }
        for (let i in c) {
            delete c[i];
        }
    }
    if (missileTree.collides(getMinMax(player))) {
        let c = missileTree.search(getMinMax(player));
        for (let i in c) {
            if (c[i].alive) {
                score -= 100;
                c[i].alive = false;
                c[i].loop = false;
                explosions.push(new Sprite(player.x, player.y, explosions2, 640, 640, 1, 15, 15, 0, 0.25, 15))
            }
        }
    }
    for (let i in enemy.missiles) {
        let trig = false;
        let m = enemy.missiles[i];
        let hit = laserTree.search(m);
        for (let i in hit) {
            if (hit[i].alive) {
                explosions.push(new Sprite(hit[i].x, hit[i].y, explosions2, 640, 640, 1, 15, 15, 0, 0.25, 15));
                score += 10;
            }
            hit[i].alive = false;
            trig = true;
        }
        if (trig) {
            enemy.missiles[i].alive = false;
            enemy.missiles[i].loop = false;
        }
    }
    if (particleTree.collides(getMinMax(player))) {
        let c = particleTree.search(getMinMax(player));
        for (let i in c) {
            c[i].orbit = true;
            c[i].clr = 'aqua';
        }
    }
    if (astTree.collides(getMinMax(player))) {
        let c = astTree.search(getMinMax(player));
        for (let i in c) {
            if (c[i].alive) score -= 100;
            c[i].alive = false;
        }
    }
    for (let i in asteroids) {
        let a = asteroids[i];
        if (laserTree.collides(getMinMax(a))) {
            if (a.alive) {
                score += 10;
                for (let i = 0; i < 20; i++) {
                    let p = new Particle(a.x, a.y, 0, Math.random() * 1 + 2, Math.random() * 3 + 2, 'black', canvas.height, canvas.width);
                    p.orbit = true;
                    p.clr = 'aqua';
                    player.particles.particles.push(p);
                }
            }
            a.alive = false;
        } else if (particleTree2.collides(getMinMax(a))) {
            if (a.alive) {
                score += 10;
            }
            a.alive = false;
        }
    }
    if (Date.now() - lastAsteroid > 100) {
        asteroids.push(getAsteroid());
        lastAsteroid = Date.now();
    }
    if (distance > 500 && distance < 1000) {
        for (let i = 0; i < asteroids.length; i++) {
            let a = asteroids[i];
            if (a.y > canvas.height) {
                asteroids.splice(i, 1);
                i = i - 1;
            } else {
                a.update();
                a.draw(ctx);
            }
        }
    }
    if (wand.x < 0) background.speed = Math.max(-wand.x / 15, 2);
    else background.speed = 2;
    distance += background.speed;
    ctx.fillStyle = 'grey';
    ctx.font = "36px Impact"
    ctx.fillText("SCORE: " + score, 50, 50);
    if (player.particles.particles.length > 500) player.particles.particles.splice(0, player.particles.particles.length - 499);
    background.drawFog(ctx);
    requestAnimationFrame(run);
}

window.onload = run();