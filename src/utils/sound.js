import { CUPID_CONFIG } from '../data/studioData';

let audioCtx = null;

export function playChime(type = 'stamp') {
    try {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioClass) return;
        if (!audioCtx) audioCtx = new AudioClass();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const sequences = {
            flip: [392, 523.25],
            stamp: [523.25, 659.25, 783.99],
            birthdayMelody: [
                [392, 0.00, 0.25], [392, 0.28, 0.25], [440, 0.56, 0.45],
                [392, 1.05, 0.45], [523.25, 1.55, 0.45], [493.88, 2.05, 0.85]
            ],
            anniversary: [
                [349.23, 0.0, 0.5], [440, 0.22, 0.5], [523.25, 0.44, 0.6], [698.46, 0.68, 0.9]
            ],
            valentine: [
                [329.63, 0.0, 0.5], [415.30, 0.16, 0.5], [493.88, 0.34, 0.6], [659.25, 0.54, 0.9]
            ]
        };

        const now = audioCtx.currentTime;
        const seq = sequences[type] || sequences.stamp;

        seq.forEach((item, idx) => {
            const freq = Array.isArray(item) ? item[0] : item;
            const offset = Array.isArray(item) ? item[1] : idx * 0.11;
            const dur = Array.isArray(item) ? item[2] : 0.65;

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + offset);
            gain.gain.setValueAtTime(0.0001, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.055, now + offset + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + dur);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + dur + 0.05);
        });
    } catch {
        // Ignore audio errors if blocked by browser autoplay policy
    }
}

export function buildVCardPayload() {
    const studioUrl = 'https://cupid-studio.vercel.app/';
    return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:Devs;The Cupid;;;',
        `FN:Cupid Studio — ${CUPID_CONFIG.founder} (${CUPID_CONFIG.handle})`,
        'ORG:Cupid Studio',
        `TITLE:${CUPID_CONFIG.founder} (${CUPID_CONFIG.handle})`,
        `EMAIL;TYPE=INTERNET,WORK:${CUPID_CONFIG.email}`,
        `URL;TYPE=Studio:${studioUrl}`,
        'ADR;TYPE=WORK:;;;;;Ghana',
        'CATEGORIES:Cupid Studio,Web Design,Digital Keepsakes',
        `NOTE:Personal websites for birthdays, anniversaries, events & Valentine's. Book at ${studioUrl}`,
        'END:VCARD',
        ''
    ].join('\r\n');
}

export function downloadCardImage(obsidian, showToast) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 680;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = obsidian ? '#161413' : '#FFFCF7';
    ctx.fillRect(0, 0, 1200, 680);

    ctx.strokeStyle = obsidian ? '#9A7B3C' : '#181210';
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, 1128, 608);

    ctx.strokeStyle = obsidian ? 'rgba(255,248,236,0.22)' : 'rgba(24,18,16,0.16)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(52, 52, 1096, 576);

    ctx.fillStyle = obsidian ? '#C8A25B' : '#9E2A2B';
    ctx.font = '500 20px monospace';
    ctx.fillText('CUPID STUDIO · PERSONAL WEBSITES & INVITES', 88, 122);

    ctx.fillStyle = obsidian ? '#EFE6D8' : '#181210';
    ctx.font = '400 118px Georgia, serif';
    ctx.fillText('Cupid.', 86, 300);

    ctx.fillStyle = obsidian ? '#C6BAA8' : '#574E48';
    ctx.font = '400 32px Georgia, serif';
    ctx.fillText('Personal websites for birthdays, anniversaries,', 88, 372);
    ctx.fillText("events, and Valentine's Day.", 88, 416);

    ctx.strokeStyle = obsidian ? 'rgba(200,162,91,0.35)' : 'rgba(24,18,16,0.16)';
    ctx.beginPath();
    ctx.moveTo(88, 476);
    ctx.lineTo(1112, 476);
    ctx.stroke();

    ctx.fillStyle = obsidian ? '#EFE6D8' : '#181210';
    ctx.font = '600 24px sans-serif';
    ctx.fillText(`The Cupid Devs · ${CUPID_CONFIG.handle}`, 88, 530);

    ctx.fillStyle = obsidian ? '#C8A25B' : '#9E2A2B';
    ctx.font = '500 20px monospace';
    ctx.fillText(CUPID_CONFIG.email, 88, 574);
    ctx.fillText('cupid-studio.vercel.app · Ghana · Worldwide', 88, 608);

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = obsidian ? 'CupidCallingCard-Obsidian.png' : 'CupidCallingCard-Ivory.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    playChime('stamp');
    if (showToast) showToast('Saved calling card image (.png)');
}

