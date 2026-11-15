import React, { useState, useEffect } from 'react';
import { OCCASIONS, GAME_ICONS } from '../data/studioData';
import { playChime } from '../utils/sound';
import GuestPassCard from './GuestPassCard';
import CupidSelect from './CupidSelect';

export function PhoneSimulatorScreen({
    occasionKey,
    activeChapterIdx,
    onSelectChapter,
    simState,
    simActions,
    showToast
}) {
    const data = OCCASIONS[occasionKey];
    if (!data) return null;

    const {
        bdayCandlesLit,
        pinUnlocked,
        polaroidIndex,
        wishIndex,
        wishHearts,
        vinylPlayingKey,
        activeMilestoneIdx,
        annivTickSecs,
        dreamsDone,
        memCards,
        memFlipped,
        memMatched,
        inviteAccent,
        inviteColorName,
        openProgIdx,
        rsvpConfirmed,
        rsvpGuestCount,
        rsvpMealNote,
        valEnvOpened,
        activeOwKey,
        valReasonIdx,
        dateVoucherRevealed
    } = simState;

    const renderChapterContent = () => {
        /* ---------------------- 1. BIRTHDAYS (3 CHAPTERS) ---------------------- */
        if (occasionKey === 'birthdays') {
            if (activeChapterIdx === 0) {
                const litCount = bdayCandlesLit.filter(Boolean).length;
                return (
                    <>
                        <div className="demo-hero-card">
                            <span className="demo-kicker">CHAPTER 01 &middot; NOVEMBER 24</span>
                            <div className="demo-serif-title">Happy 24th, Ama</div>
                            <p className="demo-sub">A personal birthday page filled with your memories, songs, and family wishes.</p>

                            <div className="candle-row">
                                {bdayCandlesLit.map((lit, i) => (
                                    <button
                                        key={i}
                                        className={`candle-unit ${lit ? '' : 'blown'}`}
                                        type="button"
                                        onClick={() => simActions.toggleCandle(i)}
                                        aria-label={`Candle ${i + 1}`}
                                    >
                                        <span className="flame"></span>
                                        <span className="candle-stick"></span>
                                    </button>
                                ))}
                            </div>
                            <div className="wish-status">
                                {litCount === 0
                                    ? 'All candles blown! May this year be your brightest.'
                                    : `Tap any flame to blow it out (${litCount} lit)`}
                            </div>
                            {litCount === 0 && (
                                <button
                                    className="wishes-pager-btn"
                                    style={{ marginTop: 7 }}
                                    type="button"
                                    onClick={simActions.relightCandles}
                                >
                                    Relight Candles
                                </button>
                            )}
                        </div>

                        <div className="pin-teaser-bar">
                            <span>{pinUnlocked ? 'Secret Question Passed (05/11)' : 'Lock Screen Preview: PIN Option'}</span>
                            <button
                                className={`mini-action-btn ${pinUnlocked ? 'crimson' : ''}`}
                                type="button"
                                onClick={simActions.togglePinSample}
                            >
                                {pinUnlocked ? 'Unlocked ✓' : 'Test Lock'}
                            </button>
                        </div>
                    </>
                );
            }

            if (activeChapterIdx === 1) {
                const polaroids = [
                    {
                        cap: 'Chapter 24 begins bright',
                        tag: '1 of 3',
                        art: `<svg viewBox="0 0 240 110"><rect width="240" height="110" fill="#F8EDE3"/><circle cx="185" cy="28" r="18" fill="#E8C68E" opacity="0.7"/><path d="M90 88h60v-22c0-6-5-10-10-10h-40c-5 0-10 4-10 10v22z" fill="#82172E"/><path d="M90 68c8 6 16 0 24 6s16 0 24 6 12-4 12-4" stroke="#FFF8F0" stroke-width="3" fill="none"/><rect x="117" y="34" width="6" height="22" fill="#D4A65A"/><path d="M120 20c3 5 4 9 0 12-4-3-3-7 0-12z" fill="#E07A3F"/></svg>`
                    },
                    {
                        cap: 'Golden hour laughs at Osu',
                        tag: '2 of 3',
                        art: `<svg viewBox="0 0 240 110"><rect width="240" height="110" fill="#EFE6DC"/><circle cx="72" cy="48" r="24" fill="#9A7638" opacity="0.22"/><path d="M40 96c15-26 38-34 62-20 18-16 44-10 64 20H40z" fill="#82172E" opacity="0.85"/><circle cx="118" cy="36" r="12" fill="#2A1D1B"/></svg>`
                    },
                    {
                        cap: 'To many more road trips',
                        tag: '3 of 3',
                        art: `<svg viewBox="0 0 240 110"><rect width="240" height="110" fill="#EDE7DF"/><path d="M15 86 Q 80 48, 145 72 T 230 60" stroke="#9A7638" stroke-width="2" fill="none"/><circle cx="170" cy="40" r="14" fill="#82172E" opacity="0.85"/><rect x="52" y="54" width="52" height="32" rx="4" fill="#1B1715"/><circle cx="78" cy="70" r="9" stroke="#F7F1E6" stroke-width="2" fill="none"/></svg>`
                    }
                ];
                const curP = polaroids[polaroidIndex % polaroids.length];
                const isPlaying = vinylPlayingKey === 'birthdays';
                return (
                    <>
                        <div className="polaroid-stage" onClick={simActions.nextPolaroid} title="Tap to cycle photos">
                            <div className="polaroid-card" style={{ transform: 'rotate(3deg) translate(5px, 4px)', opacity: 0.6 }}></div>
                            <div className="polaroid-card" style={{ transform: 'rotate(-1.2deg)' }}>
                                <div className="polaroid-art" dangerouslySetInnerHTML={{ __html: curP.art }} />
                                <div className="polaroid-caption">
                                    <span>{curP.cap}</span>
                                    <small>Tap &middot; {curP.tag}</small>
                                </div>
                            </div>
                        </div>

                        <div className="vinyl-widget">
                            <div className={`vinyl-disc-wrap ${isPlaying ? 'active' : ''}`}>
                                <div className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`}>
                                    <div className="vinyl-label"><div className="vinyl-hole"></div></div>
                                </div>
                                <div className="tonearm"></div>
                            </div>
                            <div className="vinyl-info">
                                <strong>Birthday Acoustic Song</strong>
                                <span>{isPlaying ? 'Playing Birthday Melody...' : 'Tap Play to spin record'}</span>
                            </div>
                            <button className="vinyl-play-btn" type="button" onClick={() => simActions.toggleVinyl('birthdays')}>
                                {isPlaying ? 'Pause' : 'Play'}
                            </button>
                        </div>
                    </>
                );
            }

            const wishes = [
                { who: 'Kofi B.', rel: 'Childhood Friend', text: '“Happy 24th Ama! Still laughing at our Cape Coast trip. Dinner is on me Saturday!”' },
                { who: 'Nana Yaa', rel: 'Sister', text: '“Wishing my favorite sister softer days, peace of mind, and louder wins all year.”' },
                { who: 'Mum', rel: 'Family', text: '“God bless your new age my dear. Keep shining everywhere you step.”' }
            ];
            const curW = wishes[wishIndex % wishes.length];
            return (
                <>
                    <div className="wishes-card">
                        <div className="wishes-top">
                            <span>{curW.who} &middot; {curW.rel}</span>
                            <span>{wishIndex + 1} / {wishes.length}</span>
                        </div>
                        <div className="wishes-quote">{curW.text}</div>
                        <div className="wishes-footer">
                            <button className="wishes-pager-btn" type="button" onClick={simActions.likeWish}>
                                &#10084; {wishHearts[wishIndex]}
                            </button>
                            <button className="wishes-pager-btn" type="button" onClick={simActions.nextWish}>
                                Next Note &rarr;
                            </button>
                        </div>
                    </div>
                    <div className="demo-sub" style={{ textAlign: 'center' }}>
                        Full builds collect messages, photos, and voice notes from all their friends into one wall.
                    </div>
                </>
            );
        }

        /* ---------------------- 2. ANNIVERSARIES (3 CHAPTERS) ---------------------- */
        if (occasionKey === 'anniversaries') {
            if (activeChapterIdx === 0) {
                const milestones = [
                    { t: 'Nov 12 · How It Started', n: 'You replied to a late status photo, and our four hour midnight conversation began.' },
                    { t: 'Apr 10 · First Coast Drive', n: 'Missed two turns on the way back and laughed until our sides hurt.' },
                    { t: 'Today · One Year Together', n: 'A personal home online holding our favorite moments.' }
                ];
                const h = Math.floor((annivTickSecs % 86400) / 3600);
                const m = Math.floor((annivTickSecs % 3600) / 60);
                const s = annivTickSecs % 60;
                const tickerText = `365 DAYS · ${String(h).padStart(2, '0')} HRS · ${String(m).padStart(2, '0')} MIN · ${String(s).padStart(2, '0')} SEC`;

                return (
                    <>
                        <div style={{ textAlign: 'center' }}>
                            <div className="demo-serif-title">Kwame &amp; Efua</div>
                        </div>
                        <div className="mini-ticker-bar" id="annivTicker">{tickerText}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {milestones.map((ms, i) => (
                                <div
                                    key={i}
                                    className={`milestone-row ${activeMilestoneIdx === i ? 'active' : ''}`}
                                    onClick={() => simActions.selectMilestone(i)}
                                >
                                    <strong>{ms.t}</strong>
                                    {activeMilestoneIdx === i && <small>{ms.n}</small>}
                                </div>
                            ))}
                        </div>
                    </>
                );
            }

            if (activeChapterIdx === 1) {
                const isPlaying = vinylPlayingKey === 'anniversaries';
                const dreams = [
                    'Sunrise coffee trip to Aburi Hills',
                    'Cooking Saturday jollof together',
                    'Saving for our next coastal getaway'
                ];
                return (
                    <>
                        <div className="vinyl-widget">
                            <div className={`vinyl-disc-wrap ${isPlaying ? 'active' : ''}`}>
                                <div className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`}>
                                    <div className="vinyl-label"><div className="vinyl-hole"></div></div>
                                </div>
                                <div className="tonearm"></div>
                            </div>
                            <div className="vinyl-info">
                                <strong>Gone, Gone, Gone</strong>
                                <span>{isPlaying ? 'Now playing couple track...' : 'Tap Play to test vinyl'}</span>
                            </div>
                            <button className="vinyl-play-btn" type="button" onClick={() => simActions.toggleVinyl('anniversaries')}>
                                {isPlaying ? 'Pause' : 'Play'}
                            </button>
                        </div>

                        <div>
                            <div className="game-header-mini" style={{ marginBottom: 6 }}>
                                <span>OUR BUCKET LIST</span>
                                <span>{dreamsDone.filter(Boolean).length}/{dreams.length}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {dreams.map((d, i) => (
                                    <div
                                        key={i}
                                        className={`dream-item ${dreamsDone[i] ? 'done' : ''}`}
                                        onClick={() => simActions.toggleDream(i)}
                                    >
                                        <div className="dream-box">{dreamsDone[i] ? '✓' : ''}</div>
                                        <span>{d}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                );
            }

            const allMatched = memMatched.size === GAME_ICONS.length;
            return (
                <>
                    <div className="game-header-mini">
                        <span>COUPLE MEMORY GAME ({memMatched.size}/{GAME_ICONS.length})</span>
                        <button className="wishes-pager-btn" type="button" onClick={simActions.resetMemoryGame}>
                            Shuffle
                        </button>
                    </div>
                    <div className="memory-grid-mini">
                        {memCards.map((c, idx) => {
                            const isF = memFlipped.includes(idx);
                            const isM = memMatched.has(c.id);
                            return (
                                <div
                                    key={idx}
                                    className={`mem-tile ${isF ? 'flipped' : ''} ${isM ? 'matched' : ''}`}
                                    onClick={() => simActions.flipMemCard(idx)}
                                >
                                    <div className="mem-tile-inner">
                                        <div className="mem-face mem-back">&#10022;</div>
                                        <div className="mem-face mem-front">
                                            <span dangerouslySetInnerHTML={{ __html: c.svg }} />
                                            <span>{c.label}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="demo-sub" style={{ textAlign: 'center' }}>
                        {allMatched ? (
                            <><strong style={{ color: 'var(--crimson)' }}>All pairs matched!</strong> Real pages use your own couple photos.</>
                        ) : (
                            'Tap tiles to match pairs.'
                        )}
                    </div>
                </>
            );
        }

        /* ---------------------- 3. FUNCTIONS & EVENTS (3 CHAPTERS + UPGRADED VIP GUEST PASS) ---------------------- */
        if (occasionKey === 'functions') {
            if (activeChapterIdx === 0) {
                return (
                    <>
                        <div className="invite-banner" style={{ background: inviteAccent }}>
                            <small>TRADITIONAL ENGAGEMENT</small>
                            <h5>Kojo &amp; Afua</h5>
                            <div className="invite-date-line">SATURDAY, DECEMBER 19 &middot; EAST LEGON</div>
                        </div>

                        <div className="swatch-bar-phone">
                            <span>Dress Code: <strong>{inviteColorName}</strong></span>
                            <div className="swatch-dots">
                                <button
                                    className={`swatch-btn ${inviteAccent === '#82172E' ? 'selected' : ''}`}
                                    style={{ background: '#82172E' }}
                                    aria-label="Oxblood theme"
                                    onClick={() => simActions.setInviteTheme('#82172E', 'Oxblood')}
                                />
                                <button
                                    className={`swatch-btn ${inviteAccent === '#9A7638' ? 'selected' : ''}`}
                                    style={{ background: '#9A7638' }}
                                    aria-label="Champagne Gold theme"
                                    onClick={() => simActions.setInviteTheme('#9A7638', 'Champagne')}
                                />
                                <button
                                    className={`swatch-btn ${inviteAccent === '#1F4234' ? 'selected' : ''}`}
                                    style={{ background: '#1F4234' }}
                                    aria-label="Emerald theme"
                                    onClick={() => simActions.setInviteTheme('#1F4234', 'Emerald')}
                                />
                            </div>
                        </div>

                        <div className="demo-hero-card">
                            <span className="demo-kicker">GUEST GUIDE</span>
                            <p className="demo-sub" style={{ marginTop: 0 }}>
                                Tap the color circles above to test the dress code preview, then open <strong>03 VIP Pass</strong> to generate your digital entry ticket.
                            </p>
                        </div>
                    </>
                );
            }

            if (activeChapterIdx === 1) {
                const progs = [
                    { t: '2:00 PM Arrival & Welcome Drinks', d: 'Garden Pavilion entrance. Chilled palm drink bar opens on arrival.' },
                    { t: '3:30 PM Traditional Ceremony', d: 'Blessing and family rites led by both families.' },
                    { t: '5:45 PM Dinner & Highlife Band', d: 'Three course dinner followed by live acoustic music outdoors.' }
                ];
                return (
                    <>
                        <div>
                            {progs.map((p, i) => (
                                <div key={i} className="prog-item">
                                    <button
                                        className="prog-trigger"
                                        type="button"
                                        onClick={() => simActions.setOpenProgIdx(i)}
                                    >
                                        <span>{p.t}</span>
                                        <span>{openProgIdx === i ? '−' : '+'}</span>
                                    </button>
                                    {openProgIdx === i && <div className="prog-detail">{p.d}</div>}
                                </div>
                            ))}
                        </div>
                        <div className="venue-pin-card">
                            <strong>VENUE &amp; GOOGLE MAPS PIN</strong>
                            The Cedar Court, East Legon. Valet parking opens at 1:30 PM. Full event pages link directly to Google Maps &amp; Uber.
                        </div>
                    </>
                );
            }

            const guestOpts = ['1 Guest', '2 Guests', 'VIP Table'];
            const mealOpts = ['Jollof & Grill', 'Continental', 'Vegetarian'];

            return (
                <>
                    <div className="rsvp-box">
                        <div className="rsvp-box-head">
                            <span>RESERVE SEAT &amp; MINT VIP PASS</span>
                            <span className="rsvp-dress-tag" style={{ color: inviteAccent }}>{inviteColorName}</span>
                        </div>
                        <div className="rsvp-inline-selects">
                            <CupidSelect
                                mini
                                value={rsvpGuestCount}
                                options={guestOpts}
                                onChange={simActions.setRsvpGuestCount}
                                ariaLabel="Guest count"
                            />
                            <CupidSelect
                                mini
                                value={rsvpMealNote}
                                options={mealOpts}
                                onChange={simActions.setRsvpMealNote}
                                ariaLabel="Meal preference"
                            />
                        </div>
                        <button
                            className="btn"
                            type="button"
                            style={{
                                padding: '7px 10px',
                                fontSize: '0.73rem',
                                background: rsvpConfirmed ? '#1F4234' : inviteAccent,
                                color: '#fff',
                                width: '100%'
                            }}
                            onClick={simActions.togglePhoneRsvp}
                        >
                            {rsvpConfirmed ? `VIP Pass Issued (${rsvpGuestCount}) ✓` : 'Generate My VIP Gate Pass'}
                        </button>
                    </div>

                    <GuestPassCard
                        guestCount={rsvpGuestCount}
                        mealNote={rsvpMealNote}
                        colorName={inviteColorName}
                        accentHex={inviteAccent}
                        showToast={showToast}
                    />
                </>
            );
        }

        /* ---------------------- 4. VALENTINE'S DAY (3 CHAPTERS) ---------------------- */
        if (occasionKey === 'valentines') {
            if (activeChapterIdx === 0) {
                return (
                    <>
                        <div style={{ textAlign: 'center' }}>
                            <span className="demo-kicker">CHAPTER 01 &middot; PERSONAL LETTER</span>
                            <div className="demo-serif-title">Before Today Ends</div>
                        </div>

                        <div className="env-card-stage">
                            {!valEnvOpened ? (
                                <div className="env-closed-view" onClick={simActions.toggleValEnvelope} title="Tap wax seal to open">
                                    <div className="env-closed-flap-line"></div>
                                    <span className="env-recipient">For My Favorite Person</span>
                                    <div className="env-seal-medallion">&#10084;</div>
                                    <span className="env-tap-cue">Tap Wax Seal to Open &amp; Read</span>
                                </div>
                            ) : (
                                <div className="env-opened-letter">
                                    <p>
                                        No long speech today. Thank you for bringing calm, laughter, and warmth into every ordinary week we share. Open the next tabs whenever you want me close.
                                    </p>
                                    <div className="env-letter-bottom">
                                        <span className="env-letter-sign">Always yours, K.</span>
                                        <button className="wishes-pager-btn" type="button" onClick={simActions.toggleValEnvelope}>
                                            Fold Letter
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                );
            }

            if (activeChapterIdx === 1) {
                const owMessages = {
                    miss: '“Close your eyes, press play below, and remember distance is temporary. Call me tonight.”',
                    stressed: '“Take one slow breath. Put everything down for 20 minutes after reading this. I’m proud of you.”',
                    smile: '“Still laughing at the evening we talked past midnight on the balcony until my phone died.”'
                };
                const isPlaying = vinylPlayingKey === 'valentines';
                return (
                    <>
                        <div>
                            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.57rem', color: 'var(--ink-faint)', marginBottom: 5 }}>
                                OPEN WHEN NOTES
                            </div>
                            <div className="open-when-strip">
                                <button
                                    className={`ow-btn ${activeOwKey === 'miss' ? 'active' : ''}`}
                                    type="button"
                                    onClick={() => simActions.setActiveOwKey('miss')}
                                >
                                    Miss Me
                                </button>
                                <button
                                    className={`ow-btn ${activeOwKey === 'stressed' ? 'active' : ''}`}
                                    type="button"
                                    onClick={() => simActions.setActiveOwKey('stressed')}
                                >
                                    Long Day
                                </button>
                                <button
                                    className={`ow-btn ${activeOwKey === 'smile' ? 'active' : ''}`}
                                    type="button"
                                    onClick={() => simActions.setActiveOwKey('smile')}
                                >
                                    Need a Smile
                                </button>
                            </div>
                        </div>
                        <div className="ow-reveal">{owMessages[activeOwKey]}</div>
                        <div className="vinyl-widget">
                            <div className={`vinyl-disc-wrap ${isPlaying ? 'active' : ''}`}>
                                <div className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`}>
                                    <div className="vinyl-label"><div className="vinyl-hole"></div></div>
                                </div>
                                <div className="tonearm"></div>
                            </div>
                            <div className="vinyl-info">
                                <strong>Late Night Song</strong>
                                <span>{isPlaying ? 'Playing acoustic chord...' : 'Tap Play for background music'}</span>
                            </div>
                            <button className="vinyl-play-btn" type="button" onClick={() => simActions.toggleVinyl('valentines')}>
                                {isPlaying ? 'Pause' : 'Play'}
                            </button>
                        </div>
                    </>
                );
            }

            const reasons = [
                'The quiet way you calm any crowded room just by walking into it.',
                'How you remember tiny details I casually mentioned weeks earlier.',
                'Every road trip feels shorter when your playlist is on.',
                'You always show up with warmth even on ordinary Tuesdays.'
            ];
            return (
                <>
                    <div className="reason-circle-btn" onClick={simActions.nextValReason}>
                        <small>REASON {valReasonIdx + 1} OF {reasons.length} &middot; TAP TO FLIP</small>
                        <p>“{reasons[valReasonIdx]}”</p>
                    </div>

                    <div className="pin-teaser-bar" style={{ marginTop: 2 }}>
                        <span>{dateVoucherRevealed ? 'Friday 7:30 PM · Dinner & Music' : 'Surprise Date Night Ticket'}</span>
                        <button className="mini-action-btn crimson" type="button" onClick={simActions.toggleDatePass}>
                            {dateVoucherRevealed ? 'Claimed ✓' : 'Reveal Ticket'}
                        </button>
                    </div>
                </>
            );
        }

        return null;
    };

    return (
        <div className="phone-shell">
            <div className="phone-screen">
                <div className="phone-topbar">
                    <span id="phoneUrl">{data.url}</span>
                    <span className="phone-pill" id="phoneBadge">{data.badge}</span>
                </div>
                <div className="phone-chapter-bar" id="phoneChapterBar" role="tablist" aria-label="Sample page chapters">
                    {data.chapters.map((label, i) => (
                        <button
                            key={label}
                            className={`ch-btn ${activeChapterIdx === i ? 'active' : ''}`}
                            type="button"
                            onClick={() => onSelectChapter(i)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="phone-content" id="phoneContent">
                    {renderChapterContent()}
                </div>
            </div>
        </div>
    );
}

export default function SampleDesk({
    occasionKey,
    onSelectOccasion,
    activeChapterIdx,
    onSelectChapter,
    simState,
    simActions,
    onOpenBooking,
    onOpenFullDemo,
    showToast
}) {
    const data = OCCASIONS[occasionKey] || OCCASIONS.birthdays;

    return (
        <section className="section-block reveal" id="occasions">
            <div className="section-kicker-bar">
                <span className="kicker-index">03</span>
                <span className="kicker-label">Try a Live Sample</span>
                <span className="kicker-rule"></span>
                <span className="kicker-meta">Interactive Phone Preview</span>
            </div>

            <div className="occasions-header">
                <div className="prose">
                    <h2>Tap Around Inside a Sample Page</h2>
                    <p>
                        Pick an occasion below and test the actual features inside the phone screen. Blow out birthday candles, spin the vinyl song player, flip Polaroid photos, or download a VIP event gate pass.
                    </p>
                </div>
                <span className="occasions-meta">4 Occasions &middot; 12 Interactive Screens</span>
            </div>

            <div className="tab-strip" role="tablist" aria-label="Celebration categories">
                {Object.entries(OCCASIONS).map(([key, item]) => (
                    <button
                        key={key}
                        className={`occ-tab ${occasionKey === key ? 'active' : ''}`}
                        role="tab"
                        aria-selected={occasionKey === key}
                        data-occ={key}
                        type="button"
                        onClick={() => onSelectOccasion(key)}
                    >
                        <span className="tab-num">{item.tabNum}</span> {item.tabLabel}
                    </button>
                ))}
            </div>

            <div className="occ-panel" role="tabpanel">
                <div className="occ-copy" id="occCopyWrap">
                    <span className="eyebrow" id="occEyebrow">{data.eyebrow}</span>
                    <h3 id="occTitle">{data.title}</h3>
                    <p id="occDesc">{data.desc}</p>

                    <details className="occ-details-drawer" open>
                        <summary>What's Included in a Full Build</summary>
                        <ul className="occ-bullets" id="occBullets">
                            {data.bullets.map((b, idx) => (
                                <li key={idx}>{b}</li>
                            ))}
                        </ul>
                    </details>

                    <div className="occ-teaser-disclaimer">
                        <strong>Quick Note:</strong> This is a small interactive preview. Your actual page is built from scratch with your own photos, songs, colors, and words.
                    </div>

                    <div className="occ-cta-row">
                        <button
                            className="btn btn-ink"
                            id="occOrderBtn"
                            type="button"
                            onClick={() => onOpenBooking('', data.occasionVal)}
                        >
                            {data.btnLabel}
                        </button>
                        <button className="btn btn-outline" type="button" onClick={onOpenFullDemo}>
                            Open Larger Preview
                        </button>
                    </div>
                </div>

                <div className="phone-stage" aria-label="Interactive sample preview">
                    <PhoneSimulatorScreen
                        occasionKey={occasionKey}
                        activeChapterIdx={activeChapterIdx}
                        onSelectChapter={onSelectChapter}
                        simState={simState}
                        simActions={simActions}
                        showToast={showToast}
                    />
                    <div className="phone-foot-bar">
                        <span>Interactive &middot; Tap inside the phone screen</span>
                        <button className="expand-link-btn" type="button" onClick={onOpenFullDemo}>
                            Expand Screen
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
