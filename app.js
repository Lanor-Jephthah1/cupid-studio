/* ==========================================================================
   CUPID STUDIO APPLICATION
   Bespoke Keepsake Webpages & Digital Invites | McLanor Jeff (#thechucksdeveloper)
   ========================================================================== */
const CUPID_CONFIG = {
    founder: "McLanor Jeff",
    handle: "#thechucksdeveloper",
    email: "mclanorjephthah@gmail.com",
    whatsappNumber: "233599623173",
    prices: {
        GHS: {
            "Simple Note Page": 250,
            "Full Keepsake Story": 550,
            "Function or Deluxe Page": 950
        },
        USD: {
            "Simple Note Page": 25,
            "Full Keepsake Story": 50,
            "Function or Deluxe Page": 90
        }
    }
};

const OCCASIONS = {
    birthdays: {
        eyebrow: "CUSTOM PAGE COMMISSION SAMPLE",
        title: "Birthday Keepsakes & Surprise Tributes",
        desc: "Instead of temporary status slides that vanish in 24 hours, give them a private birthday site combining cake candles, Polaroids, music, and wishes from every friend.",
        bullets: [
            "Optional riddle or passcode greeting screen tailored to their birthday",
            "Multi photo Polaroid gallery with real captions, videos, and timelines",
            "Favorite birthday soundtrack player & friends wishes guestbook wall"
        ],
        btnLabel: "Customize a Birthday Site",
        occasionVal: "Birthday",
        url: "cupid.studio/ama24",
        badge: "Feature Teaser",
        chapters: ["01 Candles", "02 Gallery", "03 Wishes"]
    },
    anniversaries: {
        eyebrow: "CUSTOM PAGE COMMISSION SAMPLE",
        title: "Anniversary & Relationship Books",
        desc: "Every commission is built around your actual relationship timeline, shared music, secret letters, bucket list dreams, and custom couple mini games.",
        bullets: [
            "Live day counter & multi chapter story from day one up to today",
            "Vinyl music player synchronized to your meaningful couple track",
            "Interactive memory puzzle or quiz starring your own couple photos"
        ],
        btnLabel: "Customize an Anniversary Site",
        occasionVal: "Anniversary",
        url: "cupid.studio/ouryear",
        badge: "Feature Teaser",
        chapters: ["01 Timeline", "02 Dreams", "03 Game"]
    },
    functions: {
        eyebrow: "CUSTOM PAGE COMMISSION SAMPLE",
        title: "Digital Invites & Function Portals",
        desc: "Elevate engagements, graduations, bridal showers, naming ceremonies, and dinners with an effortless link guests open for maps, dress codes, and instant RSVP passes.",
        bullets: [
            "Custom event monogram, live countdown & dress code color swatches",
            "Interactive ceremony agenda & one tap venue map directions",
            "Live guest RSVP counter with digital gate check in pass & album link"
        ],
        btnLabel: "Customize a Function Portal",
        occasionVal: "Function / Event",
        url: "cupid.studio/kojoafua",
        badge: "Feature Teaser",
        chapters: ["01 Invite", "02 Agenda", "03 RSVP"]
    },
    valentines: {
        eyebrow: "CUSTOM PAGE COMMISSION SAMPLE",
        title: "Valentine's & Romantic Letter Books",
        desc: "Far richer than this brief sample: full romantic commissions weave love letters, voice/song tracks, Open When prompts, reasons decks, and date night invitations.",
        bullets: [
            "Wax sealed envelope reveal written in your own personal voice",
            "Interactive mood cards, affectionate reasons dial & music pairing",
            "Hidden date night voucher unlocked at the finale chapter"
        ],
        btnLabel: "Customize a Romantic Site",
        occasionVal: "Valentine's Day",
        url: "cupid.studio/feb14",
        badge: "Feature Teaser",
        chapters: ["01 Letter", "02 Moods", "03 Reasons"]
    }
};

let currentCurrency = "GHS";
let showingBack = false;
let currentOccasionKey = "birthdays";
let activeChapterIdx = 0;
let selectedTierName = "Full Keepsake Story";
let selectedExtras = new Set();
let tickerInterval = null;

// Interactive teaser states
let bdayCandlesLit = [true, true, true];
let pinUnlocked = false;
let polaroidIndex = 0;
let wishIndex = 0;
let wishHearts = [12, 9, 18];
let vinylPlayingKey = null;

let activeMilestoneIdx = 0;
let dreamsDone = [true, false, false];

let inviteAccent = "#82172E";
let inviteColorName = "Oxblood";
let openProgIdx = 0;
let rsvpConfirmed = false;
let rsvpGuestCount = "2 Guests";
let rsvpMealNote = "Jollof & Grill";

let valEnvOpened = false;
let activeOwKey = "miss";
let valReasonIdx = 0;
let dateVoucherRevealed = false;

// Memory Game state
const GAME_ICONS = [
    { id: "rings", label: "Promise", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#82172E" stroke-width="1.8"><circle cx="9" cy="13" r="4.5"/><circle cx="15" cy="11" r="4.5"/></svg>` },
    { id: "vinyl", label: "Our Song", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#1B1715" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5" fill="#82172E" stroke="none"/></svg>` },
    { id: "cam",   label: "Moments", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#9A7638" stroke-width="1.8"><rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="12" cy="12.5" r="3.2"/></svg>` }
];
let memCards = [];
let memFlipped = [];
let memMatched = new Set();
let memLocked = false;

document.addEventListener("DOMContentLoaded", () => {
    resetMemoryGame();
    selectOccasion("birthdays", document.querySelector(".occ-tab.active"));
    initScrollReveal();
    initCardTilt();
    initScrollProgress();
    initActiveNav();
    initUnboxingPlayer();
    updateEstimateUI();

    const params = new URLSearchParams(window.location.search);
    const reqBook = params.get("book");
    const reqTier = params.get("tier");
    if (reqBook || reqTier) {
        setTimeout(() => {
            openBookingModal(reqTier || "", reqBook || "");
            if (window.history && window.history.replaceState) {
                window.history.replaceState({}, document.title, window.location.pathname + "#rates");
            }
        }, 160);
    }
});

function initScrollProgress() {
    const bar = document.getElementById("scrollProgress");
    if (!bar) return;
    window.addEventListener("scroll", () => {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docH > 0 ? Math.min(100, (window.scrollY / docH) * 100) : 0;
        bar.style.width = pct.toFixed(2) + "%";
    }, { passive: true });
}

function initActiveNav() {
    const links = document.querySelectorAll(".nav-links a[data-section]");
    const sections = [...links].map(a => document.getElementById(a.dataset.section)).filter(Boolean);
    if (!("IntersectionObserver" in window) || !sections.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.toggle("active", l.dataset.section === entry.target.id));
            }
        });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(sec => obs.observe(sec));
}

function initScrollReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
        els.forEach(el => el.classList.add("is-visible"));
        return;
    }
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
}

