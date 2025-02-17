import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import { FiPlus, FiCalendar, FiDollarSign, FiMoreHorizontal, FiBarChart2, FiUsers } from 'react-icons/fi';

const ProjectList = ({ type }) => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDeals();
    }, [type]);

    const loadDeals = async () => {
        try {
            const params = type ? { type } : {};
            const data = await projectService.getProjects(params);
            setDeals(data);
        } catch (error) {
            console.error('Failed to load deals:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStageVariant = (stage) => {
        const variants = {
            discovery: 'secondary',
            qualified: 'info',
            proposal: 'warning',
            negotiation: 'warning',
            closed_won: 'success',
            closed_lost: 'danger',
        };
        return variants[stage] || 'secondary';
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
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
            <div className="d-flex justify-content-between align-items-center mb-4 text-white p-4 rounded-4 shadow-sm" style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))' }}>
                <div>
                    <h2 className="fw-bold mb-1 text-white">{type === 'personal' ? 'Private Leads' : 'Sales Pipeline'}</h2>
                    <p className="mb-0 overflow-hidden text-truncate opacity-75">Track and manage your {type === 'personal' ? 'individual' : 'organization'} deals</p>
                </div>
                <Link to="/projects/new" className="btn btn-light d-flex align-items-center rounded-pill px-4 shadow-sm fw-bold" style={{ color: 'var(--primary-color)' }}>
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
                    <Link to="/projects/new" className="btn btn-primary rounded-pill px-4">
                        Launch New Deal
                    </Link>
                </div>
            ) : (
                <Row className="g-4">
                    {deals.map((deal) => (
                        <Col md={6} lg={4} key={deal.id}>
                            <Card className="h-100 border-0 shadow-sm deal-card hover-shadow transition-all rounded-4 overflow-hidden border-top border-5" style={{ borderColor: `var(--bs-${getStageVariant(deal.pipeline_stage)})` }}>
                                <Card.Body className="d-flex flex-column p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <Badge bg={getStageVariant(deal.pipeline_stage)} className="text-uppercase rounded-pill px-3 py-1" style={{ fontSize: '0.65rem', fontWeight: 800 }}>
                                            {deal.pipeline_stage?.replace('_', ' ') || 'DISCOVERY'}
                                        </Badge>
                                        <Button variant="link" className="text-secondary p-0">
                                            <FiMoreHorizontal size={20} />
                                        </Button>
                                    </div>

                                    <Card.Title as="h5" className="fw-bold mb-1">
                                        <Link to={`/projects/${deal.id}`} className="text-decoration-none stretched-link" style={{ color: 'var(--text-primary)' }}>
                                            {deal.title || deal.name}
                                        </Link>
                                    </Card.Title>
                                    <div className="d-flex align-items-center text-success fw-bold mb-3">
                                        <FiDollarSign size={14} className="me-1" />
                                        <span>{formatCurrency(deal.deal_value || 0)}</span>
                                    </div>

                                    <Card.Text className="text-secondary small mb-4 flex-grow-1 line-clamp-2">
                                        {deal.description || 'No deal description provided.'}
                                    </Card.Text>

                                    <div className="mt-auto">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-2">
                                                <FiUsers size={14} className="text-primary" />
                                            </div>
                                            <span className="small text-secondary fw-semibold">{deal.contact?.name || 'Unassigned Contact'}</span>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center border-top pt-3">
                                            <div className="d-flex align-items-center text-secondary small">
                                                <FiCalendar className="me-1" />
                                                {deal.updated_at ? new Date(deal.updated_at).toLocaleDateString() : 'Active'}
                                            </div>
                                            <div className="user-avatars d-flex">
                                                <div className="bg-primary rounded-circle border border-2 border-white d-flex align-items-center justify-content-center text-white small shadow-sm"
                                                    style={{ width: 28, height: 28, fontSize: '10px', fontWeight: 600 }}>
                                                    {deal.owner?.name?.charAt(0) || 'U'}
                                                </div>
                                            </div>
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

export default ProjectList;