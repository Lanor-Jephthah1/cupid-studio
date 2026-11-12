let botParty = "2 Seats";
let botMeal = "Charcoal Sea Bass";
let botPassSerial = 418;

function selectBotSwatch(title, detail, hex, btn) {
    document.querySelectorAll(".swatch-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    document.getElementById("swatchTitle").textContent = title;
    document.getElementById("swatchDetail").textContent = detail;
    document.getElementById("swatchNoteBox").style.borderTop = `2px solid ${hex}`;
}

function toggleVenueHint(btn) {
    const note = document.getElementById("venuePinNote");
    note.hidden = !note.hidden;
    btn.textContent = note.hidden ? "Show Arrival & Parking Pin" : "Hide Arrival Note";
}

function toggleAgendaRow(btn) {
    const row = btn.closest(".agenda-row");
    const willOpen = !row.classList.contains("open");
    document.querySelectorAll(".agenda-row").forEach(r => {
        r.classList.remove("open");
        const icon = r.querySelector(".agenda-trigger span:last-child");
        if (icon) icon.innerHTML = "+";
    });
    if (willOpen) {
        row.classList.add("open");
        btn.querySelector("span:last-child").innerHTML = "&#8722;";
    }
}

function toggleBotDd(id, ev) {
    if (ev) ev.stopPropagation();
    document.querySelectorAll(".bot-dd.open").forEach(d => {
        if (d.id !== id) d.classList.remove("open");
    });
    const el = document.getElementById(id);
    if (el) el.classList.toggle("open");
}

function pickBotDd(id, kind, val) {
    if (kind === "party") botParty = val;
    else botMeal = val;
    const el = document.getElementById(id);
    el.querySelector(".bot-dd-label").textContent = val;
    el.querySelectorAll(".bot-dd-opt").forEach(o => {
        o.classList.toggle("selected", o.textContent.trim() === val);
    });
    el.classList.remove("open");
}

document.addEventListener("click", e => {
    if (!e.target.closest(".bot-dd")) {
        document.querySelectorAll(".bot-dd.open").forEach(d => d.classList.remove("open"));
    }
});

function mintGatePass() {
    const rawName = (document.getElementById("botGuestName").value || "").trim() || "Honored Guest";
    botPassSerial += 1;
    document.getElementById("passCode").textContent = `PASS #0${botPassSerial}`;
    document.getElementById("passNameOut").textContent = rawName;
    document.getElementById("passMetaOut").textContent = `${botParty.toUpperCase()} · ${botMeal.toUpperCase()} · CYPRESS CODE`;
}

function downloadBotPassPng() {
    const canvas = document.createElement("canvas");
    canvas.width = 960;
    canvas.height = 540;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#FAF7F0";
    ctx.fillRect(0, 0, 960, 540);
    ctx.strokeStyle = "#1B3429";
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, 912, 492);
    ctx.strokeStyle = "#A86E42";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, 888, 468);

    ctx.fillStyle = "#A86E42";
    ctx.font = "500 20px monospace";
    ctx.fillText("OKOTO GARDEN SUPPER · GATE PASS", 64, 96);
    ctx.fillText(document.getElementById("passCode").textContent, 740, 96);

    ctx.fillStyle = "#5A645D";
    ctx.font = "500 18px monospace";
    ctx.fillText("ADMITTED GUEST", 64, 190);

    ctx.fillStyle = "#1B3429";
    ctx.font = "400 54px Georgia, serif";
    ctx.fillText(document.getElementById("passNameOut").textContent, 64, 255);

    ctx.fillStyle = "#5A645D";
    ctx.font = "500 21px monospace";
    ctx.fillText(document.getElementById("passMetaOut").textContent, 64, 315);

    ctx.strokeStyle = "rgba(27,52,41,0.28)";
    ctx.beginPath();
    ctx.moveTo(64, 390);
    ctx.lineTo(896, 390);
    ctx.stroke();

    ctx.fillStyle = "#1B3429";
    ctx.font = "400 20px monospace";
    ctx.fillText("GATE B CONSERVATORY TERRACE · 17:00 PROMPT", 64, 444);

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "OkotoGardenGatePass.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
}

function startEventCountdown() {
    const target = Date.now() + (14 * 86400 + 6 * 3600 + 28 * 60 + 44) * 1000;
    const tick = () => {
        const diff = Math.max(0, target - Date.now());
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        document.getElementById("bDays").textContent = String(d).padStart(2, "0");
        document.getElementById("bHrs").textContent = String(h).padStart(2, "0");
        document.getElementById("bMins").textContent = String(m).padStart(2, "0");
        document.getElementById("bSecs").textContent = String(s).padStart(2, "0");
    };
    tick();
    setInterval(tick, 1000);
}

document.addEventListener("DOMContentLoaded", startEventCountdown);
