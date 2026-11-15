import React, { useState, useRef } from 'react';
import { CUPID_CONFIG } from '../data/studioData';
import { playChime } from '../utils/sound';

export default function CallingCard3D({ cardStock, onChangeStock, onOpenBooking, onOpenVCard, showToast }) {
    const [showingBack, setShowingBack] = useState(false);
    const stageRef = useRef(null);
    const tiltRef = useRef(null);

    const handlePointerMove = (e) => {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const stage = stageRef.current;
        const tilt = tiltRef.current;
        if (!stage || !tilt) return;

        const rect = stage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rx = ((0.5 - y) * 4.2).toFixed(2);
        const ry = ((x - 0.5) * 5.0).toFixed(2);
        tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;

        stage.querySelectorAll('.card-sheen').forEach(s => {
            s.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
            s.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        });
    };

    const handlePointerLeave = () => {
        if (tiltRef.current) {
            tiltRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }
    };

    const toggleCardFace = () => {
        setShowingBack(prev => !prev);
        playChime('flip');
    };

    const handleStockSwitch = (stock) => {
        onChangeStock(stock);
        playChime('flip');
    };

    const shareCard = async () => {
        const text = `Cupid Studio (${CUPID_CONFIG.handle}): personal websites for birthdays, anniversaries, events & Valentine's Day.`;
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Cupid Studio Card', text, url: window.location.href });
                return;
            } catch {
                // fallback to clipboard
            }
        }
        try {
            await navigator.clipboard.writeText(`${text} ${window.location.href}`);
            showToast('Link copied to clipboard.');
        } catch {
            showToast('Copy or share this link.');
        }
    };

    return (
        <div id="cardSection" aria-label="Cupid Business Card">
            {/* Dedicated Card Finish Switcher Bar right above the 3D Card (Visible on Mobile & Desktop!) */}
            <div className="card-finish-toolbar">
                <span className="card-finish-label">Card Color:</span>
                <div className="stock-toggle" role="group" aria-label="Business card color finish">
                    <button
                        className={`stock-opt ${cardStock === 'ivory' ? 'active' : ''}`}
                        type="button"
                        onClick={() => handleStockSwitch('ivory')}
                    >
                        Ivory Cotton
                    </button>
                    <button
                        className={`stock-opt ${cardStock === 'obsidian' ? 'active' : ''}`}
                        type="button"
                        onClick={() => handleStockSwitch('obsidian')}
                    >
                        Obsidian Foil
                    </button>
                </div>
            </div>

            <div
                className={`biz-card-stage ${cardStock === 'obsidian' ? 'stock-obsidian' : ''}`}
                id="cardStage"
                ref={stageRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
            >
                <div className="biz-card-tilt" id="cardTilt" ref={tiltRef}>
                    <div className={`biz-card-rotator ${showingBack ? 'is-flipped' : ''}`} id="cardRotator">

                        {/* FRONT FACE — No personal name on front; flips to back for ManLike Lanor */}
                        <article className="card-face card-face--front" id="cardFrontFace" aria-hidden={showingBack}>
                            <div className="card-sheen" aria-hidden="true"></div>
                            <span className="corner-mark cm-tl" aria-hidden="true"></span>
                            <span className="corner-mark cm-tr" aria-hidden="true"></span>
                            <span className="corner-mark cm-bl" aria-hidden="true"></span>
                            <span className="corner-mark cm-br" aria-hidden="true"></span>

                            <div className="biz-card-inner">
                                <div className="card-face-header">
                                    <div className="card-mark">
                                        <button
                                            className="monogram-stamp"
                                            type="button"
                                            onClick={() => playChime('stamp')}
                                            aria-label="Play Cupid chime"
                                        >
                                            <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
                                                <path
                                                    className="draw-path"
                                                    d="M14 23.2s-7.4-4.7-9.1-9.3c-1.2-3.4 1.1-6.9 4.5-6.9 2.2 0 3.7 1.3 4.6 3.1.9-1.8 2.4-3.1 4.6-3.1 3.4 0 5.7 3.5 4.5 6.9-1.7 4.6-9.1 9.3-9.1 9.3Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.6"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M5.5 21.5L22.5 5.5m0 0h-4m4 0v4"
                                                    stroke="#9A7638"
                                                    strokeWidth="1.3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                        <div className="studio-meta">
                                            <strong>CUPID STUDIO</strong>
                                            Personal Websites &amp; Invites
                                        </div>
                                    </div>

                                    <button className="flip-btn" type="button" onClick={toggleCardFace}>
                                        Contact &amp; QR &#8635;
                                    </button>
                                </div>

                                <div className="card-face-center">
                                    <h2 className="cupid-wordmark">Cupid<span>.</span></h2>
                                    <p className="card-lead">
                                        Custom websites made from scratch for the days people keep: <em>birthdays, anniversaries, events, and Valentine's</em>.
                                    </p>
                                </div>

                                <div className="card-face-footer">
                                    <div className="founder-line">
                                        Built from scratch · <span>{CUPID_CONFIG.handle}</span>
                                    </div>
                                    <div className="card-actions">
                                        <button className="btn btn-ink" type="button" onClick={() => onOpenBooking('')}>Start a Page</button>
                                        <button className="btn btn-outline" type="button" onClick={onOpenVCard}>Save Contact</button>
                                        <button className="btn btn-outline" type="button" onClick={shareCard}>Share</button>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* BACK FACE — Displays ManLike Lanor & Alfred Agbetor + both emails */}
                        <article className="card-face card-face--back" id="cardBackFace" aria-hidden={!showingBack}>
                            <div className="card-sheen" aria-hidden="true"></div>
                            <span className="corner-mark cm-tl" aria-hidden="true"></span>
                            <span className="corner-mark cm-tr" aria-hidden="true"></span>
                            <span className="corner-mark cm-bl" aria-hidden="true"></span>
                            <span className="corner-mark cm-br" aria-hidden="true"></span>

                            <div className="biz-card-inner">
                                <div className="card-face-header">
                                    <div className="card-mark">
                                        <button
                                            className="monogram-stamp"
                                            type="button"
                                            onClick={() => playChime('stamp')}
                                            aria-label="Play Cupid chime"
                                        >
                                            <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
                                                <path
                                                    d="M14 23.2s-7.4-4.7-9.1-9.3c-1.2-3.4 1.1-6.9 4.5-6.9 2.2 0 3.7 1.3 4.6 3.1.9-1.8 2.4-3.1 4.6-3.1 3.4 0 5.7 3.5 4.5 6.9-1.7 4.6-9.1 9.3-9.1 9.3Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.6"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M5.5 21.5L22.5 5.5m0 0h-4m4 0v4"
                                                    stroke="#9A7638"
                                                    strokeWidth="1.3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                        <div className="studio-meta">
                                            <strong>STUDIO CONTACT</strong>
                                            Direct Reach &amp; Socials
                                        </div>
                                    </div>
                                    <button className="flip-btn" type="button" onClick={toggleCardFace}>
                                        &larr; Front
                                    </button>
                                </div>

                                <div className="back-body">
                                    <div className="back-grid">
                                        <div className="back-item back-item--wide">
                                            <span>Founders &amp; Builders</span>
                                            <strong>{CUPID_CONFIG.founder}</strong>
                                        </div>
                                        <div className="back-item back-item--wide">
                                            <span>Direct Email</span>
                                            <a href={`mailto:${CUPID_CONFIG.email}`}>{CUPID_CONFIG.email}</a>
                                        </div>
                                        <div className="back-item">
                                            <span>Studio Handle</span>
                                            <strong>{CUPID_CONFIG.handle}</strong>
                                        </div>
                                        <div className="back-item">
                                            <span>Delivery</span>
                                            <strong>Link + QR Card</strong>
                                        </div>
                                        <div className="back-item">
                                            <span>Turnaround</span>
                                            <strong>2 to 5 Days</strong>
                                        </div>
                                        <div className="back-item">
                                            <span>Reach</span>
                                            <strong>Ghana · Worldwide</strong>
                                        </div>
                                    </div>

                                    <div className="qr-panel">
                                        <img
                                            src="/assets/email-qr.svg"
                                            alt="QR code to email hello.cupidstudio@gmail.com"
                                        />
                                        <div className="qr-caption">
                                            Scan to Email
                                            <strong>Direct Brief</strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-face-footer">
                                    <div className="founder-line">
                                        Built from scratch · <span>{CUPID_CONFIG.handle}</span>
                                    </div>
                                    <div className="card-actions">
                                        <button className="btn btn-ink" type="button" onClick={() => onOpenBooking('')}>Start a Page</button>
                                        <button className="btn btn-outline" type="button" onClick={onOpenVCard}>Save Contact</button>
                                        <button className="btn btn-outline" type="button" onClick={toggleCardFace}>Front Side</button>
                                    </div>
                                </div>
                            </div>
                        </article>

                    </div>
                </div>
            </div>
        </div>
    );
}
