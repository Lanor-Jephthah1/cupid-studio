import React, { useState, useEffect, useRef } from 'react';
import CallingCard3D from './CallingCard3D';

const LINE_ONE = 'Some moments deserve ';
const LINE_TWO = 'their own little world.';
const TOTAL_CHARS = LINE_ONE.length + LINE_TWO.length;

export default function HeroSection({
    cardStock,
    onChangeStock,
    onOpenBooking,
    onOpenVCard,
    onOpenTagModal,
    onJumpToOccasion,
    showToast
}) {
    const [charCount, setCharCount] = useState(0);
    const headlineRef = useRef(null);
    const wasOutRef = useRef(false);

    useEffect(() => {
        if (charCount >= TOTAL_CHARS) return;
        const delay = charCount === 0 ? 150 : 38;
        const timer = setTimeout(() => {
            setCharCount(c => Math.min(TOTAL_CHARS, c + 1));
        }, delay);
        return () => clearTimeout(timer);
    }, [charCount]);

    // Replay typing animation smoothly whenever user scrolls away and back to the Hero headline
    useEffect(() => {
        const el = headlineRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') return;
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        wasOutRef.current = true;
                    } else if (wasOutRef.current) {
                        wasOutRef.current = false;
                        setCharCount(0);
                    }
                });
            },
            { threshold: 0.2 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const typedLineOne = LINE_ONE.slice(0, Math.min(charCount, LINE_ONE.length));
    const typedLineTwo = charCount > LINE_ONE.length
        ? LINE_TWO.slice(0, charCount - LINE_ONE.length)
        : '';
    const isTypingDone = charCount >= TOTAL_CHARS;

    return (
        <section className="hero-section" id="hero" aria-label="Cupid Studio Introduction">
            <div className="hero-grid">

                {/* Left Column: Warm, Human Introduction */}
                <div className="hero-editorial">
                    <h1 ref={headlineRef} className="hero-headline hero-headline--typing" aria-label="Some moments deserve their own little world.">
                        <span className="hero-typing-ghost" aria-hidden="true">
                            Some moments deserve <br />
                            <em>their own little world.</em>
                        </span>
                        <span className="hero-typing-live" aria-hidden="true">
                            {typedLineOne}
                            {charCount >= LINE_ONE.length && <br />}
                            <em>{typedLineTwo}</em>
                            <span className={`typing-caret ${isTypingDone ? 'is-done' : ''}`}>|</span>
                        </span>
                    </h1>
                    <p className="hero-lead">
                        We build private, personal websites for birthdays, anniversaries, proposals, and events, filled with your photos, favorite songs, voice notes, and secret passcodes.
                    </p>

                    <div className="hero-narrative-box">
                        <p>
                            A WhatsApp message gets buried by morning, and a one day status disappears the next morning. Built from scratch by <strong>#thecupiddevs</strong>, every Cupid page gives your favorite person a link they can open anytime, complete with wax sealed letters, spinning vinyl music, photo Polaroids, and wishes from friends.
                        </p>

                        <div className="hero-occasion-pills" aria-label="Occasion quick links">
                            <button type="button" className="hero-occ-pill" onClick={() => onJumpToOccasion('birthdays')}>Birthdays</button>
                            <button type="button" className="hero-occ-pill" onClick={() => onJumpToOccasion('anniversaries')}>Anniversaries &amp; Proposals</button>
                            <button type="button" className="hero-occ-pill" onClick={() => onJumpToOccasion('functions')}>Events &amp; Weddings</button>
                            <button type="button" className="hero-occ-pill" onClick={() => onJumpToOccasion('valentines')}>Valentine's &amp; Letters</button>
                        </div>

                        <div className="hero-meta-strip">
                            <div className="hero-meta-item">
                                <span className="meta-label">How It's Shared</span>
                                <strong>Private Link &amp; QR Card</strong>
                            </div>
                            <div className="hero-meta-item">
                                <span className="meta-label">Build Time</span>
                                <strong>2 to 5 Days</strong>
                            </div>
                            <div className="hero-meta-item">
                                <span className="meta-label">Starting Price</span>
                                <strong>GH₵250 · $25</strong>
                            </div>
                        </div>
                    </div>

                    <div className="hero-actions-row">
                        <button className="btn btn-ink" type="button" onClick={() => onOpenBooking('')}>Start Your Page</button>
                        <a href="#occasions" className="btn btn-outline">Try a Live Sample &darr;</a>
                        <button className="btn btn-outline" type="button" onClick={onOpenVCard}>Save Contact</button>
                    </div>
                </div>

                {/* Right Column: Gift Box Bridge & Interactive 3D Calling Card */}
                <div className="hero-atelier">
                    <div className="atelier-tableau">
                        <div className="atelier-slate-bar">
                            <span>FROM GIFT BOX TO PHONE SCREEN</span>
                            <strong>LINK OR PRINTED QR CARD</strong>
                        </div>

                        <div className="atelier-bridge-card">
                            <div className="atelier-thumb-wrap">
                                <img
                                    src="/assets/unboxing-flatlay.jpg"
                                    alt="Gift box with ribbon, flowers, and printed QR card"
                                    className="atelier-thumb"
                                />
                            </div>
                            <div className="atelier-bridge-text">
                                <span>HOW THEY OPEN IT</span>
                                <strong>Send the Link or Tuck a QR Card in a Gift</strong>
                                <p>Share their private link on WhatsApp at midnight, or print our matching QR tag to drop inside a flower bouquet or gift box.</p>
                                <button type="button" className="bridge-link-btn" onClick={onOpenTagModal}>
                                    See Printable QR Gift Tag &rarr;
                                </button>
                            </div>
                        </div>

                        <CallingCard3D
                            cardStock={cardStock}
                            onChangeStock={onChangeStock}
                            onOpenBooking={onOpenBooking}
                            onOpenVCard={onOpenVCard}
                            showToast={showToast}
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
