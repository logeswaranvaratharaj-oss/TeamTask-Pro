import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { FiFolder } from 'react-icons/fi';
import '../styles/CreateProject.css';

const CreateProject = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'team',
        status: 'planning',
        start_date: '',
        end_date: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await projectService.createProject(formData);
            navigate(`/projects/${response.project.id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-project-wrapper py-5">
            <div className="form-container shadow-lg border-0 rounded-4 p-4 p-md-5 mx-auto" style={{ maxWidth: '800px', backgroundColor: 'var(--surface-color)', transition: 'all 0.3s ease' }}>
                <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-4 me-3 text-primary">
                        <FiFolder size={32} />
                    </div>
                    <div>
                        <h1 className="fw-bold mb-1" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Create New Project</h1>
                        <p className="text-secondary mb-0">Define your project details to get started</p>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="project-form">
                    <div className="form-group">
                        <label htmlFor="name">Project Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter project name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Project Type *</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="team">Team Project</option>
                            <option value="personal">Personal Project</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Describe your project..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status *</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="planning">Planning</option>
                            <option value="active">Active</option>
                            <option value="on_hold">On Hold</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="start_date">Start Date</label>
                            <input
                                type="date"
                                id="start_date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="end_date">End Date</label>
                            <input
                                type="date"
                                id="end_date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-actions pt-4 border-top mt-4 d-flex justify-content-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/projects')}
                            className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary rounded-pill px-5 py-2 fw-semibold shadow-sm" disabled={loading}>
                            {loading ? (
                                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating...</>
                            ) : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProject;