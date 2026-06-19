import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { listNewsRequest } from '../../api/news';
import { NewsArticle } from '../../types';
import { CategoryChip } from '../../components/CategoryChip';

const NAV_ITEMS = [
  { to: '/reporter/upload', label: 'Upload News' },
  { to: '/reporter/password', label: 'Update Password' },
  { to: '/reporter', label: 'My Profile' },
];

export default function ReporterProfilePage() {
  const { user } = useAuth();
  const [myArticles, setMyArticles] = useState<NewsArticle[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    listNewsRequest({ mine: true })
      .then(setMyArticles)
      .catch(() => setMyArticles([]))
      .finally(() => setLoadingArticles(false));
  }, []);

  return (
    <DashboardLayout navItems={NAV_ITEMS}>
      <header className="mb-8">
        <p className="dateline">Reporter desk</p>
        <h1 className="font-display text-3xl font-semibold text-ink-900">My profile</h1>
      </header>

      <div className="mb-10 max-w-xl border border-ink-200 bg-white p-6">
        <p className="dateline mb-4">Profile details</p>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="label-text">Name</dt>
            <dd className="text-ink-800">{user?.name}</dd>
          </div>
          <div>
            <dt className="label-text">Email</dt>
            <dd className="text-ink-800">{user?.email}</dd>
          </div>
          <div>
            <dt className="label-text">Role</dt>
            <dd className="capitalize text-ink-800">{user?.role}</dd>
          </div>
        </dl>
      </div>

      <div>
        <p className="dateline mb-4">My published articles</p>
        {loadingArticles ? (
          <p className="font-mono text-sm text-ink-500">Loading…</p>
        ) : myArticles.length === 0 ? (
          <p className="font-mono text-sm text-ink-500">
            You haven't published anything yet.
          </p>
        ) : (
          <ul className="divide-y divide-ink-100 border border-ink-200 bg-white">
            {myArticles.map((article) => (
              <li key={article.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-ink-800">{article.title}</span>
                <CategoryChip category={article.category} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}