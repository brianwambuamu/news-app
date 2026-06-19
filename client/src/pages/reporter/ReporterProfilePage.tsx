import { FormEvent, useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { AlertBanner } from '../../components/AlertBanner';
import { useAuth } from '../../context/AuthContext';
import { changePasswordRequest } from '../../api/auth';
import { getErrorMessage } from '../../api/client';
import { listNewsRequest } from '../../api/news';
import { NewsArticle } from '../../types';
import { CategoryChip } from '../../components/CategoryChip';

const NAV_ITEMS = [
  { to: '/reporter', label: 'My Profile' },
  { to: '/reporter/upload', label: 'Upload News' },
];

export default function ReporterProfilePage() {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [myArticles, setMyArticles] = useState<NewsArticle[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    listNewsRequest({ mine: true })
      .then(setMyArticles)
      .catch(() => setMyArticles([]))
      .finally(() => setLoadingArticles(false));
  }, []);

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const message = await changePasswordRequest(currentPassword, newPassword);
      setSuccess(message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout navItems={NAV_ITEMS}>
      <header className="mb-8">
        <p className="dateline">Reporter desk</p>
        <h1 className="font-display text-3xl font-semibold text-ink-900">My profile</h1>
      </header>

      <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="border border-ink-200 bg-white p-6">
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

        <div className="border border-ink-200 bg-white p-6">
          <p className="dateline mb-4">Update password</p>

          {error && (
            <div className="mb-4">
              <AlertBanner variant="error" onDismiss={() => setError(null)}>
                {error}
              </AlertBanner>
            </div>
          )}
          {success && (
            <div className="mb-4">
              <AlertBanner variant="success" onDismiss={() => setSuccess(null)}>
                {success}
              </AlertBanner>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="label-text">
                Current password
              </label>
              <input
                id="currentPassword"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="label-text">
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="label-text">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
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
