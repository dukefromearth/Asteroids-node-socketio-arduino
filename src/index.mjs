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

const socket = io();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = Math.min(window.innerWidth - 17, window.innerHeight - 17);
canvas.height = canvas.width;

//Images
const burst1Img = document.getElementById('burst1');
const backgroundParallax = getImagesReturnArr("bkgd_", 7);
const ship = document.getElementById('ship');
const ast_explode = document.getElementById('ast_explode');
const asteroid = document.getElementById('asteroid');

//Game assets
const player = new Player(canvas.width / 2, canvas.height - 100, ship, 392, 338, 0.25);
const virtualWand = new VirtualWand(canvas.width / 2, canvas.height - 100, 'red', burst1Img);
const background = new Background(backgroundParallax, canvas);
var wand = {};
var asteroids = [];
var lastAsteroid = 0;
var astTree = new rbush;
var laserTree = new rbush;
var score = 0;

socket.emit('new player');

function getAsteroid() {
    let randX = Math.random() * canvas.width;
    const explode_sprite = new Sprite(randX, -200, ast_explode, 32, 32, 1, 24, 24, Math.random() * Math.PI);
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
    laserTree.clear();
    laserTree.load(player.lasers);
    background.draw(ctx);
    player.update(wand, canvas);
    player.draw(ctx);
    if (astTree.collides(getMinMax(player))) {
        let c = astTree.search(getMinMax(player));
        for (let i in c) {
            if(c[i].alive) score -= 100;
            c[i].alive = false;
            
        }
    }
    for(let i in asteroids){
        let a = asteroids[i];
        if(laserTree.collides(getMinMax(a))){
            if(a.alive) score += 10;
            a.alive = false;
            
        }
    }
    if (Date.now() - lastAsteroid > 200) {
        asteroids.push(getAsteroid());
        lastAsteroid = Date.now();
    }
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
    ctx.fillStyle = 'white';
    ctx.font = "36px Impact"
    ctx.fillText("SCORE: " + score, 50, 50);
    requestAnimationFrame(run);
}

window.onload = run();