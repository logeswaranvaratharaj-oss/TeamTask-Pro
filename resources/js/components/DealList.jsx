import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dealService } from '../services/dealService';
import { Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { FiPlus, FiClock, FiBarChart2 } from 'react-icons/fi';

const DealList = ({ type }) => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDeals();
    }, [type]);

    const loadDeals = async () => {
        setLoading(true);
        try {
            const data = await dealService.getDeals({ type });
            setDeals(data);
        } catch (error) {
            console.error('Failed to load deals:', error);
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
        <div className="deals-container">
            <div className="bg-primary-gradient p-5 rounded-4 mb-4 shadow-lg text-white d-flex justify-content-between align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                    <h2 className="fw-bold mb-1 text-white">{type === 'personal' ? 'Private Leads' : 'Sales Pipeline'}</h2>
                    <p className="mb-0 overflow-hidden text-truncate opacity-75">Track and manage your {type === 'personal' ? 'individual' : 'organization'} deals</p>
                </div>
                <Link to="/deals/new" className="btn btn-light d-flex align-items-center rounded-pill px-4 shadow-sm fw-bold" style={{ color: 'var(--primary-color)' }}>
                    <FiPlus className="me-2" />
                    Create Deal
                </Link>
            </div>

            {deals.length === 0 ? (
                <div className="text-center py-5 rounded-4 border border-dashed" style={{ backgroundColor: 'var(--surface-color)' }}>
                    <div className="mb-3 text-secondary opacity-25">
                        <FiBarChart2 size={64} />
                    </div>
                    <h3 className="fw-bold" style={{ color: 'var(--text-primary)' }}>Pipeline is Empty</h3>
                    <p className="text-secondary mb-4">Start generating revenue by creating your first deal.</p>
                    <Link to="/deals/new" className="btn btn-primary rounded-pill px-4">
                        Launch New Deal
                    </Link>
                </div>
            ) : (
                <Row className="g-4">
                    {deals.map((deal) => (
                        <Col md={6} lg={4} key={deal.id}>
                            <Card className="h-100 border-0 shadow-sm animate-hover rounded-4 overflow-hidden position-relative">
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <Badge bg="success" className="bg-opacity-10 text-success rounded-pill px-3 py-2 small">
                                            {deal.pipeline_stage?.toUpperCase().replace('_', ' ') || 'DISCOVERY'}
                                        </Badge>
                                        <div className="deal-value fw-bold text-primary">
                                            ${Number(deal.deal_value || 0).toLocaleString()}
                                        </div>
                                    </div>

                                    <Card.Title as="h5" className="fw-bold mb-1">
                                        <Link to={`/deals/${deal.id}`} className="text-decoration-none stretched-link" style={{ color: 'var(--text-primary)' }}>
                                            {deal.title || deal.name}
                                        </Link>
                                    </Card.Title>
                                    <Card.Text className="text-secondary small mb-4 text-truncate-2" style={{ height: '3em' }}>
                                        {deal.description || 'No strategy defined for this opportunity.'}
                                    </Card.Text>

                                    <div className="deal-footer pt-3 border-top mt-auto d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-primary-gradient rounded-circle d-flex align-items-center justify-content-center text-white me-2 shadow-sm" style={{ width: 28, height: 28, fontSize: '0.75rem' }}>
                                                {deal.owner?.name?.charAt(0) || 'U'}
                                            </div>
                                            <span className="small text-muted fw-semibold">{deal.contact?.name || 'Prospect'}</span>
                                        </div>
                                        <div className="text-muted small d-flex align-items-center">
                                            <FiClock className="me-1" />
                                            {deal.due_date ? new Date(deal.due_date).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default DealList;