function initCardTilt() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const stage = document.getElementById("cardStage");
    const tilt = document.getElementById("cardTilt");
    const sheens = document.querySelectorAll(".card-sheen");
    if (!stage || !tilt) return;

    stage.addEventListener("pointermove", (e) => {
        const rect = stage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rx = ((0.5 - y) * 4.2).toFixed(2);
        const ry = ((x - 0.5) * 5.0).toFixed(2);
        tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
        sheens.forEach(s => {
            s.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
            s.style.setProperty("--my", (y * 100).toFixed(1) + "%");
        });
    });

    stage.addEventListener("pointerleave", () => {
        tilt.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
}

function setCardStock(stock, btn) {
    const stage = document.getElementById("cardStage");
    if (!stage) return;
    stage.classList.toggle("stock-obsidian", stock === "obsidian");
    document.querySelectorAll(".stock-opt").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    playChime("flip");
}

function toggleCardFace() {
    showingBack = !showingBack;
    const rotator = document.getElementById("cardRotator");
    const front = document.getElementById("cardFrontFace");
    const back = document.getElementById("cardBackFace");
    rotator.classList.toggle("is-flipped", showingBack);
    front.setAttribute("aria-hidden", String(showingBack));
    back.setAttribute("aria-hidden", String(!showingBack));
    playChime("flip");
}

/* ==========================================================================
   OCCASION SWITCHER & 3-CHAPTER INTERACTIVE PHONE ENGINE
   ========================================================================== */
function selectOccasion(key, tabBtn) {
    const data = OCCASIONS[key];
    if (!data) return;
    currentOccasionKey = key;
    activeChapterIdx = 0;

    document.querySelectorAll(".occ-tab").forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
    });
    if (tabBtn) {
        tabBtn.classList.add("active");
        tabBtn.setAttribute("aria-selected", "true");
    }

    const copyWrap = document.getElementById("occCopyWrap");
    if (copyWrap) {
        copyWrap.classList.remove("occ-animate");
        void copyWrap.offsetWidth;
        copyWrap.classList.add("occ-animate");
    }

    document.getElementById("occEyebrow").textContent = data.eyebrow;
    document.getElementById("occTitle").textContent = data.title;
    document.getElementById("occDesc").textContent = data.desc;
    document.getElementById("occBullets").innerHTML = data.bullets.map(b => `<li>${b}</li>`).join("");

    const btn = document.getElementById("occOrderBtn");
    btn.textContent = data.btnLabel;
    btn.setAttribute("onclick", `openBookingModal('', '${data.occasionVal.replace(/'/g, "\\'")}')`);

    document.getElementById("phoneUrl").textContent = data.url;
    document.getElementById("phoneBadge").textContent = data.badge;

    renderBothDemoScreens();
    if (!document.getElementById("fullDemoModal").hidden) {
        syncFullDemo();
    }
}

function setDemoChapter(idx) {
    activeChapterIdx = idx;
    playChime("flip");
    renderBothDemoScreens();
}

function renderChapterBarInto(barId, key) {
    const bar = document.getElementById(barId);
    const data = OCCASIONS[key];
    if (!bar || !data) return;
    bar.innerHTML = data.chapters.map((label, i) => `
        <button class="ch-btn ${activeChapterIdx === i ? "active" : ""}" type="button" onclick="setDemoChapter(${i})">
            ${label}
        </button>
    `).join("");
}

function renderBothDemoScreens() {
    renderChapterBarInto("phoneChapterBar", currentOccasionKey);
    renderPhoneDemoInto("phoneContent", currentOccasionKey);
    if (!document.getElementById("fullDemoModal").hidden) {
        renderChapterBarInto("fullPhoneChapterBar", currentOccasionKey);
        renderPhoneDemoInto("fullPhoneContent", currentOccasionKey);
    }
}

