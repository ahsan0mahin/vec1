// ===================================
// Global Utilities
// ===================================
const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;

function drawArrow(ctx, fromX, fromY, toX, toY, color, lineWidth = 2.5, headLen = 12) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
}

function drawDashedLine(ctx, fromX, fromY, toX, toY, color, lineWidth = 1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawArc(ctx, cx, cy, radius, startAngle, endAngle, color, label, labelRadius) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, -startAngle, -endAngle, true);
    ctx.stroke();

    if (label) {
        const midAngle = -(startAngle + endAngle) / 2;
        const lr = labelRadius || radius + 15;
        const lx = cx + lr * Math.cos(midAngle);
        const ly = cy + lr * Math.sin(midAngle);
        ctx.fillStyle = color;
        ctx.font = 'bold 14px "Noto Sans Bengali", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, lx, ly);
    }
}

function drawLabel(ctx, text, x, y, color, fontSize = 14, align = 'center') {
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px "Noto Sans Bengali", sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
}

function drawPoint(ctx, x, y, color, radius = 4) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawRightAngleMarker(ctx, x, y, size, angle1, angle2, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    const cos1 = Math.cos(angle1), sin1 = Math.sin(angle1);
    const cos2 = Math.cos(angle2), sin2 = Math.sin(angle2);
    ctx.beginPath();
    ctx.moveTo(x + size * cos1, y - size * sin1);
    ctx.lineTo(x + size * cos1 + size * cos2, y - size * sin1 - size * sin2);
    ctx.lineTo(x + size * cos2, y - size * sin2);
    ctx.stroke();
}

// ===================================
// Hero Canvas Animation
// ===================================
(function () {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    function animateHero() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const ox = 80, oy = 150;
        const angle = toRad(30 + 10 * Math.sin(t * 0.02));
        const pLen = 120 + 20 * Math.sin(t * 0.015);
        const qLen = 100 + 15 * Math.cos(t * 0.018);

        const px = ox + pLen, py = oy;
        const qx = ox + qLen * Math.cos(angle), qy = oy - qLen * Math.sin(angle);
        const cx = px + (qx - ox), cy = py + (qy - oy);

        // Parallelogram fill
        ctx.fillStyle = 'rgba(76, 201, 240, 0.08)';
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(px, py);
        ctx.lineTo(cx, cy);
        ctx.lineTo(qx, qy);
        ctx.closePath();
        ctx.fill();

        // Dashed lines
        drawDashedLine(ctx, px, py, cx, cy, 'rgba(255,255,255,0.15)');
        drawDashedLine(ctx, qx, qy, cx, cy, 'rgba(255,255,255,0.15)');

        // Vectors
        drawArrow(ctx, ox, oy, px, py, '#4cc9f0', 2.5);
        drawArrow(ctx, ox, oy, qx, qy, '#f72585', 2.5);
        drawArrow(ctx, ox, oy, cx, cy, '#06d6a0', 3);

        // Labels
        drawLabel(ctx, 'P⃗', (ox + px) / 2, py + 20, '#4cc9f0', 16);
        drawLabel(ctx, 'Q⃗', (ox + qx) / 2 - 15, (oy + qy) / 2, '#f72585', 16);
        drawLabel(ctx, 'R⃗ = P⃗ + Q⃗', (ox + cx) / 2 + 20, (oy + cy) / 2 - 10, '#06d6a0', 14);

        t++;
        requestAnimationFrame(animateHero);
    }

    animateHero();
})();

// ===================================
// Boat Animation
// ===================================
let boatAnimId = null;
function animateBoat() {
    const canvas = document.getElementById('boatCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    if (boatAnimId) cancelAnimationFrame(boatAnimId);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Water
        ctx.fillStyle = '#e3f2fd';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Waves
        ctx.strokeStyle = '#90caf9';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            for (let x = 0; x < canvas.width; x += 5) {
                ctx.lineTo(x, 40 + i * 35 + 5 * Math.sin((x + t * 2 + i * 20) * 0.03));
            }
            ctx.stroke();
        }

        const boatX = 50 + t * 1.5;
        const boatY = 100 - t * 0.3;

        if (boatX < 300) {
            // Boat
            ctx.fillStyle = '#5d4037';
            ctx.beginPath();
            ctx.moveTo(boatX - 15, boatY);
            ctx.lineTo(boatX + 20, boatY);
            ctx.lineTo(boatX + 15, boatY + 8);
            ctx.lineTo(boatX - 10, boatY + 8);
            ctx.closePath();
            ctx.fill();

            // Sail
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(boatX + 5, boatY);
            ctx.lineTo(boatX + 5, boatY - 20);
            ctx.lineTo(boatX + 18, boatY - 5);
            ctx.closePath();
            ctx.fill();

            // Force arrows
            drawArrow(ctx, boatX, boatY, boatX, boatY - 50, '#2196f3', 2);
            drawLabel(ctx, 'বৈঠার বল', boatX - 40, boatY - 35, '#2196f3', 11);

            drawArrow(ctx, boatX, boatY, boatX + 60, boatY, '#e74c3c', 2);
            drawLabel(ctx, 'স্রোতের বল', boatX + 40, boatY + 15, '#e74c3c', 11);

            drawArrow(ctx, boatX, boatY, boatX + 40, boatY - 40, '#06d6a0', 2.5);
            drawLabel(ctx, 'লব্ধি', boatX + 50, boatY - 40, '#06d6a0', 12);

            t++;
            boatAnimId = requestAnimationFrame(draw);
        }
    }
    draw();
}

