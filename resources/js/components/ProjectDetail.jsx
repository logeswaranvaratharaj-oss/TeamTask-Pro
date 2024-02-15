import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import TaskModal from './TaskModal';
import { Container, Row, Col, Card, Badge, Button, ProgressBar, Form, Nav, Spinner } from 'react-bootstrap';
import { FiPlus, FiTrash2, FiClock, FiCheckCircle, FiAlertCircle, FiUser } from 'react-icons/fi';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        loadProjectData();
    }, [id]);

    const loadProjectData = async () => {
        try {
            const projectData = await projectService.getProject(id);
            setProject(projectData.project);
            const tasksData = await taskService.getTasks(id);
            setTasks(tasksData);
        } catch (error) {
            console.error('Failed to load project:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = () => {
        setSelectedTask(null);
        setShowTaskModal(true);
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setShowTaskModal(true);
    };

    const handleTaskSaved = () => {
        setShowTaskModal(false);
        loadProjectData();
    };

    const handleDeleteProject = async () => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await projectService.deleteProject(id);
                navigate('/projects');
            } catch (error) {
                console.error('Failed to delete project:', error);
            }
        }
    };

    const filteredTasks = filterStatus === 'all'
        ? tasks
        : tasks.filter(task => task.status === filterStatus);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (!project) {
        return <div className="text-center py-5"><h3>Project not found</h3></div>;
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
                    <h2 className="fw-bold mb-2">{project.name}</h2>
                    <p className="text-muted mb-0">{project.description}</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-danger" onClick={handleDeleteProject}>
                        <FiTrash2 className="me-2" />
                        Delete
                    </Button>
                    <Button variant="primary" onClick={handleCreateTask}>
                        <FiPlus className="me-2" />
                        Add Task
                    </Button>
                </div>
            </div>

            <Row className="mb-5 g-3">
                <Col sm={6} md={3}>
                    <Card className="border-0 shadow-sm text-center py-3">
                        <h3 className="fw-bold text-primary">{project.stats?.total || 0}</h3>
                        <span className="text-muted small">Total Tasks</span>
                    </Card>
                </Col>
                <Col sm={6} md={3}>
                    <Card className="border-0 shadow-sm text-center py-3">
                        <h3 className="fw-bold text-success">{project.stats?.completed || 0}</h3>
                        <span className="text-muted small">Completed</span>
                    </Card>
                </Col>
                <Col sm={6} md={3}>
                    <Card className="border-0 shadow-sm text-center py-3">
                        <h3 className="fw-bold text-warning">{project.stats?.in_progress || 0}</h3>
                        <span className="text-muted small">In Progress</span>
                    </Card>
                </Col>
                <Col sm={6} md={3}>
                    <Card className="border-0 shadow-sm text-center py-3">
                        <h3 className="fw-bold text-secondary">{project.stats?.todo || 0}</h3>
                        <span className="text-muted small">To Do</span>
                    </Card>
                </Col>
            </Row>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <Nav variant="pills" activeKey={filterStatus} onSelect={(k) => setFilterStatus(k)}>
                    <Nav.Item>
                        <Nav.Link eventKey="all">All Tasks</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="todo">To Do</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="in_progress">In Progress</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="review">Review</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="completed">Completed</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>

            <Row className="g-3">
                {filteredTasks.length === 0 ? (
                    <Col xs={12}>
                        <div className="text-center py-5 border rounded bg-white">
                            <p className="text-muted mb-0">No tasks found in this category</p>
                        </div>
                    </Col>
                ) : (
                    filteredTasks.map((task) => (
                        <Col key={task.id} xs={12}>
                            <Card className="border-0 shadow-sm hover-shadow transition-all" onClick={() => handleEditTask(task)} style={{ cursor: 'pointer' }}>
                                <Card.Body className="d-flex justify-content-between align-items-center p-3">
                                    <div className="d-flex align-items-center">
                                        <Badge bg={
                                            task.priority === 'urgent' ? 'danger' :
                                                task.priority === 'high' ? 'warning' :
                                                    'info'
                                        } className="me-3 rounded-pill" style={{ width: '80px' }}>
                                            {task.priority}
                                        </Badge>
                                        <div>
                                            <h6 className="mb-0 fw-bold">{task.title}</h6>
                                            {task.assignee && (
                                                <small className="text-muted d-flex align-items-center mt-1">
                                                    <FiUser className="me-1" size={12} />
                                                    {task.assignee.name}
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-4">
                                        {task.due_date && (
                                            <span className="text-muted small d-flex align-items-center">
                                                <FiClock className="me-1" />
                                                {new Date(task.due_date).toLocaleDateString()}
                                            </span>
                                        )}
                                        <Badge bg={getStatusVariant(task.status)} pill>
                                            {task.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>

            {showTaskModal && (
                <TaskModal
                    projectId={id}
                    task={selectedTask}
                    members={project.members}
                    onClose={() => setShowTaskModal(false)}
                    onSave={handleTaskSaved}
                />
            )}
        </div>
    );
};

export default ProjectDetail;