function renderPhoneDemoInto(containerId, key) {
    const el = document.getElementById(containerId);
    if (!el) return;
    clearInterval(tickerInterval);

    /* ---------------------- 1. BIRTHDAYS (3 CHAPTERS) ---------------------- */
    if (key === "birthdays") {
        if (activeChapterIdx === 0) {
            const litCount = bdayCandlesLit.filter(Boolean).length;
            el.innerHTML = `
                <div class="demo-hero-card">
                    <span class="demo-kicker">CHAPTER 01 &middot; NOVEMBER 24</span>
                    <div class="demo-serif-title">Happy 24th, Ama</div>
                    <p class="demo-sub">A private keepsake prepared with your memories, songs, and family wishes.</p>

                    <div class="candle-row">
                        ${bdayCandlesLit.map((lit, i) => `
                            <button class="candle-unit ${lit ? "" : "blown"}" type="button" onclick="toggleCandle(${i})" aria-label="Candle ${i + 1}">
                                <span class="flame"></span>
                                <span class="candle-stick"></span>
                            </button>
                        `).join("")}
                    </div>
                    <div class="wish-status">
                        ${litCount === 0
                            ? "All candles blown! May this year be your brightest."
                            : `Tap any flame to blow it out (${litCount} lit)`}
                    </div>
                    ${litCount === 0 ? `<button class="wishes-pager-btn" style="margin-top:7px;" type="button" onclick="relightCandles()">Relight Candles</button>` : ""}
                </div>

                <div class="pin-teaser-bar">
                    <span>${pinUnlocked ? "Secret Riddle Passed (05/11)" : "Lock Screen Preview: PIN Option"}</span>
                    <button class="mini-action-btn ${pinUnlocked ? "crimson" : ""}" type="button" onclick="togglePinSample()">
                        ${pinUnlocked ? "Unlocked ✓" : "Test Lock"}
                    </button>
                </div>
            `;
            return;
        }

        if (activeChapterIdx === 1) {
            const polaroids = [
                {
                    cap: "Chapter 24 begins bright",
                    tag: "1 of 3",
                    art: `<svg viewBox="0 0 240 110"><rect width="240" height="110" fill="#F8EDE3"/><circle cx="185" cy="28" r="18" fill="#E8C68E" opacity="0.7"/><path d="M90 88h60v-22c0-6-5-10-10-10h-40c-5 0-10 4-10 10v22z" fill="#82172E"/><path d="M90 68c8 6 16 0 24 6s16 0 24 6 12-4 12-4" stroke="#FFF8F0" stroke-width="3" fill="none"/><rect x="117" y="34" width="6" height="22" fill="#D4A65A"/><path d="M120 20c3 5 4 9 0 12-4-3-3-7 0-12z" fill="#E07A3F"/></svg>`
                },
                {
                    cap: "Golden hour laughs at Osu",
                    tag: "2 of 3",
                    art: `<svg viewBox="0 0 240 110"><rect width="240" height="110" fill="#EFE6DC"/><circle cx="72" cy="48" r="24" fill="#9A7638" opacity="0.22"/><path d="M40 96c15-26 38-34 62-20 18-16 44-10 64 20H40z" fill="#82172E" opacity="0.85"/><circle cx="118" cy="36" r="12" fill="#2A1D1B"/></svg>`
                },
                {
                    cap: "To many more road trips",
                    tag: "3 of 3",
                    art: `<svg viewBox="0 0 240 110"><rect width="240" height="110" fill="#EDE7DF"/><path d="M15 86 Q 80 48, 145 72 T 230 60" stroke="#9A7638" stroke-width="2" fill="none"/><circle cx="170" cy="40" r="14" fill="#82172E" opacity="0.85"/><rect x="52" y="54" width="52" height="32" rx="4" fill="#1B1715"/><circle cx="78" cy="70" r="9" stroke="#F7F1E6" stroke-width="2" fill="none"/></svg>`
                }
            ];
            const curP = polaroids[polaroidIndex % polaroids.length];
            const isPlaying = vinylPlayingKey === "birthdays";
            el.innerHTML = `
                <div class="polaroid-stage" onclick="nextPolaroid()" title="Tap to cycle photos">
                    <div class="polaroid-card" style="transform: rotate(3deg) translate(5px, 4px); opacity:0.6;"></div>
                    <div class="polaroid-card" style="transform: rotate(-1.2deg);">
                        <div class="polaroid-art">${curP.art}</div>
                        <div class="polaroid-caption">
                            <span>${curP.cap}</span>
                            <small>Tap &middot; ${curP.tag}</small>
                        </div>
                    </div>
                </div>

                <div class="vinyl-widget">
                    <div class="vinyl-disc-wrap ${isPlaying ? "active" : ""}">
                        <div class="vinyl-disc ${isPlaying ? "spinning" : ""}">
                            <div class="vinyl-label"><div class="vinyl-hole"></div></div>
                        </div>
                        <div class="tonearm"></div>
                    </div>
                    <div class="vinyl-info">
                        <strong>Birthday Acoustic Track</strong>
                        <span>${isPlaying ? "Playing Birthday Melody..." : "Tap Play to spin disc"}</span>
                    </div>
                    <button class="vinyl-play-btn" type="button" onclick="toggleVinyl('birthdays')">${isPlaying ? "Pause" : "Play"}</button>
                </div>
            `;
            return;
        }

        const wishes = [
            { who: "Kofi B.", rel: "Childhood Friend", text: "“Happy 24th Ama! Still laughing at our Cape Coast trip. Dinner is on me Saturday!”" },
            { who: "Nana Yaa", rel: "Sister", text: "“Wishing my favorite sister softer days, peace of mind, and louder wins all year.”" },
            { who: "Mum", rel: "Family", text: "“God bless your new age my dear. Keep shining gracefully everywhere you step.”" }
        ];
        const curW = wishes[wishIndex % wishes.length];
        el.innerHTML = `
            <div class="wishes-card">
                <div class="wishes-top">
                    <span>${curW.who} &middot; ${curW.rel}</span>
                    <span>${wishIndex + 1} / ${wishes.length}</span>
                </div>
                <div class="wishes-quote">${curW.text}</div>
                <div class="wishes-footer">
                    <button class="wishes-pager-btn" type="button" onclick="likeWish()">&#10084; ${wishHearts[wishIndex]}</button>
                    <button class="wishes-pager-btn" type="button" onclick="nextWish()">Next Wish &rarr;</button>
                </div>
            </div>
            <div class="demo-sub" style="text-align:center;">
                In full builds, every photo, voice note, and tribute is collected into an interactive gallery wall.
            </div>
        `;
        return;
    }

    /* ---------------------- 2. ANNIVERSARIES (3 CHAPTERS) ---------------------- */
    if (key === "anniversaries") {
        if (activeChapterIdx === 0) {
            const milestones = [
                { t: "Nov 12 &middot; How It Started", n: "You replied to a quiet status photo, and our 4 hour midnight conversation began." },
                { t: "Apr 10 &middot; First Coast Drive", n: "Missed two turns on the way back and laughed until our sides hurt." },
                { t: "Today &middot; One Year Together", n: "A permanent digital home holding our favorite moments." }
            ];
            el.innerHTML = `
                <div style="text-align:center;">
                    <div class="demo-serif-title">Kwame &amp; Efua</div>
                </div>
                <div class="mini-ticker-bar" id="annivTicker">365 DAYS &middot; 14 HRS &middot; 22 MIN &middot; 10 SEC</div>
                <div style="display:flex; flex-direction:column; gap:6px;">
                    ${milestones.map((m, i) => `
                        <div class="milestone-row ${activeMilestoneIdx === i ? "active" : ""}" onclick="selectMilestone(${i})">
                            <strong>${m.t}</strong>
                            ${activeMilestoneIdx === i ? `<small>${m.n}</small>` : ""}
                        </div>
                    `).join("")}
                </div>
            `;
            startAnnivTicker();
            return;
        }

        if (activeChapterIdx === 1) {
            const isPlaying = vinylPlayingKey === "anniversaries";
            const dreams = [
                "Sunrise coffee trip to Aburi Hills",
                "Cooking Saturday jollof together",
                "Saving for our next coastal getaway"
            ];
            el.innerHTML = `
                <div class="vinyl-widget">
                    <div class="vinyl-disc-wrap ${isPlaying ? "active" : ""}">
                        <div class="vinyl-disc ${isPlaying ? "spinning" : ""}">
                            <div class="vinyl-label"><div class="vinyl-hole"></div></div>
                        </div>
                        <div class="tonearm"></div>
                    </div>
                    <div class="vinyl-info">
                        <strong>Gone, Gone, Gone</strong>
                        <span>${isPlaying ? "Now playing couple track..." : "Tap Play to test vinyl"}</span>
                    </div>
                    <button class="vinyl-play-btn" type="button" onclick="toggleVinyl('anniversaries')">${isPlaying ? "Pause" : "Play"}</button>
                </div>

                <div>
                    <div class="game-header-mini" style="margin-bottom:6px;">
                        <span>SHARED DREAMS CHECKLIST</span>
                        <span>${dreamsDone.filter(Boolean).length}/${dreams.length}</span>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        ${dreams.map((d, i) => `
                            <div class="dream-item ${dreamsDone[i] ? "done" : ""}" onclick="toggleDream(${i})">
                                <div class="dream-box">${dreamsDone[i] ? "&#10003;" : ""}</div>
                                <span>${d}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;
            return;
        }

        const allMatched = memMatched.size === GAME_ICONS.length;
        el.innerHTML = `
            <div class="game-header-mini">
                <span>COUPLE MEMORY GAME (${memMatched.size}/${GAME_ICONS.length})</span>
                <button class="wishes-pager-btn" type="button" onclick="resetMemoryGame(); renderBothDemoScreens();">Shuffle</button>
            </div>
            <div class="memory-grid-mini">
                ${memCards.map((c, idx) => {
                    const isF = memFlipped.includes(idx);
                    const isM = memMatched.has(c.id);
                    return `
                    <div class="mem-tile ${isF ? "flipped" : ""} ${isM ? "matched" : ""}" onclick="flipMemCard(${idx})">
                        <div class="mem-tile-inner">
                            <div class="mem-face mem-back">&#10022;</div>
                            <div class="mem-face mem-front">${c.svg}<span>${c.label}</span></div>
                        </div>
                    </div>`;
                }).join("")}
            </div>
            <div class="demo-sub" style="text-align:center;">
                ${allMatched
                    ? `<strong style="color:var(--crimson);">All pairs matched!</strong> Custom builds feature your real photos.`
                    : `Tap tiles to pair matching keepsakes.`}
            </div>
        `;
        return;
    }

    /* ---------------------- 3. FUNCTIONS & EVENTS (3 CHAPTERS) ---------------------- */
    if (key === "functions") {
        if (activeChapterIdx === 0) {
            el.innerHTML = `
                <div class="invite-banner" style="background:${inviteAccent};">
                    <small>TRADITIONAL ENGAGEMENT</small>
                    <h5>Kojo &amp; Afua</h5>
                    <div class="invite-date-line">SATURDAY, DECEMBER 19 &middot; EAST LEGON</div>
                </div>

                <div class="swatch-bar-phone">
                    <span>Dress Code: <strong>${inviteColorName}</strong></span>
                    <div class="swatch-dots">
                        <button class="swatch-btn ${inviteAccent === "#82172E" ? "selected" : ""}" style="background:#82172E" aria-label="Oxblood theme" onclick="setInviteTheme('#82172E', 'Oxblood')"></button>
                        <button class="swatch-btn ${inviteAccent === "#9A7638" ? "selected" : ""}" style="background:#9A7638" aria-label="Gold theme" onclick="setInviteTheme('#9A7638', 'Champagne')"></button>
                        <button class="swatch-btn ${inviteAccent === "#1F4234" ? "selected" : ""}" style="background:#1F4234" aria-label="Emerald theme" onclick="setInviteTheme('#1F4234', 'Emerald')"></button>
                    </div>
                </div>

                <div class="demo-hero-card">
                    <span class="demo-kicker">GUEST NOTICE</span>
                    <p class="demo-sub" style="margin-top:0;">Tap the color swatches above to preview live invite theming, then switch tabs for Agenda &amp; RSVP.</p>
                </div>
            `;
            return;
        }

        if (activeChapterIdx === 1) {
            const progs = [
                { t: "2:00 PM Procession & Welcome", d: "Garden Pavilion entrance. Cold palm drink bar opens on arrival." },
                { t: "3:30 PM Blessing & Dowry Rite", d: "Traditional ceremony led by both family elders." },
                { t: "5:45 PM Banquet & Live Band", d: "Three course dinner followed by acoustic highlife outdoors." }
            ];
            el.innerHTML = `
                <div>
                    ${progs.map((p, i) => `
                        <div class="prog-item">
                            <button class="prog-trigger" type="button" onclick="openProgIdx = ${i}; renderBothDemoScreens();">
                                <span>${p.t}</span>
                                <span>${openProgIdx === i ? "&#8722;" : "+"}</span>
                            </button>
                            ${openProgIdx === i ? `<div class="prog-detail">${p.d}</div>` : ""}
                        </div>
                    `).join("")}
                </div>
                <div class="venue-pin-card">
                    <strong>VENUE &amp; PARKING PIN</strong>
                    The Cedar Court, East Legon. Valet lane opens at 1:30 PM. Custom pages embed your live Google Maps pin.
                </div>
            `;
            return;
        }

        const guestDdId = `${containerId}_ddGuests`;
        const mealDdId = `${containerId}_ddMeal`;
        const guestOpts = ["1 Guest", "2 Guests", "VIP Table"];
        const mealOpts = ["Jollof & Grill", "Continental", "Vegetarian"];

        el.innerHTML = `
            <div class="rsvp-box">
                <div style="font-family:var(--mono); font-size:0.6rem; color:var(--crimson);">GUEST ATTENDANCE RSVP</div>
                <div class="cupid-select cupid-select--mini" id="${guestDdId}">
                    <button class="cupid-select-trigger" type="button" aria-label="Guest count" aria-haspopup="listbox" aria-expanded="false" onclick="toggleCupidDropdown('${guestDdId}', event)">
                        <span class="cupid-select-label">${rsvpGuestCount}</span>
                        <svg class="cupid-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <div class="cupid-select-menu" role="listbox">
                        ${guestOpts.map(o => `<button type="button" class="cupid-option ${rsvpGuestCount === o ? "selected" : ""}" role="option" aria-selected="${rsvpGuestCount === o}" onclick="pickRsvpOption('${guestDdId}', 'guest', '${o}')">${o}</button>`).join("")}
                    </div>
                </div>
                <div class="cupid-select cupid-select--mini" id="${mealDdId}">
                    <button class="cupid-select-trigger" type="button" aria-label="Meal preference" aria-haspopup="listbox" aria-expanded="false" onclick="toggleCupidDropdown('${mealDdId}', event)">
                        <span class="cupid-select-label">${rsvpMealNote}</span>
                        <svg class="cupid-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <div class="cupid-select-menu" role="listbox">
                        ${mealOpts.map(o => `<button type="button" class="cupid-option ${rsvpMealNote === o ? "selected" : ""}" role="option" aria-selected="${rsvpMealNote === o}" onclick="pickRsvpOption('${mealDdId}', 'meal', '${o}')">${o}</button>`).join("")}
                    </div>
                </div>
                <button class="btn" type="button" style="padding:8px 10px; font-size:0.74rem; background:${rsvpConfirmed ? "#1F4234" : inviteAccent}; color:#fff; width:100%;" onclick="togglePhoneRsvp()">
                    ${rsvpConfirmed ? `Seat Confirmed (${rsvpGuestCount}) ✓` : "Confirm Attendance Pass"}
                </button>
            </div>
            ${rsvpConfirmed
                ? `<div class="gate-pass-stamp">GATE PASS ACTIVE: ${rsvpGuestCount.toUpperCase()} &middot; ${rsvpMealNote.toUpperCase()} &middot; DRESS: ${inviteColorName.toUpperCase()}</div>`
                : `<div class="demo-sub" style="text-align:center;">Confirm above to generate your sample entry pass.</div>`}
        `;
        return;
    }

    /* ---------------------- 4. VALENTINE'S DAY (3 CHAPTERS) ---------------------- */
    if (key === "valentines") {
        if (activeChapterIdx === 0) {
            el.innerHTML = `
                <div style="text-align:center;">
                    <span class="demo-kicker">CHAPTER 01 &middot; FEBRUARY 14</span>
                    <div class="demo-serif-title">Before Today Ends</div>
                </div>

                <div class="env-card-stage">
                    ${!valEnvOpened
                        ? `
                        <div class="env-closed-view" onclick="toggleValEnvelope()" title="Tap wax seal to unseal">
                            <div class="env-closed-flap-line"></div>
                            <span class="env-recipient">For My Favorite Person</span>
                            <div class="env-seal-medallion">&#10084;</div>
                            <span class="env-tap-cue">Tap Wax Seal to Break &amp; Read</span>
                        </div>
                        `
                        : `
                        <div class="env-opened-letter">
                            <p>No long speech today. Thank you for bringing calm, laughter, and warmth into every ordinary week we share. Open the next tabs whenever you need me close.</p>
                            <div class="env-letter-bottom">
                                <span class="env-letter-sign">Always yours, K.</span>
                                <button class="wishes-pager-btn" type="button" onclick="toggleValEnvelope()">Fold Letter</button>
                            </div>
                        </div>
                        `}
                </div>
            `;
            return;
        }

        if (activeChapterIdx === 1) {
            const owMessages = {
                miss: "“Close your eyes, press play below, and remember distance is temporary. Call me tonight.”",
                stressed: "“Take one slow breath. Put everything down for 20 minutes after reading this. I am proud of you.”",
                smile: "“Still laughing at the evening we talked past midnight on our balcony until the battery died.”"
            };
            const isPlaying = vinylPlayingKey === "valentines";
            el.innerHTML = `
                <div>
                    <div style="font-family:var(--mono); font-size:0.57rem; color:var(--ink-faint); margin-bottom:5px;">OPEN WHEN ENVELOPES</div>
                    <div class="open-when-strip">
                        <button class="ow-btn ${activeOwKey === "miss" ? "active" : ""}" type="button" onclick="pickOw('miss')">Miss Me</button>
                        <button class="ow-btn ${activeOwKey === "stressed" ? "active" : ""}" type="button" onclick="pickOw('stressed')">Long Day</button>
                        <button class="ow-btn ${activeOwKey === "smile" ? "active" : ""}" type="button" onclick="pickOw('smile')">Need Smile</button>
                    </div>
                </div>
                <div class="ow-reveal">${owMessages[activeOwKey]}</div>
                <div class="vinyl-widget">
                    <div class="vinyl-disc-wrap ${isPlaying ? "active" : ""}">
                        <div class="vinyl-disc ${isPlaying ? "spinning" : ""}">
                            <div class="vinyl-label"><div class="vinyl-hole"></div></div>
                        </div>
                        <div class="tonearm"></div>
                    </div>
                    <div class="vinyl-info">
                        <strong>Late Night Serenade</strong>
                        <span>${isPlaying ? "Playing romantic chord..." : "Tap Play for ambient mood"}</span>
                    </div>
                    <button class="vinyl-play-btn" type="button" onclick="toggleVinyl('valentines')">${isPlaying ? "Pause" : "Play"}</button>
                </div>
            `;
            return;
        }

        const reasons = [
            "The quiet way you calm any crowded room just by walking into it.",
            "How you remember tiny details I casually mentioned weeks earlier.",
            "Every road trip feels shorter when your playlist is playing.",
            "You always show up with warmth even on ordinary Tuesdays."
        ];
        el.innerHTML = `
            <div class="reason-circle-btn" onclick="nextValReason()">
                <small>REASON ${valReasonIdx + 1} OF ${reasons.length} &middot; TAP TO CYCLE</small>
                <p>“${reasons[valReasonIdx]}”</p>
            </div>

            <div class="pin-teaser-bar" style="margin-top:2px;">
                <span>${dateVoucherRevealed ? "Friday 7:30 PM &middot; Dinner & Vinyl" : "Hidden Date Night Pass"}</span>
                <button class="mini-action-btn crimson" type="button" onclick="toggleDatePass()">
                    ${dateVoucherRevealed ? "Claimed ✓" : "Unveil Pass"}
                </button>
            </div>
        `;
    }
}