// ===================================
// Book Animation
// ===================================
let bookAnimId = null;
function animateBook() {
    const canvas = document.getElementById('bookCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    if (bookAnimId) cancelAnimationFrame(bookAnimId);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Table
        ctx.fillStyle = '#d7ccc8';
        ctx.fillRect(0, 120, canvas.width, 80);
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(0, 118, canvas.width, 4);

        const bx = 120 + t * 0.8;
        const by = 80;

        if (bx < 270) {
            // Book
            ctx.fillStyle = '#1565c0';
            ctx.fillRect(bx, by, 50, 35);
            ctx.fillStyle = '#fff';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('📖', bx + 25, by + 22);

            // Forces
            drawArrow(ctx, bx, by + 17, bx + 70, by - 10, '#e74c3c', 2);
            drawLabel(ctx, 'ডান হাত', bx + 80, by - 10, '#e74c3c', 10);

            drawArrow(ctx, bx + 50, by + 17, bx + 50 + 20, by - 30, '#2196f3', 2);
            drawLabel(ctx, 'বাম হাত', bx + 90, by - 30, '#2196f3', 10);

            drawArrow(ctx, bx + 25, by + 17, bx + 25 + 50, by - 25, '#06d6a0', 2.5);
            drawLabel(ctx, 'লব্ধি ↗', bx + 25 + 55, by - 35, '#06d6a0', 11);

            t++;
            bookAnimId = requestAnimationFrame(draw);
        }
    }
    draw();
}

