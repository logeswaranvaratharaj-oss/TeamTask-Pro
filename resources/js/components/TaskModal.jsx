import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';

const TaskModal = ({ projectId, task, members, onClose, onSave }) => {
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
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                assigned_to: task.assigned_to || '',
                priority: task.priority || 'medium',
                status: task.status || 'todo',
                due_date: task.due_date || '',
            });
        }
    }, [task]);

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
            if (task) {
                await taskService.updateTask(projectId, task.id, formData);
            } else {
                await taskService.createTask(projectId, formData);
            }
            onSave();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(projectId, task.id);
                onSave();
            } catch (err) {
                setError('Failed to delete task');
            }
        }
    };

    return (
        <Modal show={true} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{task ? 'Edit Task' : 'Create New Task'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form.Group className="mb-3">
                        <Form.Label>Task Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter task title"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Task details..."
                        />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Assign To</Form.Label>
                                <Form.Select
                                    name="assigned_to"
                                    value={formData.assigned_to}
                                    onChange={handleChange}
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
                            <Form.Group className="mb-3">
                                <Form.Label>Priority</Form.Label>
                                <Form.Select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="review">Review</option>
                                    <option value="completed">Completed</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Due Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="due_date"
                                    value={formData.due_date}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    {task && (
                        <Button variant="danger" onClick={handleDelete} className="me-auto">
                            Delete
                        </Button>
                    )}
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default TaskModal;