import React from 'react';
import { Dropdown, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
    FiHome,
    FiBarChart2,
    FiZap,
    FiSettings,
    FiLogOut,
    FiUsers,
    FiTrendingUp,
    FiMoon,
    FiSun,
    FiTarget
} from 'react-icons/fi';
import { authService } from '../services/authService';
import { useTheme } from './ThemeProvider';

const Sidebar = () => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = async () => {
        await authService.logout();
        window.location.href = '/login';
    };

    return (
        <div className="sidebar-container d-flex flex-column flex-shrink-0 p-3"
            style={{
                width: 'var(--sidebar-width)',
                height: '100vh',
                borderRight: '1px solid var(--border-color)',
                position: 'fixed',
                left: 0,
                top: 0,
                backgroundColor: 'var(--surface-color)',
                transition: 'all 0.3s ease',
                zIndex: 1000
            }}>
            <div className="sidebar-header px-2 py-3 mb-4 d-flex align-items-center justify-content-between">
                <Link to="/dashboard" className="d-flex align-items-center link-dark text-decoration-none" style={{ color: 'inherit' }}>
                    <div className="logo-icon bg-primary-gradient rounded-3 me-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: 40, height: 40 }}>
                        <FiTrendingUp className="text-white" size={24} />
                    </div>
                    <div>
                        <span className="fs-4 fw-bold text-gradient d-block">NexusCRM</span>
                        <span className="text-muted small fw-bold" style={{ fontSize: '0.65rem', marginTop: '-4px', display: 'block' }}>SALES ACCELERATOR</span>
                    </div>
                </Link>
            </div>

            <Nav className="flex-column mb-auto sidebar-nav">
                <div className="nav-section-label">Overview</div>
                <Nav.Item className="mb-1">
                    <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
                        <FiHome className="link-icon" />
                        <span>Sales Insights</span>
                    </Link>
                </Nav.Item>

                <div className="nav-section-label mt-4">Growth</div>
                <Nav.Item className="mb-1">
                    <Link to="/deals" className={`sidebar-link ${isActive('/deals') ? 'active' : ''}`}>
                        <FiBarChart2 className="link-icon" />
                        <span>Sales Pipeline</span>
                    </Link>
                </Nav.Item>
                <Nav.Item className="mb-1">
                    <Link to="/leads" className={`sidebar-link ${isActive('/leads') ? 'active' : ''}`}>
                        <FiTarget className="link-icon" />
                        <span>Prospect Leads</span>
                    </Link>
                </Nav.Item>
                <Nav.Item className="mb-1">
                    <Link to="/contacts" className={`sidebar-link ${isActive('/contacts') ? 'active' : ''}`}>
                        <FiUsers className="link-icon" />
                        <span>Contacts Hub</span>
                    </Link>
                </Nav.Item>

                <div className="nav-section-label mt-4">Operations</div>
                <Nav.Item className="mb-1">
                    <Link to="/my-tasks" className={`sidebar-link ${isActive('/my-tasks') ? 'active' : ''}`}>
                        <FiZap className="link-icon" />
                        <span>Activity Audit</span>
                    </Link>
                </Nav.Item>

                <div className="nav-section-label mt-4">System</div>
                <Nav.Item className="mb-1">
                    <Link to="/settings" className={`sidebar-link ${isActive('/settings') ? 'active' : ''}`}>
                        <FiSettings className="link-icon" />
                        <span>Preference Center</span>
                    </Link>
                </Nav.Item>
            </Nav>

            <div className="sidebar-footer mt-auto pt-4 border-top">
                <div className="theme-toggle-wrapper px-2 mb-3">
                    <button
                        onClick={toggleTheme}
                        className="btn w-100 d-flex align-items-center justify-content-between rounded-3 border-0 py-2 transition-all px-3"
                        style={{
                            backgroundColor: 'var(--background-color)',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}
                    >
                        <div className="d-flex align-items-center">
                            {theme === 'dark' ? <FiMoon className="me-2 text-primary" /> : <FiSun className="me-2 text-warning" />}
                            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                        </div>
                        <div className={`form-check form-switch mb-0`}>
                            <input className="form-check-input" type="checkbox" checked={theme === 'dark'} readOnly style={{ cursor: 'pointer' }} />
                        </div>
                    </button>
                </div>

                <Dropdown drop="up" className="w-100 shadow-none">
                    <Dropdown.Toggle as="div" className="d-flex align-items-center text-decoration-none user-profile-link px-2 py-2 rounded-3 border-0 transition-all dropdown-toggle-custom" id="dropdown-user" style={{ cursor: 'pointer' }}>
                        <div className="user-avatar bg-primary-gradient rounded-circle d-flex align-items-center justify-content-center text-white me-2 shadow-sm" style={{ width: 36, height: 36 }}>
                            {authService.getStoredUser()?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info flex-grow-1 overflow-hidden">
                            <div className="user-name text-truncate fw-semibold" style={{ color: 'var(--text-primary)' }}>{authService.getStoredUser()?.name}</div>
                            <div className="user-role text-truncate small text-muted">Sales Executive</div>
                        </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="shadow-lg border-0 rounded-4 p-2 mb-2 w-100" style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)' }}>
                        <Dropdown.Item onClick={handleLogout} className="rounded-3 py-2 d-flex align-items-center text-danger">
                            <FiLogOut className="me-2" />
                            <span>Sign out</span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
};

export default Sidebar;
