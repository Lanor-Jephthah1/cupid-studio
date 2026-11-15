import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import './styles/base.css';
import './styles/hero-card.css';
import './styles/sections.css';
import './styles/simulator.css';
import './styles/pricing.css';
import './styles/modals.css';
import './styles/responsive.css';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
