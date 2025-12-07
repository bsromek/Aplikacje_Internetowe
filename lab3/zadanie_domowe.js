const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;
const groundImgSrc = 'assets/Flappy Bird/base.png';
const pipeImgSrc = 'assets/Flappy Bird/pipe-green.png';
const bgImgSrc = 'assets/Flappy Bird/background-day.png';
const birdFrames = ['assets/Flappy Bird/yellowbird-downflap.png','assets/Flappy Bird/yellowbird-midflap.png','assets/Flappy Bird/yellowbird-upflap.png'];
const audioFiles = {wing:'assets/Sound Efects/wing.wav',point:'assets/Sound Efects/point.wav',hit:'assets/Sound Efects/hit.wav',die:'assets/Sound Efects/die.wav'};
let sounds = {};
let images = {};
let bird = {x:80,y:200,w:34,h:24,frame:0,frameTick:0,vel:0,rot:0};
let gravity = 0.6;
let jump = -9.5;
let pipes = [];
let pipeSpeed = 2.2;
let gapMin = 110;
let gapMax = 165;
let spawnInterval = 1500;
let lastSpawn = 0;
let score = 0;
let gameState = 'start';
let lastTime = 0;
let groundY = H - 112;
let deadTimeout = null;
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const scoreEl = document.getElementById('score');
const bestListEl = document.getElementById('bestList');
const lastScoreEl = document.getElementById('lastScore');
loadAudio();

function loadAudio() {
    for (const k in audioFiles) {
        const a = new Audio();
        a.src = audioFiles[k];
        a.preload = 'auto';
        sounds[k] = a;
    }
}

function loadImages(cb) {
    const list = [groundImgSrc,pipeImgSrc,bgImgSrc,...birdFrames];
    let cnt = 0;
    const total = list.length;
    list.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            cnt++;
            if (cnt >= total)
                cb();
        };
        images[src] = img;
    });
}

loadImages(() => {
    drawInitial();
});

window.addEventListener('keydown', e => {
    if (e.code == 'Space') {
        e.preventDefault();
        onFlap();
    }
});

window.addEventListener('mousedown', () => {
    onFlap();
});

function onFlap() {
    if (gameState == 'start')
        startGame();
    else if (gameState == 'playing') {
        bird.vel = jump;
        playSound('wing');
    } 
    else if (gameState == 'dead') {
        if (deadTimeout) {
            clearTimeout(deadTimeout);
            deadTimeout = null;
            gameState = 'over';
            showGameOver();
        }
    } 
    else if (gameState == 'over')
        restartGame();
}

function startGame() {
    pipes = [];
    score = 0;
    bird.y = 200;
    bird.vel = 0;
    bird.frame = 0;
    lastSpawn = performance.now();
    gameState = 'playing';
    scoreEl.innerText = score;
    requestAnimationFrame(loop);
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
}

function restartGame() {
    gameOverScreen.classList.add('hidden');
    startGame();
}

function spawnPipe() {
    const gap = gapMin + Math.random() * (gapMax - gapMin);
    const topH = 50 + Math.random() * (groundY - gap - 120);
    pipes.push({x: W,top: topH,gap: gap});
}

function playSound(name) {
    const s = sounds[name];
    if (s) {
        s.currentTime = 0;
        s.play();
    }
}

function loop(ts) {
    if (!lastTime)
        lastTime = ts;
    const dt = ts - lastTime;
    lastTime = ts;
    update(dt);
    draw();
    if (gameState == 'playing' || gameState == 'dead')
        requestAnimationFrame(loop);
}

function update(dt) {
    bird.frameTick += dt;
    if (bird.frameTick > 80) {
        bird.frame = (bird.frame + 1) % birdFrames.length;
        bird.frameTick = 0;
    }
    if (gameState == 'playing') {
        bird.vel += gravity;
        bird.y += bird.vel;
        bird.rot = Math.max(-25, Math.min(90, bird.vel * 6));
        for (let p of pipes)
            p.x -= pipeSpeed;
        if (performance.now() - lastSpawn > spawnInterval) {
            spawnPipe();
            lastSpawn = performance.now();
        }
        if (pipes.length && pipes[0].x < -60)
            pipes.shift();
        for (let p of pipes) {
            if (!p.scored && p.x + 52 < bird.x) {
                p.scored = true;
                score++;
                scoreEl.innerText = score;
                playSound('point');
            }
        }
        for (let p of pipes) {
            const pipeW = 52;
            const topRect = {x:p.x,y:0,w:pipeW,h:p.top};
            const bottomRect = {x:p.x,y:p.top+p.gap,w:pipeW,h:groundY-(p.top+p.gap)};
            const birdRect = {x:bird.x-6,y:bird.y-6,w:bird.w,h:bird.h};
            if (rectIntersect(birdRect, topRect) || rectIntersect(birdRect, bottomRect)) {
                playSound('hit');
                playSound('die');
                gameState = 'dead';
                bird.vel = 2;
                break;
            }
        }
        if (bird.y + bird.h / 2 >= groundY  || bird.y - bird.h / 2 <= 0) {
            playSound('die');
            gameState = 'dead';
        }
    }
    else if (gameState == 'dead') {
        bird.vel += gravity;
        bird.y += bird.vel;
        bird.rot = Math.min(90, bird.rot + 6);
        if (bird.y + bird.h / 2 >= groundY) {
            bird.y = groundY - bird.h / 2;
            if (!deadTimeout) {
                deadTimeout = setTimeout(() => {
                    gameState = 'over';
                    deadTimeout = null;
                    showGameOver();
                }, 500);
            }
        }
    }
}

function rectIntersect(a, b) {
    return !((a.x + a.w < b.x) || (a.x > b.x + b.w) || (a.y + a.h < b.y) || (a.y > b.y + b.h));
}

function draw() {
    ctx.clearRect(0, 0, W, H);
    const bg = images[bgImgSrc];
    ctx.drawImage(bg, 0, 0, W, H);
    const pipeImg = images[pipeImgSrc];
    for (let p of pipes) {
        ctx.save();
        ctx.translate(p.x + 26, p.top);
        ctx.scale(1, -1);
        ctx.drawImage(pipeImg, -26, 0, 52, p.top);
        ctx.restore();
        ctx.drawImage(pipeImg,p.x,p.top + p.gap,52,groundY - (p.top + p.gap));
    }
    const ground = images[groundImgSrc];
    ctx.drawImage(ground, 0, groundY, W, ground.height);
    const birdImg = images[birdFrames[bird.frame]];
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate((bird.rot * Math.PI) / 180);
    ctx.drawImage(birdImg, -bird.w / 2, -bird.h / 2, bird.w, bird.h);
    ctx.restore();
}

function drawInitial() {
    ctx.clearRect(0, 0, W, H);
    const bg = images[bgImgSrc];
    ctx.drawImage(bg, 0, 0, W, H);
}

function showGameOver() {
    const key = 'flappy_top5';
    let top = JSON.parse(localStorage.getItem(key) || '[]');
    const last = score;
    top.push(last);
    top.sort((a, b) => b - a);
    top = top.slice(0, 5);
    localStorage.setItem(key, JSON.stringify(top));
    localStorage.setItem('flappy_last', String(last));
    lastScoreEl.innerText = last;
    scoreEl.innerText = score;
    bestListEl.innerHTML = '';
    top.forEach(s => {
        const li = document.createElement('li');
        li.innerText = s;
        bestListEl.appendChild(li);
    });
    gameOverScreen.classList.remove('hidden');
}