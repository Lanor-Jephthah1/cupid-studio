import React from 'react';
import { downloadVipGuestPass } from '../utils/sound';

/**
 * GuestPassCard
 * Luxury perforated VIP Digital Gate Pass with foil header, live dress-code color swatch,
 * table/seat badge, scannable QR stub, and 1-tap PNG download.
 */
export default function GuestPassCard({
    guestCount,
    mealNote,
    colorName,
    accentHex,
    showToast
}) {
    const zoneLabel = guestCount === 'VIP Table' ? 'VIP TABLE 01' : 'TABLE 04 · GARDEN';

    return (
        <div className="vip-pass-ticket" style={{ '--pass-accent': accentHex || '#82172E' }}>
            <div className="vip-pass-top-bar">
                <span className="vip-pass-kicker">
                    <span className="vip-pass-dot" /> VIP ADMISSION PASS
                </span>
                <span className="vip-pass-serial">#CPD 204</span>
            </div>

            <div className="vip-pass-body">
                <div className="vip-pass-main">
                    <div className="vip-pass-event-head">
                        <strong>Kojo &amp; Afua · Engagement</strong>
                        <span>Sat, Dec 19 · 2:00 PM · The Cedar Court</span>
                    </div>

                    <div className="vip-pass-grid">
                        <div className="vip-pass-cell">
                            <small>ADMITTANCE</small>
                            <strong>{guestCount}</strong>
                        </div>
                        <div className="vip-pass-cell">
                            <small>ASSIGNED ZONE</small>
                            <strong>{zoneLabel}</strong>
                        </div>
                        <div className="vip-pass-cell">
                            <small>DINING MENU</small>
                            <strong>{mealNote}</strong>
                        </div>
                        <div className="vip-pass-cell">
                            <small>DRESS SHADE</small>
                            <strong>
                                <span
                                    className="vip-swatch-pip"
                                    style={{ background: accentHex || '#82172E' }}
                                />
                                {colorName}
                            </strong>
                        </div>
                    </div>
                </div>

                {/* Perforated Divider & Scannable QR Ticket Stub */}
                <div className="vip-pass-stub">
                    <div className="vip-qr-mini" aria-label="Gate check-in QR code">
                        <svg viewBox="0 0 21 21" shapeRendering="crispEdges">
                            <rect width="21" height="21" fill="#FFFDF9" />
                            <path
                                fill="#161312"
                                d="M1 1h6v6H1V1zm1 1v4h4V2H2zm1 1h2v2H3V3zm11-2h6v6h-6V1zm1 1v4h4V2h-4zm1 1h2v2h-2V3zM1 14h6v6H1v-6zm1 1v4h4v-4H2zm1 1h2v2H3v-2zM9 2h2v2H9V2zm3 2h1v3h-1V4zM8 7h3v2H8V7zm4 1h2v2h-2V8zM2 9h3v2H2V9zm5 2h4v2H7v-2zm6 0h3v2h-3v-2zm4 1h2v3h-2v-3zM9 14h2v3H9v-3zm3 2h3v2h-3v-2zm4 1h3v3h-3v-3zm-5 2h2v1h-2v-1z"
                            />
                        </svg>
                    </div>
                    <span className="vip-stub-caption">SCAN AT GATE</span>
                </div>
            </div>

            <div className="vip-pass-footer">
                <span className="vip-pass-status">&#10003; Verified Guest Entry</span>
                <button
                    type="button"
                    className="vip-pass-dl-btn"
                    onClick={() =>
                        downloadVipGuestPass({
                            guestCount,
                            mealNote,
                            colorName,
                            accentHex,
                            showToast
                        })
                    }
                >
                    Download VIP Pass (.PNG) &darr;
                </button>
            </div>
        </div>
    );
}
