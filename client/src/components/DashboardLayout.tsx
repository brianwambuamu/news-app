import { NavLink, useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface NavItem {
  to: string;
  label: string;
}

interface DashboardLayoutProps {
  navItems: NavItem[];
  children: ReactNode;
}

export function DashboardLayout({ navItems, children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-parchment">
      <aside className="flex w-64 flex-col bg-masthead text-parchment">
        <div className="border-b border-white/10 px-6 py-6">
          <p className="font-display text-xl font-semibold tracking-tight">Newsroom Desk</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-parchment/60">
            {user?.role === 'admin' ? 'Admin Console' : 'Reporter Desk'}
          </p>
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `block rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-parchment/70 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-white/10 px-6 py-4">
          <p className="truncate text-sm font-medium text-white">{user?.name}</p>
          <p className="truncate text-xs text-parchment/60">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="mt-3 w-full rounded-sm border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-parchment/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
