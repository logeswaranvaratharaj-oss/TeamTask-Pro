import React, { useState, useEffect } from 'react';
import { dealService } from '../services/dealService';
import { Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import { FiPlus, FiMail, FiPhone, FiTarget, FiUser } from 'react-icons/fi';

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            const data = await dealService.getContacts();
            setContacts(data);
        } catch (error) {
            console.error('Failed to load contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="contacts-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Contacts</h2>
                    <p className="text-secondary mb-0">Manage your client relationships and accounts</p>
                </div>
                <Button className="btn btn-primary d-flex align-items-center rounded-pill px-4 shadow-sm animate-hover">
                    <FiPlus className="me-2" />
                    New Contact
                </Button>
            </div>

            <Row className="g-4">
                {contacts.length === 0 ? (
                    <Col xs={12}>
                        <div className="text-center py-5 rounded-4 border border-dashed" style={{ backgroundColor: 'var(--surface-color)' }}>
                            <FiUser size={48} className="text-secondary opacity-25 mb-3" />
                            <h3 className="fw-bold">No contacts found</h3>
                            <p className="text-secondary">Start by adding your first client contact.</p>
                        </div>
                    </Col>
                ) : (
                    contacts.map((contact) => (
                        <Col md={6} lg={4} key={contact.id}>
                            <Card className="h-100 border-0 shadow-sm animate-hover rounded-4 overflow-hidden">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle me-3">
                                            <FiUser size={24} />
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-0">{contact.name}</h5>
                                            <span className="text-secondary small">{contact.job_title} at {contact.company}</span>
                                        </div>
                                    </div>

                                    <div className="contact-details">
                                        <div className="d-flex align-items-center mb-2 text-secondary small">
                                            <FiMail className="me-2" />
                                            {contact.email || 'No email provided'}
                                        </div>
                                        <div className="d-flex align-items-center mb-3 text-secondary small">
                                            <FiPhone className="me-2" />
                                            {contact.phone || 'No phone provided'}
                                        </div>
                                    </div>

                                    <div className="pt-3 border-top mt-auto">
                                        <Button variant="link" className="p-0 text-decoration-none small fw-bold text-primary d-flex align-items-center">
                                            <FiTarget size={14} className="me-1" />
                                            View Related Deals
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </div>
    );
};

export default ContactList;
