import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/DashboardLayout';
import { NewsUploadForm } from '../../components/NewsUploadForm';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/upload', label: 'Upload News' },
  { to: '/admin/users', label: 'Manage Reporters' },
];

export default function AdminUploadNewsPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout navItems={NAV_ITEMS}>
      <header className="mb-8">
        <p className="dateline">Editorial desk</p>
        <h1 className="font-display text-3xl font-semibold text-ink-900">Upload news</h1>
      </header>

      <div className="max-w-2xl">
        <NewsUploadForm onPublished={() => navigate('/admin')} />
      </div>
    </DashboardLayout>
  );
}
