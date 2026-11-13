let nocAudioCtx = null;
let nocPlaying = false;
let nocBeatTimer = null;
let nocBeatIdx = 0;

const CHORDS = [
    { notes: [261.63, 311.13, 392.00, 466.16], line: "Walking home past the warm streetlamps without checking the time." },
    { notes: [220.00, 261.63, 329.63, 392.00], line: "Every small note saved in one quiet room away from noisy feeds." },
    { notes: [174.61, 220.00, 261.63, 329.63], line: "Four years later, October still sounds just like this room." },
    { notes: [196.00, 246.94, 293.66, 349.23], line: "For Efua, tonight and through every season still ahead." }
];

function getAudio() {
    if (!nocAudioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) nocAudioCtx = new Ctx();
    }
    if (nocAudioCtx && nocAudioCtx.state === "suspended") nocAudioCtx.resume();
    return nocAudioCtx;
}

function playSoftChord(freqs) {
    const ctx = getAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(f, now + idx * 0.04);
        gain.gain.setValueAtTime(0.0001, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.032, now + idx * 0.04 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 1.85);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 1.9);
    });
}

function attemptGateUnlock() {
    const input = document.getElementById("riddleInput");
    const feedback = document.getElementById("gateFeedback");
    const val = (input.value || "").trim().toLowerCase();
    if (!val || val.includes("akosombo") || val.includes("accra") || val.length >= 3) {
        if (!val) input.value = "Akosombo";
        document.getElementById("riddleGate").classList.add("unlocked");
        feedback.textContent = "Unlocked cleanly.";
        playSoftChord([261.63, 329.63, 392.00, 523.25]);
        setTimeout(() => {
            document.querySelector(".noc-hero").scrollIntoView({ behavior: "smooth", block: "start" });
        }, 260);
    } else {
        feedback.textContent = "Try typing Akosombo or click Preview Entry.";
    }
}

function fillAndUnlockGate() {
    document.getElementById("riddleInput").value = "Akosombo";
    attemptGateUnlock();
}

function toggleNocturneTrack() {
    const tt = document.getElementById("turntable");
    const eq = document.getElementById("eqBars");
    const btn = document.getElementById("vinylToggleBtn");
    const lyric = document.getElementById("lyricLine");

    nocPlaying = !nocPlaying;
    tt.classList.toggle("playing", nocPlaying);
    eq.classList.toggle("active", nocPlaying);
    btn.textContent = nocPlaying ? "Pause Vinyl Track" : "Spin Vinyl & Listen";

    clearInterval(nocBeatTimer);
    if (nocPlaying) {
        const triggerBeat = () => {
            const c = CHORDS[nocBeatIdx % CHORDS.length];
            lyric.textContent = c.line;
            playSoftChord(c.notes);
            nocBeatIdx++;
        };
        triggerBeat();
        nocBeatTimer = setInterval(triggerBeat, 2400);
    }
}

function breakEpilogueSeal() {
    document.getElementById("sealedCover").hidden = true;
    document.getElementById("unfoldedLetter").hidden = false;
    playSoftChord([293.66, 369.99, 440.00, 587.33]);
}

function startRelationshipClock() {
    const start = new Date("2022-10-18T18:00:00Z").getTime();
    const tick = () => {
        const diff = Math.max(0, Date.now() - start);
        const days = Math.floor(diff / 86400000);
        const hrs = Math.floor((diff % 86400000) / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        document.getElementById("cntDays").textContent = days.toLocaleString();
        document.getElementById("cntHours").textContent = String(hrs).padStart(2, "0");
        document.getElementById("cntMins").textContent = String(mins).padStart(2, "0");
        document.getElementById("cntSecs").textContent = String(secs).padStart(2, "0");
    };
    tick();
    setInterval(tick, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    startRelationshipClock();
    const inp = document.getElementById("riddleInput");
    if (inp) {
        inp.addEventListener("keydown", e => {
            if (e.key === "Enter") attemptGateUnlock();
        });
    }
});

// Milestone Timeline & Wishes Wall
const NOCTURNE_MILESTONES = [
    {
        date: 'OCTOBER 18, 2022 · AKOSOMBO',
        title: 'The Lakeside Rain Walk',
        note: 'We missed the last turn before the bridge on purpose just so the evening would last twenty minutes longer.'
    },
    {
        date: 'JUNE 04, 2023 · CAPE COAST',
        title: 'Midnight Ocean & Film Camera',
        note: 'Two rolls of 35mm film, cold sea breeze, and your laugh echoing across the empty courtyard.'
    },
    {
        date: 'FEBRUARY 14, 2024 · ACCRA',
        title: 'First Apartment Dinner',
        note: 'Cardboard boxes still in the hallway, two candles on a crate, and the best jollof we ever made.'
    },
    {
        date: 'OCTOBER 18, 2025 · YEAR FOUR',
        title: 'Still Choosing Quiet Fridays',
        note: 'Four years in, and ordinary evenings with you still feel like the main event.'
    }
];

function selectMilestone(idx, btn) {
    const item = NOCTURNE_MILESTONES[idx];
    if (!item) return;
    document.querySelectorAll('.ms-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    document.getElementById('msDate').textContent = item.date;
    document.getElementById('msTitle').textContent = item.title;
    document.getElementById('msNote').textContent = item.note;
}

function addNocturneWish() {
    const authorEl = document.getElementById('wishAuthor');
    const textEl = document.getElementById('wishText');
    const list = document.getElementById('wishesList');
    const author = (authorEl.value || '').trim() || 'Guest';
    const text = (textEl.value || '').trim();
    if (!text) {
        textEl.focus();
        return;
    }
    const card = document.createElement('div');
    card.className = 'wish-item';
    const p = document.createElement('p');
    p.textContent = `"${text}"`;
    const span = document.createElement('span');
    span.textContent = `— ${author}`;
    card.appendChild(p);
    card.appendChild(span);
    list.prepend(card);
    authorEl.value = '';
    textEl.value = '';
}
