import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import CreateProject from './components/CreateProject';
import MyTasks from './components/MyTasks';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Layout>
                <ProjectList type="team" />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/personal-projects"
          element={
            <PrivateRoute>
              <Layout>
                <ProjectList type="personal" />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/projects/new"
          element={
            <PrivateRoute>
              <Layout>
                <CreateProject />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <PrivateRoute>
              <Layout>
                <ProjectDetail />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/my-tasks"
          element={
            <PrivateRoute>
              <Layout>
                <MyTasks />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Layout>
                <Settings />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;