/* ==========================================================================
   TEASER HANDLERS
   ========================================================================== */
function toggleCandle(i) {
    bdayCandlesLit[i] = !bdayCandlesLit[i];
    playChime("stamp");
    renderBothDemoScreens();
}
function relightCandles() {
    bdayCandlesLit = [true, true, true];
    playChime("birthdayMelody");
    renderBothDemoScreens();
}
function togglePinSample() {
    pinUnlocked = !pinUnlocked;
    if (pinUnlocked) playChime("stamp");
    renderBothDemoScreens();
}
function nextPolaroid() {
    polaroidIndex = (polaroidIndex + 1) % 3;
    playChime("flip");
    renderBothDemoScreens();
}
function nextWish() {
    wishIndex = (wishIndex + 1) % 3;
    renderBothDemoScreens();
}
function likeWish() {
    wishHearts[wishIndex]++;
    playChime("stamp");
    renderBothDemoScreens();
}

function toggleVinyl(key) {
    if (vinylPlayingKey === key) {
        vinylPlayingKey = null;
    } else {
        vinylPlayingKey = key;
        if (key === "birthdays") playChime("birthdayMelody");
        else if (key === "valentines") playChime("valentine");
        else playChime("anniversary");
    }
    renderBothDemoScreens();
}

function selectMilestone(i) {
    activeMilestoneIdx = i;
    renderBothDemoScreens();
}
function toggleDream(i) {
    dreamsDone[i] = !dreamsDone[i];
    playChime("flip");
    renderBothDemoScreens();
}

