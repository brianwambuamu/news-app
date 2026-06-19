import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { NewsUploadForm } from '../../components/NewsUploadForm';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/upload', label: 'Upload News' },
  { to: '/admin/users', label: 'Manage Reporters' },
];

export default function AdminUploadNewsPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#ebf1f5] font-sans antialiased flex flex-col md:flex-row">
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
          md:translate-x-0 md:sticky md:top-0 md:h-screen flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-0 max-md:-translate-x-full'}
        `}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-100 gap-3">
          <img src="/BBN254.jpeg" alt="App Logo" className="h-12 w-20 object-cover" />
          <div>
            <div className="font-bold text-sm text-gray-800">BBN KENYA</div>
            <p className="text-[11px] uppercase tracking-wide text-gray-500">Admin Console</p>
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
              <h1 className="text-lg font-semibold text-gray-800">Admin Upload news</h1>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-full transition"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
                SA
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">Super Admin</span>
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
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gray-700 font-medium">Upload News</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-200 overflow-hidden">
                <div className="bg-[#4f46e5] text-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">Upload news</h2>
                    <p className="text-sm text-white/80">Publish a new article to the newsroom.</p>
                  </div>
                  <button
                    onClick={() => navigate('/admin')}
                    className="text-sm font-semibold text-white/80 hover:text-white transition"
                  >
                    Back to dashboard
                  </button>
                </div>

                <div className="p-6 max-w-2xl">
                  <NewsUploadForm onPublished={() => navigate('/admin')} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900">Need a hand?</h2>
                <p className="mt-3 text-sm text-gray-600 leading-7">
                  Fill in the story details, attach the news image, and submit when ready.
                  The newsroom team will review and publish the article.
                </p>
                <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                  <p className="font-medium text-gray-900">Best practices</p>
                  <ul className="mt-3 space-y-2 list-disc pl-5">
                    <li>Use a strong headline that covers the main event.</li>
                    <li>Choose a clear image and keep the caption concise.</li>
                    <li>Verify source details before submission.</li>
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
