import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomeRoute from './pages/HomeRoute';
import NewAppointmentPage from './pages/NewAppointmentPage';
import ServiceCardFormPage from './pages/ServiceCardFormPage';
import ServiceCardDetailPage from './pages/ServiceCardDetailPage';
import EmployeesAdminPage from './pages/EmployeesAdminPage';
import ServiceCatalogAdminPage from './pages/ServiceCatalogAdminPage';

const isAuthenticated = () => Boolean(localStorage.getItem('nalin_token'));
const getRole = () => JSON.parse(localStorage.getItem('nalin_employee') || '{}').role;

const ProtectedRoute = ({ children }) =>
  isAuthenticated() ? children : <Navigate to="/login" replace />;

const OwnerRoute = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return getRole() === 'owner' ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomeRoute />} />
        <Route
          path="/appointments/new"
          element={
            <ProtectedRoute>
              <NewAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/service-cards/new"
          element={
            <ProtectedRoute>
              <ServiceCardFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/service-cards/:id"
          element={
            <ProtectedRoute>
              <ServiceCardDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <OwnerRoute>
              <EmployeesAdminPage />
            </OwnerRoute>
          }
        />
        <Route
          path="/admin/catalog"
          element={
            <OwnerRoute>
              <ServiceCatalogAdminPage />
            </OwnerRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;