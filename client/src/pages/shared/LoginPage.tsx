import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/client';
import { AlertBanner } from '../../components/AlertBanner';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/reporter', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#ebf1f5] px-4 font-sans">
      <div className="w-full max-w-[420px] rounded-2xl bg-white px-8 py-10 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        
        {/* Logo and Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex flex-col items-center">
            <img
              src="/BBN254.jpeg"
              alt="App Logo"
              className="h-16 w-16 rounded-full object-cover"
            />
          </div>
          
          <h2 className="text-2xl font-semibold text-[#2d3748]">Login</h2>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4">
            <AlertBanner variant="error">{error}</AlertBanner>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div className="relative">
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 text-gray-700 placeholder-gray-400 outline-none transition focus:border-gray-400"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {/* User Avatar Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 text-gray-700 placeholder-gray-400 outline-none transition focus:border-gray-400"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {/* Lock Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Utilities (Show Password & Forgot Password) */}
          <div className="flex items-center justify-between pt-1 text-sm">
            <label className="flex items-center space-x-2 cursor-pointer text-gray-500 select-none">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-red-700 focus:ring-0"
              />
              <span className="text-xs">Show Password</span>
            </label>
            <a href="#forgot" className="text-xs font-medium text-blue-500 hover:underline">
              Forgot Password
            </a>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-[#E99E57] py-3 font-semibold text-white transition hover:bg-[#800000] active:scale-[0.99] disabled:opacity-70"
            >
              {submitting ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}