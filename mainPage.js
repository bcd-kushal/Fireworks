window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    cw = window.innerWidth,
    ch = window.innerHeight,

    fireworks = [],
    particles = [],

    hue = 120,
    limiterTotal = 5,
    limiterTick = 0,
    timerTotal = 150,
    timerTick = 0,
    mousedown = false,
    mx, my;

canvas.width = cw;
canvas.height = ch;

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function calculateDistance(p1x, p1y, p2x, p2y) {
    var xDistance = p1x - p2x,
        yDistance = p1y - p2y;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function Firework(sx, sy, tx, ty) {

    this.x = sx;
    this.y = sy;

    this.sx = sx;
    this.sy = sy;

    this.tx = tx;
    this.ty = ty;

    this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
    this.distanceTraveled = 0;

    this.coordinates = [];
    this.coordinateCount = 3;

    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = .7;
    this.acceleration = 1.01;
    this.brightness = random(60, 90);

    this.targetRadius = 1;
}

Firework.prototype.update = function (index) {

    this.coordinates.pop();

    this.coordinates.unshift([this.x, this.y]);

    if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }

    this.speed *= this.acceleration;

    var vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed;

    this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

    if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty);

        fireworks.splice(index, 1);
    } else {

        this.x += vx;
        this.y += vy;
    }
}

Firework.prototype.draw = function () {
    ctx.beginPath();

    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'rgba(255,255,255,0)';
    ctx.stroke();

    ctx.beginPath();

}

function Particle(x, y) {
    this.x = x;
    this.y = y;

    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }

    this.angle = random(0, Math.PI * 2);
    this.speed = random(1, 10);

    this.friction = 0.9;

    this.gravity = 0.8;

    this.hue = random(hue - 40, hue + 40);
    this.brightness = random(60, 80);
    this.alpha = 1.2;

    this.decay = random(0.015, 0.025);
}

Particle.prototype.update = function (index) {

    this.coordinates.pop();

    this.coordinates.unshift([this.x, this.y]);

    this.speed *= this.friction;

    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;

    this.alpha -= this.decay;

    if (this.alpha <= this.decay) {
        particles.splice(index, 1);
    }
}

Particle.prototype.draw = function () {
    ctx.beginPath();

    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
    ctx.stroke();
}

function createParticles(x, y) {
    var particleCount = 65;
    while (particleCount--) {
        particles.push(new Particle(x, y));
    }
}

function loop() {

    requestAnimFrame(loop);

    hue = random(0, 360);

    ctx.globalCompositeOperation = 'destination-out';

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, cw, ch);

    ctx.globalCompositeOperation = 'lighter';

    var i = fireworks.length;
    while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
    }

    var i = particles.length;
    while (i--) {
        particles[i].draw();
        particles[i].update(i);
    }

    if (timerTick >= timerTotal) {
        if (!mousedown) {

            let var1 = (4 * ch) / 5;

            if(window.innerWidth <= 500 ){
                setTimeout(() => { fireworks.push(new Firework(0, ch, random(0, cw), random(0, var1))) }, 0);
                setTimeout(() => { fireworks.push(new Firework(0, ch, random(0, cw), random(0, var1))) }, 200);
                setTimeout(() => { fireworks.push(new Firework(0, ch, random(0, cw), random(0, var1))) }, 400);
                setTimeout(() => { fireworks.push(new Firework(0, ch, random(0, cw), random(0, var1))) }, 800);
                setTimeout(() => { fireworks.push(new Firework(cw, ch, random(0, cw), random(0, var1))) }, 200);
                setTimeout(() => { fireworks.push(new Firework(cw, ch, random(0, cw), random(0, var1))) }, 330);
                setTimeout(() => { fireworks.push(new Firework(cw, ch, random(0, cw), random(0, var1))) }, 830);
                setTimeout(() => { fireworks.push(new Firework(cw, ch, random(0, cw), random(0, var1))) }, 1000);
                setTimeout(() => { fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, var1))) }, 0);
                setTimeout(() => { fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, var1))) }, 200);
                setTimeout(() => { fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, var1))) }, 800);
                setTimeout(() => { fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, var1))) }, 330);              
            } else {
                setTimeout(() => { fireworks.push(new Firework(0, ch, random(0, cw), random(0, var1))) }, 0);
                setTimeout(() => { fireworks.push(new Firework(0, ch, random(0, cw), random(0, var1))) }, 200);
                setTimeout(() => { fireworks.push(new Firework(0, ch, random(0, cw), random(0, var1))) }, 400);
                setTimeout(() => { fireworks.push(new Firework(0, ch, random(0, cw), random(0, var1))) }, 600);
                setTimeout(() => { fireworks.push(new Firework(0, ch, random(0, cw), random(0, var1))) }, 800);
                setTimeout(() => { fireworks.push(new Firework(0, ch, random(0, cw), random(0, var1))) }, 110);
                setTimeout(() => { fireworks.push(new Firework(0, ch, random(0, cw), random(0, var1))) }, 1000);
                setTimeout(() => { fireworks.push(new Firework(cw, ch, random(0, cw), random(0, var1))) }, 0);
                setTimeout(() => { fireworks.push(new Firework(cw, ch, random(0, cw), random(0, var1))) }, 200);
                setTimeout(() => { fireworks.push(new Firework(cw, ch, random(0, cw), random(0, var1))) }, 800);
                setTimeout(() => { fireworks.push(new Firework(cw, ch, random(0, cw), random(0, var1))) }, 330);
                setTimeout(() => { fireworks.push(new Firework(cw, ch, random(0, cw), random(0, var1))) }, 110);
                setTimeout(() => { fireworks.push(new Firework(cw, ch, random(0, cw), random(0, var1))) }, 830);
                setTimeout(() => { fireworks.push(new Firework(cw, ch, random(0, cw), random(0, var1))) }, 1000);
                setTimeout(() => { fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, var1))) }, 0);
                setTimeout(() => { fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, var1))) }, 200);
                setTimeout(() => { fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, var1))) }, 600);
                setTimeout(() => { fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, var1))) }, 800);
                setTimeout(() => { fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, var1))) }, 750);
                setTimeout(() => { fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, var1))) }, 330);
                setTimeout(() => { fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, var1))) }, 830);
            }
            timerTick = 0;
        }
    } else {
        timerTick++;
    }

    if (limiterTick >= limiterTotal) {
        if (mousedown) {
            fireworks.push(new Firework(cw / 2, ch, mx, my));
            limiterTick = 0;
        }
    } else {
        limiterTick++;
    }
}

canvas.addEventListener('mousemove', function (e) {
    mx = e.pageX - canvas.offsetLeft;
    my = e.pageY - canvas.offsetTop;
});

canvas.addEventListener('mousedown', function (e) {
    e.preventDefault();
    mousedown = true;
});

canvas.addEventListener('mouseup', function (e) {
    e.preventDefault();
    mousedown = false;
});

window.onload = loop;
