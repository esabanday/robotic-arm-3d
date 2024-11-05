let flowFieldCanvas;
let flowFieldCtx;
let flowField;
let flowFieldAnimation;

window.addEventListener('load', function() {
    flowFieldCanvas = document.getElementById('flowFieldCanvas');
    if (!flowFieldCanvas) {
        console.error('Flow field canvas not found');
        return;
    }
    flowFieldCtx = flowFieldCanvas.getContext('2d');
    resizeFlowField();
    flowField = new FlowFieldEffect(flowFieldCtx, flowFieldCanvas.width, flowFieldCanvas.height);
    flowField.animate();
});

window.addEventListener('resize', function() {
    cancelAnimationFrame(flowFieldAnimation);
    resizeFlowField();
    flowField = new FlowFieldEffect(flowFieldCtx, flowFieldCanvas.width, flowFieldCanvas.height);
    flowField.animate();
});

function resizeFlowField() {
    flowFieldCanvas.width = window.innerWidth;
    flowFieldCanvas.height = window.innerHeight;
    console.log('Resized flow field:', flowFieldCanvas.width, 'x', flowFieldCanvas.height);
}

class FlowFieldEffect {
    #ctx;
    #width;
    #height;
    constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.particles = [];
        this.#init();
        console.log('Flow field initialized with', this.particles.length, 'particles');
    }

    #init() {
        // Create particles
        for (let i = 0; i < 100; i++) {
            this.particles.push(new Particle(this.#width, this.#height));
        }
    }

    #drawLine(x1, y1, x2, y2) {
        this.#ctx.beginPath();
        this.#ctx.moveTo(x1, y1);
        this.#ctx.lineTo(x2, y2);
        this.#ctx.stroke();
    }

    animate() {
        console.log('Animating flow field');
        this.#ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.#ctx.fillRect(0, 0, this.#width, this.#height);
        this.#ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.#ctx.lineWidth = 1;

        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.#ctx);

            this.particles.forEach(otherParticle => {
                if (particle === otherParticle) return;

                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.#ctx.globalAlpha = 1 - distance / 100;
                    this.#drawLine(particle.x, particle.y, otherParticle.x, otherParticle.y);
                }
            });
        });

        this.#ctx.globalAlpha = 1;
        flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
    }
}

class Particle {
    constructor(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.maxWidth = width;
        this.maxHeight = height;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > this.maxWidth) this.speedX *= -1;
        if (this.y < 0 || this.y > this.maxHeight) this.speedY *= -1;
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}