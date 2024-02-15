import React from 'react';
import { Container, Card, Form } from 'react-bootstrap';
import { useTheme } from '../components/ThemeProvider';
import { FiMoon, FiSun } from 'react-icons/fi';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <Container className="py-4">
            <div className="settings-header mb-4">
                <h2 className="fw-bold mb-1">Settings</h2>
                <p className="text-secondary">Manage your preferences and application settings</p>
            </div>

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>Appearance</h5>
                    <div className="appearance-setting-item d-flex align-items-center justify-content-between p-3 rounded-4" style={{ backgroundColor: 'var(--background-color)' }}>
                        <div className="d-flex align-items-center">
                            <div className={`theme-icon-box p-3 rounded-circle me-3 mb-0 d-flex align-items-center justify-content-center shadow-sm ${theme === 'dark' ? 'bg-primary text-white' : 'bg-warning text-dark'}`} style={{ width: 48, height: 48 }}>
                                {theme === 'dark' ? <FiMoon size={24} /> : <FiSun size={24} />}
                            </div>
                            <div>
                                <strong className="d-block mb-1" style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>Dark Mode</strong>
                                <p className="text-secondary small mb-0">
                                    Switch between light and dark themes for your preferred viewing experience.
                                </p>
                            </div>
                        </div>
                        <Form.Check
                            type="switch"
                            id="theme-switch"
                            checked={theme === 'dark'}
                            onChange={toggleTheme}
                        />
                    </div>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm rounded-4 mt-4 overflow-hidden">
                <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>Notifications</h5>
                    <div className="text-center py-4 bg-light rounded-4 border border-dashed">
                        <p className="text-secondary mb-0">Notification settings coming soon</p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Settings;
