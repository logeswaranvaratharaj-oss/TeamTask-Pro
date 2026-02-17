import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dealService } from '../services/dealService';
import { activityService } from '../services/activityService';
import ActivityModal from './ActivityModal';
import { Container, Row, Col, Card, Badge, Button, ProgressBar, Form, Nav, Spinner } from 'react-bootstrap';
import { FiPlus, FiTrash2, FiClock, FiCheckCircle, FiAlertCircle, FiUser, FiTarget, FiDollarSign } from 'react-icons/fi';

const DealDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deal, setDeal] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        loadDealData();
    }, [id]);

    const loadDealData = async () => {
        try {
            const data = await dealService.getDeal(id);
            // Compatibility: backend might return { project: ... }
            setDeal(data.project || data.deal);
            const tasksData = await activityService.getActivities(id);
            setActivities(tasksData);
        } catch (error) {
            console.error('Failed to load deal:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateActivity = () => {
        setSelectedActivity(null);
        setShowActivityModal(true);
    };

    const handleEditActivity = (activity) => {
        setSelectedActivity(activity);
        setShowActivityModal(true);
    };

    const handleActivitySaved = () => {
        setShowActivityModal(false);
        loadDealData();
    };

    const handleDeleteDeal = async () => {
        if (window.confirm('Terminate this deal opportunity? This action cannot be undone.')) {
            try {
                await dealService.deleteDeal(id);
                navigate('/deals');
            } catch (error) {
                console.error('Failed to delete deal:', error);
            }
        }
    };

    const filteredActivities = filterStatus === 'all'
        ? activities
        : activities.filter(activity => activity.status === filterStatus);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (!deal) {
        return <div className="text-center py-5"><h3>Deal not found</h3></div>;
    }

    const getStatusVariant = (status) => {
        const variants = {
            todo: 'secondary',
            in_progress: 'primary',
            review: 'warning',
            completed: 'success',
        };
        return variants[status] || 'secondary';
    };

    return (
        <div className="project-detail">
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <div className="d-flex align-items-center mb-2">
                        <Badge bg="primary" className="me-2 rounded-pill px-3">
                            {deal.pipeline_stage?.replace('_', ' ').toUpperCase() || 'DISCOVERY'}
                        </Badge>
                        <span className="text-muted small fw-bold">ID: #DEAL-{deal.id}</span>
                    </div>
                    <h2 className="fw-bold mb-2">{deal.title || deal.name}</h2>
                    <p className="text-secondary mb-0" style={{ maxWidth: '600px' }}>{deal.description}</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-danger" className="rounded-pill px-3" onClick={handleDeleteDeal}>
                        <FiTrash2 className="me-2" />
                        Terminate
                    </Button>
                    <Button variant="primary" className="rounded-pill px-4 shadow-sm" onClick={handleCreateActivity}>
                        <FiPlus className="me-2" />
                        Log Activity
                    </Button>
                </div>
            </div>

            <Row className="mb-5 g-4">
                <Col md={8}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold mb-0">Sales Activity Log</h5>
                                <Nav variant="pills" activeKey={filterStatus} onSelect={(k) => setFilterStatus(k)} className="small">
                                    <Nav.Item><Nav.Link eventKey="all" className="px-3 py-1">All</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="todo" className="px-3 py-1">Pending</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="completed" className="px-3 py-1">Done</Nav.Link></Nav.Item>
                                </Nav>
                            </div>

                            <div className="activity-list">
                                {filteredActivities.length === 0 ? (
                                    <div className="text-center py-4 text-muted">No activities recorded in this category</div>
                                ) : (
                                    filteredActivities.map((activity) => (
                                        <div key={activity.id} className="d-flex align-items-center p-3 mb-2 rounded-3 hover-bg-light transition-all border-bottom" onClick={() => handleEditActivity(activity)} style={{ cursor: 'pointer' }}>
                                            <div className="me-3">
                                                {activity.status === 'completed' ?
                                                    <FiCheckCircle className="text-success" size={20} /> :
                                                    <FiClock className="text-warning" size={20} />
                                                }
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-0 fw-bold">{activity.title}</h6>
                                                <small className="text-muted">{activity.priority.toUpperCase()} PRIORITY</small>
                                            </div>
                                            <div className="text-end">
                                                <Badge bg={getStatusVariant(activity.status)} className="rounded-pill px-3">
                                                    {activity.status.replace('_', ' ')}
                                                </Badge>
                                                <div className="small text-muted mt-1">
                                                    {activity.due_date ? new Date(activity.due_date).toLocaleDateString() : 'No date'}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 mb-4">
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-4">Deal Metrics</h5>
                            <div className="mb-4 text-center py-3 bg-light rounded-4">
                                <span className="text-muted small fw-bold d-block mb-1">CONTRACT VALUATION</span>
                                <h2 className="fw-bold text-primary mb-0">
                                    ${Number(deal.deal_value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </h2>
                            </div>

                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">Pipeline Progress</span>
                                <span className="fw-bold small">{deal.stats?.completion_percentage || 0}%</span>
                            </div>
                            <ProgressBar
                                variant="success"
                                now={deal.stats?.completion_percentage || 0}
                                className="rounded-pill mb-4"
                                style={{ height: '8px' }}
                            />

                            <hr className="my-4 opacity-10" />

                            <div className="mb-3 d-flex align-items-center">
                                <FiUser className="text-secondary me-3" />
                                <div>
                                    <small className="text-muted d-block">ACCOUNT OWNER</small>
                                    <span className="fw-bold small">Logeswaran Varatharaj</span>
                                </div>
                            </div>

                            <div className="mb-0 d-flex align-items-center">
                                <FiTarget className="text-secondary me-3" />
                                <div>
                                    <small className="text-muted d-block">PRIMARY CONTACT</small>
                                    <span className="fw-bold small">{deal.contact?.name || 'Unassigned'}</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="bg-primary bg-opacity-10 border-0 rounded-4 p-3 border-start border-primary border-4">
                        <div className="d-flex">
                            <FiAlertCircle className="text-primary me-2 mt-1" />
                            <div>
                                <h6 className="fw-bold text-primary mb-1 small">Account Status</h6>
                                <p className="mb-0 small text-primary opacity-75">This deal is currently in the **{deal.pipeline_stage || 'discovery'}** stage of the sales ecosystem.</p>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {showActivityModal && (
                <ActivityModal
                    dealId={id}
                    activity={selectedActivity}
                    members={deal.members || []}
                    onClose={() => setShowActivityModal(false)}
                    onSave={handleActivitySaved}
                />
            )}
        </div>
    );
};

export default DealDetail;