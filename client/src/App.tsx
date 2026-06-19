import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import LoginPage from './pages/shared/LoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUploadNewsPage from './pages/admin/AdminUploadNewsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import ReporterProfilePage from './pages/reporter/ReporterProfilePage';
import ReporterPasswordPage from './pages/reporter/ReporterPasswordPage';
import ReporterUploadNewsPage from './pages/reporter/ReporterUploadNewsPage';

function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-parchment">
        <p className="font-mono text-sm uppercase tracking-wide text-ink-500">Loading…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin' : '/reporter'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/upload" element={<AdminUploadNewsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['reporter']} />}>
            <Route path="/reporter" element={<ReporterProfilePage />} />
            <Route path="/reporter/password" element={<ReporterPasswordPage />} />
            <Route path="/reporter/upload" element={<ReporterUploadNewsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
