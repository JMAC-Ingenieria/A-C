/* =========================================================
   FONDO INTERACTIVO LOW-POLY (MALLA DE ELEMENTOS FINITOS)
========================================================= */
(function () {
    let canvas = document.getElementById('mesh-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'mesh-canvas';
        document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width, height, cols, rows;
    let points = [];
    const spacing = 85; // Tamaño de los triángulos
    const mouse = { x: -9999, y: -9999, radius: 260 };

    function initMesh() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        cols = Math.ceil(width / spacing) + 2;
        rows = Math.ceil(height / spacing) + 2;
        points = [];

        for (let r = 0; r <= rows; r++) {
            for (let c = 0; c <= cols; c++) {
                const baseX = (c - 1) * spacing;
                const baseY = (r - 1) * spacing;
                // Variación aleatoria para lograr el aspecto poligonal orgánico
                const jitterX = (Math.random() - 0.5) * spacing * 0.65;
                const jitterY = (Math.random() - 0.5) * spacing * 0.65;

                points.push({
                    ox: baseX + jitterX,
                    oy: baseY + jitterY,
                    x: baseX + jitterX,
                    y: baseY + jitterY,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.008 + Math.random() * 0.012
                });
            }
        }
    }

    function drawTriangle(p1, p2, p3, time) {
        const cx = (p1.x + p2.x + p3.x) / 3;
        const cy = (p1.y + p2.y + p3.y) / 3;

        // Distancia al cursor
        const dx = cx - mouse.x;
        const dy = cy - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / mouse.radius);

        // Iluminación direccional suave + onda animada
        const wave = Math.sin(cx * 0.006 + cy * 0.005 + time * 0.0012) * 0.5 + 0.5;
        const light = Math.min(1, wave * 0.35 + proximity * 0.85);

        // Colores base oscuros que brillan en azul/cian al acercar el mouse
        const r = Math.floor(8 + light * 22);
        const g = Math.floor(18 + light * 155);
        const b = Math.floor(38 + light * 205);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.28 + proximity * 0.42})`;
        ctx.fill();

        // Aristas sutiles que se iluminan cerca del cursor
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.06 + proximity * 0.38})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
    }

    function animate(time) {
        ctx.clearRect(0, 0, width, height);

        // Actualizar posiciones de vértices
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            const waveX = Math.sin(time * 0.001 + p.phase) * 10;
            const waveY = Math.cos(time * 0.001 + p.phase) * 10;

            let targetX = p.ox + waveX;
            let targetY = p.oy + waveY;

            // Desplazamiento reactivo al mouse
            const dx = targetX - mouse.x;
            const dy = targetY - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius && dist > 0) {
                const force = (1 - dist / mouse.radius) * 22;
                targetX += (dx / dist) * force;
                targetY += (dy / dist) * force;
            }

            p.x += (targetX - p.x) * 0.12;
            p.y += (targetY - p.y) * 0.12;
        }

        // Dibujar malla triangular
        const rowStride = cols + 1;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const i = r * rowStride + c;
                const p1 = points[i];
                const p2 = points[i + 1];
                const p3 = points[i + rowStride];
                const p4 = points[i + rowStride + 1];

                drawTriangle(p1, p2, p3, time);
                drawTriangle(p2, p4, p3, time);
            }
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', initMesh);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    initMesh();
    requestAnimationFrame(animate);
})();

/* =========================================================
   ANIMACIONES DE ENTRADA Y EFECTO 3D EN TARJETAS
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Aparición suave al hacer scroll
    const animatedEls = document.querySelectorAll('.fade-in, .slide-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    animatedEls.forEach((el) => observer.observe(el));

    // Inclinación 3D sutil al pasar el cursor sobre tarjetas
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y / rect.height) - 0.5) * -8;
            const rotateY = ((x / rect.width) - 0.5) * 8;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
});
