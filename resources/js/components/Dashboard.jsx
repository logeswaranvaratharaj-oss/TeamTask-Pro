import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { Card, Row, Col, Table, Badge, Spinner } from 'react-bootstrap';
import {
    FiFolder,
    FiCheckCircle,
    FiClock,
    FiAlertCircle,
    FiPlus
} from 'react-icons/fi';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const StatCard = ({ title, value, icon, color }) => (
    <Card className="stat-card border-0 shadow-sm h-100">
        <Card.Body className="d-flex align-items-center">
            <div className={`stat-icon-wrapper p-3 me-3 bg-${color}-subtle text-${color} rounded-4 shadow-sm`}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <div>
                <h6 className="text-secondary mb-1 text-uppercase small fw-bold" style={{ letterSpacing: '0.05em' }}>{title}</h6>
                <h3 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>{value}</h3>
            </div>
        </Card.Body>
    </Card>
);

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const data = await dashboardService.getDashboardData();
            setDashboardData(data);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
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

    const { stats, recent_tasks } = dashboardData;

    // Prepare chart data
    const chartData = [
        { name: 'Active', value: stats.projects_count || 0, color: '#4f46e5' },
        { name: 'Completed', value: stats.completed_tasks_count || 0, color: '#10b981' },
        { name: 'Pending', value: stats.my_tasks_count || 0, color: '#f59e0b' },
        { name: 'Overdue', value: stats.overdue_tasks_count || 0, color: '#ef4444' },
    ];

    return (
        <div className="dashboard-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Dashboard</h2>
                    <p className="text-muted mb-0">Overview of your productivity</p>
                </div>
                <Link to="/projects/new" className="btn btn-primary d-flex align-items-center">
                    <FiPlus className="me-2" />
                    New Project
                </Link>
            </div>

            <Row className="g-4 mb-4">
                <Col md={6} xl={3}>
                    <StatCard
                        title="Active Projects"
                        value={stats.projects_count}
                        icon={<FiFolder />}
                        color="primary"
                    />
                </Col>
                <Col md={6} xl={3}>
                    <StatCard
                        title="Tasks Completed"
                        value={stats.completed_tasks_count}
                        icon={<FiCheckCircle />}
                        color="success"
                    />
                </Col>
                <Col md={6} xl={3}>
                    <StatCard
                        title="My Pending Tasks"
                        value={stats.my_tasks_count}
                        icon={<FiClock />}
                        color="warning"
                    />
                </Col>
                <Col md={6} xl={3}>
                    <StatCard
                        title="Overdue Tasks"
                        value={stats.overdue_tasks_count}
                        icon={<FiAlertCircle />}
                        color="danger"
                    />
                </Col>
            </Row>

            <Row className="g-4">
                <Col lg={8}>
                    <Card className="border-0 shadow-sm overflow-hidden">
                        <Card.Header className="py-3 border-0 d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--surface-color)' }}>
                            <h5 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>Recent Activity</h5>
                            <Link to="/my-tasks" className="text-decoration-none small fw-bold text-primary px-3 py-1 rounded-pill bg-primary bg-opacity-10 hover-bg-opacity-20 transition-all">View All</Link>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {recent_tasks && recent_tasks.length > 0 ? (
                                <div className="table-responsive">
                                    <Table hover className="mb-0 align-middle custom-table">
                                        <thead>
                                            <tr>
                                                <th className="border-0 ps-4 py-3 text-secondary">Task</th>
                                                <th className="border-0 py-3 text-secondary">Project</th>
                                                <th className="border-0 py-3 text-secondary">Priority</th>
                                                <th className="border-0 py-3 text-secondary">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recent_tasks.map((task) => (
                                                <tr key={task.id}>
                                                    <td className="ps-4 fw-medium text-dark">{task.title}</td>
                                                    <td className="text-muted small">{task.project?.name}</td>
                                                    <td>
                                                        <Badge bg={
                                                            task.priority === 'high' ? 'danger' :
                                                                task.priority === 'medium' ? 'warning' : 'info'
                                                        } className="text-uppercase" style={{ fontSize: '0.7rem' }}>
                                                            {task.priority}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Badge bg={
                                                            task.status === 'completed' ? 'success' :
                                                                task.status === 'in_progress' ? 'primary' : 'secondary'
                                                        } className="text-capitalize" style={{ fontSize: '0.7rem' }}>
                                                            {task.status.replace('_', ' ')}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <p className="text-muted mb-0">No recent activity found</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="border-0 shadow-sm h-100 overflow-hidden">
                        <Card.Header className="py-3 border-0" style={{ backgroundColor: 'var(--surface-color)' }}>
                            <h5 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>Overview</h5>
                        </Card.Header>
                        <Card.Body>
                            <div style={{ height: '300px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;