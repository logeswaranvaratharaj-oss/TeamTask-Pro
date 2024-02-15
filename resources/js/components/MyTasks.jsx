import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/taskService';
import '../styles/MyTasks.css';

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await taskService.getMyTasks();
            setTasks(data);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return task.status === filter;
    });

    const groupTasksByPriority = (tasks) => {
        return {
            urgent: tasks.filter(t => t.priority === 'urgent'),
            high: tasks.filter(t => t.priority === 'high'),
            medium: tasks.filter(t => t.priority === 'medium'),
            low: tasks.filter(t => t.priority === 'low'),
        };
    };

    const groupedTasks = groupTasksByPriority(filteredTasks);

    if (loading) {
        return <div className="loading">Loading your tasks...</div>;
    }

    return (
        <div className="my-tasks">
            <div className="page-header">
                <h1>My Tasks</h1>
                <div className="task-filters">
                    <button
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={filter === 'todo' ? 'active' : ''}
                        onClick={() => setFilter('todo')}
                    >
                        To Do
                    </button>
                    <button
                        className={filter === 'in_progress' ? 'active' : ''}
                        onClick={() => setFilter('in_progress')}
                    >
                        In Progress
                    </button>
                    <button
                        className={filter === 'completed' ? 'active' : ''}
                        onClick={() => setFilter('completed')}
                    >
                        Completed
                    </button>
                </div>
            </div>

            {filteredTasks.length === 0 ? (
                <div className="empty-state">
                    <h3>No tasks found</h3>
                    <p>You don't have any tasks assigned yet</p>
                </div>
            ) : (
                <div className="tasks-sections">
                    {groupedTasks.urgent.length > 0 && (
                        <div className="task-section">
                            <h2 className="section-title urgent">🔥 Urgent</h2>
                            <div className="tasks-grid">
                                {groupedTasks.urgent.map(task => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                            </div>
                        </div>
                    )}

                    {groupedTasks.high.length > 0 && (
                        <div className="task-section">
                            <h2 className="section-title high">⚡ High Priority</h2>
                            <div className="tasks-grid">
                                {groupedTasks.high.map(task => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                            </div>
                        </div>
                    )}

                    {groupedTasks.medium.length > 0 && (
                        <div className="task-section">
                            <h2 className="section-title medium">📌 Medium Priority</h2>
                            <div className="tasks-grid">
                                {groupedTasks.medium.map(task => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                            </div>
                        </div>
                    )}

                    {groupedTasks.low.length > 0 && (
                        <div className="task-section">
                            <h2 className="section-title low">📝 Low Priority</h2>
                            <div className="tasks-grid">
                                {groupedTasks.low.map(task => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const TaskCard = ({ task }) => (
    <Link to={`/projects/${task.project_id}`} className="task-card-link">
        <div className={`task-card priority-${task.priority}`}>
            <div className="task-header">
                <h3>{task.title}</h3>
                <span className={`status-badge ${task.status}`}>
                    {task.status.replace('_', ' ')}
                </span>
            </div>

            {task.description && (
                <p className="task-description">{task.description}</p>
            )}

            <div className="task-meta">
                <span className="project-name">📁 {task.project?.name}</span>
                {task.due_date && (
                    <span className="due-date">
                        📅 {new Date(task.due_date).toLocaleDateString()}
                    </span>
                )}
            </div>
        </div>
    </Link>
);

export default MyTasks;