const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
WIDTH = canvas.width;
HEIGHT = canvas.height;
// const scoreBar = document.querySelector('#scoreBar');

// Áudios
const soundBubble_1 = document.createElement('audio');
soundBubble_1.src = './sfx/egg-bubble-pop.wav';
const soundBubble_2 = document.createElement('audio');
soundBubble_2.src = './sfx/soap-bubble-sound.wav';
const soundBubble_3 = document.createElement('audio');
soundBubble_3.src = './sfx/liquid-bubble.wav';

let particles = [];
let gameFrame = 0; // controla o fluxo de bolinhas criadas
let score = 0; // pontuação

let mouse = {
    x: undefined,
    y: undefined
};

class Particle {
    constructor() {
        this.posX = Math.random() * WIDTH;
        this.posY = HEIGHT;
        this.width = Math.floor(Math.random() * (90 - 15) + 15);
        this.speed = Math.random() * (4 - 2) + 2;
        this.image = document.querySelector('#imgCanvas');
        this.filterColor = `hue-rotate(${Math.floor(Math.random() * 360)}deg) opacity(${Math.floor(Math.random() * (100 - 30) + 30)}%)`;
    }
    draw() {
        ctx.save();
        ctx.filter = this.filterColor;
        ctx.drawImage(this.image, this.posX, this.posY, this.width, this.width);
        ctx.restore();
    }
    update() {
        this.posY -= this.speed;
    }
};

// Desenha as bolinhas
function drawParticles() {
    if(gameFrame % 50 === 0) {
        particles.push(new Particle());
    }
    for(let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
        if(particles[i] < 0) {
            particles.splice(i, 1);
        }
    }
    for(let i = 0; i < particles.length; i++) {
        if(particles[i].posY < 0 - particles[i].width * 2) {
            particles.splice(i, 1);
            console.log(particles)
        }
    }
};

// Deleta as bolinhas quando clicadas
function deleteParticle(e) {
    let cnv = this.getBoundingClientRect();
    mouse.x = e.clientX - cnv.left;
    mouse.y = e.clientY - cnv.top;
    particles.forEach((particle, index) => {
        let dx = mouse.x - particle.posX;
        let dy = mouse.y - particle.posY;
        let dist = (dx * dx + dy * dy) < (particle.width * particle.width);
        if(dist) {
            if(particle.width < 30) {
                soundBubble_1.play();
                score += 3;
                // scoreBar.value += 3;
            }
            else if(particle.width > 30 && particle.width < 60) {
                soundBubble_2.play();
                score += 2;
                // scoreBar.value += 2;
            }
            else if(particle.width > 60) {
                soundBubble_3.play();
                score += 1;
                // scoreBar.value += 1;
            }
            particles.splice(index, 1);

        }
    })
};

canvas.addEventListener('mousedown', deleteParticle);

function anim() {
    ctx.clearRect(0,0, WIDTH, HEIGHT);
    gameFrame++;
    drawParticles();
    ctx.font = '30px serif';
    ctx.fillStyle = 'red';
    ctx.fillText('Pontuação: ' + score, 10, 30);
    requestAnimationFrame(anim);
};