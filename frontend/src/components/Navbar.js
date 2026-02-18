import React from 'react';
import { NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
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

    /* Don't render navigation for unauthenticated users */
    if (!user) return null;

    /* Navigation links for regular police officers */
    const clientLinks = (
        <>
            <NavLink className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} to="/" end>
                <img src={`${process.env.PUBLIC_URL}/home_icon.png`} alt="Home" width={18} height={18} />
                <span>Home</span>
            </NavLink>
            <NavLink className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} to="/add">
                <img src={`${process.env.PUBLIC_URL}/add_icon.png`} alt="Add Case" width={18} height={18} />
                <span>Add Case</span>
            </NavLink>
            <NavLink className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} to="/search">
                <img src={`${process.env.PUBLIC_URL}/search_icon.png`} alt="Search Case" width={18} height={18} />
                <span>Search Case</span>
            </NavLink>
            <NavLink className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} to="/update">
                <img src={`${process.env.PUBLIC_URL}/update_icon.png`} alt="Update Case" width={18} height={18} />
                <span>Update Case</span>
            </NavLink>
            <NavLink className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} to="/report">
                <img src={`${process.env.PUBLIC_URL}/reports.png`} alt="Report" width={18} height={18} />
                <span>Report</span>
            </NavLink>
        </>
    );

    /* Navigation links for administrative users with expanded capabilities */
    const adminLinks = (
        <>
            <NavLink className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} to="/" end>
                <img src={`${process.env.PUBLIC_URL}/home_icon.png`} alt="Home" width={18} height={18} />
                <span>Home</span>
            </NavLink>
            <NavLink className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} to="/admin/add-case">
                <img src={`${process.env.PUBLIC_URL}/add_icon.png`} alt="Add Case" width={18} height={18} />
                <span>Add Case</span>
            </NavLink>
            <NavLink className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} to="/search">
                <img src={`${process.env.PUBLIC_URL}/search_icon.png`} alt="Search Case" width={18} height={18} />
                <span>Search Case</span>
            </NavLink>
            <NavLink className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} to="/admin/update-case">
                <img src={`${process.env.PUBLIC_URL}/update_icon.png`} alt="Update Case" width={18} height={18} />
                <span>Update Case</span>
            </NavLink>
            <NavLink className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} to="/admin/pending-updates">
                <img src={`${process.env.PUBLIC_URL}/pending_update_case_icon.png`} alt="Pending update Case" width={18} height={18} />
                <span>Pending update Case</span>
            </NavLink>
            <NavLink className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} to="/admin/remove-case">
                <img src={`${process.env.PUBLIC_URL}/remove_case.png`} alt="Remove Case" width={18} height={18} />
                <span>Remove Case</span>
            </NavLink>
            <NavLink className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} to="/admin/AdminRemovedCasesPage">
                <img src={`${process.env.PUBLIC_URL}/removed_case_icon.png`} alt="Removed Case" width={18} height={18} />
                <span>Removed Case</span>
            </NavLink>
            <NavLink className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} to="/admin/pending-cases">
                <img src={`${process.env.PUBLIC_URL}/pending_case_icon.png`} alt="Pending Case" width={18} height={18} />
                <span>Pending Case</span>
            </NavLink>
            <NavLink className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} to="/admin/pending-users">
                <img src={`${process.env.PUBLIC_URL}/pending_user_icon.png`} alt="Pending User" width={18} height={18} />
                <span>Pending User</span>
            </NavLink>
            <NavLink className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} to="/admin/active-users">
                <img src={`${process.env.PUBLIC_URL}/active_users_icon.png`} alt="Active Users" width={18} height={18} />
                <span>Active Users</span>
            </NavLink>
            <NavLink className={({ isActive }) => `nav-item-link${isActive ? ' active' : ''}`} to="/admin/reports">
                <img src={`${process.env.PUBLIC_URL}/reports.png`} alt="Reports" width={18} height={18} />
                <span>Reports</span>
            </NavLink>
        </>
    );

    return (
        <>
            <style>{`
              :root { --header-h: 110px; --footer-h: 60px; --sidebar-collapsed: 81px; --sidebar-expanded: 252px; }
              aside.sidebar { position: fixed; top: calc(var(--header-h) + 2px); bottom: var(--footer-h); left: 0; background: #f8f9fa; border-right: 1px solid #e5e5e5; padding: 4px 0 12px; width: var(--sidebar-collapsed); transition: width 200ms ease; overflow-x: hidden; overflow-y: auto; z-index: 999; box-sizing: border-box; }
              aside.sidebar:hover { width: var(--sidebar-expanded); }
              aside.sidebar nav { display: flex; flex-direction: column; gap: 0; padding-top: 0; }
              /* Center icon in collapsed sidebar view for proper alignment */
              a.nav-item-link { display: flex; align-items: center; gap: 7px; padding: 14px 11px; padding-left: calc((81px - 22px) / 2); color: #333; text-decoration: none; height: 50px; box-sizing: border-box; }
              a.nav-item-link:hover { background: #e9ecef; }
              a.nav-item-link span { display: none; white-space: nowrap; }
              aside.sidebar:hover a.nav-item-link span { display: inline; }
              a.nav-item-link img { display: block; margin: 0; flex: 0 0 22px; height: 22px; width: 22px; align-self: center; }
              main { margin-left: var(--sidebar-collapsed); transition: margin-left 200ms ease; }
              aside.sidebar:hover ~ main { margin-left: var(--sidebar-expanded); }
              /* Styling for currently active navigation item */
              a.nav-item-link.active { background: #6c757d; color: #fff; border-left: 3px solid #495057; }
              a.nav-item-link.active span { color: #fff; }
              a.nav-item-link.active img { filter: brightness(0) invert(1); }
            `}</style>
            <aside className="sidebar">
                <nav>
                    {user.isAdmin ? adminLinks : clientLinks}
                </nav>
            </aside>
        </>
    );
};

export default Navbar;