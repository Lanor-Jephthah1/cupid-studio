import React, { useState, useRef } from 'react';
import { CUPID_CONFIG, OCCASIONS, EXTRAS_LIST, TIER_INCLUDED_EXTRAS } from '../data/studioData';
import { buildVCardPayload, downloadCardImage } from '../utils/sound';
import { PhoneSimulatorScreen } from './SampleDesk';
import CupidSelect from './CupidSelect';

const OCCASION_OPTIONS = [
    'Birthday',
    'Anniversary',
    'Function / Event',
    "Valentine's Day",
    'Just Because'
];

const PACKAGE_OPTIONS = [
    'Simple Note Page',
    'Full Keepsake Story',
    'Function or Deluxe Page'
];

export default function Modals({
    activeModal,
    onCloseModal,
    selectedTier,
    onSelectTier,
    bookingOccasion,
    onChangeBookingOccasion,
    selectedExtras,
    currency,
    estimateDesc,
    estimateTotal,
    occasionKey,
    activeChapterIdx,
    onSelectChapter,
    simState,
    simActions,
    cardStock,
    onOpenBooking,
    policyTab = 'privacy',
    onSelectPolicyTab,
    showToast
}) {
    const [fName, setFName] = useState('');
    const [fDate, setFDate] = useState('');
    const [fNotes, setFNotes] = useState('');
    const [errors, setErrors] = useState({});

    const nameRef = useRef(null);
    const dateRef = useRef(null);
    const notesRef = useRef(null);

    const validateBrief = () => {
        const nextErr = {
            fName: !fName.trim(),
            fDate: !fDate.trim(),
            fNotes: !fNotes.trim()
        };
        setErrors(nextErr);
        if (nextErr.fName || nextErr.fDate || nextErr.fNotes) {
            const firstRef = nextErr.fName ? nameRef : (nextErr.fDate ? dateRef : notesRef);
            if (firstRef.current) firstRef.current.focus();
            showToast('Please fill in your name, target date, and details first.');
            return false;
        }
        return true;
    };

    const buildBriefText = () => {
        const symbol = currency === 'USD' ? '$' : '₵';
        let total = CUPID_CONFIG.prices[currency][selectedTier] || 0;
        const included = TIER_INCLUDED_EXTRAS[selectedTier] || [];
        const chosenExtras = [];

        EXTRAS_LIST.forEach(extra => {
            if (selectedExtras.includes(extra.id) && !included.includes(extra.id)) {
                total += currency === 'USD' ? extra.usd : extra.ghs;
                chosenExtras.push(extra.title);
            }
        });

        return [
            `Hello ${CUPID_CONFIG.handle} (Cupid Studio),`,
            `I would like to book a custom webpage:`,
            ``,
            `Name: ${fName.trim() || 'Client'}`,
            `Occasion: ${bookingOccasion}`,
            `Package: ${selectedTier}`,
            `Extras: ${chosenExtras.length ? chosenExtras.join(', ') : 'None'}`,
            `Estimated Total: ${symbol}${total}`,
            `Target Date: ${fDate.trim() || 'Flexible'}`,
            `Details: ${fNotes.trim() || 'None'}`
        ].join('\n');
    };

    const sendWhatsApp = () => {
        if (!validateBrief()) return;
        const digits = CUPID_CONFIG.whatsappNumber.replace(/\D/g, '');
        window.open(`https://wa.me/${digits}?text=${encodeURIComponent(buildBriefText())}`, '_blank', 'noopener,noreferrer');
    };

    const sendEmail = () => {
        const subject = encodeURIComponent(`Cupid Booking: ${bookingOccasion}`);
        const body = encodeURIComponent(buildBriefText());
        window.location.href = `mailto:${CUPID_CONFIG.email}?subject=${subject}&body=${body}`;
        showToast('Opening email app...');
    };

    const copyBrief = async () => {
        try {
            await navigator.clipboard.writeText(buildBriefText());
            showToast('Order details copied to clipboard.');
        } catch {
            showToast('Please copy your details manually.');
        }
    };

    const downloadVCard = (ev) => {
        if (ev) ev.preventDefault();
        const payload = buildVCardPayload();
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        if (isIOS) {
            window.location.href = '/cupid.vcf';
            showToast('Opening Apple Contacts card (.vcf)...');
            return;
        }
        const blob = new Blob([payload], { type: 'text/vcard;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'CupidStudio-Contact.vcf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showToast('Saved CupidStudio-Contact.vcf');
    };

    const shareVCardFile = async () => {
        const payload = buildVCardPayload();
        try {
            const file = new File([payload], 'CupidStudio-Contact.vcf', { type: 'text/vcard;charset=utf-8' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: `Cupid Studio · ${CUPID_CONFIG.handle}`,
                    text: 'Save Cupid Studio contact card (.vcf)'
                });
                showToast('Shared .vcf to your phone.');
                return;
            }
        } catch {
            // fallback
        }
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Cupid Studio · ${CUPID_CONFIG.handle}`,
                    text: 'Personal celebration websites & digital invites by Cupid Studio.',
                    url: window.location.href
                });
                return;
            } catch {
                // fallback
            }
        }
        copyContactDetails();
    };

    const copyContactDetails = async () => {
        const info = [
            `Cupid Studio · ${CUPID_CONFIG.founder} (${CUPID_CONFIG.handle})`,
            'Personal Websites & Digital Invites · Ghana · Worldwide',
            `Email: ${CUPID_CONFIG.email}`,
            'Website: https://cupid-studio.vercel.app/'
        ].join('\n');
        try {
            await navigator.clipboard.writeText(info);
            showToast('Studio contact details copied.');
        } catch {
            showToast(`Email: ${CUPID_CONFIG.email}`);
        }
    };

    const currentOccasionData = OCCASIONS[occasionKey] || OCCASIONS.birthdays;

    return (
        <>
            {/* 1. Booking Modal */}
            <div
                className="modal-backdrop"
                id="bookingModal"
                hidden={activeModal !== 'bookingModal'}
                role="dialog"
                aria-modal="true"
                aria-labelledby="bookingTitle"
                onClick={(e) => { if (e.target === e.currentTarget) onCloseModal(); }}
            >
                <div className="modal-card modal-card--brief">
                    <button className="modal-close" type="button" aria-label="Close booking dialog" onClick={onCloseModal}>&times;</button>
                    <h3 id="bookingTitle">Start Your Page</h3>
                    <p className="sub">Fill in a few quick details below to send your plan directly on WhatsApp or email.</p>

                    <div className="modal-estimate-strip">
                        <span id="modalEstimateDesc">{estimateDesc}</span>
                        <strong id="modalEstimateTotal">{estimateTotal}</strong>
                    </div>

                    <div className="booking-form-scroll" id="bookingFormScroll">
                        <div className="booking-fields-grid">
                            <div className="field">
                                <label htmlFor="fName">Your Name *</label>
                                <input
                                    id="fName"
                                    ref={nameRef}
                                    type="text"
                                    className={errors.fName ? 'field-error' : ''}
                                    placeholder="e.g. Akwasi Mensah"
                                    autoComplete="name"
                                    value={fName}
                                    onChange={(e) => {
                                        setFName(e.target.value);
                                        if (errors.fName) setErrors(prev => ({ ...prev, fName: false }));
                                    }}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="fDate">Target Date *</label>
                                <input
                                    id="fDate"
                                    ref={dateRef}
                                    type="text"
                                    className={errors.fDate ? 'field-error' : ''}
                                    placeholder="e.g. December 14"
                                    value={fDate}
                                    onChange={(e) => {
                                        setFDate(e.target.value);
                                        if (errors.fDate) setErrors(prev => ({ ...prev, fDate: false }));
                                    }}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="ddOccasionBtn">Occasion</label>
                                <CupidSelect
                                    id="ddOccasion"
                                    value={bookingOccasion}
                                    options={OCCASION_OPTIONS}
                                    onChange={onChangeBookingOccasion}
                                    ariaLabel="Select occasion"
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="ddPackageBtn">Selected Package</label>
                                <CupidSelect
                                    id="ddPackage"
                                    value={selectedTier}
                                    options={PACKAGE_OPTIONS}
                                    onChange={onSelectTier}
                                    ariaLabel="Select package"
                                />
                            </div>

                            <div className="field field--full">
                                <label htmlFor="fNotes">Story, Colors &amp; Song Notes *</label>
                                <textarea
                                    id="fNotes"
                                    ref={notesRef}
                                    className={errors.fNotes ? 'field-error' : ''}
                                    placeholder="Share their name, favorite colors, song title or link, how many photos you have, or event details."
                                    value={fNotes}
                                    onChange={(e) => {
                                        setFNotes(e.target.value);
                                        if (errors.fNotes) setErrors(prev => ({ ...prev, fNotes: false }));
                                    }}
                                />
                            </div>
                        </div>

                        <div className="modal-btns">
                            <button className="btn btn-ink modal-btn-primary" type="button" onClick={sendWhatsApp}>
                                Send on WhatsApp
                            </button>
                            <button className="btn btn-outline" type="button" onClick={sendEmail}>
                                Send via Email
                            </button>
                            <button className="btn btn-outline" type="button" onClick={copyBrief}>
                                Copy Text
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Printable QR Gift Tag Modal */}
            <div
                className="modal-backdrop"
                id="tagModal"
                hidden={activeModal !== 'tagModal'}
                role="dialog"
                aria-modal="true"
                aria-labelledby="tagTitle"
                onClick={(e) => { if (e.target === e.currentTarget) onCloseModal(); }}
            >
                <div className="modal-card">
                    <button className="modal-close" type="button" aria-label="Close QR tag preview" onClick={onCloseModal}>&times;</button>
                    <h3 id="tagTitle">Printable QR Gift Tag</h3>
                    <p className="sub">Sent as a printable PDF you can print on cardstock and tie onto a gift box or flower bouquet.</p>

                    <div className="gift-tag-specimen">
                        <div className="tag-hole" aria-hidden="true"></div>
                        <div className="tag-qr-wrap">
                            <svg viewBox="0 0 39 39" shapeRendering="crispEdges" role="img" aria-label="Sample gift tag QR code">
                                <rect width="39" height="39" fill="#FFFCF7" />
                                <path fill="none" stroke="#1B1715" strokeWidth="1" d="M1 1.5h7m1 0h1m2 0h2m2 0h1m2 0h2m2 0h1m1 0h5m1 0h7M1 2.5h1m5 0h1m2 0h3m1 0h3m2 0h1m1 0h1m1 0h1m2 0h2m3 0h1m5 0h1M1 3.5h1m1 0h3m1 0h1m3 0h1m3 0h1m2 0h7m4 0h1m1 0h1m1 0h3m1 0h1M1 4.5h1m1 0h3m1 0h1m1 0h1m6 0h1m2 0h2m3 0h4m1 0h1m1 0h1m1 0h3m1 0h1M1 5.5h1m1 0h3m1 0h1m1 0h3m1 0h3m1 0h1m1 0h1m2 0h1m1 0h1m1 0h1m1 0h1m2 0h1m1 0h3m1 0h1M1 6.5h1m5 0h1m1 0h2m1 0h1m2 0h1m1 0h1m1 0h5m2 0h1m2 0h1m1 0h1m5 0h1M1 7.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M9 8.5h1m1 0h2m1 0h2m2 0h3m2 0h3m1 0h2M1 9.5h1m3 0h1m1 0h5m1 0h4m2 0h2m2 0h1m1 0h1m4 0h5m2 0h1M4 10.5h1m4 0h1m2 0h1m1 0h1m2 0h1m2 0h3m4 0h1m1 0h1m1 0h1m1 0h1M2 11.5h1m3 0h2m2 0h2m1 0h1m3 0h1m1 0h1m1 0h3m4 0h3m1 0h4M1 12.5h1m3 0h2m1 0h2m5 0h1m2 0h1m3 0h2m1 0h1m1 0h4m4 0h1m1 0h1M2 13.5h1m3 0h4m2 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h4m4 0h3m2 0h1m1 0h1M1 14.5h2m1 0h1m1 0h1m1 0h3m2 0h2m1 0h1m1 0h1m5 0h1m1 0h4m1 0h3m2 0h1M1 15.5h1m4 0h2m1 0h3m1 0h4m2 0h1m1 0h9m1 0h1m1 0h1m1 0h1M1 16.5h1m4 0h1m3 0h1m2 0h1m1 0h3m2 0h1m1 0h1m1 0h2m2 0h1m1 0h1m1 0h2m1 0h1M2 17.5h3m2 0h1m1 0h1m2 0h1m1 0h4m2 0h2m2 0h1m5 0h3m2 0h3M3 18.5h2m1 0h1m3 0h2m1 0h1m5 0h2m1 0h2m1 0h1m1 0h2m4 0h1m1 0h1M1 19.5h2m1 0h8m3 0h2m1 0h3m1 0h11m2 0h1M4 20.5h1m1 0h1m4 0h2m1 0h5m1 0h3m1 0h1m2 0h1m1 0h1m2 0h2m1 0h1m1 0h1M2 21.5h1m1 0h4m2 0h1m6 0h2m2 0h3m1 0h1m5 0h2m2 0h1m1 0h1M3 22.5h1m1 0h2m3 0h2m2 0h4m1 0h2m1 0h1m1 0h1m1 0h1m1 0h2m2 0h5M1 23.5h7m2 0h1m3 0h1m1 0h3m5 0h5m1 0h1m1 0h1m1 0h1M3 24.5h1m2 0h1m1 0h2m3 0h2m2 0h3m3 0h1m1 0h1m2 0h2m2 0h1m1 0h2m1 0h1M3 25.5h7m9 0h2m2 0h3m1 0h1m1 0h5m1 0h1m1 0h1M1 26.5h2m1 0h1m3 0h1m1 0h1m1 0h1m2 0h1m1 0h1m2 0h3m3 0h4m3 0h2m1 0h2M3 27.5h1m3 0h3m2 0h1m1 0h1m2 0h3m1 0h1m5 0h2m1 0h1m3 0h2M3 28.5h3m2 0h2m2 0h3m3 0h2m2 0h2m1 0h1m1 0h1m2 0h1m2 0h3m1 0h1M1 29.5h5m1 0h1m1 0h1m2 0h3m1 0h1m1 0h1m1 0h6m1 0h7m1 0h2M9 30.5h3m1 0h1m1 0h5m1 0h1m2 0h1m2 0h1m1 0h1m3 0h1m3 0h1M1 31.5h7m1 0h1m1 0h2m3 0h2m1 0h1m2 0h4m3 0h1m1 0h1m1 0h3M1 32.5h1m5 0h1m2 0h4m1 0h3m2 0h3m4 0h1m1 0h1m3 0h1m1 0h2M1 33.5h1m1 0h3m1 0h1m1 0h3m2 0h2m1 0h1m3 0h1m3 0h1m1 0h1m1 0h5m1 0h1m1 0h1M1 34.5h1m1 0h3m1 0h1m3 0h2m2 0h1m3 0h2m2 0h1m1 0h4m1 0h3m3 0h1M1 35.5h1m1 0h3m1 0h1m2 0h2m3 0h2m1 0h3m3 0h1m5 0h3m1 0h3M1 36.5h1m5 0h1m2 0h4m2 0h3m1 0h3m2 0h1m2 0h1m2 0h2m1 0h3M1 37.5h7m1 0h1m1 0h1m1 0h1m4 0h2m1 0h2m1 0h1m3 0h1m6 0h3" />
                            </svg>
                        </div>
                        <h4>Scan Me. I Made You Something.</h4>
                        <p>Made by Cupid Studio · Private Gift Tag</p>
                    </div>

                    <button className="btn btn-ink" type="button" style={{ width: '100%' }} onClick={onCloseModal}>
                        Close Preview
                    </button>
                </div>
            </div>

            {/* 3. Expanded Interactive Demo Modal */}
            <div
                className="modal-backdrop"
                id="fullDemoModal"
                hidden={activeModal !== 'fullDemoModal'}
                role="dialog"
                aria-modal="true"
                aria-labelledby="fullDemoHeading"
                onClick={(e) => { if (e.target === e.currentTarget) onCloseModal(); }}
            >
                <div className="full-demo-card">
                    <button className="modal-close" type="button" aria-label="Close expanded sample" onClick={onCloseModal}>&times;</button>
                    <h3 id="fullDemoHeading">{currentOccasionData.title}</h3>

                    <PhoneSimulatorScreen
                        occasionKey={occasionKey}
                        activeChapterIdx={activeChapterIdx}
                        onSelectChapter={onSelectChapter}
                        simState={simState}
                        simActions={simActions}
                        showToast={showToast}
                    />

                    <p className="full-demo-disclaimer">
                        Interactive sample showing 3 starter screens. Every real page is built from scratch around your own photos, words, and music.
                    </p>
                    <button
                        className="btn btn-ink"
                        id="fullDemoOrderBtn"
                        type="button"
                        style={{ width: '100%' }}
                        onClick={() => {
                            onCloseModal();
                            onOpenBooking('', currentOccasionData.occasionVal);
                        }}
                    >
                        Book a Page Like This
                    </button>
                </div>
            </div>

            {/* 4. Save Contact / vCard Modal */}
            <div
                className="modal-backdrop"
                id="vcardModal"
                hidden={activeModal !== 'vcardModal'}
                role="dialog"
                aria-modal="true"
                aria-labelledby="vcardTitle"
                onClick={(e) => { if (e.target === e.currentTarget) onCloseModal(); }}
            >
                <div className="modal-card modal-card--vcard">
                    <button className="modal-close" type="button" aria-label="Close save card options" onClick={onCloseModal}>&times;</button>
                    <h3 id="vcardTitle">Save Cupid Studio Contact</h3>
                    <p className="sub">
                        Save <strong>{CUPID_CONFIG.founder}</strong> ({CUPID_CONFIG.handle}) straight to your phone contacts or photo gallery.
                    </p>

                    <div className="vcard-qr-panel">
                        <div className="vcard-qr-box">
                            <img src="/assets/vcard-qr.svg" alt="Scannable contact QR code for Cupid Studio" />
                        </div>
                        <div className="vcard-qr-copy">
                            <span className="vcard-kicker">PHONE CAMERA SCAN</span>
                            <strong>Scan with Any Phone Camera</strong>
                            <p>Point your phone camera here to add Cupid Studio straight into your Contacts list.</p>
                        </div>
                    </div>

                    <div className="vcard-options-grid">
                        <a
                            className="btn btn-ink vcard-opt-btn"
                            href="/cupid.vcf"
                            download="CupidStudio-TheCupidDevs.vcf"
                            onClick={downloadVCard}
                        >
                            Download Contact (.vcf)
                        </a>
                        <button className="btn btn-outline vcard-opt-btn" type="button" onClick={shareVCardFile}>
                            Share to Contacts
                        </button>
                        <button
                            className="btn btn-outline vcard-opt-btn"
                            type="button"
                            onClick={() => downloadCardImage(cardStock === 'obsidian', showToast)}
                        >
                            Save Card Image (.png)
                        </button>
                        <button className="btn btn-outline vcard-opt-btn" type="button" onClick={copyContactDetails}>
                            Copy Contact Info
                        </button>
                    </div>

                    <p className="vcard-note">
                        Tip: On iPhone Safari, tap Share and choose <strong>Add to Home Screen</strong> to keep Cupid Studio one tap away.
                    </p>
                </div>
            </div>

            {/* 5. Legal Policies, Terms, Refunds & FAQ Modal */}
            <div
                className="modal-backdrop"
                id="policyModal"
                hidden={activeModal !== 'policyModal'}
                role="dialog"
                aria-modal="true"
                aria-labelledby="policyModalTitle"
                onClick={(e) => { if (e.target === e.currentTarget) onCloseModal(); }}
            >
                <div className="modal-card modal-card--policy">
                    <button className="modal-close" type="button" aria-label="Close studio policies" onClick={onCloseModal}>&times;</button>
                    <span className="policy-modal-kicker">CUPID STUDIO &middot; {CUPID_CONFIG.handle.toUpperCase()}</span>
                    <h3 id="policyModalTitle">Studio Policies &amp; Client Guide</h3>

                    <div className="policy-tabs" role="tablist" aria-label="Policy sections">
                        {[
                            { id: 'privacy', label: 'Privacy Policy' },
                            { id: 'terms', label: 'Terms of Service' },
                            { id: 'refunds', label: 'Revisions & Refunds' },
                            { id: 'faq', label: 'FAQ' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={policyTab === tab.id}
                                className={`policy-tab-btn ${policyTab === tab.id ? 'active' : ''}`}
                                onClick={() => onSelectPolicyTab && onSelectPolicyTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="policy-body">
                        {policyTab === 'privacy' && (
                            <div className="policy-section">
                                <h4>1. Your Photos, Voice Notes &amp; Letters Stay Private</h4>
                                <p>
                                    Every page we build is created exclusively for you and the person or guests you share it with. We never sell, rent, or share your personal photographs, voice recordings, letters, or guest RSVP lists with third parties.
                                </p>
                                <h4>2. Secret Passcode &amp; Unlisted Links</h4>
                                <p>
                                    Your finished page lives on an unlisted link and can be locked behind a personal 4 digit date or passcode so only people with your code can open it. Search engines are blocked from indexing private keepsake pages unless you ask us to showcase an anonymized sample.
                                </p>
                                <h4>3. Photo &amp; Data Removal Anytime</h4>
                                <p>
                                    You stay in full control of your page. If you ever want a photo swapped, a passcode changed, or your entire page taken offline permanently, message <strong>{CUPID_CONFIG.handle}</strong> at <a href={`mailto:${CUPID_CONFIG.email}`}>{CUPID_CONFIG.email}</a> and we will process it within 24 hours.
                                </p>
                            </div>
                        )}

                        {policyTab === 'terms' && (
                            <div className="policy-section">
                                <h4>1. Custom Page Commissions</h4>
                                <p>
                                    Each Cupid Studio page is hand coded and custom designed around the photos, songs, colors, and words you send us. Standard build time is 2 to 5 days depending on your package and whether you select 24 Hour Express Delivery.
                                </p>
                                <h4>2. Deposit &amp; Final Handoff</h4>
                                <p>
                                    Work begins once your brief is confirmed and a 50% deposit is received via Mobile Money, bank transfer, or card/international transfer. The remaining 50% is paid after you review your private preview link and approve the final page.
                                </p>
                                <h4>3. Hosting &amp; Link Uptime</h4>
                                <p>
                                    Every package includes 12 months of fast, secure hosting at no extra cost. You can also download your printable QR gift card or VIP event passes to keep forever.
                                </p>
                            </div>
                        )}

                        {policyTab === 'refunds' && (
                            <div className="policy-section">
                                <h4>1. Free Tweaks During Preview</h4>
                                <p>
                                    Before your final link goes live, we send you a private test link on WhatsApp or email. You can request wording edits, photo swaps, color adjustments, or song changes at no extra charge until it feels right.
                                </p>
                                <h4>2. Cancellation &amp; Refund Policy</h4>
                                <p>
                                    If you cancel before we begin building your layout, your deposit is refunded in full. Once custom design and coding have started, the initial 50% deposit covers the build time already completed, or can be held as full studio credit toward any future birthday, anniversary, or event page within 12 months.
                                </p>
                                <h4>3. Event Date Changes</h4>
                                <p>
                                    If your event date, venue, or time changes, we update your live countdown, schedule, and VIP pass details free of charge.
                                </p>
                            </div>
                        )}

                        {policyTab === 'faq' && (
                            <div className="policy-section">
                                <h4>How do I send my photos, song, and voice note?</h4>
                                <p>
                                    Once you submit the <strong>Start Your Page</strong> form, your brief opens straight in WhatsApp or email. You can drop your photos, voice note, and song link right in our chat or via Google Drive.
                                </p>
                                <h4>Does the recipient need to install an app?</h4>
                                <p>
                                    No app is needed. Your page opens smoothly in any phone or laptop browser (Safari, Chrome, etc.) the moment they tap your WhatsApp link or scan your printed QR gift tag.
                                </p>
                                <h4>Can I order from outside Ghana?</h4>
                                <p>
                                    Yes. You can switch prices between <strong>GH₵ (Cedis)</strong> and <strong>$ (US Dollars)</strong> in the Pricing section, and your digital link and printable QR card work anywhere in the world.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="policy-footer-bar">
                        <span>Questions? Reach us at <a href={`mailto:${CUPID_CONFIG.email}`}>{CUPID_CONFIG.email}</a></span>
                        <button
                            type="button"
                            className="btn btn-ink ub-btn-sm"
                            onClick={() => {
                                onCloseModal();
                                onOpenBooking('');
                            }}
                        >
                            Start Your Page
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
