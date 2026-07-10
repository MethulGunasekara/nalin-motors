import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const navigate = useNavigate();
  return () => {
    localStorage.removeItem('nalin_token');
    localStorage.removeItem('nalin_employee');
    navigate('/login');
  };
};