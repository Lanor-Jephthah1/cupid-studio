import React, { useEffect, useState } from 'react';

const NAV_ITEMS = [
    { id: 'hero', label: 'Home' },
    { id: 'craft', label: 'Why Us' },
    { id: 'repertoire', label: 'What We Make' },
    { id: 'occasions', label: 'Live Samples' },
    { id: 'showcase', label: 'How It Arrives' },
    { id: 'rates', label: 'Pricing' }
];

export default function Navbar({ onOpenBooking }) {
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const sections = NAV_ITEMS.map(item => document.getElementById(item.id)).filter(Boolean);
        if (!('IntersectionObserver' in window) || !sections.length) return;

        const obs = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-25% 0px -65% 0px' }
        );

        sections.forEach(sec => obs.observe(sec));
        return () => obs.disconnect();
    }, []);

    return (
        <nav className="studio-nav" aria-label="Studio navigation">
            <div className="studio-nav-inner">
                <div className="nav-brand">
                    <a href="#hero" className="nav-brand-link">
                        <strong>Cupid<span>.</span></strong>
                        <span className="nav-origin">Ghana &middot; Worldwide</span>
                    </a>
                </div>
                <div className="nav-links">
                    {NAV_ITEMS.map(item => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            data-section={item.id}
                            className={activeSection === item.id ? 'active' : ''}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
                <div className="nav-actions">
                    <button
                        className="btn btn-ink nav-commission-btn"
                        type="button"
                        onClick={() => onOpenBooking('')}
                    >
                        Start a Page
                    </button>
                </div>
            </div>
        </nav>
    );
}
