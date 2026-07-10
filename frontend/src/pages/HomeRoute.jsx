import { Navigate } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import MechanicQueuePage from './MechanicQueuePage';
import AdminAppointmentsPage from './AdminAppointmentsPage';

// This is a real component, not an inline ternary — so React re-renders it
// (and re-reads localStorage) every time the "/" route is matched, including
// right after a login/logout navigation, with no full page reload needed.
const HomeRoute = () => {
  if (!localStorage.getItem('nalin_token')) {
    return <Navigate to="/login" replace />;
  }

  const employee = JSON.parse(localStorage.getItem('nalin_employee') || '{}');

  if (employee.role === 'mechanic') return <MechanicQueuePage />;
  if (employee.role === 'owner') return <AdminAppointmentsPage />;
  return <DashboardPage />;
};

export default HomeRoute;