// ===================================
// Plane Animation
// ===================================
let planeAnimId = null;
function animatePlane() {
    const canvas = document.getElementById('planeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    if (planeAnimId) cancelAnimationFrame(planeAnimId);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Sky
        ctx.fillStyle = '#e1f5fe';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Clouds
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath();
        ctx.arc(80 - t * 0.3, 40, 20, 0, Math.PI * 2);
        ctx.arc(100 - t * 0.3, 35, 25, 0, Math.PI * 2);
        ctx.arc(120 - t * 0.3, 42, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(250 - t * 0.2, 50, 15, 0, Math.PI * 2);
        ctx.arc(270 - t * 0.2, 45, 20, 0, Math.PI * 2);
        ctx.fill();

        const px = 80 + t * 0.9;
        const py = 150 - t * 0.6;

        if (py > 30) {
            // Plane emoji
            ctx.font = '24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('✈️', px, py);

            drawArrow(ctx, px, py, px, py - 55, '#2196f3', 2);
            drawLabel(ctx, 'ইঞ্জিনের বেগ', px + 55, py - 45, '#2196f3', 10);

            drawArrow(ctx, px, py, px + 55, py, '#e74c3c', 2);
            drawLabel(ctx, 'বাতাসের বেগ', px + 45, py + 15, '#e74c3c', 10);

            drawArrow(ctx, px, py, px + 40, py - 45, '#06d6a0', 2.5);
            drawLabel(ctx, 'প্রকৃত বেগ', px + 55, py - 55, '#06d6a0', 11);

            t++;
            planeAnimId = requestAnimationFrame(draw);
        }
    }
    draw();
}

// ===================================
// Parallelogram Interactive Diagram
// ===================================
(function () {
    const canvas = document.getElementById('parallelogramCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pSlider = document.getElementById('pSlider');
    const qSlider = document.getElementById('qSlider');
    const alphaSlider = document.getElementById('alphaSlider');

    function draw() {
        const P = parseFloat(pSlider.value);
        const Q = parseFloat(qSlider.value);
        const alpha = parseFloat(alphaSlider.value);
        const alphaRad = toRad(alpha);

        document.getElementById('pValue').textContent = P;
        document.getElementById('qValue').textContent = Q;
        document.getElementById('alphaValue').textContent = alpha;

        const R = Math.sqrt(P * P + Q * Q + 2 * P * Q * Math.cos(alphaRad));
        const theta = toDeg(Math.atan2(Q * Math.sin(alphaRad), P + Q * Math.cos(alphaRad)));

        document.getElementById('resultR').textContent = R.toFixed(2);
        document.getElementById('resultTheta').textContent = theta.toFixed(2) + '°';

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scale = 40;
        const ox = 120, oy = 320;

        const pEnd = { x: ox + P * scale, y: oy };
        const qEnd = { x: ox + Q * scale * Math.cos(alphaRad), y: oy - Q * scale * Math.sin(alphaRad) };
        const cEnd = { x: pEnd.x + (qEnd.x - ox), y: pEnd.y + (qEnd.y - oy) };

        // Grid
        ctx.strokeStyle = 'rgba(0,0,0,0.04)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 30) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 30) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        // Parallelogram fill
        ctx.fillStyle = 'rgba(67, 97, 238, 0.06)';
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(pEnd.x, pEnd.y);
        ctx.lineTo(cEnd.x, cEnd.y);
        ctx.lineTo(qEnd.x, qEnd.y);
        ctx.closePath();
        ctx.fill();

        // Dashed completion lines
        drawDashedLine(ctx, pEnd.x, pEnd.y, cEnd.x, cEnd.y, 'rgba(0,0,0,0.2)', 1.5);
        drawDashedLine(ctx, qEnd.x, qEnd.y, cEnd.x, cEnd.y, 'rgba(0,0,0,0.2)', 1.5);

        // P vector
        drawArrow(ctx, ox, oy, pEnd.x, pEnd.y, '#4361ee', 3);
        drawLabel(ctx, `P⃗ = ${P}`, (ox + pEnd.x) / 2, oy + 25, '#4361ee', 15);

        // Q vector
        drawArrow(ctx, ox, oy, qEnd.x, qEnd.y, '#f72585', 3);
        drawLabel(ctx, `Q⃗ = ${Q}`, (ox + qEnd.x) / 2 - 25, (oy + qEnd.y) / 2 - 5, '#f72585', 15);

        // R vector (resultant)
        drawArrow(ctx, ox, oy, cEnd.x, cEnd.y, '#06d6a0', 3.5);
        drawLabel(ctx, `R⃗ = ${R.toFixed(2)}`, (ox + cEnd.x) / 2 + 15, (oy + cEnd.y) / 2 - 15, '#06d6a0', 15);

        // Angle alpha
        if (alpha > 5) {
            drawArc(ctx, ox, oy, 35, 0, alphaRad, '#ff9800', `α=${alpha}°`, 55);
        }

        // Angle theta
        const thetaRad = toRad(theta);
        if (theta > 2) {
            drawArc(ctx, ox, oy, 55, 0, thetaRad, '#9c27b0', `θ=${theta.toFixed(1)}°`, 75);
        }

        // Points
        drawPoint(ctx, ox, oy, '#333', 5);
        drawPoint(ctx, pEnd.x, pEnd.y, '#4361ee', 4);
        drawPoint(ctx, qEnd.x, qEnd.y, '#f72585', 4);
        drawPoint(ctx, cEnd.x, cEnd.y, '#06d6a0', 5);

        // Labels
        drawLabel(ctx, 'O', ox - 15, oy + 15, '#333', 14);
        drawLabel(ctx, 'A', pEnd.x + 10, pEnd.y + 15, '#4361ee', 14);
        drawLabel(ctx, 'B', qEnd.x - 15, qEnd.y - 5, '#f72585', 14);
        drawLabel(ctx, 'C', cEnd.x + 10, cEnd.y - 10, '#06d6a0', 14);
    }

    pSlider.addEventListener('input', draw);
    qSlider.addEventListener('input', draw);
    alphaSlider.addEventListener('input', draw);
    draw();
})();

// ===================================
// Proof Diagram
// ===================================
(function () {
    const canvas = document.getElementById('proofCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const ox = 80, oy = 260;
        const P = 5, Q = 4, alpha = toRad(50);
        const scale = 42;

        const ax = ox + P * scale, ay = oy;
        const bx = ox + Q * scale * Math.cos(alpha), by = oy - Q * scale * Math.sin(alpha);
        const cx = ax + (bx - ox), cy = ay + (by - oy);

        // D point (foot of perpendicular from C to OA extended)
        const dx = cx, dy = oy;

        // Parallelogram fill
        ctx.fillStyle = 'rgba(67, 97, 238, 0.06)';
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ax, ay);
        ctx.lineTo(cx, cy);
        ctx.lineTo(bx, by);
        ctx.closePath();
        ctx.fill();

        // OA extended
        drawDashedLine(ctx, ax, ay, dx + 20, dy, 'rgba(0,0,0,0.2)');

        // Dashed
        drawDashedLine(ctx, bx, by, cx, cy, 'rgba(0,0,0,0.2)', 1.5);
        drawDashedLine(ctx, ax, ay, cx, cy, 'rgba(0,0,0,0.2)', 1.5);

        // CD perpendicular
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(dx, dy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Right angle marker at D
        drawRightAngleMarker(ctx, dx, dy, 10, Math.PI, Math.PI / 2, '#e74c3c');

        // Vectors
        drawArrow(ctx, ox, oy, ax, ay, '#4361ee', 3);
        drawArrow(ctx, ox, oy, bx, by, '#f72585', 3);
        drawArrow(ctx, ox, oy, cx, cy, '#06d6a0', 3.5);

        // Angle alpha at O
        drawArc(ctx, ox, oy, 30, 0, alpha, '#ff9800', 'α', 45);

        // Angle alpha at A
        drawArc(ctx, ax, ay, 25, 0, alpha, '#ff9800', 'α', 40);

        // Labels
        drawLabel(ctx, 'O', ox - 15, oy + 18, '#333', 14);
        drawLabel(ctx, 'A', ax, ay + 20, '#4361ee', 14);
        drawLabel(ctx, 'B', bx - 18, by - 5, '#f72585', 14);
        drawLabel(ctx, 'C', cx + 12, cy - 10, '#06d6a0', 14);
        drawLabel(ctx, 'D', dx + 5, dy + 18, '#e74c3c', 14);

        drawLabel(ctx, 'P⃗', (ox + ax) / 2, oy + 35, '#4361ee', 13);
        drawLabel(ctx, 'Q⃗', (ox + bx) / 2 - 20, (oy + by) / 2, '#f72585', 13);
        drawLabel(ctx, 'R⃗', (ox + cx) / 2 + 18, (oy + cy) / 2 - 12, '#06d6a0', 14);
        drawLabel(ctx, 'CD = Q sinα', cx + 20, (cy + dy) / 2, '#e74c3c', 11);
        drawLabel(ctx, 'AD = Q cosα', (ax + dx) / 2, oy + 35, '#9c27b0', 11, 'center');

        // Points
        drawPoint(ctx, ox, oy, '#333', 5);
        drawPoint(ctx, ax, ay, '#4361ee', 4);
        drawPoint(ctx, bx, by, '#f72585', 4);
        drawPoint(ctx, cx, cy, '#06d6a0', 5);
        drawPoint(ctx, dx, dy, '#e74c3c', 4);
    }

    draw();
})();

// ===================================
// Max/Min Canvas
// ===================================
let maxMinMode = 'max';
function showMaxMin(mode) {
    maxMinMode = mode;
    document.querySelectorAll('.max-min-controls .control-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.control-btn').classList.add('active');
    drawMaxMin();
}

function drawMaxMin() {
    const canvas = document.getElementById('maxMinCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const P = 5, Q = 3;
    const scale = 35;
    const ox = 150, oy = 180;

    let alpha;
    if (maxMinMode === 'max') alpha = 0;
    else if (maxMinMode === 'min') alpha = Math.PI;
    else alpha = toRad(60);

    const alphaRad = alpha;
    const R = Math.sqrt(P * P + Q * Q + 2 * P * Q * Math.cos(alphaRad));

    const pEnd = { x: ox + P * scale, y: oy };
    const qEnd = { x: ox + Q * scale * Math.cos(alphaRad), y: oy - Q * scale * Math.sin(alphaRad) };
    const rEnd = { x: ox + (P * scale + Q * scale * Math.cos(alphaRad)), y: oy - Q * scale * Math.sin(alphaRad) };

    // Grid
    ctx.strokeStyle = 'rgba(0,0,0,0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }

    if (maxMinMode === 'max') {
        // Same direction
        drawArrow(ctx, ox, oy, ox + P * scale, oy, '#4361ee', 3);
        drawArrow(ctx, ox + P * scale, oy, ox + (P + Q) * scale, oy, '#f72585', 3);
        drawArrow(ctx, ox, oy - 15, ox + (P + Q) * scale, oy - 15, '#06d6a0', 3.5);

        drawLabel(ctx, `P = ${P}`, ox + P * scale / 2, oy + 25, '#4361ee', 14);
        drawLabel(ctx, `Q = ${Q}`, ox + P * scale + Q * scale / 2, oy + 25, '#f72585', 14);
        drawLabel(ctx, `R = P + Q = ${P + Q}`, ox + (P + Q) * scale / 2, oy - 35, '#06d6a0', 15);

        drawLabel(ctx, 'α = 0° (একই দিকে)', canvas.width / 2, 40, '#333', 16);
        drawLabel(ctx, 'সর্বোচ্চ!', canvas.width / 2, 65, '#1565c0', 14);
    } else if (maxMinMode === 'min') {
        // Opposite direction
        drawArrow(ctx, ox, oy, ox + P * scale, oy, '#4361ee', 3);
        drawArrow(ctx, ox, oy, ox - Q * scale, oy, '#f72585', 3);
        drawArrow(ctx, ox, oy - 20, ox + (P - Q) * scale, oy - 20, '#06d6a0', 3.5);

        drawLabel(ctx, `P = ${P}`, ox + P * scale / 2, oy + 25, '#4361ee', 14);
        drawLabel(ctx, `Q = ${Q}`, ox - Q * scale / 2, oy + 25, '#f72585', 14);
        drawLabel(ctx, `R = P − Q = ${P - Q}`, ox + (P - Q) * scale / 2, oy - 40, '#06d6a0', 15);

        drawLabel(ctx, 'α = 180° (বিপরীত দিকে)', canvas.width / 2, 40, '#333', 16);
        drawLabel(ctx, 'সর্বনিম্ন!', canvas.width / 2, 65, '#c62828', 14);
    } else {
        // Any angle
        const cEnd = { x: pEnd.x + (qEnd.x - ox), y: pEnd.y + (qEnd.y - oy) };

        ctx.fillStyle = 'rgba(67, 97, 238, 0.06)';
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(pEnd.x, pEnd.y);
        ctx.lineTo(cEnd.x, cEnd.y);
        ctx.lineTo(qEnd.x, qEnd.y);
        ctx.closePath();
        ctx.fill();

        drawDashedLine(ctx, pEnd.x, pEnd.y, cEnd.x, cEnd.y, 'rgba(0,0,0,0.15)');
        drawDashedLine(ctx, qEnd.x, qEnd.y, cEnd.x, cEnd.y, 'rgba(0,0,0,0.15)');

        drawArrow(ctx, ox, oy, pEnd.x, pEnd.y, '#4361ee', 3);
        drawArrow(ctx, ox, oy, qEnd.x, qEnd.y, '#f72585', 3);
        drawArrow(ctx, ox, oy, cEnd.x, cEnd.y, '#06d6a0', 3.5);

        drawArc(ctx, ox, oy, 30, 0, alphaRad, '#ff9800', 'α=60°', 50);

        drawLabel(ctx, `P = ${P}`, (ox + pEnd.x) / 2, oy + 25, '#4361ee', 14);
        drawLabel(ctx, `Q = ${Q}`, (ox + qEnd.x) / 2 - 20, (oy + qEnd.y) / 2, '#f72585', 14);
        drawLabel(ctx, `R = ${R.toFixed(2)}`, (ox + cEnd.x) / 2 + 15, (oy + cEnd.y) / 2 - 10, '#06d6a0', 14);

        drawLabel(ctx, `${P - Q} ≤ R ≤ ${P + Q}`, canvas.width / 2, 35, '#333', 15);
        drawLabel(ctx, `${P - Q} ≤ ${R.toFixed(2)} ≤ ${P + Q} ✓`, canvas.width / 2, 60, '#2e7d32', 14);
    }
}

// Initial draw
setTimeout(drawMaxMin, 100);

// ===================================
// Resolution Interactive Diagram
// ===================================
(function () {
    const canvas = document.getElementById('resolutionCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rSlider = document.getElementById('rResSlider');
    const aSlider = document.getElementById('alphaResSlider');

    function draw() {
        const R = parseFloat(rSlider.value);
        const alpha = parseFloat(aSlider.value);
        const alphaRad = toRad(alpha);

        document.getElementById('rResValue').textContent = R;
        document.getElementById('alphaResValue').textContent = alpha;

        const X = R * Math.cos(alphaRad);
        const Y = R * Math.sin(alphaRad);

        document.getElementById('resultX').textContent = X.toFixed(2);
        document.getElementById('resultY').textContent = Y.toFixed(2);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scale = 35;
        const ox = 120, oy = 350;

        // Grid
        ctx.strokeStyle = 'rgba(0,0,0,0.04)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 30) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 30) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        const rx = ox + R * scale * Math.cos(alphaRad);
        const ry = oy - R * scale * Math.sin(alphaRad);
        const xx = ox + X * scale;
        const yy = oy - Y * scale;

        // Shaded rectangle
        ctx.fillStyle = 'rgba(67, 97, 238, 0.04)';
        ctx.fillRect(ox, ry, X * scale, Y * scale);

        // Dashed projections
        drawDashedLine(ctx, rx, ry, rx, oy, 'rgba(39, 174, 96, 0.4)', 1.5);
        drawDashedLine(ctx, rx, ry, ox, ry, 'rgba(231, 76, 60, 0.4)', 1.5);

        // X axis (extended)
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ox - 20, oy);
        ctx.lineTo(canvas.width - 30, oy);
        ctx.stroke();

        // Y axis (extended)
        ctx.beginPath();
        ctx.moveTo(ox, oy + 20);
        ctx.lineTo(ox, 30);
        ctx.stroke();

        // X component
        drawArrow(ctx, ox, oy, xx, oy, '#e74c3c', 3);
        drawLabel(ctx, `X = ${X.toFixed(2)}`, (ox + xx) / 2, oy + 30, '#e74c3c', 14);

        // Y component
        drawArrow(ctx, ox, oy, ox, yy, '#27ae60', 3);
        drawLabel(ctx, `Y = ${Y.toFixed(2)}`, ox - 50, (oy + yy) / 2, '#27ae60', 14);

        // R vector
        drawArrow(ctx, ox, oy, rx, ry, '#4361ee', 3.5);
        drawLabel(ctx, `R⃗ = ${R}`, (ox + rx) / 2 + 20, (oy + ry) / 2 - 15, '#4361ee', 15);

        // Angle
        if (alpha > 3) {
            drawArc(ctx, ox, oy, 40, 0, alphaRad, '#ff9800', `α=${alpha}°`, 60);
        }

        // Right angle marker
        if (alpha > 5 && alpha < 85) {
            drawRightAngleMarker(ctx, ox, oy, 12, 0, Math.PI / 2, '#666');
        }

        // Points
        drawPoint(ctx, ox, oy, '#333', 5);
        drawLabel(ctx, 'O', ox - 18, oy + 18, '#333', 14);

        // Axis labels
        drawLabel(ctx, 'X-অক্ষ', canvas.width - 50, oy + 25, '#999', 12);
        drawLabel(ctx, 'Y-অক্ষ', ox + 30, 40, '#999', 12);

        // Formula reminder
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.font = '12px "Noto Sans Bengali", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('X = R cos α, Y = R sin α', canvas.width - 20, canvas.height - 15);
    }

    rSlider.addEventListener('input', draw);
    aSlider.addEventListener('input', draw);
    draw();
})();

// ===================================
// Connection Canvas
// ===================================
(function () {
    const canvas = document.getElementById('connectionCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Left side: Addition
        const lox = 80, loy = 180;
        const scale = 25;
        const alpha = toRad(45);
        const P = 4, Q = 3;

        const lpx = lox + P * scale, lpy = loy;
        const lqx = lox + Q * scale * Math.cos(alpha), lqy = loy - Q * scale * Math.sin(alpha);
        const lcx = lpx + (lqx - lox), lcy = lpy + (lqy - loy);

        drawDashedLine(ctx, lpx, lpy, lcx, lcy, 'rgba(0,0,0,0.15)');
        drawDashedLine(ctx, lqx, lqy, lcx, lcy, 'rgba(0,0,0,0.15)');

        drawArrow(ctx, lox, loy, lpx, lpy, '#4361ee', 2.5);
        drawArrow(ctx, lox, loy, lqx, lqy, '#f72585', 2.5);
        drawArrow(ctx, lox, loy, lcx, lcy, '#06d6a0', 3);

        drawLabel(ctx, 'P⃗', (lox + lpx) / 2, loy + 18, '#4361ee', 12);
        drawLabel(ctx, 'Q⃗', (lox + lqx) / 2 - 12, (loy + lqy) / 2, '#f72585', 12);
        drawLabel(ctx, 'R⃗', (lox + lcx) / 2 + 12, (loy + lcy) / 2 - 8, '#06d6a0', 12);
        drawLabel(ctx, 'যোগ: P⃗ + Q⃗ = R⃗', 160, 30, '#333', 14);

        // Arrow in middle
        drawArrow(ctx, 310, 120, 380, 120, '#ff9800', 3, 15);
        drawArrow(ctx, 380, 140, 310, 140, '#9c27b0', 3, 15);
        drawLabel(ctx, 'যোগ →', 345, 108, '#ff9800', 11);
        drawLabel(ctx, '← বিভাজন', 345, 158, '#9c27b0', 11);

        // Right side: Resolution
        const rox = 450, roy = 180;
        const rAngle = toRad(35);
        const Rv = 5;

        const rrx = rox + Rv * scale * Math.cos(rAngle);
        const rry = roy - Rv * scale * Math.sin(rAngle);

        drawDashedLine(ctx, rrx, rry, rrx, roy, 'rgba(39,174,96,0.3)');
        drawDashedLine(ctx, rrx, rry, rox, rry, 'rgba(231,76,60,0.3)');

        drawArrow(ctx, rox, roy, rox + Rv * scale * Math.cos(rAngle), roy, '#e74c3c', 2.5);
        drawArrow(ctx, rox, roy, rox, roy - Rv * scale * Math.sin(rAngle), '#27ae60', 2.5);
        drawArrow(ctx, rox, roy, rrx, rry, '#4361ee', 3);

        drawLabel(ctx, 'X⃗', (rox + rrx) / 2, roy + 18, '#e74c3c', 12);
        drawLabel(ctx, 'Y⃗', rox - 18, (roy + rry) / 2, '#27ae60', 12);
        drawLabel(ctx, 'R⃗', (rox + rrx) / 2 + 15, (roy + rry) / 2 - 10, '#4361ee', 12);
        drawLabel(ctx, 'বিভাজন: R⃗ → X⃗ + Y⃗', 550, 30, '#333', 14);
    }

    draw();
})();

// ===================================
// Oblique Resolution Canvas
// ===================================
(function () {
    const canvas = document.getElementById('obliqueCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rSlider = document.getElementById('rObSlider');
    const aSlider = document.getElementById('alphaObSlider');
    const bSlider = document.getElementById('betaObSlider');

    function draw() {
        const R = parseFloat(rSlider.value);
        const alpha = parseFloat(aSlider.value);
        const beta = parseFloat(bSlider.value);

        document.getElementById('rObValue').textContent = R;
        document.getElementById('alphaObValue').textContent = alpha;
        document.getElementById('betaObValue').textContent = beta;

        const alphaRad = toRad(alpha);
        const betaRad = toRad(beta);
        const sumRad = alphaRad + betaRad;

        const X = (R * Math.sin(betaRad)) / Math.sin(sumRad);
        const Y = (R * Math.sin(alphaRad)) / Math.sin(sumRad);

        document.getElementById('resultXOb').textContent = X.toFixed(2);
        document.getElementById('resultYOb').textContent = Y.toFixed(2);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scale = 30;
        const ox = 150, oy = 300;

        // R vector direction: let's put it at angle (alpha) relative to X direction
        // X direction: along 0 (horizontal)
        // R is between X and Y
        // X at angle (-alpha) from R, Y at angle (+beta) from R
        // Let's place R direction at angle from horizontal = alpha from X direction

        // Actually, simpler: R makes angle α with X and angle β with Y
        // X direction: horizontal (angle 0 from horizontal)
        // R direction: angle α from horizontal
        // Y direction: angle (α+β) from horizontal

        const rEndX = ox + R * scale * Math.cos(alphaRad);
        const rEndY = oy - R * scale * Math.sin(alphaRad);

        const xEndX = ox + X * scale;
        const xEndY = oy;

        const yEndX = ox + Y * scale * Math.cos(sumRad);
        const yEndY = oy - Y * scale * Math.sin(sumRad);

        // Parallelogram
        ctx.fillStyle = 'rgba(67, 97, 238, 0.05)';
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(xEndX, xEndY);
        ctx.lineTo(rEndX, rEndY);
        ctx.lineTo(yEndX, yEndY);
        ctx.closePath();
        ctx.fill();

        // Dashed
        drawDashedLine(ctx, xEndX, xEndY, rEndX, rEndY, 'rgba(0,0,0,0.15)', 1.5);
        drawDashedLine(ctx, yEndX, yEndY, rEndX, rEndY, 'rgba(0,0,0,0.15)', 1.5);

        // X vector
        drawArrow(ctx, ox, oy, xEndX, xEndY, '#e74c3c', 2.5);
        drawLabel(ctx, `X⃗ = ${X.toFixed(2)}`, (ox + xEndX) / 2, oy + 25, '#e74c3c', 13);

        // Y vector
        drawArrow(ctx, ox, oy, yEndX, yEndY, '#27ae60', 2.5);
        drawLabel(ctx, `Y⃗ = ${Y.toFixed(2)}`, (ox + yEndX) / 2 - 25, (oy + yEndY) / 2 - 5, '#27ae60', 13);

        // R vector
        drawArrow(ctx, ox, oy, rEndX, rEndY, '#4361ee', 3);
        drawLabel(ctx, `R⃗ = ${R}`, (ox + rEndX) / 2 + 18, (oy + rEndY) / 2 - 12, '#4361ee', 14);

        // Angle α
        drawArc(ctx, ox, oy, 35, 0, alphaRad, '#ff9800', `α=${alpha}°`, 55);

        // Angle β
        drawArc(ctx, ox, oy, 50, alphaRad, sumRad, '#9c27b0', `β=${beta}°`, 70);

        drawPoint(ctx, ox, oy, '#333', 5);
        drawLabel(ctx, 'O', ox - 15, oy + 15, '#333', 14);
    }

    rSlider.addEventListener('input', draw);
    aSlider.addEventListener('input', draw);
    bSlider.addEventListener('input', draw);
    draw();
})();

// ===================================
// Problem Solutions - Visual
// ===================================
function toggleSolution(id) {
    const container = document.getElementById(id);
    container.classList.toggle('show');

    // Draw solution diagrams when shown
    if (container.classList.contains('show')) {
        if (id === 'sol1') drawProb1();
        if (id === 'sol2') drawProb2();
        if (id === 'sol3') drawProb3();
        if (id === 'sol4') drawProb4();
        if (id === 'sol5') drawProb5();
    }
}

function drawProb1() {
    const canvas = document.getElementById('prob1Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const ox = 80, oy = 270, scale = 28;
    const P = 5, Q = 8, alpha = toRad(60);

    const px = ox + P * scale, py = oy;
    const qx = ox + Q * scale * Math.cos(alpha), qy = oy - Q * scale * Math.sin(alpha);
    const cx = px + (qx - ox), cy = py + (qy - oy);

    ctx.fillStyle = 'rgba(67,97,238,0.06)';
    ctx.beginPath();
    ctx.moveTo(ox, oy); ctx.lineTo(px, py); ctx.lineTo(cx, cy); ctx.lineTo(qx, qy);
    ctx.closePath(); ctx.fill();

    drawDashedLine(ctx, px, py, cx, cy, 'rgba(0,0,0,0.15)');
    drawDashedLine(ctx, qx, qy, cx, cy, 'rgba(0,0,0,0.15)');

    drawArrow(ctx, ox, oy, px, py, '#4361ee', 3);
    drawArrow(ctx, ox, oy, qx, qy, '#f72585', 3);
    drawArrow(ctx, ox, oy, cx, cy, '#06d6a0', 3.5);

    drawArc(ctx, ox, oy, 30, 0, alpha, '#ff9800', 'α=60°', 50);

    const R = Math.sqrt(P * P + Q * Q + 2 * P * Q * Math.cos(alpha));
    const theta = toDeg(Math.atan2(Q * Math.sin(alpha), P + Q * Math.cos(alpha)));
    drawArc(ctx, ox, oy, 50, 0, toRad(theta), '#9c27b0', `θ=${theta.toFixed(1)}°`, 70);

    drawLabel(ctx, `P⃗ = 5N`, (ox + px) / 2, py + 25, '#4361ee', 14);
    drawLabel(ctx, `Q⃗ = 8N`, (ox + qx) / 2 - 20, (oy + qy) / 2, '#f72585', 14);
    drawLabel(ctx, `R⃗ = ${R.toFixed(2)}N`, (ox + cx) / 2 + 20, (oy + cy) / 2 - 15, '#06d6a0', 14);

    drawPoint(ctx, ox, oy, '#333', 5);
    drawLabel(ctx, 'O', ox - 15, oy + 15, '#333', 13);
}

function drawProb2() {
    const canvas = document.getElementById('prob2Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const ox = 80, oy = 280, scale = 22;
    const R = 10, alpha = toRad(30);
    const X = R * Math.cos(alpha), Y = R * Math.sin(alpha);

    const rx = ox + R * scale * Math.cos(alpha), ry = oy - R * scale * Math.sin(alpha);

    drawDashedLine(ctx, rx, ry, rx, oy, 'rgba(39,174,96,0.3)');
    drawDashedLine(ctx, rx, ry, ox, ry, 'rgba(231,76,60,0.3)');

    // Axes
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(canvas.width - 30, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, 30); ctx.stroke();

    drawArrow(ctx, ox, oy, ox + X * scale, oy, '#e74c3c', 3);
    drawArrow(ctx, ox, oy, ox, oy - Y * scale, '#27ae60', 3);
    drawArrow(ctx, ox, oy, rx, ry, '#4361ee', 3.5);

    drawArc(ctx, ox, oy, 35, 0, alpha, '#ff9800', 'α=30°', 55);
    drawRightAngleMarker(ctx, ox, oy, 12, 0, Math.PI / 2, '#666');

    drawLabel(ctx, `R⃗ = 10N`, (ox + rx) / 2 + 20, (oy + ry) / 2 - 15, '#4361ee', 14);
    drawLabel(ctx, `X = 8.66N`, (ox + ox + X * scale) / 2, oy + 25, '#e74c3c', 13);
    drawLabel(ctx, `Y = 5N`, ox - 40, (oy + oy - Y * scale) / 2, '#27ae60', 13);

    drawPoint(ctx, ox, oy, '#333', 5);
}

function drawProb3() {
    const canvas = document.getElementById('prob3Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = 15;
    const P = 12, Q = 5;

    // Max scenario
    const ox1 = 30, oy1 = 80;
    drawArrow(ctx, ox1, oy1, ox1 + P * scale, oy1, '#4361ee', 2.5);
    drawArrow(ctx, ox1 + P * scale, oy1, ox1 + (P + Q) * scale, oy1, '#f72585', 2.5);
    drawArrow(ctx, ox1, oy1 - 15, ox1 + (P + Q) * scale, oy1 - 15, '#06d6a0', 2.5);
    drawLabel(ctx, 'সর্বোচ্চ: R = 17N (α=0°)', 300, oy1 - 30, '#1565c0', 13);
    drawLabel(ctx, '12N', ox1 + P * scale / 2, oy1 + 18, '#4361ee', 11);
    drawLabel(ctx, '5N', ox1 + P * scale + Q * scale / 2, oy1 + 18, '#f72585', 11);

    // Min scenario
    const oy2 = 160;
    drawArrow(ctx, ox1 + 50, oy2, ox1 + 50 + P * scale, oy2, '#4361ee', 2.5);
    drawArrow(ctx, ox1 + 50, oy2, ox1 + 50 - Q * scale, oy2, '#f72585', 2.5);
    drawArrow(ctx, ox1 + 50, oy2 - 15, ox1 + 50 + (P - Q) * scale, oy2 - 15, '#06d6a0', 2.5);
    drawLabel(ctx, 'সর্বনিম্ন: R = 7N (α=180°)', 300, oy2 - 30, '#c62828', 13);

    // 90 degree scenario
    const oy3 = 250;
    const ox3 = 100;
    drawArrow(ctx, ox3, oy3, ox3 + P * scale, oy3, '#4361ee', 2.5);
    drawArrow(ctx, ox3, oy3, ox3, oy3 - Q * scale, '#f72585', 2.5);
    const r90 = Math.sqrt(P * P + Q * Q);
    const angle90 = Math.atan2(Q, P);
    drawArrow(ctx, ox3, oy3, ox3 + r90 * scale * Math.cos(angle90), oy3 - r90 * scale * Math.sin(angle90), '#06d6a0', 2.5);
    drawRightAngleMarker(ctx, ox3, oy3, 10, 0, Math.PI / 2, '#ff9800');
    drawLabel(ctx, 'R = 13N (α=90°) — পিথাগোরাসের ত্রয়ী!', 350, oy3 - 20, '#2e7d32', 13);
    drawLabel(ctx, '12N', ox3 + P * scale / 2, oy3 + 18, '#4361ee', 11);
    drawLabel(ctx, '5N', ox3 - 20, oy3 - Q * scale / 2, '#f72585', 11);
    drawLabel(ctx, '13N', ox3 + 90, oy3 - 50, '#06d6a0', 12);
}

function drawProb4() {
    const canvas = document.getElementById('prob4Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const ox = 100, oy = 270, scale = 18;
    const F = 10, alpha = toRad(120);

    const px = ox + F * scale, py = oy;
    const qx = ox + F * scale * Math.cos(alpha), qy = oy - F * scale * Math.sin(alpha);
    const cx = px + (qx - ox), cy = py + (qy - oy);

    ctx.fillStyle = 'rgba(67,97,238,0.05)';
    ctx.beginPath();
    ctx.moveTo(ox, oy); ctx.lineTo(px, py); ctx.lineTo(cx, cy); ctx.lineTo(qx, qy);
    ctx.closePath(); ctx.fill();

    drawDashedLine(ctx, px, py, cx, cy, 'rgba(0,0,0,0.15)');
    drawDashedLine(ctx, qx, qy, cx, cy, 'rgba(0,0,0,0.15)');

    drawArrow(ctx, ox, oy, px, py, '#4361ee', 3);
    drawArrow(ctx, ox, oy, qx, qy, '#f72585', 3);
    drawArrow(ctx, ox, oy, cx, cy, '#06d6a0', 3.5);

    drawArc(ctx, ox, oy, 30, 0, alpha, '#ff9800', 'α=120°', 50);

    drawLabel(ctx, 'F = 10N', (ox + px) / 2, py + 25, '#4361ee', 13);
    drawLabel(ctx, 'F = 10N', (ox + qx) / 2 - 30, (oy + qy) / 2, '#f72585', 13);
    drawLabel(ctx, 'R = 10N', (ox + cx) / 2 + 15, (oy + cy) / 2 - 10, '#06d6a0', 14);

    drawPoint(ctx, ox, oy, '#333', 5);

    drawLabel(ctx, 'F = F (সমান মানের বল)', canvas.width / 2, 30, '#333', 14);
}

function drawProb5() {
    const canvas = document.getElementById('prob5Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const ox = 100, oy = 280, scale = 12;
    const R = 20, alpha = toRad(35), beta = toRad(25);
    const sumAngle = alpha + beta;

    const X = (R * Math.sin(beta)) / Math.sin(sumAngle);
    const Y = (R * Math.sin(alpha)) / Math.sin(sumAngle);

    const rEndX = ox + R * scale * Math.cos(alpha);
    const rEndY = oy - R * scale * Math.sin(alpha);

    const xEndX = ox + X * scale;
    const xEndY = oy;

    const yEndX = ox + Y * scale * Math.cos(sumAngle);
    const yEndY = oy - Y * scale * Math.sin(sumAngle);

    ctx.fillStyle = 'rgba(67, 97, 238, 0.05)';
    ctx.beginPath();
    ctx.moveTo(ox, oy); ctx.lineTo(xEndX, xEndY);
    ctx.lineTo(rEndX, rEndY); ctx.lineTo(yEndX, yEndY);
    ctx.closePath(); ctx.fill();

    drawDashedLine(ctx, xEndX, xEndY, rEndX, rEndY, 'rgba(0,0,0,0.15)');
    drawDashedLine(ctx, yEndX, yEndY, rEndX, rEndY, 'rgba(0,0,0,0.15)');

    drawArrow(ctx, ox, oy, xEndX, xEndY, '#e74c3c', 2.5);
    drawArrow(ctx, ox, oy, yEndX, yEndY, '#27ae60', 2.5);
    drawArrow(ctx, ox, oy, rEndX, rEndY, '#4361ee', 3);

    drawArc(ctx, ox, oy, 35, 0, alpha, '#ff9800', 'α=35°', 55);
    drawArc(ctx, ox, oy, 50, alpha, sumAngle, '#9c27b0', 'β=25°', 70);

    drawLabel(ctx, `R⃗ = 20N`, (ox + rEndX) / 2 + 20, (oy + rEndY) / 2 - 15, '#4361ee', 14);
    drawLabel(ctx, `X = ${X.toFixed(2)}N`, (ox + xEndX) / 2, oy + 25, '#e74c3c', 13);
    drawLabel(ctx, `Y = ${Y.toFixed(2)}N`, (ox + yEndX) / 2 - 25, (oy + yEndY) / 2, '#27ae60', 13);

    drawPoint(ctx, ox, oy, '#333', 5);
}

// ===================================
// Calculator Functions
// ===================================
function switchCalcTab(tab) {
    document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    if (tab === 'resultant') {
        document.getElementById('calcResultant').style.display = 'block';
        document.getElementById('calcResolve').style.display = 'none';
    } else {
        document.getElementById('calcResultant').style.display = 'none';
        document.getElementById('calcResolve').style.display = 'block';
    }
}

function calculateResultant() {
    const P = parseFloat(document.getElementById('calcP').value);
    const Q = parseFloat(document.getElementById('calcQ').value);
    const alpha = parseFloat(document.getElementById('calcAlpha').value);
    const alphaRad = toRad(alpha);

    const R = Math.sqrt(P * P + Q * Q + 2 * P * Q * Math.cos(alphaRad));
    const theta = toDeg(Math.atan2(Q * Math.sin(alphaRad), P + Q * Math.cos(alphaRad)));

    document.getElementById('calcResultDisplay').innerHTML = `
        <div style="margin-bottom:8px">
            <strong>R = √(${P}² + ${Q}² + 2×${P}×${Q}×cos${alpha}°)</strong>
        </div>
        <div style="font-size:1.4rem; color:#4cc9f0; margin-bottom:8px">
            <strong>R = ${R.toFixed(3)}</strong>
        </div>
        <div>
            <strong>θ = ${theta.toFixed(3)}°</strong> (P⃗ এর সাথে)
        </div>
        <div style="margin-top:8px; font-size:0.85rem; opacity:0.7">
            সর্বোচ্চ: ${(P + Q).toFixed(2)} | সর্বনিম্ন: ${Math.abs(P - Q).toFixed(2)}
        </div>
    `;
}

function calculateResolve() {
    const R = parseFloat(document.getElementById('calcR').value);
    const alpha = parseFloat(document.getElementById('calcAngle').value);
    const alphaRad = toRad(alpha);

    const X = R * Math.cos(alphaRad);
    const Y = R * Math.sin(alphaRad);

    document.getElementById('resolveResultDisplay').innerHTML = `
        <div style="margin-bottom:8px">
            <strong>X = ${R} × cos${alpha}° = <span style="color:#e74c3c">${X.toFixed(3)}</span></strong>
        </div>
        <div style="margin-bottom:8px">
            <strong>Y = ${R} × sin${alpha}° = <span style="color:#27ae60">${Y.toFixed(3)}</span></strong>
        </div>
        <div style="font-size:0.85rem; opacity:0.7; margin-top:8px">
            যাচাই: √(${X.toFixed(2)}² + ${Y.toFixed(2)}²) = ${Math.sqrt(X * X + Y * Y).toFixed(3)} ✓
        </div>
    `;
}

// ===================================
// Scroll to Top
// ===================================
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================
// Mobile Menu Toggle
// ===================================
document.getElementById('menuToggle')?.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '60px';
        navLinks.style.right = '20px';
        navLinks.style.background = 'rgba(26, 26, 46, 0.98)';
        navLinks.style.padding = '15px 25px';
        navLinks.style.borderRadius = '12px';
        navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    }
});

// ===================================
// Initialize on load
// ===================================
window.addEventListener('load', () => {
    // Draw initial boat/book/plane canvases with static state
    const boatCanvas = document.getElementById('boatCanvas');
    if (boatCanvas) {
        const ctx = boatCanvas.getContext('2d');
        ctx.fillStyle = '#e3f2fd';
        ctx.fillRect(0, 0, boatCanvas.width, boatCanvas.height);
        ctx.fillStyle = '#666';
        ctx.font = '13px "Noto Sans Bengali", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('▶ বাটনে ক্লিক করো', boatCanvas.width / 2, boatCanvas.height / 2);
    }

    const bookCanvas = document.getElementById('bookCanvas');
    if (bookCanvas) {
        const ctx = bookCanvas.getContext('2d');
        ctx.fillStyle = '#efebe9';
        ctx.fillRect(0, 0, bookCanvas.width, bookCanvas.height);
        ctx.fillStyle = '#666';
        ctx.font = '13px "Noto Sans Bengali", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('▶ বাটনে ক্লিক করো', bookCanvas.width / 2, bookCanvas.height / 2);
    }

    const planeCanvas = document.getElementById('planeCanvas');
    if (planeCanvas) {
        const ctx = planeCanvas.getContext('2d');
        ctx.fillStyle = '#e1f5fe';
        ctx.fillRect(0, 0, planeCanvas.width, planeCanvas.height);
        ctx.fillStyle = '#666';
        ctx.font = '13px "Noto Sans Bengali", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('▶ বাটনে ক্লিক করো', planeCanvas.width / 2, planeCanvas.height / 2);
    }
});