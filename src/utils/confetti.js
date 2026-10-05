// Lightweight canvas confetti explosion for 2048 victory celebration
// Zero external package required, runs at 60 FPS

export function triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#fcd34d'];
    const particles = [];
    const count = 100;

    for (let i = 0; i < count; i++) {
        particles.push({
            x: width / 2,
            y: height / 2,
            w: Math.random() * 8 + 6,
            h: Math.random() * 6 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 16,
            vy: (Math.random() - 0.7) * 18,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 12,
            gravity: 0.35,
            opacity: 1,
            decay: Math.random() * 0.012 + 0.008
        });
    }

    let animationFrame;
    function render() {
        ctx.clearRect(0, 0, width, height);
        let alive = 0;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            if (p.opacity <= 0) continue;
            alive++;

            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.rotation += p.rotationSpeed;
            p.opacity -= p.decay;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        }

        if (alive > 0) {
            animationFrame = requestAnimationFrame(render);
        } else {
            cancelAnimationFrame(animationFrame);
            if (canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        }
    }

    animationFrame = requestAnimationFrame(render);
}
