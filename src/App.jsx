import React, { useState, useEffect, useRef } from 'react';
import {
    CUPID_CONFIG,
    OCCASIONS,
    EXTRAS_LIST,
    TIER_INCLUDED_EXTRAS,
    GAME_ICONS
} from './data/studioData';
import { playChime } from './utils/sound';

import ScrollGrainCanvas from './components/ScrollGrainCanvas';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StorySection from './components/StorySection';
import WhatWeMake from './components/WhatWeMake';
import SampleDesk from './components/SampleDesk';
import DeliveryAndArchive from './components/DeliveryAndArchive';
import PricingSection from './components/PricingSection';
import ProcessSection from './components/ProcessSection';
import Modals from './components/Modals';

export default function App() {
    // Card & Navigation State
    const [cardStock, setCardStock] = useState('ivory');
    const [scrollPct, setScrollPct] = useState(0);

    // Pricing & Add-On State
    const [currency, setCurrency] = useState('GHS');
    const [selectedTier, setSelectedTier] = useState('Full Keepsake Story');
    const [selectedExtras, setSelectedExtras] = useState([]);

    // Modal & Toast State
    const [activeModal, setActiveModal] = useState(null);
    const [policyTab, setPolicyTab] = useState('privacy');
    const [bookingOccasion, setBookingOccasion] = useState('Birthday');
    const [toastMsg, setToastMsg] = useState('');
    const toastTimerRef = useRef(null);

    // Sample Desk Simulator State
    const [occasionKey, setOccasionKey] = useState('birthdays');
    const [activeChapterIdx, setActiveChapterIdx] = useState(0);

    const [bdayCandlesLit, setBdayCandlesLit] = useState([true, true, true]);
    const [pinUnlocked, setPinUnlocked] = useState(false);
    const [polaroidIndex, setPolaroidIndex] = useState(0);
    const [wishIndex, setWishIndex] = useState(0);
    const [wishHearts, setWishHearts] = useState([12, 9, 18]);
    const [vinylPlayingKey, setVinylPlayingKey] = useState(null);

    const [activeMilestoneIdx, setActiveMilestoneIdx] = useState(0);
    const [annivTickSecs, setAnnivTickSecs] = useState(51730);
    const [dreamsDone, setDreamsDone] = useState([true, false, false]);

    const [memCards, setMemCards] = useState(() =>
        [...GAME_ICONS, ...GAME_ICONS].sort(() => Math.random() - 0.5)
    );
    const [memFlipped, setMemFlipped] = useState([]);
    const [memMatched, setMemMatched] = useState(new Set());
    const [memLocked, setMemLocked] = useState(false);

    const [inviteAccent, setInviteAccent] = useState('#82172E');
    const [inviteColorName, setInviteColorName] = useState('Oxblood');
    const [openProgIdx, setOpenProgIdx] = useState(0);
    const [rsvpConfirmed, setRsvpConfirmed] = useState(true);
    const [rsvpGuestCount, setRsvpGuestCount] = useState('2 Guests');
    const [rsvpMealNote, setRsvpMealNote] = useState('Jollof & Grill');

    const [valEnvOpened, setValEnvOpened] = useState(false);
    const [activeOwKey, setActiveOwKey] = useState('miss');
    const [valReasonIdx, setValReasonIdx] = useState(0);
    const [dateVoucherRevealed, setDateVoucherRevealed] = useState(false);

    const showToast = (msg) => {
        setToastMsg(msg);
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setToastMsg(''), 3000);
    };

    // Scroll progress bar & Escape key listener
    useEffect(() => {
        const onScroll = () => {
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docH > 0 ? Math.min(100, (window.scrollY / docH) * 100) : 0;
            setScrollPct(pct);
        };
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setActiveModal(null);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('keydown', onKeyDown);

        // Support URL query params ?book=...&tier=... from archive pages
        const params = new URLSearchParams(window.location.search);
        const reqBook = params.get('book');
        const reqTier = params.get('tier');
        if (reqBook || reqTier) {
            if (reqTier) handleSelectTier(reqTier);
            if (reqBook) setBookingOccasion(reqBook);
            setActiveModal('bookingModal');
            if (window.history && window.history.replaceState) {
                window.history.replaceState({}, document.title, window.location.pathname + '#rates');
            }
        }

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    // Continuous Smooth Scroll-Reveal Observer (animates every time you scroll down or up)
    useEffect(() => {
        if (typeof IntersectionObserver === 'undefined') return;
        const targets = document.querySelectorAll(
            '.reveal, .tenet-card, .repertoire-card, .occ-panel, .pricing-col, .extra-item, .process-step-card, .unboxing-card, .delivery-console-panel, .final-cta-banner'
        );

        targets.forEach((el, idx) => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('scroll-card-reveal');
                el.style.setProperty('--reveal-delay', `${(idx % 3) * 55}ms`);
            }
        });

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    } else {
                        entry.target.classList.remove('is-visible');
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
        );

        targets.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    // Live Anniversary Counter
    useEffect(() => {
        if (occasionKey !== 'anniversaries' || activeChapterIdx !== 0) return;
        const timer = setInterval(() => {
            setAnnivTickSecs(s => s + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [occasionKey, activeChapterIdx]);

    // Smart Tier Selection (automatically clears included add-ons so they are never double-charged)
    const handleSelectTier = (tierName) => {
        setSelectedTier(tierName);
        const included = TIER_INCLUDED_EXTRAS[tierName] || [];
        setSelectedExtras(prev => prev.filter(id => !included.includes(id)));
    };

    const handleToggleExtra = (extraId, isIncluded) => {
        if (isIncluded) {
            showToast(`Already included in ${selectedTier} at no extra charge.`);
            return;
        }
        setSelectedExtras(prev =>
            prev.includes(extraId) ? prev.filter(x => x !== extraId) : [...prev, extraId]
        );
    };

    const handleOpenBooking = (pkgName, occVal) => {
        if (pkgName) handleSelectTier(pkgName);
        if (occVal) setBookingOccasion(occVal);
        setActiveModal('bookingModal');
    };

    const handleSelectOccasion = (key) => {
        if (!OCCASIONS[key]) return;
        setOccasionKey(key);
        setActiveChapterIdx(0);
    };

    const handleJumpToOccasion = (key) => {
        handleSelectOccasion(key);
        const desk = document.getElementById('occasions');
        if (desk) desk.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleSelectChapter = (idx) => {
        setActiveChapterIdx(idx);
        playChime('flip');
    };

    // Compute live estimate summary & total
    const symbol = currency === 'USD' ? '$' : '₵';
    const includedIds = TIER_INCLUDED_EXTRAS[selectedTier] || [];
    const activeExtraItems = EXTRAS_LIST.filter(
        ex => selectedExtras.includes(ex.id) && !includedIds.includes(ex.id)
    );
    const basePrice = CUPID_CONFIG.prices[currency][selectedTier] || 0;
    const extrasSum = activeExtraItems.reduce(
        (acc, ex) => acc + (currency === 'USD' ? ex.usd : ex.ghs),
        0
    );
    const totalAmount = basePrice + extrasSum;
    const estimateDesc =
        activeExtraItems.length > 0
            ? `${selectedTier} + ${activeExtraItems.length} extra${activeExtraItems.length > 1 ? 's' : ''}`
            : `${selectedTier} (base rate)`;
    const estimateTotal = `${symbol}${totalAmount}`;

    // Simulator interactive actions
    const simState = {
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
    };

    const simActions = {
        toggleCandle: (i) => {
            setBdayCandlesLit(prev => prev.map((v, idx) => (idx === i ? !v : v)));
            playChime('stamp');
        },
        relightCandles: () => {
            setBdayCandlesLit([true, true, true]);
            playChime('birthdayMelody');
        },
        togglePinSample: () => {
            setPinUnlocked(prev => {
                if (!prev) playChime('stamp');
                return !prev;
            });
        },
        nextPolaroid: () => {
            setPolaroidIndex(i => (i + 1) % 3);
            playChime('flip');
        },
        nextWish: () => setWishIndex(i => (i + 1) % 3),
        likeWish: () => {
            setWishHearts(prev => prev.map((h, idx) => (idx === wishIndex ? h + 1 : h)));
            playChime('stamp');
        },
        toggleVinyl: (key) => {
            setVinylPlayingKey(prev => {
                if (prev === key) return null;
                if (key === 'birthdays') playChime('birthdayMelody');
                else if (key === 'valentines') playChime('valentine');
                else playChime('anniversary');
                return key;
            });
        },
        selectMilestone: (i) => setActiveMilestoneIdx(i),
        toggleDream: (i) => {
            setDreamsDone(prev => prev.map((d, idx) => (idx === i ? !d : d)));
            playChime('flip');
        },
        resetMemoryGame: () => {
            setMemCards([...GAME_ICONS, ...GAME_ICONS].sort(() => Math.random() - 0.5));
            setMemFlipped([]);
            setMemMatched(new Set());
            setMemLocked(false);
        },
        flipMemCard: (idx) => {
            if (memLocked || memFlipped.includes(idx) || memMatched.has(memCards[idx].id)) return;
            const nextFlipped = [...memFlipped, idx];
            setMemFlipped(nextFlipped);

            if (nextFlipped.length === 2) {
                setMemLocked(true);
                const [a, b] = nextFlipped;
                if (memCards[a].id === memCards[b].id) {
                    playChime('stamp');
                    setTimeout(() => {
                        setMemMatched(prev => {
                            const next = new Set(prev);
                            next.add(memCards[a].id);
                            return next;
                        });
                        setMemFlipped([]);
                        setMemLocked(false);
                    }, 180);
                } else {
                    setTimeout(() => {
                        setMemFlipped([]);
                        setMemLocked(false);
                    }, 680);
                }
            }
        },
        setInviteTheme: (hex, name) => {
            setInviteAccent(hex);
            setInviteColorName(name);
        },
        setOpenProgIdx: (i) => setOpenProgIdx(i),
        togglePhoneRsvp: () => {
            setRsvpConfirmed(prev => {
                if (!prev) playChime('stamp');
                return !prev;
            });
        },
        setRsvpGuestCount: (val) => setRsvpGuestCount(val),
        setRsvpMealNote: (val) => setRsvpMealNote(val),
        toggleValEnvelope: () => {
            setValEnvOpened(prev => {
                playChime(!prev ? 'valentine' : 'flip');
                return !prev;
            });
        },
        setActiveOwKey: (key) => setActiveOwKey(key),
        nextValReason: () => {
            setValReasonIdx(i => (i + 1) % 4);
            playChime('flip');
        },
        toggleDatePass: () => {
            setDateVoucherRevealed(prev => {
                if (!prev) playChime('valentine');
                return !prev;
            });
        }
    };

    return (
        <>
            <ScrollGrainCanvas />
            <div
                className="scroll-progress"
                id="scrollProgress"
                style={{ width: `${scrollPct.toFixed(2)}%` }}
                aria-hidden="true"
            />

            <Navbar onOpenBooking={handleOpenBooking} />

            <main className="page-wrap">
                <HeroSection
                    cardStock={cardStock}
                    onChangeStock={setCardStock}
                    onOpenBooking={handleOpenBooking}
                    onOpenVCard={() => setActiveModal('vcardModal')}
                    onOpenTagModal={() => setActiveModal('tagModal')}
                    onJumpToOccasion={handleJumpToOccasion}
                    showToast={showToast}
                />

                <StorySection />

                <WhatWeMake
                    onJumpToOccasion={handleJumpToOccasion}
                    onOpenBooking={handleOpenBooking}
                />

                <SampleDesk
                    occasionKey={occasionKey}
                    onSelectOccasion={handleSelectOccasion}
                    activeChapterIdx={activeChapterIdx}
                    onSelectChapter={handleSelectChapter}
                    simState={simState}
                    simActions={simActions}
                    onOpenBooking={handleOpenBooking}
                    onOpenFullDemo={() => setActiveModal('fullDemoModal')}
                    showToast={showToast}
                />

                <DeliveryAndArchive
                    onOpenTagModal={() => setActiveModal('tagModal')}
                    onOpenBooking={handleOpenBooking}
                />

                <PricingSection
                    currency={currency}
                    onChangeCurrency={setCurrency}
                    selectedTier={selectedTier}
                    onSelectTier={handleSelectTier}
                    selectedExtras={selectedExtras}
                    onToggleExtra={handleToggleExtra}
                    estimateDesc={estimateDesc}
                    estimateTotal={estimateTotal}
                    onOpenBooking={handleOpenBooking}
                    onOpenTagModal={() => setActiveModal('tagModal')}
                />

                <ProcessSection
                    onOpenBooking={handleOpenBooking}
                    onOpenVCard={() => setActiveModal('vcardModal')}
                    onOpenPolicy={(tab) => {
                        setPolicyTab(tab || 'privacy');
                        setActiveModal('policyModal');
                    }}
                />
            </main>

            <Modals
                activeModal={activeModal}
                onCloseModal={() => setActiveModal(null)}
                selectedTier={selectedTier}
                onSelectTier={handleSelectTier}
                bookingOccasion={bookingOccasion}
                onChangeBookingOccasion={setBookingOccasion}
                selectedExtras={selectedExtras}
                currency={currency}
                estimateDesc={estimateDesc}
                estimateTotal={estimateTotal}
                occasionKey={occasionKey}
                activeChapterIdx={activeChapterIdx}
                onSelectChapter={handleSelectChapter}
                simState={simState}
                simActions={simActions}
                cardStock={cardStock}
                onOpenBooking={handleOpenBooking}
                policyTab={policyTab}
                onSelectPolicyTab={setPolicyTab}
                showToast={showToast}
            />

            <div className={`toast ${toastMsg ? 'show' : ''}`} id="toast" role="status" aria-live="polite">
                {toastMsg}
            </div>
        </>
    );
}
