import React from 'react';

export default function WhatWeMake({ onJumpToOccasion, onOpenBooking }) {
    return (
        <section className="section-block reveal" id="repertoire">
            <div className="section-kicker-bar">
                <span className="kicker-index">02</span>
                <span className="kicker-label">What We Make</span>
                <span className="kicker-rule"></span>
                <span className="kicker-meta">Three Ways to Celebrate</span>
            </div>

            <div className="repertoire-header-grid">
                <div>
                    <h2 className="repertoire-main-title">Three Types of Personal Pages</h2>
                </div>
                <p className="repertoire-main-sub">
                    Whether you want a full story with photos and music, a simple heartfelt letter, or a clean event invitation with VIP guest passes, we build the exact format your occasion needs.
                </p>
            </div>

            <div className="repertoire-grid">
                {/* Format 01: Flagship Keepsake Story */}
                <article className="repertoire-card repertoire-card--flagship">
                    <div className="rep-card-head">
                        <span className="rep-badge rep-badge--crimson">MOST POPULAR · FULL EXPERIENCE</span>
                        <span className="rep-num">01 / STORY</span>
                    </div>
                    <h3 className="rep-title">The Keepsake Story</h3>
                    <p className="rep-subtitle">A personal story website celebrating a birthday, anniversary, or relationship.</p>
                    <p className="rep-desc">
                        Our signature build starts with a secret question or PIN screen, then opens into flipping Polaroid photos, a timeline of your best memories, a wall of wishes from friends, and your favorite song spinning on vinyl.
                    </p>
                    <div className="rep-chips">
                        <span className="rep-chip">Secret PIN Gate</span>
                        <span className="rep-chip">3D Flip Polaroids</span>
                        <span className="rep-chip">Vinyl Music Player</span>
                        <span className="rep-chip">Memory Timeline</span>
                        <span className="rep-chip">Friends Wishes Wall</span>
                    </div>
                    <div className="rep-card-foot">
                        <span className="rep-price-hint"><strong>GH₵550</strong> · $50</span>
                        <div className="rep-actions">
                            <button type="button" className="btn btn-ink rep-btn" onClick={() => onJumpToOccasion('anniversaries')}>Try Sample &rarr;</button>
                            <button type="button" className="btn btn-outline rep-btn" onClick={() => onOpenBooking('Full Keepsake Story')}>Book This</button>
                        </div>
                    </div>
                </article>

                {/* Format 02: The Sealed Letter */}
                <article className="repertoire-card">
                    <div className="rep-card-head">
                        <span className="rep-badge">SIMPLE &amp; SWEET</span>
                        <span className="rep-num">02 / LETTER</span>
                    </div>
                    <h3 className="rep-title">The Sealed Letter</h3>
                    <p className="rep-subtitle">A personal letter inside an interactive wax sealed envelope.</p>
                    <p className="rep-desc">
                        Made for when your words are the main gift. They tap the wax seal to break it open and read your letter with smooth typewriter pacing and a soft background song.
                    </p>
                    <div className="rep-chips">
                        <span className="rep-chip">Interactive Wax Seal</span>
                        <span className="rep-chip">Typewriter Reveal</span>
                        <span className="rep-chip">Background Song</span>
                        <span className="rep-chip">Hidden Postscript</span>
                    </div>
                    <div className="rep-card-foot">
                        <span className="rep-price-hint"><strong>GH₵250</strong> · $25</span>
                        <div className="rep-actions">
                            <button type="button" className="btn btn-outline rep-btn" onClick={() => onJumpToOccasion('valentines')}>Try Sample &rarr;</button>
                            <button type="button" className="btn btn-ink rep-btn" onClick={() => onOpenBooking('Simple Note Page')}>Book This</button>
                        </div>
                    </div>
                </article>

                {/* Format 03: The Event & Function Invite */}
                <article className="repertoire-card">
                    <div className="rep-card-head">
                        <span className="rep-badge">EVENTS &amp; CELEBRATIONS</span>
                        <span className="rep-num">03 / INVITE</span>
                    </div>
                    <h3 className="rep-title">The Event Invite</h3>
                    <p className="rep-subtitle">Digital invitation and RSVP portal for weddings, dinners, and parties.</p>
                    <p className="rep-desc">
                        Replaces plain flyer images with an interactive guest page featuring a live countdown, dress code color swatches, ceremony schedule, Google Maps pin, and instant VIP gate passes.
                    </p>
                    <div className="rep-chips">
                        <span className="rep-chip">Live Countdown</span>
                        <span className="rep-chip">Add to Calendar (.ics)</span>
                        <span className="rep-chip">Dress Code Swatches</span>
                        <span className="rep-chip">VIP QR Gate Pass</span>
                    </div>
                    <div className="rep-card-foot">
                        <span className="rep-price-hint"><strong>GH₵950</strong> · $90</span>
                        <div className="rep-actions">
                            <button type="button" className="btn btn-outline rep-btn" onClick={() => onJumpToOccasion('functions')}>Try Sample &rarr;</button>
                            <button type="button" className="btn btn-ink rep-btn" onClick={() => onOpenBooking('Function or Deluxe Page')}>Book This</button>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
}
