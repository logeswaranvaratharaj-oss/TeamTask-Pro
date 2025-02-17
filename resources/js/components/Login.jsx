import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import { authService } from '../services/authService';
import { FiMail, FiLock, FiTrendingUp } from 'react-icons/fi';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: 'var(--background-color)' }}>
            <Row className="w-100 justify-content-center">
                <Col md={8} lg={5} xl={4}>
                    <div className="text-center mb-4">
                        <div className="bg-primary-gradient rounded-4 d-inline-flex p-3 mb-3 shadow-lg">
                            <FiTrendingUp className="text-white" size={32} />
                        </div>
                        <h2 className="fw-bold mb-0" style={{ letterSpacing: '-0.03em' }}>NexusCRM</h2>
                        <p className="text-secondary fw-semibold small">SALES COMMAND CENTER</p>
                    </div>

                    <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                        <Card.Body className="p-4 p-md-5">
                            <h4 className="fw-bold mb-4 text-center">Welcome Back</h4>

                            {error && (
                                <Alert variant="danger" className="border-0 shadow-sm rounded-3 py-2 small" onClose={() => setError('')} dismissible>
                                    {error}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label className="small fw-bold text-secondary">CORPORATE EMAIL</Form.Label>
                                    <InputGroup className="border-2 rounded-3">
                                        <InputGroup.Text className="bg-light border-0"><FiMail className="text-muted" /></InputGroup.Text>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="border-0 bg-light p-3"
                                            placeholder="name@company.com"
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="password">
                                    <div className="d-flex justify-content-between">
                                        <Form.Label className="small fw-bold text-secondary">SECURITY KEY</Form.Label>
                                        <Link to="#" className="small text-decoration-none">Forgot Key?</Link>
                                    </div>
                                    <InputGroup className="border-2 rounded-3">
                                        <InputGroup.Text className="bg-light border-0"><FiLock className="text-muted" /></InputGroup.Text>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="border-0 bg-light p-3"
                                            placeholder="••••••••"
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100 py-3 rounded-pill fw-bold shadow-sm mb-4" disabled={loading}>
                                    {loading ? 'Authenticating...' : 'Access Pipeline'}
                                </Button>
                            </Form>

                            <div className="text-center mt-3">
                                <span className="text-muted small">New to the platform? </span>
                                <Link to="/register" className="small fw-bold text-decoration-none">Request Access</Link>
                            </div>
                        </Card.Body>
                    </Card>
                    <p className="text-center text-secondary small mt-4 opacity-50">© 2025 NexusCRM Systems v3.0.1</p>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;