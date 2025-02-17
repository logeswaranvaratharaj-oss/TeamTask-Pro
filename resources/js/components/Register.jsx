import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import { authService } from '../services/authService';
import { FiUser, FiMail, FiLock, FiTrendingUp } from 'react-icons/fi';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            await authService.register(
                formData.name,
                formData.email,
                formData.password,
                formData.password_confirmation
            );
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: 'Registration failed. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: 'var(--background-color)', padding: '2rem 0' }}>
            <Row className="w-100 justify-content-center">
                <Col md={10} lg={7} xl={6}>
                    <div className="text-center mb-4">
                        <div className="bg-primary-gradient rounded-4 d-inline-flex p-3 mb-3 shadow-lg">
                            <FiTrendingUp className="text-white" size={32} />
                        </div>
                        <h2 className="fw-bold mb-0" style={{ letterSpacing: '-0.03em' }}>NexusCRM</h2>
                        <p className="text-secondary fw-semibold small">SCALE YOUR SALES ECOSYSTEM</p>
                    </div>

                    <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                        <Card.Body className="p-4 p-md-5">
                            <h4 className="fw-bold mb-4 text-center">Create Professional Profile</h4>

                            {errors.general && (
                                <Alert variant="danger" className="border-0 shadow-sm rounded-3 px-3 py-2 small" onClose={() => setErrors({ ...errors, general: '' })} dismissible>
                                    {errors.general}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label className="small fw-bold text-secondary">FULL LEGAL NAME</Form.Label>
                                    <InputGroup className="border-2 rounded-3">
                                        <InputGroup.Text className="bg-light border-0"><FiUser className="text-muted" /></InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="border-0 bg-light p-3"
                                            placeholder="Logeswaran Varatharaj"
                                            isInvalid={!!errors.name}
                                        />
                                    </InputGroup>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name && errors.name[0]}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label className="small fw-bold text-secondary">WORK EMAIL ADDRESS</Form.Label>
                                    <InputGroup className="border-2 rounded-3">
                                        <InputGroup.Text className="bg-light border-0"><FiMail className="text-muted" /></InputGroup.Text>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="border-0 bg-light p-3"
                                            placeholder="sales@nexus-crm.com"
                                            isInvalid={!!errors.email}
                                        />
                                    </InputGroup>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email && errors.email[0]}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="password">
                                            <Form.Label className="small fw-bold text-secondary">SET PASSWORD</Form.Label>
                                            <InputGroup className="border-2 rounded-3">
                                                <InputGroup.Text className="bg-light border-0"><FiLock className="text-muted" /></InputGroup.Text>
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                    className="border-0 bg-light p-3"
                                                    placeholder="At least 8 chars"
                                                    isInvalid={!!errors.password}
                                                />
                                            </InputGroup>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4" controlId="password_confirmation">
                                            <Form.Label className="small fw-bold text-secondary">CONFIRM KEY</Form.Label>
                                            <InputGroup className="border-2 rounded-3">
                                                <InputGroup.Text className="bg-light border-0"><FiLock className="text-muted" /></InputGroup.Text>
                                                <Form.Control
                                                    type="password"
                                                    name="password_confirmation"
                                                    value={formData.password_confirmation}
                                                    onChange={handleChange}
                                                    required
                                                    className="border-0 bg-light p-3"
                                                    placeholder="Retype password"
                                                    isInvalid={!!errors.password_confirmation}
                                                />
                                            </InputGroup>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password_confirmation}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button variant="primary" type="submit" className="w-100 py-3 rounded-pill fw-bold shadow-sm mb-4" disabled={loading}>
                                    {loading ? 'Provisioning Account...' : 'Initialize Access'}
                                </Button>
                            </Form>

                            <div className="text-center">
                                <span className="text-muted small">Part of existing team? </span>
                                <Link to="/login" className="small fw-bold text-decoration-none">Sign In Here</Link>
                            </div>
                        </Card.Body>
                    </Card>
                    <p className="text-center text-secondary small mt-4 opacity-50">Industrial Grade Sales CRM Framework</p>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;