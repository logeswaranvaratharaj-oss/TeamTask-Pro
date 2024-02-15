import React from 'react';
import { Container } from 'react-bootstrap';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ marginLeft: 'var(--sidebar-width)', minHeight: '100vh', backgroundColor: 'var(--background-color)' }}>
                <Container fluid className="p-4">
                    {children}
                </Container>
            </div>
        </div>
    );
};

export default Layout;