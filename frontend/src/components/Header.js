import React from 'react';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  /* Extract user information from JWT token in localStorage */
  const token = localStorage.getItem('token');
  let user = null;
  if (token) {
    try {
      user = jwtDecode(token).user;
    } catch (error) {
      console.error("Invalid token");
    }
  }

  /* Handle user logout by clearing token and redirecting */
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  /* Dynamically adjust header spacer height to match fixed header to prevent layout shifts */
  React.useEffect(() => {
    function syncHeaderSpacer() {
      const header = document.querySelector('header.site-header');
      if (!header) return;
      const h = Math.ceil(header.getBoundingClientRect().height) + 2; /* Add small buffer for safety */
      document.documentElement.style.setProperty('--header-h', h + 'px');
      const spacer = document.getElementById('header-spacer');
      if (spacer) spacer.style.height = h + 'px';
    }
    const onLoad = () => {
      syncHeaderSpacer();
      let t = 0;
      const iv = setInterval(() => {
        syncHeaderSpacer(); if (++t > 10) clearInterval(iv);
      }, 100);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', syncHeaderSpacer);
      window.addEventListener('load', onLoad);
    } else {
      syncHeaderSpacer(); onLoad();
    }
    window.addEventListener('resize', syncHeaderSpacer);
    return () => {
      window.removeEventListener('resize', syncHeaderSpacer);
      window.removeEventListener('load', onLoad);
      document.removeEventListener('DOMContentLoaded', syncHeaderSpacer);
    };
  }, []);

  return (
    <>
      <style>{`
        :root { --header-h: 110px; }
        header.site-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          display: flex; align-items: center; justify-content: space-between;
          padding: 15px; background: #000; color: #fff; margin: 0;
        }
        #header-spacer { height: var(--header-h); }
        header.site-header h1 { flex: 1; text-align: center; margin: 0; }
        .user-meta { display: flex; align-items: center; gap: 10px; }
        .user-name { color: #fff; font-weight: 500; opacity: 0.6; }
        .user-divider { display: inline-block; width: 1px; height: 20px; background: #fff; opacity: 0.35; }
      `}</style>
      <header className="site-header">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" style={{ height: '80px', width: '65px', marginRight: 15 }} />
        <h1>Police Case Management</h1>
        <div className="user-meta">
          <span className="user-name">{user?.fullname || 'User'}</span>
          <span className="user-divider" />
          {user ? (
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          ) : (
            <a href="/login" className="btn btn-success">Login</a>
          )}
        </div>
      </header>
      <div id="header-spacer" />
    </>
  );
};

export default Header;