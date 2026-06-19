import { FormEvent, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { AlertBanner } from '../../components/AlertBanner';
import { changePasswordRequest } from '../../api/auth';
import { getErrorMessage } from '../../api/client';

const NAV_ITEMS = [
    { to: '/reporter/upload', label: 'Upload News' },
    { to: '/reporter/password', label: 'Update Password' },
    { to: '/reporter', label: 'My Profile' },
];

export default function ReporterPasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
      newPassword && setNewPassword('');
      confirmPassword && setConfirmPassword('');
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
        <h1 className="font-display text-3xl font-semibold text-ink-900">Security Management</h1>
      </header>

      <div className="max-w-xl border border-ink-200 bg-white p-6">
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
    </DashboardLayout>
  );
}