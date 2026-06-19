import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/DashboardLayout';
import { NewsUploadForm } from '../../components/NewsUploadForm';

const NAV_ITEMS = [
  { to: '/reporter/upload', label: 'Upload News' },
  { to: '/reporter/password', label: 'Update Password' },
  { to: '/reporter', label: 'My Profile' },
];

export default function ReporterUploadNewsPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout navItems={NAV_ITEMS}>
      <header className="mb-8">
        <p className="dateline">Filing a story</p>
        <h1 className="font-display text-3xl font-semibold text-ink-900">Upload news</h1>
      </header>

      <div className="max-w-2xl">
        <NewsUploadForm onPublished={() => navigate('/reporter')} />
      </div>
    </DashboardLayout>
  );
}
