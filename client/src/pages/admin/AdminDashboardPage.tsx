import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { NewsCard } from '../../components/NewsCard';
import { listNewsRequest, deleteNewsRequest } from '../../api/news';
import { listReportersRequest } from '../../api/users';
import { NewsArticle } from '../../types';
import { getErrorMessage } from '../../api/client';
import { AlertBanner } from '../../components/AlertBanner';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [reportersCount, setReportersCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI states for responsiveness & interactivity
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  async function loadArticles() {
    setLoading(true);
    try {
      const data = await listNewsRequest();
      setArticles(data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function loadReportersCount() {
    try {
      const reporters = await listReportersRequest();
      setReportersCount(reporters.length);
    } catch (err) {
      setError(getErrorMessage(err));
      setReportersCount(0);
    }
  }

  useEffect(() => {
    loadArticles();
    loadReportersCount();
  }, []);

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this article? This cannot be undone.')) return;
    try {
      await deleteNewsRequest(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  const handleLogout = () => {
    // Implement your logout logic here (e.g., clear tokens)
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#ebf1f5] font-sans antialiased flex flex-col md:flex-row">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        md:translate-x-0 md:static md:h-screen flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-0 max-md:-translate-x-full'}
      `}>
        {/* Brand Logo Header */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100 gap-3">
          <img
            src="/BBN254.jpeg"
            alt="App Logo"
            className="h-12 w-20 object-cover"
          />
          <div>
            <div className="font-bold text-sm text-gray-800">BBN KENYA</div>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link 
            to="/admin" 
            className="flex items-center px-4 py-3 text-sm font-medium text-white bg-[#1a252f] rounded-lg transition"
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/upload" 
            className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition"
          >
            Upload News
          </Link>
          <Link 
            to="/admin/users" 
            className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition"
          >
            Manage Reporters
          </Link>
        </nav>
      </aside>

      {/* Backdrop overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      {/* --- MAIN APP WORKSPACE --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* --- TOP NAVBAR --- */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger button for mobile */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
          </div>

          {/* Profile Controls with Dropdown */}
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

            {/* Profile Dropdown Menu */}
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

        {/* --- MAIN PAGE BODY CONTENT --- */}
        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
          
          {/* Breadcrumbs Route Indicator */}
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gray-700 font-medium">Dashboard</span>
          </div>

          {/* Error Banner System notifications */}
          {error && (
            <AlertBanner variant="error" onDismiss={() => setError(null)}>
              {error}
            </AlertBanner>
          )}

          {/* --- SUMMARY CARDS METRICS SECTION --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Total Reporters */}
            <div className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">Total Reporters</h3>
              <p className="text-4xl font-bold text-gray-900 mt-2">
                {reportersCount === null ? '...' : reportersCount}
              </p>
            </div>

            {/* Card 2: Total News Published */}
            <div className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">Total News Published</h3>
              <p className="text-4xl font-bold text-gray-900 mt-2">
                {loading ? '...' : articles.length}
              </p>
            </div>

            {/* Card 3: Interactive Action Button Link */}
            <button 
              onClick={() => navigate('/admin/users')}
              className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-dashed border-gray-300 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:bg-blue-50/20 group transition duration-150"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition mb-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600">Add Member</span>
            </button>
          </div>

          {/* --- PUBLISHED NEWS REPOSITORY WRAPPER CONTAINER --- */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-gray-200">
            {/* Context Module Accent Bar */}
            <div className="bg-[#4f46e5] text-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold">
                All Published News ({articles.length})
              </h2>
              <button 
                onClick={() => navigate('/admin/upload')}
                className="bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-lg border border-white/20 flex items-center gap-1.5 self-start sm:self-auto transition"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload News
              </button>
            </div>

            {/* Data Feed / Feed Status State Handler */}
            <div className="p-6">
              {loading ? (
                <div className="py-12 text-center text-gray-500 font-medium">
                  Loading published news entries...
                </div>
              ) : articles.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-gray-500 font-medium mb-2">No upcoming meetings scheduled.</p>
                  <button 
                    onClick={() => navigate('/admin/upload')} 
                    className="text-sm font-semibold text-[#4f46e5] hover:underline"
                  >
                    Create one now.
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {articles.map((article) => (
                    <NewsCard
                      key={article.id}
                      article={article}
                      canDelete
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}