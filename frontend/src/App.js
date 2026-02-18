import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminHomePage from './pages/AdminHomePage';
import AddCasePage from './pages/AddCasePage';
import UpdateCasePage from './pages/UpdateCasePage';
import AdminUpdateCasePage from './pages/AdminUpdateCasePage';
import AdminUpdateFormPage from './pages/AdminUpdateFormPage';
import AdminRemoveCasePage from './pages/AdminRemoveCasePage';
import AdminRemovedCasesPage from './pages/AdminRemovedCasesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CaseDetailsPage from './pages/CaseDetailsPage';
import SearchCasePage from './pages/SearchCasePage';
import ReportPage from './pages/ReportPage';
import PublicReportPage from './pages/PublicReportPage';
import TermsPage from './pages/TermsPage';
import PendingUsersPage from './pages/PendingUsersPage';
import ActiveUsersPage from './pages/ActiveUsersPage';
import ViewReportsPage from './pages/ViewReportsPage';
import PendingCasesPage from './pages/PendingCasesPage';
import PendingUpdatesPage from './pages/PendingUpdatesPage';

/* Main application layout wrapper with common components */
const MainLayout = () => ( <div style={{ background: '#f1f1f1', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}><Header /><Navbar /><main className="flex-grow-1"><Outlet /></main><Footer /></div> );
/* Route protection for authenticated users only */
const PrivateRoutes = () => { const token = localStorage.getItem('token'); return token ? <Outlet /> : <Navigate to="/login" />; };
/* Route protection for administrative users only */
const AdminRoutes = () => { const token = localStorage.getItem('token'); if (token) { try { const user = jwtDecode(token).user; return user.isAdmin ? <Outlet /> : <Navigate to="/" />; } catch (error) { return <Navigate to="/login" />; } } return <Navigate to="/login" />; };
/* Dynamic home route that renders different views based on user role */
const HomeRoute = () => { const token = localStorage.getItem('token'); if (token) { try { const user = jwtDecode(token).user; return user.isAdmin ? <AdminHomePage /> : <HomePage />; } catch (error) { return <Navigate to="/login" />; } } return <Navigate to="/login" />; };

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes - accessible without authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/report-issue" element={<PublicReportPage />} />
        <Route path="/terms" element={<TermsPage />} /> {/* Terms and conditions page */}

        {/* Protected routes - require authentication */}
        <Route element={<MainLayout />}>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/add" element={<AddCasePage />} />
            <Route path="/update" element={<UpdateCasePage />} />
            <Route path="/case/:id" element={<CaseDetailsPage />} />
            <Route path="/search" element={<SearchCasePage />} />
            <Route path="/report" element={<ReportPage />} />
          </Route>
          <Route element={<AdminRoutes />}>
            <Route path="/admin/pending-users" element={<PendingUsersPage />} />
            <Route path="/admin/active-users" element={<ActiveUsersPage />} />
            <Route path="/admin/reports" element={<ViewReportsPage />} />
            <Route path="/admin/pending-cases" element={<PendingCasesPage />} />
            <Route path="/admin/pending-updates" element={<PendingUpdatesPage />} />
            <Route path="/admin/add-case" element={<AddCasePage />} />
            <Route path="/admin/update-case" element={<AdminUpdateCasePage />} />
            <Route path="/admin/update-form/:id" element={<AdminUpdateFormPage />} />
            <Route path="/admin/remove-case" element={<AdminRemoveCasePage />} />
            <Route path="/admin/AdminRemovedCasesPage" element={<AdminRemovedCasesPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;