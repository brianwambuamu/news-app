import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { listNewsRequest } from '../../api/news';
import { NewsArticle } from '../../types';
import { CategoryChip } from '../../components/CategoryChip';

const NAV_ITEMS = [
  { to: '/reporter', label: 'My Profile' },
  { to: '/reporter/upload', label: 'Upload News' },
  { to: '/reporter/password', label: 'Update Password' },
];

function getInitials(name?: string) {
  if (!name) return 'RP';
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function ReporterProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const [myArticles, setMyArticles] = useState<NewsArticle[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    listNewsRequest({ mine: true })
      .then(setMyArticles)
      .catch(() => setMyArticles([]))
      .finally(() => setLoadingArticles(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#ebf1f5] font-sans antialiased flex flex-col md:flex-row">
      <aside
        className={
          `fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
          md:translate-x-0 md:sticky md:top-0 md:h-screen flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-0 max-md:-translate-x-full'}`
        }
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-100 gap-3">
          <img src="/BBN254.jpeg" alt="App Logo" className="h-12 w-20 object-cover rounded-md" />
          <div>
            <div className="font-bold text-sm text-gray-800">BBN KENYA</div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
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

        <div className="border-t border-gray-100 px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 grid place-items-center font-semibold text-sm">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user?.name ?? 'Reporter'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email ?? ''}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">My Profile</h1>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-full transition"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-sm">
                {getInitials(user?.name)}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user?.name ?? 'Reporter'}
              </span>
              <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span>Reporter</span>
            <span>&gt;</span>
            <span className="text-gray-700 font-medium">My Profile</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-200 overflow-hidden">
                <div className="bg-gray-500 text-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">Profile details</h2>
                  </div>
                </div>

                <div className="p-6">
                  <dl className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Name</dt>
                      <dd className="mt-1 text-gray-800 font-medium">{user?.name}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Email</dt>
                      <dd className="mt-1 text-gray-800 font-medium">{user?.email}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Role</dt>
                      <dd className="mt-1 text-gray-800 font-medium capitalize">{user?.role}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-200 overflow-hidden">
                <div className="bg-gray-500 text-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">My published articles</h2>
                  </div>
                    <button 
                  onClick={() => navigate('/reporter/upload')}
                className="bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-lg border border-white/20 flex items-center gap-1.5 self-start sm:self-auto transition"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload News
              </button>
            </div>

                <div className="p-6">
                  {loadingArticles ? (
                    <p className="text-sm text-gray-500">Loading…</p>
                  ) : myArticles.length === 0 ? (
                    <p className="text-sm text-gray-500">You haven't published anything yet.</p>
                  ) : (
                    <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden">
                      {myArticles.map((article) => (
                        <li
                          key={article.id}
                          className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50 transition"
                        >
                          <span className="text-sm font-medium text-gray-800 truncate">
                            {article.title}
                          </span>
                          <CategoryChip category={article.category} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900">Need a hand?</h2>
                <p className="mt-3 text-sm text-gray-600 leading-7">
                  This is your reporter dashboard. Review your details, keep track of what you've
                  published, and manage your account from here.
                </p>
                <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                  <p className="font-medium text-gray-900">Quick tips</p>
                  <ul className="mt-3 space-y-2 list-disc pl-5">
                    <li>Keep your profile details accurate and up to date.</li>
                    <li>Check back here to track your published stories.</li>
                    <li>Update your password regularly to stay secure.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}