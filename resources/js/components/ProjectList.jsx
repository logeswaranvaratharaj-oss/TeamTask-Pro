import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { Container, Row, Col, Card, Badge, Button, ProgressBar, Spinner } from 'react-bootstrap';
import { FiPlus, FiCalendar, FiUsers, FiMoreHorizontal, FiFolder } from 'react-icons/fi';

const ProjectList = ({ type }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, [type]);

    const loadProjects = async () => {
        try {
            const params = type ? { type } : {};
            const data = await projectService.getProjects(params);
            setProjects(data);
        } catch (error) {
            console.error('Failed to load projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusVariant = (status) => {
        const variants = {
            planning: 'secondary',
            active: 'success',
            on_hold: 'warning',
            completed: 'primary',
        };
        return variants[status] || 'secondary';
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="projects-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">{type === 'personal' ? 'Personal Projects' : 'Team Projects'}</h2>
                    <p className="text-secondary mb-0">Manage and track your {type === 'personal' ? 'personal' : 'team'} projects</p>
                </div>
                <Link to="/projects/new" className="btn btn-primary d-flex align-items-center rounded-pill px-4 shadow-sm">
                    <FiPlus className="me-2" />
                    New Project
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-5 rounded-4 border border-dashed" style={{ backgroundColor: 'var(--surface-color)' }}>
                    <div className="mb-3 text-secondary opacity-25">
                        <FiFolder size={64} />
                    </div>
                    <h3 className="fw-bold" style={{ color: 'var(--text-primary)' }}>No projects yet</h3>
                    <p className="text-secondary mb-4">Create your first {type} project to get started</p>
                    <Link to="/projects/new" className="btn btn-primary rounded-pill px-4">
                        Create Project
                    </Link>
                </div>
            ) : (
                <Row className="g-4">
                    {projects.map((project) => (
                        <Col md={6} lg={4} key={project.id}>
                            <Card className="h-100 border-0 shadow-sm project-card hover-shadow transition-all rounded-4 overflow-hidden">
                                <Card.Body className="d-flex flex-column p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <Badge bg={getStatusVariant(project.status)} className="text-uppercase rounded-pill px-2 py-1" style={{ fontSize: '0.65rem', fontWeight: 700 }}>
                                            {project.status.replace('_', ' ')}
                                        </Badge>
                                        <Button variant="link" className="text-secondary p-0">
                                            <FiMoreHorizontal size={20} />
                                        </Button>
                                    </div>

                                    <Card.Title as="h5" className="fw-bold mb-2">
                                        <Link to={`/projects/${project.id}`} className="text-decoration-none stretched-link" style={{ color: 'var(--text-primary)' }}>
                                            {project.name}
                                        </Link>
                                    </Card.Title>

                                    <Card.Text className="text-secondary small mb-4 flex-grow-1">
                                        {project.description || 'No description provided.'}
                                    </Card.Text>

                                    <div className="mt-auto">
                                        <div className="d-flex justify-content-between align-items-center mb-2 small text-secondary fw-bold">
                                            <span>Progress</span>
                                            <span>{Math.floor(Math.random() * 100)}%</span>
                                        </div>
                                        <ProgressBar now={Math.floor(Math.random() * 100)} variant={getStatusVariant(project.status)} style={{ height: '6px' }} className="mb-4 rounded-pill bg-opacity-10 bg-secondary" />

                                        <div className="d-flex justify-content-between align-items-center border-top pt-3">
                                            <div className="d-flex align-items-center text-secondary small">
                                                <FiCalendar className="me-1" />
                                                {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'No date'}
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div className="d-flex ms-2">
                                                    {[...Array(Math.min(3, project.members?.length || 1))].map((_, i) => (
                                                        <div key={i} className="bg-primary rounded-circle border border-2 border-white d-flex align-items-center justify-content-center text-white small shadow-sm"
                                                            style={{ width: 28, height: 28, marginLeft: -10, fontSize: '10px', fontWeight: 600 }}>
                                                            {String.fromCharCode(65 + i)}
                                                        </div>
                                                    ))}
                                                    {(project.members?.length || 0) > 3 && (
                                                        <div className="bg-light rounded-circle border border-2 border-white d-flex align-items-center justify-content-center text-secondary small shadow-sm"
                                                            style={{ width: 28, height: 28, marginLeft: -10, fontSize: '10px', fontWeight: 600 }}>
                                                            +{project.members.length - 3}
                                                        </div>
                                                    )}
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