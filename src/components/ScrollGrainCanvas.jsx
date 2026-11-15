import React, { useEffect, useRef } from 'react';

export default function ScrollGrainCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        let w = 0, h = 0;
        let lastScrollY = window.scrollY;
        let scrollVelocity = 0;
        let rafId = null;

        const PARTICLE_COUNT = 44;
        const MAX_DIST_SQ = 88 * 88;
        const particles = [];

        function resize() {
            w = window.innerWidth;
            h = window.innerHeight;
            // Use 1x resolution for subtle background dust to cut laptop GPU fill-rate by 4x
            canvas.width = w;
            canvas.height = h;
        }

        resize();
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                r: 1.1 + Math.random() * 1.2,
                gold: i % 2 === 0
            });
        }

        const onScroll = () => {
            const currentY = window.scrollY;
            const delta = currentY - lastScrollY;
            scrollVelocity = Math.max(-14, Math.min(14, scrollVelocity + delta * 0.14));
            lastScrollY = currentY;
        };

        window.addEventListener('resize', resize);
        window.addEventListener('scroll', onScroll, { passive: true });

        function tick() {
            ctx.clearRect(0, 0, w, h);
            scrollVelocity *= 0.9;

            // Update positions
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy - scrollVelocity * 0.32;
                if (p.x < 0) p.x = w;
                else if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                else if (p.y > h) p.y = 0;
            }

            // Batch 1: Gold dust particles (single draw call)
            ctx.fillStyle = 'rgba(184, 134, 59, 0.24)';
            ctx.beginPath();
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const p = particles[i];
                if (!p.gold) continue;
                ctx.moveTo(p.x + p.r, p.y);
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            }
            ctx.fill();

            // Batch 2: Crimson dust particles (single draw call)
            ctx.fillStyle = 'rgba(130, 23, 46, 0.20)';
            ctx.beginPath();
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const p = particles[i];
                if (p.gold) continue;
                ctx.moveTo(p.x + p.r, p.y);
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            }
            ctx.fill();

            // Batch 3: Constellation filaments (single draw call, no Math.hypot)
            if (window.scrollY > 40) {
                ctx.strokeStyle = 'rgba(184, 134, 59, 0.08)';
                ctx.lineWidth = 0.65;
                ctx.beginPath();
                for (let i = 0; i < PARTICLE_COUNT; i++) {
                    const p = particles[i];
                    for (let j = i + 1; j < PARTICLE_COUNT; j++) {
                        const q = particles[j];
                        const dx = p.x - q.x;
                        const dy = p.y - q.y;
                        if (dx * dx + dy * dy < MAX_DIST_SQ) {
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(q.x, q.y);
                        }
                    }
                }
                ctx.stroke();
            }

            rafId = requestAnimationFrame(tick);
        }

        rafId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return <canvas id="scrollGrainCanvas" ref={canvasRef} aria-hidden="true" />;
}
