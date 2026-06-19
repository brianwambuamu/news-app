import { FormEvent, useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { AlertBanner } from '../../components/AlertBanner';
import {
  listReportersRequest,
  createUserRequest,
  terminateUserRequest,
  deleteUserRequest,
} from '../../api/users';
import { PublicUser } from '../../types';
import { getErrorMessage } from '../../api/client';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/upload', label: 'Upload News' },
  { to: '/admin/users', label: 'Manage Reporters' },
];

export default function AdminUsersPage() {
  const [reporters, setReporters] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadReporters() {
    setLoading(true);
    try {
      const data = await listReportersRequest();
      setReporters(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReporters();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const result = await createUserRequest(name, email, 'reporter');
      setSuccess(
        result.warning
          ? `${result.warning} Temporary password: ${result.temporaryPassword}`
          : `Reporter account created. Credentials were emailed to ${email}.`
      );
      setName('');
      setEmail('');
      await loadReporters();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTerminate(id: number) {
    if (!window.confirm('Deactivate this reporter? They will no longer be able to log in.')) {
      return;
    }
    try {
      await terminateUserRequest(id);
      await loadReporters();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Permanently delete this reporter account? This cannot be undone.')) {
      return;
    }
    try {
      await deleteUserRequest(id);
      setReporters((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <DashboardLayout navItems={NAV_ITEMS}>
      <header className="mb-8">
        <p className="dateline">Staffing</p>
        <h1 className="font-display text-3xl font-semibold text-ink-900">Manage reporters</h1>
      </header>

      {error && (
        <div className="mb-6">
          <AlertBanner variant="error" onDismiss={() => setError(null)}>
            {error}
          </AlertBanner>
        </div>
      )}
      {success && (
        <div className="mb-6">
          <AlertBanner variant="success" onDismiss={() => setSuccess(null)}>
            {success}
          </AlertBanner>
        </div>
      )}

      <div className="mb-10 max-w-xl border border-ink-200 bg-white p-6">
        <p className="dateline mb-4">Add a reporter</p>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label htmlFor="name" className="label-text">
              Full name
            </label>
            <input
              id="name"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label htmlFor="reporter-email" className="label-text">
              Email
            </label>
            <input
              id="reporter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="jane@newsroom.com"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Creating…' : 'Create reporter account'}
          </button>
          <p className="text-xs text-ink-500">
            A temporary password is generated automatically and emailed to the reporter.
          </p>
        </form>
      </div>

      <div>
        <p className="dateline mb-4">All reporters</p>
        {loading ? (
          <p className="font-mono text-sm text-ink-500">Loading…</p>
        ) : reporters.length === 0 ? (
          <p className="font-mono text-sm text-ink-500">No reporters yet.</p>
        ) : (
          <div className="overflow-hidden border border-ink-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-200 bg-ink-50 text-left font-mono text-[11px] uppercase tracking-wide text-ink-500">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reporters.map((reporter) => (
                  <tr key={reporter.id} className="border-b border-ink-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-ink-800">{reporter.name}</td>
                    <td className="px-4 py-3 text-ink-600">{reporter.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-mono text-[11px] uppercase tracking-wide ${
                          reporter.is_active ? 'text-masthead' : 'text-wire'
                        }`}
                      >
                        {reporter.is_active ? 'Active' : 'Terminated'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {reporter.is_active && (
                        <button
                          onClick={() => handleTerminate(reporter.id)}
                          className="mr-3 text-xs font-semibold uppercase tracking-wide text-ink-600 hover:underline"
                        >
                          Terminate
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(reporter.id)}
                        className="text-xs font-semibold uppercase tracking-wide text-wire hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