function startAnnivTicker() {
    let secs = 51730;
    const update = () => {
        secs++;
        const h = Math.floor((secs % 86400) / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        const txt = `365 DAYS · ${String(h).padStart(2, "0")} HRS · ${String(m).padStart(2, "0")} MIN · ${String(s).padStart(2, "0")} SEC`;
        document.querySelectorAll("#annivTicker").forEach(n => { n.textContent = txt; });
    };
    update();
    tickerInterval = setInterval(update, 1000);
}

function resetMemoryGame() {
    memCards = [...GAME_ICONS, ...GAME_ICONS].sort(() => Math.random() - 0.5);
    memFlipped = [];
    memMatched = new Set();
    memLocked = false;
}

function flipMemCard(idx) {
    if (memLocked || memFlipped.includes(idx) || memMatched.has(memCards[idx].id)) return;
    memFlipped.push(idx);
    renderBothDemoScreens();

    if (memFlipped.length === 2) {
        memLocked = true;
        const [a, b] = memFlipped;
        if (memCards[a].id === memCards[b].id) {
            memMatched.add(memCards[a].id);
            memFlipped = [];
            memLocked = false;
            playChime("stamp");
            setTimeout(renderBothDemoScreens, 180);
        } else {
            setTimeout(() => {
                memFlipped = [];
                memLocked = false;
                renderBothDemoScreens();
            }, 680);
        }
    }
}

function setInviteTheme(hex, name) {
    inviteAccent = hex;
    inviteColorName = name;
    renderBothDemoScreens();
}
function togglePhoneRsvp() {
    rsvpConfirmed = !rsvpConfirmed;
    if (rsvpConfirmed) playChime("stamp");
    renderBothDemoScreens();
}

function toggleValEnvelope() {
    valEnvOpened = !valEnvOpened;
    if (valEnvOpened) playChime("valentine");
    else playChime("flip");
    renderBothDemoScreens();
}
function pickOw(key) {
    activeOwKey = key;
    renderBothDemoScreens();
}
function nextValReason() {
    valReasonIdx = (valReasonIdx + 1) % 4;
    playChime("flip");
    renderBothDemoScreens();
}
function toggleDatePass() {
    dateVoucherRevealed = !dateVoucherRevealed;
    if (dateVoucherRevealed) playChime("valentine");
    renderBothDemoScreens();
}

// Expanded Interactive Teaser Modal
function openFullDemo() {
    syncFullDemo();
    document.getElementById("fullDemoModal").hidden = false;
}
function syncFullDemo() {
    const data = OCCASIONS[currentOccasionKey];
    document.getElementById("fullDemoHeading").textContent = data.title;
    document.getElementById("fullPhoneUrl").textContent = data.url;
    document.getElementById("fullPhoneBadge").textContent = data.badge;
    renderChapterBarInto("fullPhoneChapterBar", currentOccasionKey);
    renderPhoneDemoInto("fullPhoneContent", currentOccasionKey);
    document.getElementById("fullDemoOrderBtn").onclick = () => {
        closeModal("fullDemoModal");
        openBookingModal("", data.occasionVal);
    };
}

/* ==========================================================================
   WEB AUDIO SYNTHESIZER (ACOUSTIC FEEDBACK & HAPPY BIRTHDAY MELODY)
   ========================================================================== */
let audioCtx = null;
function playChime(type) {
    try {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioClass) return;
        if (!audioCtx) audioCtx = new AudioClass();
        if (audioCtx.state === "suspended") audioCtx.resume();

        const sequences = {
            flip:           [392, 523.25],
            stamp:          [523.25, 659.25, 783.99],
            birthdayMelody: [
                [392, 0.00, 0.25], [392, 0.28, 0.25], [440, 0.56, 0.45],
                [392, 1.05, 0.45], [523.25, 1.55, 0.45], [493.88, 2.05, 0.85]
            ],
            anniversary:    [
                [349.23, 0.0, 0.5], [440, 0.22, 0.5], [523.25, 0.44, 0.6], [698.46, 0.68, 0.9]
            ],
            valentine:      [
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
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + offset);
            gain.gain.setValueAtTime(0.0001, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.055, now + offset + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + dur);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + dur + 0.05);
        });
    } catch {}
}

