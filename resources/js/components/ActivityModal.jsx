import React, { useState, useEffect } from 'react';
import { activityService } from '../services/activityService';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { FiClock, FiTarget, FiUser, FiZap } from 'react-icons/fi';

const ActivityModal = ({ dealId, activity, members, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'medium',
        status: 'todo',
        due_date: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (activity) {
            setFormData({
                title: activity.title || '',
                description: activity.description || '',
                assigned_to: activity.assigned_to || '',
                priority: activity.priority || 'medium',
                status: activity.status || 'todo',
                due_date: activity.due_date ? activity.due_date.split('T')[0] : '',
            });
        }
    }, [activity]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (activity) {
                await activityService.updateActivity(dealId, activity.id, formData);
            } else {
                await activityService.createActivity(dealId, formData);
            }
            onSave();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to sync activity');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Strike this activity from the audit log?')) {
            try {
                await activityService.deleteActivity(dealId, activity.id);
                onSave();
            } catch (err) {
                setError('Failed to remove activity');
            }
        }
    };

    return (
        <Modal show={true} onHide={onClose} centered size="lg" className="activity-modal">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 text-primary">
                        <FiZap size={20} />
                    </div>
                    {activity ? 'Update Sales Action' : 'Schedule New Activity'}
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body className="p-4">
                    {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

                    <Form.Group className="mb-4">
                        <Form.Label className="small fw-bold text-uppercase text-secondary">Action Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="form-control-lg border-2"
                            placeholder="e.g. Follow-up call, Send contract draft..."
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="small fw-bold text-uppercase text-secondary">Strategic Notes</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="border-2"
                            placeholder="Details about the client discussion or requirements..."
                        />
                    </Form.Group>

                    <Row className="g-4">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="small fw-bold text-uppercase text-secondary">
                                    <FiUser size={14} className="me-1" /> Account Executive
                                </Form.Label>
                                <Form.Select
                                    name="assigned_to"
                                    value={formData.assigned_to}
                                    onChange={handleChange}
                                    className="border-2"
                                >
                                    <option value="">Unassigned</option>
                                    {members?.map((member) => (
                                        <option key={member.id} value={member.id}>
                                            {member.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="small fw-bold text-uppercase text-secondary">Priority Level</Form.Label>
                                <Form.Select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="border-2"
                                >
                                    <option value="low">Low Impact</option>
                                    <option value="medium">Standard</option>
                                    <option value="high">High Velocity</option>
                                    <option value="urgent">Immediate Focus</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="g-4 mt-1">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="small fw-bold text-uppercase text-secondary">Activity Status</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="border-2"
                                >
                                    <option value="todo">Pending Action</option>
                                    <option value="in_progress">In Discussion</option>
                                    <option value="review">Internal Review</option>
                                    <option value="completed">Success / Closed</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="small fw-bold text-uppercase text-secondary">
                                    <FiClock size={14} className="me-1" /> Deadline
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    name="due_date"
                                    value={formData.due_date}
                                    onChange={handleChange}
                                    className="border-2"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="border-0 p-4 pt-0">
                    {activity && (
                        <Button variant="outline-danger" onClick={handleDelete} className="me-auto rounded-pill px-3">
                            Remove
                        </Button>
                    )}
                    <Button variant="link" onClick={onClose} className="text-secondary text-decoration-none fw-bold me-2">
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" className="rounded-pill px-4 shadow-sm" disabled={loading}>
                        {loading ? 'Syncing...' : 'Confirm Action'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ActivityModal;