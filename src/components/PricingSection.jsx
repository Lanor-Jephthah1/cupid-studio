import React from 'react';
import { CUPID_CONFIG, EXTRAS_LIST, TIER_INCLUDED_EXTRAS } from '../data/studioData';

export default function PricingSection({
    currency,
    onChangeCurrency,
    selectedTier,
    onSelectTier,
    selectedExtras,
    onToggleExtra,
    estimateDesc,
    estimateTotal,
    onOpenBooking,
    onOpenTagModal
}) {
    const symbol = currency === 'USD' ? '$' : '₵';
    const currencyLabel = currency === 'USD' ? 'US Dollars' : 'GH Cedis';
    const prices = CUPID_CONFIG.prices[currency];
    const includedInCurrentTier = TIER_INCLUDED_EXTRAS[selectedTier] || [];

    return (
        <section className="section-block reveal" id="rates">
            <div className="section-kicker-bar">
                <span className="kicker-index">05</span>
                <span className="kicker-label">Pricing &amp; Cost Estimator</span>
                <span className="kicker-rule"></span>
                <div className="curr-switch" role="group" aria-label="Switch currency">
                    <button
                        className={`curr-opt ${currency === 'GHS' ? 'active' : ''}`}
                        type="button"
                        onClick={() => onChangeCurrency('GHS')}
                    >
                        GHS (₵)
                    </button>
                    <button
                        className={`curr-opt ${currency === 'USD' ? 'active' : ''}`}
                        type="button"
                        onClick={() => onChangeCurrency('USD')}
                    >
                        USD ($)
                    </button>
                </div>
            </div>

            <div className="pricing-intro-grid">
                <div>
                    <h2 className="pricing-section-title">Simple, Clear Packages</h2>
                </div>
                <p className="pricing-section-sub">
                    Every page is written and coded from scratch. Start with a simple sealed letter (<strong>GH₵250</strong>), step up <strong>+GH₵300</strong> to our full keepsake story (<strong>GH₵550</strong>), or book a complete event &amp; RSVP portal (<strong>GH₵950</strong>).
                </p>
            </div>

            {/* Horizontal 3-Column Package Layout */}
            <div className="pricing-columns">

                {/* Package 01: Simple Note Page */}
                <article
                    className={`pricing-col ${selectedTier === 'Simple Note Page' ? 'selected-tier' : ''}`}
                    data-tier="Simple Note Page"
                    onClick={() => onSelectTier('Simple Note Page')}
                >
                    <div className="pricing-col-top">
                        <span className="pricing-tier-label">01 · Sweet &amp; Simple</span>
                        <h3 className="pricing-name">Simple Note Page</h3>
                        <p className="pricing-positioning">
                            A single page personal letter inside an interactive wax sealed envelope with music.
                        </p>
                    </div>

                    <div className="pricing-price-block">
                        <span className="rate-price pricing-figure">{symbol}{prices['Simple Note Page']}</span>
                        <span className="pricing-currency-label">{currencyLabel}</span>
                    </div>

                    <div className="pricing-diff-note">
                        Starter package &middot; Focused single page letter reveal
                    </div>

                    <div className="pricing-features">
                        <ul className="pricing-feature-list">
                            <li>Single personal webpage</li>
                            <li>Interactive wax seal envelope</li>
                            <li>Smooth typewriter letter reveal</li>
                            <li>Voice note or background song</li>
                            <li>Private link to share</li>
                        </ul>
                    </div>

                    <div className="pricing-col-footer">
                        <button
                            className={`btn pricing-select-btn ${selectedTier === 'Simple Note Page' ? 'btn-ink' : 'btn-outline'}`}
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenBooking('Simple Note Page');
                            }}
                        >
                            Choose Simple Note
                        </button>
                    </div>
                </article>

                {/* Package 02: Full Keepsake Story (Flagship / Centerpiece) */}
                <article
                    className={`pricing-col pricing-col--flagship ${selectedTier === 'Full Keepsake Story' ? 'selected-tier' : ''}`}
                    data-tier="Full Keepsake Story"
                    onClick={() => onSelectTier('Full Keepsake Story')}
                >
                    <div className="pricing-flagship-badge">MOST POPULAR &middot; BEST VALUE</div>

                    <div className="pricing-col-top">
                        <span className="pricing-tier-label">02 · Full Story Experience</span>
                        <h3 className="pricing-name">Full Keepsake Story</h3>
                        <p className="pricing-positioning">
                            Our signature story website combining your photos, music, memory timeline, secret passcode, and wishes from friends.
                        </p>
                    </div>

                    <div className="pricing-price-block">
                        <span className="rate-price pricing-figure">{symbol}{prices['Full Keepsake Story']}</span>
                        <span className="pricing-currency-label">{currencyLabel}</span>
                    </div>

                    <div className="pricing-diff-note pricing-diff-note--flagship">
                        +GH₵300 upgrade &middot; Adds full chapter story, secret PIN gate, 3D Polaroids, wishes wall &amp; vinyl player
                    </div>

                    <div className="pricing-features">
                        <ul className="pricing-feature-list">
                            <li>Full story personal website</li>
                            <li>Private passcode / riddle lock <em>(included)</em></li>
                            <li>3D flipping Polaroid photo gallery</li>
                            <li>Interactive memory timeline</li>
                            <li>Friends &amp; family wishes wall <em>(included)</em></li>
                            <li>Spinning vinyl song player</li>
                        </ul>
                    </div>

                    <div className="pricing-col-footer">
                        <button
                            className="btn btn-ink pricing-select-btn"
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenBooking('Full Keepsake Story');
                            }}
                        >
                            Book Full Keepsake Story
                        </button>
                        <span className="pricing-flagship-note">Best for Birthdays, Anniversaries &amp; Valentine's</span>
                    </div>
                </article>

                {/* Package 03: Function or Deluxe Page */}
                <article
                    className={`pricing-col ${selectedTier === 'Function or Deluxe Page' ? 'selected-tier' : ''}`}
                    data-tier="Function or Deluxe Page"
                    onClick={() => onSelectTier('Function or Deluxe Page')}
                >
                    <div className="pricing-col-top">
                        <span className="pricing-tier-label">03 · Events &amp; Celebrations</span>
                        <h3 className="pricing-name">Function or Deluxe Page</h3>
                        <p className="pricing-positioning">
                            A complete digital invitation and guest portal for weddings, engagements, dinners, and milestone parties.
                        </p>
                    </div>

                    <div className="pricing-price-block">
                        <span className="rate-price pricing-figure">{symbol}{prices['Function or Deluxe Page']}</span>
                        <span className="pricing-currency-label">{currencyLabel}</span>
                    </div>

                    <div className="pricing-diff-note">
                        +GH₵400 upgrade &middot; Adds guest RSVP tracking, calendar save, dress code swatches &amp; VIP gate passes
                    </div>

                    <div className="pricing-features">
                        <ul className="pricing-feature-list">
                            <li>Full event invitation website</li>
                            <li>Live event countdown timer</li>
                            <li>Instant Add to Calendar (.ics)</li>
                            <li>Interactive dress code color swatches</li>
                            <li>Google Maps venue directions</li>
                            <li>Downloadable VIP QR guest pass</li>
                        </ul>
                    </div>

                    <div className="pricing-col-footer">
                        <button
                            className={`btn pricing-select-btn ${selectedTier === 'Function or Deluxe Page' ? 'btn-ink' : 'btn-outline'}`}
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenBooking('Function or Deluxe Page');
                            }}
                        >
                            Choose Event Page
                        </button>
                    </div>
                </article>

            </div>

            {/* Optional Add-Ons & Live Estimate */}
            <div className="extras-box">
                <div className="extras-head">
                    <div>
                        <h3>Optional Extras</h3>
                        <p className="extras-sub">
                            Add express next day delivery or a printable QR gift card. Features already included in your chosen package are automatically marked for you.
                        </p>
                    </div>
                    <span>Tap to add to estimate</span>
                </div>

                <div className="extras-grid">
                    {EXTRAS_LIST.map(extra => {
                        const isIncluded = includedInCurrentTier.includes(extra.id);
                        const isChecked = selectedExtras.includes(extra.id);
                        const priceVal = currency === 'USD' ? `+$${extra.usd}` : `+₵${extra.ghs}`;

                        return (
                            <div
                                key={extra.id}
                                className={`extra-item ${isIncluded ? 'included-in-tier' : ''} ${isChecked ? 'checked' : ''}`}
                                data-id={extra.id}
                                onClick={() => onToggleExtra(extra.id, isIncluded)}
                            >
                                <div className="extra-left">
                                    <span className="extra-check" aria-hidden="true">&#10003;</span>
                                    <div>
                                        <span className="extra-title">{extra.title}</span>
                                        <span className="extra-note">{extra.note}</span>
                                        {extra.hasPreview && (
                                            <button
                                                type="button"
                                                className="tag-preview-link"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onOpenTagModal();
                                                }}
                                            >
                                                Preview QR Tag
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <span className="extra-cost">{isIncluded ? 'Included' : priceVal}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="estimate-bar">
                    <div className="estimate-summary">
                        Selected Estimate: <span id="estimateDesc">{estimateDesc}</span> <strong id="estimateTotal">{estimateTotal}</strong>
                    </div>
                    <button className="btn btn-ink" type="button" onClick={() => onOpenBooking(selectedTier)}>
                        Lock Price &amp; Send Details
                    </button>
                </div>
            </div>

            <div className="deposit-policy">
                <strong>How Payment &amp; Delivery Work:</strong> Every page comes on a <strong>private link</strong> you can send on WhatsApp or text—plus an optional <strong>Printable QR Gift Tag</strong> for gift boxes. We start building after a <strong>50% deposit</strong> once we confirm your layout, and you pay the remaining 50% when you're happy with the preview.
            </div>
        </section>
    );
}