/* ==========================================================================
   PACKAGES, EXTRAS & LIVE ESTIMATE BUILDER
   ========================================================================== */
function selectTier(tierName) {
    selectedTierName = tierName;
    document.querySelectorAll(".rate-row").forEach(row => {
        const match = row.dataset.tier === tierName;
        row.classList.toggle("selected-tier", match);
        const btn = row.querySelector("button");
        if (btn) btn.className = match ? "btn btn-ink" : "btn btn-outline";
    });
    setCupidSelectValue("ddPackage", tierName);
    updateEstimateUI();
}

function syncModalTier(val) {
    selectTier(val);
}

/* Custom In-Place Dropdown Widget Controllers */
function closeAllCupidDropdowns(exceptId) {
    document.querySelectorAll(".cupid-select.open").forEach(dd => {
        if (dd.id !== exceptId) {
            dd.classList.remove("open");
            const trg = dd.querySelector(".cupid-select-trigger");
            if (trg) trg.setAttribute("aria-expanded", "false");
        }
    });
}

function toggleCupidDropdown(id, event) {
    if (event) event.stopPropagation();
    const dd = document.getElementById(id);
    if (!dd) return;
    const willOpen = !dd.classList.contains("open");
    closeAllCupidDropdowns(id);
    dd.classList.toggle("open", willOpen);
    const trg = dd.querySelector(".cupid-select-trigger");
    if (trg) trg.setAttribute("aria-expanded", String(willOpen));
}

function setCupidSelectValue(wrapperId, val) {
    const dd = document.getElementById(wrapperId);
    if (!dd) return;
    const targetId = dd.dataset.target;
    if (targetId) {
        const input = document.getElementById(targetId);
        if (input) input.value = val;
    }
    const label = dd.querySelector(".cupid-select-label");
    if (label) label.textContent = val;
    dd.querySelectorAll(".cupid-option").forEach(opt => {
        const match = opt.textContent.trim() === val;
        opt.classList.toggle("selected", match);
        opt.setAttribute("aria-selected", String(match));
    });
}

function pickCupidOption(wrapperId, val) {
    setCupidSelectValue(wrapperId, val);
    const dd = document.getElementById(wrapperId);
    if (dd) {
        dd.classList.remove("open");
        const trg = dd.querySelector(".cupid-select-trigger");
        if (trg) trg.setAttribute("aria-expanded", "false");
        if (dd.dataset.callback === "syncModalTier") syncModalTier(val);
    }
}

function pickRsvpOption(wrapperId, kind, val) {
    if (kind === "guest") rsvpGuestCount = val;
    else rsvpMealNote = val;
    closeAllCupidDropdowns();
    renderBothDemoScreens();
}

document.addEventListener("click", function (e) {
    if (!e.target.closest(".cupid-select")) closeAllCupidDropdowns();
});

function toggleExtra(el) {
    const id = el.dataset.id;
    const willCheck = !selectedExtras.has(id);
    if (willCheck) selectedExtras.add(id);
    else selectedExtras.delete(id);
    el.classList.toggle("checked", willCheck);
    updateEstimateUI();
}

function setCurrency(curr, btn) {
    if (currentCurrency === curr) return;
    currentCurrency = curr;
    document.querySelectorAll(".curr-opt").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");

    const symbol = curr === "USD" ? "$" : "₵";
    document.querySelectorAll(".rate-price").forEach(el => {
        el.classList.add("swapping");
        setTimeout(() => {
            const val = curr === "USD" ? el.dataset.usd : el.dataset.ghs;
            el.textContent = symbol + val;
            el.classList.remove("swapping");
        }, 140);
    });
    document.querySelectorAll(".extra-cost").forEach(el => {
        el.textContent = curr === "USD" ? el.dataset.usd : el.dataset.ghs;
    });
    updateEstimateUI();
}

function updateEstimateUI() {
    const symbol = currentCurrency === "USD" ? "$" : "₵";
    let total = CUPID_CONFIG.prices[currentCurrency][selectedTierName] || 0;
    const checkedExtras = [];
    document.querySelectorAll(".extra-item.checked").forEach(el => {
        const add = Number(currentCurrency === "USD" ? el.dataset.usd : el.dataset.ghs) || 0;
        total += add;
        checkedExtras.push(el.querySelector(".extra-title").textContent.trim());
    });
    const desc = checkedExtras.length > 0
        ? `${selectedTierName} + ${checkedExtras.length} extra${checkedExtras.length > 1 ? "s" : ""}`
        : `${selectedTierName} (base rate)`;
    const eDesc = document.getElementById("estimateDesc");
    const eTot = document.getElementById("estimateTotal");
    const mDesc = document.getElementById("modalEstimateDesc");
    const mTot = document.getElementById("modalEstimateTotal");
    if (eDesc) eDesc.textContent = desc;
    if (eTot) eTot.textContent = symbol + total;
    if (mDesc) mDesc.textContent = desc;
    if (mTot) mTot.textContent = symbol + total;
}

/* ==========================================================================
   MODALS, VALIDATION & FORM-GATED WHATSAPP HANDOFF
   ========================================================================== */
function openBookingModal(pkgName, occasionVal) {
    closeAllCupidDropdowns();
    if (pkgName) selectTier(pkgName);
    if (occasionVal) setCupidSelectValue("ddOccasion", occasionVal);
    ["fName", "fDate", "fNotes"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove("field-error");
    });
    updateEstimateUI();
    document.getElementById("bookingModal").hidden = false;
    const scroller = document.getElementById("bookingFormScroll");
    if (scroller) scroller.scrollTop = 0;
}

function openTagModal() {
    document.getElementById("tagModal").hidden = false;
}

function closeModal(id) {
    closeAllCupidDropdowns();
    document.getElementById(id).hidden = true;
}

["bookingModal", "tagModal", "fullDemoModal", "vcardModal"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener("click", function (e) {
            if (e.target === this) closeModal(id);
        });
    }
});

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeAllCupidDropdowns();
        closeModal("bookingModal");
        closeModal("tagModal");
        closeModal("fullDemoModal");
        closeModal("vcardModal");
    }
});

function validateBriefForm() {
    const requiredIds = ["fName", "fDate", "fNotes"];
    let firstMissing = null;
    requiredIds.forEach(id => {
        const el = document.getElementById(id);
        const empty = !el.value.trim();
        el.classList.toggle("field-error", empty);
        if (empty && !firstMissing) firstMissing = el;
    });
    if (firstMissing) {
        firstMissing.scrollIntoView({ behavior: "smooth", block: "nearest" });
        firstMissing.focus({ preventScroll: true });
        showToast("Please fill in your name, target date, and details first.");
        return false;
    }
    return true;
}

