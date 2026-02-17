import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import DealList from './components/DealList';
import DealDetail from './components/DealDetail';
import CreateDeal from './components/CreateDeal';
import ContactList from './components/ContactList';
import ActivityLog from './components/ActivityLog';
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

        {/* CRM Deal Management */}
        <Route
          path="/deals"
          element={
            <PrivateRoute>
              <Layout>
                <DealList type="team" />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/leads"
          element={
            <PrivateRoute>
              <Layout>
                <DealList type="personal" />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/deals/new"
          element={
            <PrivateRoute>
              <Layout>
                <CreateDeal />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/deals/:id"
          element={
            <PrivateRoute>
              <Layout>
                <DealDetail />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Contacts */}
        <Route
          path="/contacts"
          element={
            <PrivateRoute>
              <Layout>
                <ContactList />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Activities */}
        <Route
          path="/my-tasks"
          element={
            <PrivateRoute>
              <Layout>
                <ActivityLog />
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

        {/* Redirects for stability */}
        <Route path="/projects" element={<Navigate to="/deals" replace />} />
        <Route path="/personal-projects" element={<Navigate to="/leads" replace />} />
        <Route path="/projects/new" element={<Navigate to="/deals/new" replace />} />
        <Route path="/projects/:id" element={<Navigate to="/deals/:id" replace />} />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;