import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { activityService } from '../services/activityService';
import { Row, Col, Card, Badge, Spinner, Nav } from 'react-bootstrap';
import { FiClock, FiCheckCircle, FiActivity, FiTarget, FiAlertCircle } from 'react-icons/fi';

const ActivityLog = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = async () => {
        try {
            const data = await activityService.getMyActivities();
            setActivities(data);
        } catch (error) {
            console.error('Failed to load activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredActivities = activities.filter(activity => {
        if (filter === 'all') return true;
        if (filter === 'pending') return activity.status !== 'completed';
        return activity.status === filter;
    });

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="activity-log-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Sales Activity Audit</h2>
                    <p className="text-secondary mb-0">Track all milestones and actions across your sales pipeline</p>
                </div>
                <Nav variant="pills" activeKey={filter} onSelect={(k) => setFilter(k)} className="bg-light p-1 rounded-pill">
                    <Nav.Item>
                        <Nav.Link eventKey="all" className="rounded-pill px-3 py-1">All Activity</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="pending" className="rounded-pill px-3 py-1">Pending</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="completed" className="rounded-pill px-3 py-1">Completed</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>

            {filteredActivities.length === 0 ? (
                <div className="text-center py-5 rounded-4 border border-dashed" style={{ backgroundColor: 'var(--surface-color)' }}>
                    <FiActivity size={48} className="text-secondary opacity-25 mb-3" />
                    <h3 className="fw-bold">No activity found</h3>
                    <p className="text-secondary">All actions are up to date. Keep pushing for those deals!</p>
                </div>
            ) : (
                <Row className="g-4">
                    {filteredActivities.map((activity) => (
                        <Col xs={12} key={activity.id}>
                            <Card className="border-0 shadow-sm animate-hover rounded-4 overflow-hidden">
                                <Card.Body className="p-0">
                                    <Link to={`/deals/${activity.project_id}`} className="text-decoration-none d-flex align-items-stretch" style={{ color: 'inherit' }}>
                                        <div className={`p-4 bg-${activity.status === 'completed' ? 'success' : 'primary'} bg-opacity-10 d-flex align-items-center`}>
                                            {activity.status === 'completed' ?
                                                <FiCheckCircle className="text-success" size={24} /> :
                                                <FiClock className="text-primary" size={24} />
                                            }
                                        </div>
                                        <div className="p-4 flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <h5 className="fw-bold mb-1">{activity.title}</h5>
                                                    <div className="d-flex align-items-center text-secondary small">
                                                        <FiTarget className="me-1" />
                                                        <span className="fw-bold text-primary opacity-75">{activity.project?.name || 'Related Deal'}</span>
                                                        <span className="mx-2">•</span>
                                                        <FiClock className="me-1" />
                                                        <span>Due: {activity.due_date ? new Date(activity.due_date).toLocaleDateString() : 'ASAP'}</span>
                                                    </div>
                                                </div>
                                                <Badge bg={
                                                    activity.priority === 'urgent' ? 'danger' :
                                                        activity.priority === 'high' ? 'warning' :
                                                            'info'
                                                } pill className="px-3">
                                                    {activity.priority.toUpperCase()}
                                                </Badge>
                                            </div>
                                            <p className="text-secondary small mb-0 mt-2 line-clamp-1">{activity.description}</p>
                                        </div>
                                        <div className="p-4 d-none d-md-flex align-items-center border-start text-secondary">
                                            <div className="text-center" style={{ minWidth: '100px' }}>
                                                <span className="d-block small fw-bold text-uppercase opacity-50">Status</span>
                                                <span className={`small fw-bold text-${activity.status === 'completed' ? 'success' : 'warning'}`}>
                                                    {activity.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default ActivityLog;