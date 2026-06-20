import { FormEvent, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [reporters, setReporters] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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

  async function handleLogout() {
    try {
      if (logout) {
        await logout();
      } else {
        localStorage.removeItem('token');
      }
      setIsProfileDropdownOpen(false);
      navigate('/login');
    } catch (err) {
      setError('An error occurred during sign out.');
    }
  }

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
    <div className="min-h-screen bg-[#ebf1f5] font-sans antialiased flex flex-col md:flex-row">

      {/* --- SIDE NAVIGATION BAR --- */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 max-w-[80vw] bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
          md:translate-x-0 md:sticky md:top-0 md:h-screen flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/BBN254.jpeg" alt="App Logo" className="h-12 w-20 object-cover shrink-0" />
            <div className="min-w-0">
              <div className="font-bold text-sm text-gray-800 truncate">BBN KENYA</div>
            </div>
          </div>
          {/* Mobile-only close control for the drawer */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-lg md:hidden shrink-0"
            aria-label="Close menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1a252f] text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Drawer Overlay Mask Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      {/* --- WORKSPACE VIEWSPACE --- */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* --- TOP HEADER NAVIGATION BAR --- */}
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-gray-200 flex items-center justify-between gap-3 px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden shrink-0"
              aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            >
              {isSidebarOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
              Admin Add Reporters
            </h1>
          </div>

          {/* Identity controls and logout profile settings structure */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-full transition"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm shrink-0">
                SA
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">Super Admin</span>
              <svg className="h-4 w-4 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isProfileDropdownOpen && (
              <>
                <div onClick={() => setIsProfileDropdownOpen(false)} className="fixed inset-0 z-10" />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* --- PANEL MAIN BODY CONTAINER --- */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto">
          <nav className="text-sm text-gray-500 flex items-center gap-2">
            <span className="hover:text-slate-700 cursor-pointer">Home</span>
            <span>&gt;</span>
            <span className="text-gray-700 font-medium">Manage Reporters</span>
          </nav>

          {error && (
            <AlertBanner variant="error" onDismiss={() => setError(null)}>
              {error}
            </AlertBanner>
          )}

          {success && (
            <AlertBanner variant="success" onDismiss={() => setSuccess(null)}>
              {success}
            </AlertBanner>
          )}

          <div className="grid gap-4 md:gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6 min-w-0">
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-gray-200">
                <div className="bg-[#4f46e5] text-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">Reporter roster</h2>
                    <p className="text-sm text-white/80">All registered reporters and account status.</p>
                  </div>
                  <div className="text-sm font-semibold text-white">{loading ? '...' : `${reporters.length} reporters`}</div>
                </div>

                <div className="p-4 sm:p-6">
                  {loading ? (
                    <div className="py-12 text-center text-gray-500 font-medium">Loading reporters...</div>
                  ) : reporters.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-gray-500 font-medium mb-2">No reporters have been added yet.</p>
                      <p className="text-sm text-gray-500">Use the form on the right to create the first reporter account.</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-2xl border border-gray-100">
                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-sm min-w-[500px]">
                          <thead>
                            <tr className="border-b border-gray-200 bg-gray-50 text-left font-mono text-[11px] uppercase tracking-wide text-gray-500">
                              <th className="px-4 py-3">Name</th>
                              <th className="px-4 py-3">Email</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reporters.map((reporter) => (
                              <tr key={reporter.id} className="border-b border-gray-100 last:border-0">
                                <td className="px-4 py-3 font-medium text-gray-900">{reporter.name}</td>
                                <td className="px-4 py-3 text-gray-600">{reporter.email}</td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`font-mono text-[11px] uppercase tracking-wide ${
                                      reporter.is_active ? 'text-[#4f46e5]' : 'text-gray-400'
                                    }`}
                                  >
                                    {reporter.is_active ? 'Active' : 'Terminated'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                  {reporter.is_active && (
                                    <button
                                      onClick={() => handleTerminate(reporter.id)}
                                      className="mr-3 text-xs font-semibold uppercase tracking-wide text-gray-600 hover:underline"
                                    >
                                      Terminate
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDelete(reporter.id)}
                                    className="text-xs font-semibold uppercase tracking-wide text-gray-400 hover:text-gray-700 hover:underline"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Side Column Data Creation Widget */}
            <div className="space-y-6 min-w-0">
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">Add a reporter</p>
                    <h2 className="text-xl font-semibold text-gray-900">New account</h2>
                  </div>
                </div>

                <form onSubmit={handleCreate} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full name
                    </label>
                    <input
                      id="name"
                      required
                      minLength={2}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#c7d2fe]"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="reporter-email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="reporter-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#c7d2fe]"
                      placeholder="jane@newsroom.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-[#1a252f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#111923] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Creating…' : 'Create reporter account'}
                  </button>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    A temporary password is generated automatically and emailed to the reporter.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}