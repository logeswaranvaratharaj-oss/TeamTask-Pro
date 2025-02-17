import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { FiTrendingUp, FiDollarSign, FiTarget } from 'react-icons/fi';
import '../styles/CreateProject.css';

const CreateProject = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        name: '', // sync for compatibility
        description: '',
        type: 'team',
        pipeline_stage: 'discovery',
        deal_value: '',
        start_date: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title' || name === 'name') {
            setFormData({ ...formData, title: value, name: value });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Ensure title/name parity
            const submissionData = { ...formData, name: formData.title };
            const response = await projectService.createProject(submissionData);
            navigate(`/projects/${response.project.id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initialize deal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-project-wrapper py-5">
            <div className="form-container shadow-lg border-0 rounded-4 p-4 p-md-5 mx-auto" style={{ maxWidth: '800px', backgroundColor: 'var(--surface-color)', transition: 'all 0.3s ease' }}>
                <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-4 me-3 text-primary">
                        <FiTrendingUp size={32} />
                    </div>
                    <div>
                        <h1 className="fw-bold mb-1" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Initialize New Deal</h1>
                        <p className="text-secondary mb-0">Record a new sales opportunity in NexusCRM</p>
                    </div>
                </div>

                {error && <div className="error-message p-3 rounded-3 mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="project-form">
                    <div className="form-group mb-4">
                        <label className="fw-bold small text-uppercase text-secondary mb-2">Opportunity Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="form-control form-control-lg border-2"
                            placeholder="e.g. Enterprise Software License - Acme Corp"
                        />
                    </div>

                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="fw-bold small text-uppercase text-secondary mb-2">Deal Valuation (USD) *</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-2 border-end-0"><FiDollarSign /></span>
                                    <input
                                        type="number"
                                        name="deal_value"
                                        value={formData.deal_value}
                                        onChange={handleChange}
                                        required
                                        className="form-control form-control-lg border-2 border-start-0"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="fw-bold small text-uppercase text-secondary mb-2">Pipeline Stage *</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-2 border-end-0"><FiTarget /></span>
                                    <select
                                        name="pipeline_stage"
                                        value={formData.pipeline_stage}
                                        onChange={handleChange}
                                        required
                                        className="form-select form-control-lg border-2 border-start-0"
                                    >
                                        <option value="discovery">Discovery</option>
                                        <option value="qualified">Qualified Lead</option>
                                        <option value="proposal">Drafting Proposal</option>
                                        <option value="negotiation">Negotiation</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group mt-4 mb-4">
                        <label className="fw-bold small text-uppercase text-secondary mb-2">Opportunity Notes</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="form-control border-2"
                            placeholder="Describe the client needs, pain points, and current status..."
                        />
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="fw-bold small text-uppercase text-secondary mb-2">Account Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="form-select border-2"
                                >
                                    <option value="team">Corporate Account</option>
                                    <option value="personal">Individual Account</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="fw-bold small text-uppercase text-secondary mb-2">Projected Close Date</label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    className="form-control border-2"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions pt-4 border-top mt-4 d-flex justify-content-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/projects')}
                            className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold shadow-none"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary rounded-pill px-5 py-2 fw-semibold shadow-sm" disabled={loading}>
                            {loading ? (
                                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>
                            ) : 'Generate Deal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProject;