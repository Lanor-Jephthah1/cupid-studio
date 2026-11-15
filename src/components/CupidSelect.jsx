import React, { useState, useEffect, useRef } from 'react';
import { playChime } from '../utils/sound';

export default function CupidSelect({
    id,
    value,
    options,
    onChange,
    mini = false,
    ariaLabel
}) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onDocClick = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('pointerdown', onDocClick);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onDocClick);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    const handlePick = (opt) => {
        onChange(opt);
        setOpen(false);
        playChime('flip');
    };

    return (
        <div
            ref={wrapRef}
            className={`cupid-select ${mini ? 'cupid-select--mini' : ''} ${open ? 'open is-open' : ''}`}
            id={id}
        >
            <button
                className="cupid-select-trigger"
                id={id ? `${id}Btn` : undefined}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={ariaLabel}
                onClick={() => setOpen(o => !o)}
            >
                <span className="cupid-select-label">{value}</span>
                <svg className="cupid-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                        d="M4 6l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            <div className="cupid-select-menu" role="listbox">
                {options.map(opt => {
                    const isSelected = opt === value;
                    return (
                        <button
                            key={opt}
                            type="button"
                            className={`cupid-option ${isSelected ? 'selected is-selected' : ''}`}
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => handlePick(opt)}
                        >
                            <span>{opt}</span>
                            {isSelected && <span className="cupid-opt-check" aria-hidden="true">&#10003;</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
