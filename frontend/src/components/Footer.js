import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Footer = () => {
  /* Show issue reporting link only on public authentication pages */
  const location = useLocation();
  const showReportLink = location && (location.pathname === '/login' || location.pathname === '/register');
  React.useEffect(() => {
    /* Dynamically adjust footer spacer height to match fixed footer to prevent layout shifts */
    function syncFooterSpacer() {
      const f = document.querySelector('footer.site-footer');
      if (!f) return;
      const h = Math.ceil(f.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--footer-h', h + 'px');
      const sp = document.getElementById('footer-spacer');
      if (sp) sp.style.height = h + 'px';
    }
    const onLoad = () => {
      syncFooterSpacer();
      let t = 0; const iv = setInterval(() => { syncFooterSpacer(); if (++t > 10) clearInterval(iv); }, 100);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', syncFooterSpacer);
      window.addEventListener('load', onLoad);
    } else {
      syncFooterSpacer(); onLoad();
    }
    window.addEventListener('resize', syncFooterSpacer);
    return () => {
      window.removeEventListener('resize', syncFooterSpacer);
      window.removeEventListener('load', onLoad);
      document.removeEventListener('DOMContentLoaded', syncFooterSpacer);
    };
  }, []);

  return (
    <>
      <style>{`
        :root { --footer-h: 60px; }
        #footer-spacer { height: var(--footer-h); }
        footer.site-footer { position: fixed; left: 0; right: 0; bottom: 0; z-index: 1001; width: 100%; }
      `}</style>
      <div id="footer-spacer" />
      <footer className="site-footer bg-dark text-white text-center p-3">
        <p className="m-0"> 2025 All rights reserved. Developed by PVD</p>
        {showReportLink && (
          <p>Having issues? <Link to="/report-issue" className="text-white text-decoration-underline">Report here</Link>.</p>
        )}
      </footer>
    </>
  );
};

export default Footer;