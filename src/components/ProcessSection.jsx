import React from 'react';
import { CUPID_CONFIG } from '../data/studioData';

export default function ProcessSection({ onOpenBooking, onOpenVCard, onOpenPolicy }) {
    const waUrl = `https://wa.me/${CUPID_CONFIG.whatsappNumber}?text=${encodeURIComponent(
        'Hi Cupid Studio (#thecupiddevs), I would like to ask about a custom page.'
    )}`;

    return (
        <>
            <section className="section-block reveal" id="process">
                <div className="section-kicker-bar">
                    <span className="kicker-index">06</span>
                    <span className="kicker-label">How Ordering Works</span>
                    <span className="kicker-rule"></span>
                    <span className="kicker-meta">Three Easy Steps</span>
                </div>

                <div className="process-header-grid">
                    <div>
                        <h2 className="process-title">From Your Idea to a Finished Link in 2 to 5 Days</h2>
                        <p className="process-subtitle">Simple, collaborative, and easy from start to finish.</p>
                    </div>
                    <div className="process-cta-top">
                        <button className="btn btn-ink" type="button" onClick={() => onOpenBooking('')}>
                            Start Your Page &rarr;
                        </button>
                    </div>
                </div>

                <div className="process-editorial-grid">
                    <article className="process-step-card">
                        <div className="proc-step-num">01</div>
                        <span className="proc-step-tag">STEP ONE</span>
                        <h3 className="proc-step-title">Tell Us What You Want</h3>
                        <p className="proc-step-desc">
                            Fill out our quick form with their name, the date, your favorite photos, song choice, and any personal notes. We will reply on WhatsApp or email to confirm your plan.
                        </p>
                        <div className="proc-step-meta">Same Day Reply · 50% Deposit to Start</div>
                    </article>

                    <article className="process-step-card">
                        <div className="proc-step-num">02</div>
                        <span className="proc-step-tag">STEP TWO</span>
                        <h3 className="proc-step-title">Preview &amp; Tweak Together</h3>
                        <p className="proc-step-desc">
                            We send you a private preview link so you can test the passcode, music, photos, and wording on your phone. Want to swap a photo or edit a sentence? We adjust it right away.
                        </p>
                        <div className="proc-step-meta">Private Test Link · 2 to 3 Days Build</div>
                    </article>

                    <article className="process-step-card proc-step-card--final">
                        <div className="proc-step-num">03</div>
                        <span className="proc-step-tag">STEP THREE</span>
                        <h3 className="proc-step-title">Ready to Share or Print</h3>
                        <p className="proc-step-desc">
                            Your finished page goes live on its own clean link (like <code>cupid.studio/ama24</code>). Send it directly on WhatsApp or print the matching QR gift card for their gift box.
                        </p>
                        <div className="proc-step-meta">Private Link · Printable QR Card Ready</div>
                    </article>
                </div>

                {/* Final Call-to-Action Banner */}
                <div className="final-cta-banner">
                    <div className="final-cta-copy">
                        <span className="final-cta-kicker">CUPID STUDIO &middot; {CUPID_CONFIG.handle.toUpperCase()}</span>
                        <h3>Ready to build something special for someone you love?</h3>
                        <p>
                            Tell us who you&apos;re celebrating and when. We&apos;ll put together your plan and open a direct chat on WhatsApp or email.
                        </p>
                    </div>
                    <div className="final-cta-actions">
                        <button className="btn btn-ink" type="button" onClick={() => onOpenBooking('')}>
                            Start Your Page
                        </button>
                        <button className="btn btn-outline" type="button" onClick={onOpenVCard}>
                            Save Studio Contact
                        </button>
                    </div>
                </div>
            </section>

            {/* Standard Footer with Legal Policies, External Contact Links & Studio Colophon */}
            <footer className="colophon" aria-label="Studio footer and policies">
                <div className="colophon-top">
                    <div className="colophon-brand">
                        <strong>CUPID STUDIO · {CUPID_CONFIG.handle.toUpperCase()}</strong>
                        <span>Custom Digital Keepsakes &amp; Event Invitations · Ghana &amp; Worldwide</span>
                    </div>

                    <nav className="colophon-links" aria-label="Legal policies and external links">
                        <button type="button" className="colophon-link-btn" onClick={() => onOpenPolicy('privacy')}>
                            Privacy Policy
                        </button>
                        <span className="colophon-dot" aria-hidden="true">&middot;</span>
                        <button type="button" className="colophon-link-btn" onClick={() => onOpenPolicy('terms')}>
                            Terms of Service
                        </button>
                        <span className="colophon-dot" aria-hidden="true">&middot;</span>
                        <button type="button" className="colophon-link-btn" onClick={() => onOpenPolicy('refunds')}>
                            Revisions &amp; Refunds
                        </button>
                        <span className="colophon-dot" aria-hidden="true">&middot;</span>
                        <button type="button" className="colophon-link-btn" onClick={() => onOpenPolicy('faq')}>
                            FAQ
                        </button>
                        <span className="colophon-dot" aria-hidden="true">&middot;</span>
                        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="colophon-ext-link">
                            WhatsApp Direct &#8599;
                        </a>
                        <span className="colophon-dot" aria-hidden="true">&middot;</span>
                        <a href="/cupid.vcf" download="CupidStudio-TheCupidDevs.vcf" className="colophon-ext-link">
                            vCard (.vcf) &#8595;
                        </a>
                    </nav>
                </div>

                <div className="colophon-bottom">
                    <span>&copy; {new Date().getFullYear()} CUPID STUDIO · BUILT BY {CUPID_CONFIG.handle.toUpperCase()}</span>
                    <span className="colophon-emails">
                        <a href={`mailto:${CUPID_CONFIG.email}`}>{CUPID_CONFIG.email.toUpperCase()}</a>
                    </span>
                </div>
            </footer>
        </>
    );
}