export function downloadVipGuestPass({ guestCount, mealNote, colorName, accentHex, showToast }) {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 560;
    const ctx = canvas.getContext('2d');

    // Deep luxury obsidian & warm ivory ticket base
    ctx.fillStyle = '#161312';
    ctx.fillRect(0, 0, 1080, 560);

    // Top accent bar matching dress code color
    ctx.fillStyle = accentHex || '#82172E';
    ctx.fillRect(0, 0, 1080, 16);

    // Outer gold foil frame
    ctx.strokeStyle = '#C8A25B';
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 32, 1024, 496);

    // Inner subtle frame
    ctx.strokeStyle = 'rgba(200, 162, 91, 0.28)';
    ctx.lineWidth = 1;
    ctx.strokeRect(38, 42, 1004, 476);

    // Perforated divider line between main ticket and stub
    ctx.save();
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = 'rgba(200, 162, 91, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(760, 42);
    ctx.lineTo(760, 518);
    ctx.stroke();
    ctx.restore();

    // Ticket notches
    ctx.fillStyle = '#F5EFEB';
    ctx.beginPath();
    ctx.arc(760, 32, 16, 0, Math.PI * 2);
    ctx.arc(760, 528, 16, 0, Math.PI * 2);
    ctx.fill();

    // Header kicker
    ctx.fillStyle = '#C8A25B';
    ctx.font = '600 18px monospace';
    ctx.fillText('VIP EVENT GATE PASS  ·  TRADITIONAL ENGAGEMENT', 68, 96);

    // Main Event Title
    ctx.fillStyle = '#FFFDF9';
    ctx.font = '400 68px Georgia, serif';
    ctx.fillText('Kojo & Afua', 68, 182);

    ctx.fillStyle = '#D5C7B4';
    ctx.font = '500 20px sans-serif';
    ctx.fillText('Saturday, December 19  ·  2:00 PM  ·  The Cedar Court, East Legon', 68, 226);

    // Divider
    ctx.strokeStyle = 'rgba(200, 162, 91, 0.3)';
    ctx.beginPath();
    ctx.moveTo(68, 260);
    ctx.lineTo(710, 260);
    ctx.stroke();

    // Metadata grid
    const cols = [
        { label: 'ADMITTANCE', val: guestCount.toUpperCase(), x: 68, y: 310 },
        { label: 'TABLE / ZONE', val: guestCount === 'VIP Table' ? 'VIP TABLE 01' : 'GARDEN TABLE 04', x: 290, y: 310 },
        { label: 'DINING PREFERENCE', val: mealNote.toUpperCase(), x: 510, y: 310 },
        { label: 'DRESS CODE SHADE', val: colorName.toUpperCase(), x: 68, y: 410 },
        { label: 'GATE STATUS', val: 'CONFIRMED · VERIFIED', x: 290, y: 410 },
        { label: 'PASS SERIAL', val: '#CPD-0204-GH', x: 510, y: 410 }
    ];

    cols.forEach(c => {
        ctx.fillStyle = '#9A8D7F';
        ctx.font = '500 14px monospace';
        ctx.fillText(c.label, c.x, c.y);
        ctx.fillStyle = '#FFFDF9';
        ctx.font = '600 22px sans-serif';
        ctx.fillText(c.val, c.x, c.y + 30);
    });

    // Right stub: QR box
    ctx.fillStyle = '#FFFDF9';
    ctx.fillRect(810, 110, 190, 190);

    // Crisp deterministic QR pattern inside stub
    ctx.fillStyle = '#161312';
    const cell = 10;
    for (let r = 0; r < 15; r++) {
        for (let c = 0; c < 15; c++) {
            const isCorner = (r < 4 && c < 4) || (r < 4 && c > 10) || (r > 10 && c < 4);
            const hash = ((r * 31 + c * 17) % 7) < 3;
            if (isCorner || hash) {
                ctx.fillRect(830 + c * cell, 130 + r * cell, cell - 1, cell - 1);
            }
        }
    }

    ctx.fillStyle = '#C8A25B';
    ctx.font = '600 16px monospace';
    ctx.fillText('SCAN AT GATE', 845, 345);

    ctx.fillStyle = '#FFFDF9';
    ctx.font = '700 22px monospace';
    ctx.fillText('#CPD-204', 852, 380);

    ctx.fillStyle = '#9A8D7F';
    ctx.font = '400 14px sans-serif';
    ctx.fillText('Crafted by Cupid Studio', 832, 465);

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'KojoAfua-VIP-GatePass.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    playChime('stamp');
    if (showToast) showToast('Downloaded VIP Gate Pass (.png)');
}
