import React from 'react';
import { CUPID_CONFIG } from '../data/studioData';

export default function StorySection() {
    return (
        <section className="section-block reveal" id="craft">
            <div className="section-kicker-bar">
                <span className="kicker-index">01</span>
                <span className="kicker-label">Why We Build These</span>
                <span className="kicker-rule"></span>
                <span className="kicker-meta">Ghana · Worldwide</span>
            </div>

            <div className="editorial-manifesto-grid">
                <div className="manifesto-lead-col">
                    <h2 className="manifesto-title">
                        Real Moments Deserve More Than a <em>Status That Disappears.</em>
                    </h2>
                    <div className="manifesto-signoff">
                        <strong>The Cupid Devs</strong>
                        <span>Founders, Designers &amp; Developers</span>
                        <small>{CUPID_CONFIG.handle}</small>
                    </div>
                </div>

                <div className="manifesto-body-col">
                    <p className="manifesto-para-lead">
                        Social media stories vanish in a day. A long birthday or anniversary text on WhatsApp gets buried under group chats by the next morning. The people you love deserve something they can actually keep.
                    </p>
                    <p>
                        <strong>Cupid Studio</strong> builds personal websites for the days that matter most. Every page is coded by hand around your story, with envelopes they tap to unseal, a vinyl record that plays your song, Polaroid photos that flip over, and a secret passcode screen at the door.
                    </p>
                    <p>
                        We do not use generic templates. Every page is made specifically for your person, hosted on a clean private link they can come back to whenever they want to smile.
                    </p>
                </div>
            </div>

            <div className="tenets-editorial-grid">
                <article className="tenet-card">
                    <div className="tenet-top">
                        <span className="tenet-roman">I</span>
                        <span className="tenet-tag">MADE FROM SCRATCH</span>
                    </div>
                    <h3>Built Around Your Story</h3>
                    <p>
                        No ready made templates. We design the colors, layout, music, and chapters around your actual photos, inside jokes, and voice notes.
                    </p>
                </article>

                <article className="tenet-card tenet-card--accent">
                    <div className="tenet-top">
                        <span className="tenet-roman">II</span>
                        <span className="tenet-tag">INTERACTIVE &amp; FUN</span>
                    </div>
                    <h3>Meant to Be Touched</h3>
                    <p>
                        They do not just scroll. They blow out birthday candles, break a wax seal on your letter, spin a vinyl record, and unlock secret riddles.
                    </p>
                </article>

                <article className="tenet-card">
                    <div className="tenet-top">
                        <span className="tenet-roman">III</span>
                        <span className="tenet-tag">YOURS TO KEEP</span>
                    </div>
                    <h3>Private &amp; Permanent</h3>
                    <p>
                        Hosted on its own clean link (like <code>cupid.studio/ama24</code>) with an optional passcode lock and a printable QR card for gift boxes.
                    </p>
                </article>
            </div>
        </section>
    );
}
