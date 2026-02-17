import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { Card, Row, Col, Table, Badge, Spinner } from 'react-bootstrap';
import {
    FiBarChart2,
    FiUsers,
    FiActivity,
    FiDollarSign,
    FiPlus,
    FiTrendingUp
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

const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card className="stat-card border-0 shadow-sm h-100 animate-hover">
        <Card.Body className="d-flex align-items-center">
            <div className={`stat-icon-wrapper p-3 me-3 bg-${color} bg-opacity-10 text-${color} rounded-4 shadow-sm`}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <div>
                <h6 className="text-secondary mb-1 text-uppercase small fw-bold" style={{ letterSpacing: '0.05em' }}>{title}</h6>
                <h3 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>{value}</h3>
                {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
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

    const { stats, recent_tasks, pipeline_data } = dashboardData;

    // Format currency
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    // Prepare chart data
    const chartData = (pipeline_data && pipeline_data.length > 0) ? pipeline_data.map(item => ({
        name: item.stage.charAt(0).toUpperCase() + item.stage.slice(1).replace('_', ' '),
        value: parseFloat(item.value) || 0,
        count: item.count
    })) : [
        { name: 'Prospecting', value: 5000, count: 2 },
        { name: 'Qualified', value: 8500, count: 3 },
        { name: 'Proposal', value: 12000, count: 1 },
        { name: 'Negotiation', value: 0, count: 0 },
        { name: 'Closed', value: 25000, count: 5 },
    ];

    const COLORS = ['#10b981', '#059669', '#047857', '#065f46', '#064e3b'];

    return (
        <div className="dashboard-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Sales Insights</h2>
                    <p className="text-muted mb-0">Overview of your sales performance and pipeline</p>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/contacts/new" className="btn btn-outline-primary rounded-pill px-4 fw-semibold shadow-sm">
                        Add Contact
                    </Link>
                    <Link to="/deals/new" className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm animate-hover">
                        <FiPlus className="me-2" />
                        Create Deal
                    </Link>
                </div>
            </div>

            <Row className="g-4 mb-4">
                <Col md={6} xl={3}>
                    <StatCard
                        title="Total Pipeline Value"
                        value={formatCurrency(stats.total_revenue || 0)}
                        icon={<FiDollarSign />}
                        color="success"
                        subtitle="Projected revenue"
                    />
                </Col>
                <Col md={6} xl={3}>
                    <StatCard
                        title="Active Deals"
                        value={stats.deals_count}
                        icon={<FiBarChart2 />}
                        color="primary"
                        subtitle="Deals in progress"
                    />
                </Col>
                <Col md={6} xl={3}>
                    <StatCard
                        title="Total Contacts"
                        value={stats.contacts_count}
                        icon={<FiUsers />}
                        color="info"
                        subtitle="Unique clients"
                    />
                </Col>
                <Col md={6} xl={3}>
                    <StatCard
                        title="Action Items"
                        value={stats.my_tasks_count}
                        icon={<FiActivity />}
                        color="warning"
                        subtitle={`${stats.overdue_activities || 0} overdue`}
                    />
                </Col>
            </Row>

            <Row className="g-4">
                <Col lg={8}>
                    <Card className="border-0 shadow-sm h-100 overflow-hidden">
                        <Card.Header className="py-3 border-0 d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--surface-color)' }}>
                            <div className="d-flex align-items-center">
                                <FiBarChart2 className="text-primary me-2" />
                                <h5 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>Sales Pipeline Hierarchy</h5>
                            </div>
                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">By Valuation</span>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <div style={{ height: '350px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                        <XAxis type="number" axisLine={false} tickLine={false} hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} style={{ fontSize: '0.8rem', fontWeight: 600 }} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', shadow: 'var(--shadow-md)' }}
                                            formatter={(value) => formatCurrency(value)}
                                        />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="border-0 shadow-sm h-100 overflow-hidden">
                        <Card.Header className="py-3 border-0 d-flex align-items-center" style={{ backgroundColor: 'var(--surface-color)' }}>
                            <FiActivity className="text-primary me-2" />
                            <h5 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>Recent Activities</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {recent_tasks && recent_tasks.length > 0 ? (
                                <div className="activity-list p-2">
                                    {recent_tasks.map((task) => (
                                        <div key={task.id} className="d-flex p-3 mb-2 rounded-3 hover-bg-light transition-all">
                                            <div className={`activity-icon p-2 rounded-circle me-3 d-flex align-items-center justify-content-center bg-${task.status === 'completed' ? 'success' : 'primary'} bg-opacity-10`}>
                                                <FiTrendingUp size={16} className={`text-${task.status === 'completed' ? 'success' : 'primary'}`} />
                                            </div>
                                            <div className="flex-grow-1 overflow-hidden">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <h6 className="mb-1 fw-bold text-truncate" style={{ fontSize: '0.9rem' }}>{task.title}</h6>
                                                    <small className="text-muted ms-2" style={{ fontSize: '0.7rem' }}>Now</small>
                                                </div>
                                                <p className="text-muted small mb-0 text-truncate">Deal: {task.deal?.title || 'Unknown'}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="p-3 pt-0 mt-3 text-center">
                                        <Link to="/my-tasks" className="text-decoration-none small fw-bold text-primary">View Full Audit Log</Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <p className="text-muted mb-0">No recent activity detected</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;