function buildBrief() {
    const name = document.getElementById("fName").value.trim() || "Client";
    const occ = document.getElementById("fOccasion").value;
    const pkg = document.getElementById("fPackage").value;
    const date = document.getElementById("fDate").value.trim() || "Flexible";
    const notes = document.getElementById("fNotes").value.trim() || "None";

    const symbol = currentCurrency === "USD" ? "$" : "₵";
    let total = CUPID_CONFIG.prices[currentCurrency][pkg] || 0;
    const extras = [];
    document.querySelectorAll(".extra-item.checked").forEach(el => {
        total += Number(currentCurrency === "USD" ? el.dataset.usd : el.dataset.ghs) || 0;
        extras.push(el.querySelector(".extra-title").textContent.trim());
    });

    return [
        `Hello ${CUPID_CONFIG.founder} (Cupid),`,
        `I would like to book a custom webpage:`,
        ``,
        `Name: ${name}`,
        `Occasion: ${occ}`,
        `Package: ${pkg}`,
        `Extras: ${extras.length ? extras.join(", ") : "None"}`,
        `Estimated Total: ${symbol}${total}`,
        `Target Date: ${date}`,
        `Details: ${notes}`
    ].join("\n");
}

function sendWhatsApp() {
    if (!validateBriefForm()) return;
    const digits = CUPID_CONFIG.whatsappNumber.replace(/\D/g, "");
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(buildBrief())}`, "_blank", "noopener,noreferrer");
}

function sendEmail() {
    const occ = document.getElementById("fOccasion").value;
    const subject = encodeURIComponent(`Cupid Booking: ${occ}`);
    const body = encodeURIComponent(buildBrief());
    window.location.href = `mailto:${CUPID_CONFIG.email}?subject=${subject}&body=${body}`;
    showToast("Opening email app...");
}

async function copyBrief() {
    try {
        await navigator.clipboard.writeText(buildBrief());
        showToast("Order brief copied cleanly.");
    } catch {
        showToast("Select and copy your details manually.");
    }
}

function openVCardModal() {
    closeAllCupidDropdowns();
    document.getElementById("vcardModal").hidden = false;
}

function buildVCardPayload() {
    const studioUrl = "https://cupid-studio.vercel.app/";
    return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "N:Jeff;McLanor;;;",
        `FN:${CUPID_CONFIG.founder} (Cupid Studio)`,
        "ORG:Cupid Studio",
        `TITLE:Bespoke Keepsake Webpages & Digital Invites (${CUPID_CONFIG.handle})`,
        `EMAIL;TYPE=INTERNET,WORK:${CUPID_CONFIG.email}`,
        `URL;TYPE=Studio:${studioUrl}`,
        "URL;TYPE=X:https://x.com/jeff_lanor",
        "URL;TYPE=GitHub:https://github.com/Lanor-Jephthah1",
        "ADR;TYPE=WORK:;;Akosombo;;;Ghana",
        "CATEGORIES:Cupid Studio,Web Design,Digital Keepsakes",
        `NOTE:Birthdays, Anniversaries, Functions & Valentine's custom webpages. Commission inquiry unlocks WhatsApp dispatch at ${studioUrl}`,
        "END:VCARD",
        ""
    ].join("\r\n");
}

function downloadVCard(ev) {
    if (ev) ev.preventDefault();
    const payload = buildVCardPayload();
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isIOS) {
        window.location.href = "cupid.vcf";
        showToast("Opening Apple Contacts card (.vcf)...");
        return;
    }
    const blob = new Blob([payload], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CupidStudio-McLanorJeff.vcf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("Saved CupidStudio-McLanorJeff.vcf");
}

async function shareVCardFile() {
    const payload = buildVCardPayload();
    try {
        const file = new File([payload], "CupidStudio-McLanorJeff.vcf", { type: "text/vcard;charset=utf-8" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: "McLanor Jeff · Cupid Studio",
                text: "Save Cupid Studio contact card (.vcf)"
            });
            showToast("Shared .vcf to your phone sheet.");
            return;
        }
    } catch {}
    if (navigator.share) {
        try {
            await navigator.share({
                title: "McLanor Jeff · Cupid Studio",
                text: "Bespoke keepsake webpages & digital invites by Cupid Studio.",
                url: window.location.href
            });
            return;
        } catch {}
    }
    copyContactDetails();
}

function downloadCardImage() {
    const stage = document.getElementById("cardStage");
    const obsidian = stage && stage.classList.contains("stock-obsidian");
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 680;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = obsidian ? "#161413" : "#FFFCF7";
    ctx.fillRect(0, 0, 1200, 680);

    ctx.strokeStyle = obsidian ? "#9A7B3C" : "#181210";
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, 1128, 608);

    ctx.strokeStyle = obsidian ? "rgba(255,248,236,0.22)" : "rgba(24,18,16,0.16)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(52, 52, 1096, 576);

    ctx.fillStyle = obsidian ? "#C8A25B" : "#9E2A2B";
    ctx.font = "500 20px monospace";
    ctx.fillText("CUPID STUDIO · AKOSOMBO, GHANA", 88, 122);

    ctx.fillStyle = obsidian ? "#EFE6D8" : "#181210";
    ctx.font = "400 118px Georgia, serif";
    ctx.fillText("Cupid.", 86, 310);

    ctx.fillStyle = obsidian ? "#C6BAA8" : "#574E48";
    ctx.font = "400 32px Georgia, serif";
    ctx.fillText("Bespoke interactive webpages for birthdays, anniversaries,", 88, 382);
    ctx.fillText("milestone functions, and Valentine's.", 88, 426);

    ctx.strokeStyle = obsidian ? "rgba(200,162,91,0.35)" : "rgba(24,18,16,0.16)";
    ctx.beginPath();
    ctx.moveTo(88, 492);
    ctx.lineTo(1112, 492);
    ctx.stroke();

    ctx.fillStyle = obsidian ? "#EFE6D8" : "#181210";
    ctx.font = "600 24px sans-serif";
    ctx.fillText("McLanor Jeff · #thechucksdeveloper", 88, 548);

    ctx.fillStyle = obsidian ? "#C8A25B" : "#9E2A2B";
    ctx.font = "500 22px monospace";
    ctx.fillText("mclanorjephthah@gmail.com  |  cupid-studio.vercel.app", 88, 588);

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = obsidian ? "CupidCallingCard-Obsidian.png" : "CupidCallingCard-Ivory.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    playChime("stamp");
    showToast("Saved calling card image (.png)");
}

async function copyContactDetails() {
    const info = [
        "Cupid Studio · McLanor Jeff (#thechucksdeveloper)",
        "Bespoke Keepsake Webpages & Digital Invites",
        `Email: ${CUPID_CONFIG.email}`,
        "Studio Card: https://cupid-studio.vercel.app/",
        "X: https://x.com/jeff_lanor | GitHub: https://github.com/Lanor-Jephthah1",
        "Location: Akosombo, Ghana (Direct WhatsApp unlocks after brief form)"
    ].join("\n");
    try {
        await navigator.clipboard.writeText(info);
        showToast("Studio contact card copied cleanly.");
    } catch {
        showToast("Copy email: " + CUPID_CONFIG.email);
    }
}

