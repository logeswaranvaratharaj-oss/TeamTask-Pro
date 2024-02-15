import React from 'react';
import { Dropdown, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
    FiHome,
    FiGrid,
    FiCheckSquare,
    FiSettings,
    FiLogOut,
    FiUser
} from 'react-icons/fi';
import { authService } from '../services/authService';

const Sidebar = () => {
    const location = useLocation();

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
            <div className="sidebar-header px-2 py-3 mb-4">
                <Link to="/dashboard" className="d-flex align-items-center link-dark text-decoration-none">
                    <div className="logo-icon bg-primary rounded-3 me-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: 36, height: 36 }}>
                        <FiCheckSquare className="text-white" size={20} />
                    </div>
                    <span className="fs-4 fw-bold text-gradient">TeamTask</span>
                </Link>
            </div>

            <Nav className="flex-column mb-auto sidebar-nav">
                <div className="nav-section-label">General</div>
                <Nav.Item className="mb-1">
                    <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
                        <FiHome className="link-icon" />
                        <span>Dashboard</span>
                    </Link>
                </Nav.Item>
                <Nav.Item className="mb-1">
                    <Link to="/projects" className={`sidebar-link ${isActive('/projects') ? 'active' : ''}`}>
                        <FiGrid className="link-icon" />
                        <span>Team Projects</span>
                    </Link>
                </Nav.Item>
                <Nav.Item className="mb-1">
                    <Link to="/my-tasks" className={`sidebar-link ${isActive('/my-tasks') ? 'active' : ''}`}>
                        <FiCheckSquare className="link-icon" />
                        <span>My Tasks</span>
                    </Link>
                </Nav.Item>

                <div className="nav-section-label mt-4">Personal Space</div>
                <Nav.Item className="mb-1">
                    <Link to="/personal-projects" className={`sidebar-link ${isActive('/personal-projects') ? 'active' : ''}`}>
                        <FiUser className="link-icon" />
                        <span>Personal projects</span>
                    </Link>
                </Nav.Item>

                <div className="nav-section-label mt-4">Preferences</div>
                <Nav.Item className="mb-1">
                    <Link to="/settings" className={`sidebar-link ${isActive('/settings') ? 'active' : ''}`}>
                        <FiSettings className="link-icon" />
                        <span>Settings</span>
                    </Link>
                </Nav.Item>
            </Nav>

            <div className="sidebar-footer mt-auto pt-4 border-top">
                <Dropdown drop="up" className="w-100 shadow-none">
                    <Dropdown.Toggle as="div" className="d-flex align-items-center text-decoration-none user-profile-link px-2 py-2 rounded-3 border-0 transition-all dropdown-toggle-custom" id="dropdown-user" style={{ cursor: 'pointer' }}>
                        <div className="user-avatar bg-primary-gradient rounded-circle d-flex align-items-center justify-content-center text-white me-2 shadow-sm" style={{ width: 36, height: 36 }}>
                            {authService.getStoredUser()?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info flex-grow-1 overflow-hidden">
                            <div className="user-name text-truncate fw-semibold" style={{ color: 'var(--text-primary)' }}>{authService.getStoredUser()?.name}</div>
                            <div className="user-role text-truncate small text-muted">Pro Plan</div>
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
