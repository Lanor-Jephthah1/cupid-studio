export const CUPID_CONFIG = {
    founder: "The Cupid Devs",
    teamName: "The Cupid Devs",
    handle: "#thecupiddevs",
    email: "hello.cupidstudio@gmail.com",
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

export const TIER_INCLUDED_EXTRAS = {
    "Simple Note Page": [],
    "Full Keepsake Story": ["pin", "wishes"],
    "Function or Deluxe Page": []
};

export const EXTRAS_LIST = [
    {
        id: "rush",
        title: "Express Next Day Build",
        note: "Need it urgently? We prioritize your page for same day or next day delivery.",
        ghs: 100,
        usd: 10
    },
    {
        id: "qrtag",
        title: "Printable QR Gift Tag",
        note: "A printable card PDF you can tuck inside a flower bouquet or gift box.",
        ghs: 40,
        usd: 4,
        hasPreview: true
    },
    {
        id: "pin",
        title: "Private Passcode Lock",
        note: "Put a secret date, riddle, or PIN screen at the front so only they can open it.",
        ghs: 50,
        usd: 5
    },
    {
        id: "wishes",
        title: "Friends & Family Wishes Wall",
        note: "A simple link you share with friends beforehand to collect their messages onto the page.",
        ghs: 80,
        usd: 8
    }
];

export const OCCASIONS = {
    birthdays: {
        tabNum: "01",
        tabLabel: "Birthdays",
        eyebrow: "LIVE BIRTHDAY SAMPLE",
        title: "Birthday Pages & Surprise Tributes",
        desc: "Instead of a WhatsApp status that disappears in a day, give them a private birthday website with interactive candles, your favorite photos together, their song, and notes from everyone who loves them.",
        bullets: [
            "Optional secret PIN or birthday question screen before the page opens",
            "Interactive Polaroid photo stack with your captions and memories",
            "Spinning vinyl song player and a wall of wishes from friends & family"
        ],
        btnLabel: "Start a Birthday Page",
        occasionVal: "Birthday",
        url: "cupid.studio/ama24",
        badge: "Live Sample",
        chapters: ["01 Candles", "02 Photos & Song", "03 Wishes"]
    },
    anniversaries: {
        tabNum: "02",
        tabLabel: "Anniversaries",
        eyebrow: "LIVE ANNIVERSARY SAMPLE",
        title: "Anniversary & Couple Story Pages",
        desc: "Built around your real story together, from how you first met to your favorite inside jokes, shared playlist, bucket list plans, and a mini couple game.",
        bullets: [
            "Live day counter and timeline of your favorite moments together",
            "Vinyl music player playing the song that means the most to you two",
            "Interactive couple checklist and photo memory matching game"
        ],
        btnLabel: "Start an Anniversary Page",
        occasionVal: "Anniversary",
        url: "cupid.studio/ouryear",
        badge: "Live Sample",
        chapters: ["01 Timeline", "02 Dreams", "03 Mini Game"]
    },
    functions: {
        tabNum: "03",
        tabLabel: "Events & Invites",
        eyebrow: "LIVE EVENT INVITE SAMPLE",
        title: "Event Invites & Guest Passes",
        desc: "For engagements, weddings, dinners, graduations, and private parties. Guests open one clean link to see the dress code, schedule, map pin, and claim their VIP gate pass.",
        bullets: [
            "Event banner with live dress code color swatches guests can preview",
            "Interactive ceremony schedule and Google Maps venue directions",
            "Instant RSVP form that generates a downloadable VIP Gate Pass with QR code"
        ],
        btnLabel: "Start an Event Invite",
        occasionVal: "Function / Event",
        url: "cupid.studio/kojoafua",
        badge: "Live Sample",
        chapters: ["01 Invite", "02 Schedule", "03 VIP Pass"]
    },
    valentines: {
        tabNum: "04",
        tabLabel: "Valentine's & Letters",
        eyebrow: "LIVE LOVE LETTER SAMPLE",
        title: "Love Letters & Romantic Surprises",
        desc: "A personal letter they unseal by tapping a wax stamp, followed by Open When notes for different moods, reasons you love them, and a hidden date night ticket.",
        bullets: [
            "Interactive wax sealed envelope written in your own words",
            "Open When mood notes paired with a late night song player",
            "Interactive reasons deck and a surprise date night invite at the end"
        ],
        btnLabel: "Start a Romantic Page",
        occasionVal: "Valentine's Day",
        url: "cupid.studio/feb14",
        badge: "Live Sample",
        chapters: ["01 Letter", "02 Open When", "03 Reasons"]
    }
};

export const GAME_ICONS = [
    {
        id: "rings",
        label: "Promise",
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#82172E" stroke-width="1.8"><circle cx="9" cy="13" r="4.5"/><circle cx="15" cy="11" r="4.5"/></svg>`
    },
    {
        id: "vinyl",
        label: "Our Song",
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#1B1715" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5" fill="#82172E" stroke="none"/></svg>`
    },
    {
        id: "cam",
        label: "Moments",
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#9A7638" stroke-width="1.8"><rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="12" cy="12.5" r="3.2"/></svg>`
    }
];

export const UNBOXING_BEATS = [
    {
        idx: 0,
        btnLabel: "01 Gift Box",
        slate: "STEP 01 · OPENING THE GIFT BOX",
        timeRange: "00:00 TO 03:00",
        caption: "They untie the ribbon and find a printed QR card waiting inside"
    },
    {
        idx: 1,
        btnLabel: "02 QR Scan",
        slate: "STEP 02 · SCANNING & SECRET PASSCODE",
        timeRange: "03:00 TO 06:00",
        caption: "Pointing their phone camera opens the link and asks a personal question"
    },
    {
        idx: 2,
        btnLabel: "03 Song & Photos",
        slate: "STEP 03 · MUSIC & PHOTO MEMORIES",
        timeRange: "06:00 TO 09:20",
        caption: "Their favorite song starts spinning while your photos and notes appear"
    },
    {
        idx: 3,
        btnLabel: "04 Final Letter",
        slate: "STEP 04 · THE PERSONAL LETTER",
        timeRange: "09:20 TO 12:00",
        caption: "Ends with your personal letter saved on a private link they can keep forever"
    }
];
