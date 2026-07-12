import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import SeekerDashboard from './pages/SeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';

const DashboardRouter = () => {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'employer') return <EmployerDashboard />;
  return <SeekerDashboard />;
};

const AppLayout = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      <Navbar />
      <main className={`main-content ${isDashboard ? 'dashboard-layout' : ''}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isDashboard && !isAuthPage && location.pathname !== '/' && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toast />
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