async function shareCard() {
    const text = `Cupid by McLanor Jeff (${CUPID_CONFIG.handle}): custom webpages for birthdays, anniversaries, functions & Valentine's. Open the studio card to submit a booking brief.`;
    if (navigator.share) {
        try {
            await navigator.share({ title: "Cupid Business Card", text, url: window.location.href });
            return;
        } catch {}
    }
    try {
        await navigator.clipboard.writeText(text + " " + window.location.href);
        showToast("Studio link & summary copied cleanly.");
    } catch {
        showToast("Copy or share this link cleanly.");
    }
}

/* ==========================================================================
   12-SECOND UNBOXING & DELIVERY REEL ENGINE
   ========================================================================== */
const UB_DURATION_MS = 12000;
const UB_SLATES = [
    "BEAT 01 · PRINTED TAG PARCEL",
    "BEAT 02 · QR SCAN & PASSCODE GATE",
    "BEAT 03 · VINYL & 35MM POLAROIDS",
    "BEAT 04 · SEALED EPILOGUE & FINISH"
];
const UB_BEAT_TIMES = [0, 3100, 6100, 9300];
let ubElapsedMs = 0;
let ubPlaying = false;
let ubAudioEnabled = false;
let ubRaf = null;
let ubLastTick = 0;
let ubLastBeat = 0;

function beatIndexForMs(ms) {
    if (ms < 3000) return 0;
    if (ms < 6000) return 1;
    if (ms < 9200) return 2;
    return 3;
}

function playBeatAudio(beatIdx) {
    if (!ubAudioEnabled) return;
    if (beatIdx === 0) playChime("flip");
    else if (beatIdx === 1) playChime("stamp");
    else if (beatIdx === 2) playChime("valentine");
    else playChime("stamp");
}

function renderUnboxingAt(ms) {
    const clamped = Math.max(0, Math.min(UB_DURATION_MS, ms));
    const stage = document.getElementById("unboxingStage");
    if (!stage) return;

    const beat = beatIndexForMs(clamped);
    stage.setAttribute("data-beat", String(beat));
    const slate = document.getElementById("unboxingSlateLabel");
    if (slate) slate.textContent = UB_SLATES[beat];

    stage.querySelectorAll(".ub-scene").forEach((el, idx) => {
        el.classList.toggle("is-active", idx === beat);
    });
    document.querySelectorAll(".ub-beat-btn").forEach((b, idx) => {
        b.classList.toggle("active", idx === beat);
    });

    const pct = (clamped / UB_DURATION_MS) * 100;
    const fill = document.getElementById("ubScrubberFill");
    if (fill) fill.style.width = pct.toFixed(2) + "%";

    const scrub = document.getElementById("ubScrubber");
    if (scrub) scrub.setAttribute("aria-valuenow", (clamped / 1000).toFixed(1));

    const tc = document.getElementById("ubTimecode");
    if (tc) tc.textContent = `${(clamped / 1000).toFixed(1).padStart(4, "0")}s / 12.0s`;

    if (beat !== ubLastBeat) {
        ubLastBeat = beat;
        if (ubPlaying) playBeatAudio(beat);
    }
}

function stepUnboxing(now) {
    if (!ubPlaying) return;
    const dt = Math.min(100, now - ubLastTick);
    ubLastTick = now;
    ubElapsedMs += dt;
    if (ubElapsedMs >= UB_DURATION_MS) {
        ubElapsedMs = UB_DURATION_MS;
        renderUnboxingAt(ubElapsedMs);
        ubPlaying = false;
        updateUnboxingBtns(true);
        return;
    }
    renderUnboxingAt(ubElapsedMs);
    ubRaf = requestAnimationFrame(stepUnboxing);
}

function updateUnboxingBtns(finished) {
    const btn = document.getElementById("ubPlayBtn");
    const overlay = document.getElementById("ubPlayOverlay");
    const hideOverlay = ubPlaying || (ubElapsedMs > 0 && ubElapsedMs < UB_DURATION_MS);
    if (btn) {
        btn.textContent = ubPlaying ? "Pause Reel" : (finished ? "Replay 12s Film" : "Play 12s Film");
    }
    if (overlay) {
        overlay.classList.toggle("is-hidden", hideOverlay);
        const txt = overlay.querySelector(".ub-play-txt");
        if (txt) txt.textContent = finished ? "Replay 12s Delivery Film" : "Watch 12s Delivery Film";
    }
}

function toggleUnboxingPlay() {
    if (ubPlaying) {
        ubPlaying = false;
        cancelAnimationFrame(ubRaf);
        updateUnboxingBtns(false);
        return;
    }
    if (ubElapsedMs >= UB_DURATION_MS) {
        ubElapsedMs = 0;
        ubLastBeat = -1;
    }
    ubPlaying = true;
    ubLastTick = performance.now();
    playBeatAudio(beatIndexForMs(ubElapsedMs));
    updateUnboxingBtns(false);
    ubRaf = requestAnimationFrame(stepUnboxing);
}

function seekUnboxingBeat(beatIdx) {
    ubElapsedMs = UB_BEAT_TIMES[beatIdx] || 0;
    ubLastBeat = beatIdx;
    renderUnboxingAt(ubElapsedMs);
    updateUnboxingBtns(ubElapsedMs >= UB_DURATION_MS);
    if (ubAudioEnabled) playBeatAudio(beatIdx);
}

function toggleUnboxingAudio() {
    ubAudioEnabled = !ubAudioEnabled;
    const btn = document.getElementById("ubMuteBtn");
    if (btn) btn.textContent = ubAudioEnabled ? "Sound: On" : "Sound: Off";
    if (ubAudioEnabled) playBeatAudio(beatIndexForMs(ubElapsedMs));
}

function initUnboxingPlayer() {
    const scrub = document.getElementById("ubScrubber");
    if (!scrub) return;
    scrub.addEventListener("click", e => {
        const rect = scrub.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        ubElapsedMs = Math.round(ratio * UB_DURATION_MS);
        ubLastBeat = beatIndexForMs(ubElapsedMs);
        renderUnboxingAt(ubElapsedMs);
        updateUnboxingBtns(ubElapsedMs >= UB_DURATION_MS);
    });
    renderUnboxingAt(0);
}

let toastTimer;
function showToast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 3000);
}

// Fine-grain scroll-reactive particle formation
(function initScrollGrainParticles() {
    const canvas = document.getElementById('scrollGrainCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const PARTICLE_COUNT = 68;
    const particles = [];

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * 1400,
            y: Math.random() * 900,
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28,
            r: 0.9 + Math.random() * 1.4,
            alpha: 0.14 + Math.random() * 0.28,
            gold: Math.random() > 0.45
        });
    }

    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY;
        scrollVelocity = Math.max(-14, Math.min(14, scrollVelocity + delta * 0.14));
        lastScrollY = currentY;
    }, { passive: true });

    function tick() {
        ctx.clearRect(0, 0, w, h);
        scrollVelocity *= 0.92;
        const scrollRatio = Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - h));

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy - scrollVelocity * 0.35;

            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.gold
                ? `rgba(184, 134, 59, ${p.alpha})`
                : `rgba(130, 23, 46, ${p.alpha * 0.85})`;
            ctx.fill();

            // Form subtle constellation threads as user scrolls down
            if (scrollRatio > 0.03) {
                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 95) {
                        const lineAlpha = (1 - dist / 95) * (0.06 + scrollRatio * 0.09);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(184, 134, 59, ${lineAlpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
        }
        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
})();
