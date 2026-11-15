import React, { useState, useEffect, useRef } from 'react';
import { UNBOXING_BEATS } from '../data/studioData';
import { playChime } from '../utils/sound';

const UB_DURATION_MS = 12000;
const UB_BEAT_TIMES = [0, 3100, 6100, 9300];

function beatIndexForMs(ms) {
    if (ms < 3000) return 0;
    if (ms < 6000) return 1;
    if (ms < 9200) return 2;
    return 3;
}

export default function DeliveryAndArchive({ onOpenTagModal }) {
    const [elapsedMs, setElapsedMs] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const stageRef = useRef(null);
    const rafRef = useRef(null);
    const lastTickRef = useRef(0);
    const lastBeatRef = useRef(0);

    const activeBeat = beatIndexForMs(elapsedMs);
    const finished = elapsedMs >= UB_DURATION_MS;

    const triggerBeatSound = (beatIdx, force = false) => {
        if (!audioEnabled && !force) return;
        if (beatIdx === 0) playChime('flip');
        else if (beatIdx === 1) playChime('stamp');
        else if (beatIdx === 2) playChime('valentine');
        else playChime('stamp');
    };

    // Auto-play the 12s delivery preview smoothly when scrolled into view
    useEffect(() => {
        const el = stageRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') return;
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasInteracted) {
                        setPlaying(true);
                    } else if (!entry.isIntersecting && !hasInteracted) {
                        setPlaying(false);
                    }
                });
            },
            { threshold: 0.35 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [hasInteracted]);

    useEffect(() => {
        if (!playing) {
            cancelAnimationFrame(rafRef.current);
            return;
        }
        lastTickRef.current = performance.now();

        const step = (now) => {
            const dt = Math.min(100, now - lastTickRef.current);
            lastTickRef.current = now;
            setElapsedMs((prev) => {
                const next = prev + dt;
                const b = beatIndexForMs(next);
                if (b !== lastBeatRef.current) {
                    lastBeatRef.current = b;
                    triggerBeatSound(b);
                }
                if (next >= UB_DURATION_MS) {
                    // Loop seamlessly back to 0 so the preview stays alive and responsive
                    lastBeatRef.current = 0;
                    return 0;
                }
                return next;
            });
            rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
    }, [playing, audioEnabled]);

    const togglePlay = () => {
        setHasInteracted(true);
        if (playing) {
            setPlaying(false);
            return;
        }
        if (elapsedMs >= UB_DURATION_MS) {
            setElapsedMs(0);
            lastBeatRef.current = 0;
        }
        setPlaying(true);
        triggerBeatSound(beatIndexForMs(elapsedMs >= UB_DURATION_MS ? 0 : elapsedMs));
    };

    const seekBeat = (beatIdx) => {
        setHasInteracted(true);
        const target = UB_BEAT_TIMES[beatIdx] || 0;
        setElapsedMs(target);
        lastBeatRef.current = beatIdx;
        if (audioEnabled) triggerBeatSound(beatIdx, true);
    };

    const handleScrub = (e) => {
        setHasInteracted(true);
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const ms = Math.round(ratio * UB_DURATION_MS);
        setElapsedMs(ms);
        lastBeatRef.current = beatIndexForMs(ms);
    };

    const toggleAudio = () => {
        const next = !audioEnabled;
        setAudioEnabled(next);
        if (next) triggerBeatSound(activeBeat, true);
    };

    const pct = (elapsedMs / UB_DURATION_MS) * 100;
    const hideOverlay = playing || hasInteracted || elapsedMs > 0;

    return (
        <section className="section-block reveal" id="showcase">
            <div className="section-kicker-bar">
                <span className="kicker-index">04</span>
                <span className="kicker-label">How Your Gift Arrives</span>
                <span className="kicker-rule"></span>
                <span className="kicker-meta">12s Delivery Preview · Link &amp; QR Tag</span>
            </div>

            <div className="showcase-head">
                <div className="prose">
                    <h2>From a Gift Box to Their Phone Screen.</h2>
                </div>
                <p className="showcase-lead">
                    Watch the 12 second preview of how someone opens their gift, from scanning the printed QR tag to unlocking their private page.
                </p>
            </div>

            {/* Horizontal 2-Column Delivery Film Stage */}
            <div className="delivery-editorial-stage">
                <div className="unboxing-card">
                    <div className="unboxing-stage" id="unboxingStage" ref={stageRef} data-beat={activeBeat}>
                        <div className="ub-beat-head">
                            <span>CUPID DELIVERY PREVIEW</span>
                            <span id="unboxingSlateLabel">{UNBOXING_BEATS[activeBeat].slate}</span>
                        </div>

                        {/* Beat 01: Physical Gift Box & Printed QR Tag */}
                        <div className={`ub-scene ub-scene--1 ${activeBeat === 0 ? 'is-active' : ''}`}>
                            <img
                                className="ub-photo"
                                src="/assets/unboxing-flatlay.jpg"
                                alt="Gift box with ribbon, flowers, and printed QR card"
                            />
                            <div className="ub-focus-ring" aria-hidden="true">
                                <span className="ub-focus-corner c-tl"></span>
                                <span className="ub-focus-corner c-tr"></span>
                                <span className="ub-focus-corner c-bl"></span>
                                <span className="ub-focus-corner c-br"></span>
                            </div>
                            <div className="ub-beat-caption">
                                <span>{UNBOXING_BEATS[0].timeRange}</span>
                                <p>{UNBOXING_BEATS[0].caption}</p>
                            </div>
                        </div>

                        {/* Beat 02: QR Code Scan & Secret Passcode Gate */}
                        <div className={`ub-scene ub-scene--2 ub-scene--scan ${activeBeat === 1 ? 'is-active' : ''}`}>
                            <img
                                className="ub-photo ub-photo--blur"
                                src="/assets/unboxing-flatlay.jpg"
                                alt=""
                                aria-hidden="true"
                            />
                            <div className="ub-scan-stage">
                                <div className="ub-scan-tag">
                                    <div className="ub-tag-hole" aria-hidden="true"></div>
                                    <div className="ub-scan-qr">
                                        <svg viewBox="0 0 39 39" shapeRendering="crispEdges" aria-label="QR Code Scan">
                                            <rect width="39" height="39" fill="#FFFCF7" />
                                            <path
                                                fill="none"
                                                stroke="#1B1715"
                                                strokeWidth="1"
                                                d="M1 1.5h7m1 0h2m1 0h1m3 0h1m1 0h1m1 0h2m1 0h2m1 0h1m2 0h1m1 0h7M1 2.5h1m5 0h1m1 0h2m6 0h4m2 0h4m4 0h1m5 0h1M1 3.5h1m1 0h3m1 0h1m1 0h2m5 0h2m2 0h1m1 0h1m1 0h1m1 0h2m1 0h1m1 0h1m1 0h3m1 0h1M1 4.5h1m1 0h3m1 0h1m3 0h5m2 0h1m3 0h1m1 0h3m2 0h1m1 0h1m1 0h3m1 0h1M1 5.5h1m1 0h3m1 0h1m1 0h1m2 0h1m2 0h2m3 0h1m1 0h1m6 0h1m1 0h1m1 0h3m1 0h1M1 6.5h1m5 0h1m3 0h1m2 0h2m5 0h1m1 0h2m4 0h1m1 0h1m5 0h1M1 7.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M14 8.5h2m2 0h2m3 0h2m1 0h3M1 9.5h1m2 0h7m1 0h1m2 0h2m5 0h2m1 0h3m2 0h1m2 0h1m1 0h3M3 10.5h1m1 0h2m1 0h1m5 0h2m1 0h1m1 0h1m5 0h1m1 0h3m2 0h2M1 11.5h1m1 0h1m2 0h2m3 0h1m1 0h1m2 0h3m1 0h3m1 0h1m2 0h6m4 0h1M6 12.5h1m2 0h4m4 0h2m1 0h2m2 0h2m6 0h4m1 0h1M1 13.5h3m3 0h2m4 0h5m7 0h1m2 0h2m1 0h2m1 0h1m1 0h2M2 14.5h2m1 0h1m6 0h3m2 0h1m1 0h1m1 0h2m1 0h1m2 0h3m3 0h1m1 0h1M1 15.5h1m1 0h1m2 0h2m1 0h2m5 0h1m2 0h3m3 0h2m1 0h3m4 0h3M1 16.5h1m3 0h2m1 0h4m1 0h3m6 0h2m1 0h1m2 0h3m1 0h1m1 0h2m1 0h1M1 17.5h1m1 0h3m1 0h1m1 0h1m2 0h1m2 0h1m2 0h3m1 0h3m1 0h1m1 0h1m2 0h1m2 0h4M4 18.5h1m3 0h1m1 0h3m1 0h1m3 0h1m3 0h2m2 0h1m1 0h3m1 0h1m1 0h3M1 19.5h1m1 0h1m3 0h2m1 0h2m1 0h3m1 0h1m1 0h2m1 0h7m3 0h1m1 0h2m1 0h1M1 20.5h3m2 0h1m5 0h1m1 0h1m1 0h2m1 0h3m1 0h7m1 0h3m2 0h2M3 21.5h1m2 0h2m3 0h3m1 0h1m2 0h1m1 0h1m4 0h1m1 0h2m1 0h5m1 0h1M3 22.5h2m1 0h1m1 0h3m3 0h7m2 0h1m2 0h1m1 0h1m3 0h3m1 0h1M1 23.5h1m4 0h2m1 0h1m1 0h2m1 0h3m5 0h1m1 0h3m1 0h3m3 0h1m2 0h1M1 24.5h1m2 0h1m1 0h1m1 0h3m1 0h2m1 0h1m3 0h3m2 0h2m2 0h1m4 0h3m1 0h1M1 25.5h1m1 0h2m1 0h4m5 0h2m1 0h1m2 0h3m5 0h1m1 0h3m3 0h1M1 26.5h2m2 0h1m2 0h1m2 0h1m1 0h1m4 0h3m1 0h3m1 0h1m1 0h2m3 0h2M1 27.5h3m2 0h4m1 0h2m1 0h3m1 0h2m2 0h1m3 0h4m1 0h2m2 0h3M1 28.5h1m1 0h3m2 0h2m1 0h1m1 0h1m1 0h1m1 0h1m1 0h2m2 0h1m1 0h1m1 0h2m1 0h2m1 0h1m1 0h1M1 29.5h1m1 0h2m2 0h1m1 0h1m2 0h6m2 0h2m3 0h2m2 0h5m1 0h3M9 30.5h2m1 0h5m1 0h6m5 0h1m3 0h3M1 31.5h7m1 0h3m1 0h1m1 0h2m1 0h3m3 0h1m1 0h2m1 0h1m1 0h1m1 0h3m1 0h1M1 32.5h1m5 0h1m1 0h2m1 0h1m2 0h2m4 0h2m2 0h2m1 0h2m3 0h2m1 0h1M1 33.5h1m1 0h3m1 0h1m1 0h1m1 0h1m3 0h3m1 0h4m2 0h1m1 0h8m2 0h1M1 34.5h1m1 0h3m1 0h1m1 0h5m1 0h1m5 0h4m1 0h1m3 0h3m2 0h1m1 0h1M1 35.5h1m1 0h3m1 0h1m2 0h2m1 0h3m2 0h1m4 0h2m2 0h1m1 0h2m2 0h3m1 0h1M1 36.5h1m5 0h1m5 0h2m1 0h1m1 0h1m4 0h2m5 0h1m1 0h2m1 0h3M1 37.5h7m1 0h3m2 0h1m2 0h1m2 0h2m2 0h2m3 0h1m1 0h1m5 0h1"
                                            />
                                        </svg>
                                        <span className="ub-scan-beam" aria-hidden="true"></span>
                                    </div>
                                    <span className="ub-tag-label">SCAN TO OPEN GIFT</span>
                                </div>

                                <div className="ub-gate-chip">
                                    <span className="ub-chip-kicker">PRIVATE LINK GATE</span>
                                    <strong>cupid.studio/ama24</strong>
                                    <div className="ub-pin-dots" aria-hidden="true">
                                        <span>0</span><span>5</span><span>1</span><span>1</span>
                                    </div>
                                    <span className="ub-chip-status">Passcode Verified &middot; Opening Page</span>
                                </div>
                            </div>
                            <div className="ub-beat-caption">
                                <span>{UNBOXING_BEATS[1].timeRange}</span>
                                <p>{UNBOXING_BEATS[1].caption}</p>
                            </div>
                        </div>

                        {/* Beat 03: Spinning Vinyl Record & Polaroid Stack */}
                        <div className={`ub-scene ub-scene--3 ${activeBeat === 2 ? 'is-active' : ''}`}>
                            <div className="ub-noc-frame">
                                <div className="ub-vinyl-card">
                                    <div className="ub-disc" aria-hidden="true">
                                        <div className="ub-disc-core"></div>
                                    </div>
                                    <div className="ub-vinyl-meta">
                                        <span>NOW PLAYING</span>
                                        <strong>&ldquo;Golden Hour&rdquo; &middot; Acoustic</strong>
                                        <div className="ub-eq-bars" aria-hidden="true">
                                            <i></i><i></i><i></i><i></i>
                                        </div>
                                    </div>
                                </div>

                                <div className="ub-pol-stack">
                                    <figure className="ub-pol ub-pol--a">
                                        <img src="/assets/nocturne-couple.jpg" alt="Couple portrait in warm evening light" />
                                        <figcaption>01 &middot; Aburi Gardens</figcaption>
                                    </figure>
                                    <figure className="ub-pol ub-pol--b">
                                        <img src="/assets/candle-dinner.jpg" alt="Candlelit dinner table" />
                                        <figcaption>02 &middot; Midnight Toast</figcaption>
                                    </figure>
                                </div>
                            </div>
                            <div className="ub-beat-caption">
                                <span>{UNBOXING_BEATS[2].timeRange}</span>
                                <p>{UNBOXING_BEATS[2].caption}</p>
                            </div>
                        </div>

                        {/* Beat 04: Wax-Sealed Personal Letter */}
                        <div className={`ub-scene ub-scene--4 ${activeBeat === 3 ? 'is-active' : ''}`}>
                            <div className="ub-letter-card">
                                <div className="ub-wax-badge" aria-hidden="true">&#10084;</div>
                                <span className="ub-letter-kicker">FINAL CHAPTER &middot; PERSONAL LETTER</span>
                                <p className="ub-letter-quote">
                                    &ldquo;Long after the flowers fade and the candles are blown out, this link stays yours to open whenever you want to look back.&rdquo;
                                </p>
                                <span className="ub-letter-sign">Built with care by Cupid Studio</span>
                            </div>
                            <div className="ub-beat-caption">
                                <span>{UNBOXING_BEATS[3].timeRange}</span>
                                <p>{UNBOXING_BEATS[3].caption}</p>
                            </div>
                        </div>

                        <button
                            className={`ub-play-overlay ${hideOverlay ? 'is-hidden' : ''}`}
                            id="ubPlayOverlay"
                            type="button"
                            onClick={togglePlay}
                            aria-label="Play 12 second delivery preview"
                        >
                            <span className="ub-play-circle">&#9654;</span>
                            <span className="ub-play-txt">{finished ? 'Replay 12s Preview' : 'Watch 12s Preview'}</span>
                        </button>
                    </div>
                </div>

                <div className="delivery-console-panel">
                    <div className="console-top">
                        <span className="console-kicker">HOW THE SURPRISE PLAYS OUT &middot; 12.0S</span>
                        <h3>How They Experience Your Gift</h3>
                        <p>
                            Whether you text the link at midnight or hide our printed QR card inside a gift box, the reveal unfolds step by step on their phone.
                        </p>
                    </div>

                    <div className="console-controls-box">
                        <div
                            className="ub-scrubber"
                            id="ubScrubber"
                            onClick={handleScrub}
                            role="progressbar"
                            aria-label="Delivery reel timeline"
                            aria-valuemin="0"
                            aria-valuemax="12"
                            aria-valuenow={(elapsedMs / 1000).toFixed(1)}
                        >
                            <div className="ub-scrubber-fill" id="ubScrubberFill" style={{ width: `${pct.toFixed(2)}%` }}></div>
                        </div>

                        <div className="console-btn-row">
                            <button className="btn btn-ink ub-btn-sm" id="ubPlayBtn" type="button" onClick={togglePlay}>
                                {playing ? 'Pause Preview' : 'Play 12s Preview'}
                            </button>
                            <button className="btn btn-outline ub-btn-sm" id="ubMuteBtn" type="button" onClick={toggleAudio}>
                                {audioEnabled ? 'Sound: On' : 'Sound: Off'}
                            </button>
                            <span className="ub-timecode" id="ubTimecode">
                                {(elapsedMs / 1000).toFixed(1).padStart(4, '0')}s / 12.0s
                            </span>
                        </div>

                        <div className="ub-beat-strip" role="tablist" aria-label="Jump to delivery step">
                            {UNBOXING_BEATS.map(b => (
                                <button
                                    key={b.idx}
                                    className={`ub-beat-btn ${activeBeat === b.idx ? 'active' : ''}`}
                                    type="button"
                                    onClick={() => seekBeat(b.idx)}
                                >
                                    {b.btnLabel}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="console-handoff-box">
                        <strong>Send by Link or Physical QR Gift Tag</strong>
                        <p>
                            Every page comes with its own clean link (like <code>cupid.studio/ama24</code>) ready for WhatsApp, plus an optional printable QR card for gift boxes and flower bouquets.
                        </p>
                        <button type="button" className="btn btn-outline ub-btn-sm" onClick={onOpenTagModal}>
                            Preview Printable QR Tag
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
