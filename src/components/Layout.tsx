import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Hjem', end: true },
  { to: '/lessons', label: 'Lektioner', end: false },
  { to: '/practice', label: 'Fri skrivning', end: false },
  { to: '/progress', label: 'Fremgang', end: false },
  { to: '/settings', label: 'Indstillinger', end: false },
];

export default function Layout() {
  return (
    <div className="flex min-h-full flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 text-lg font-bold">
            <span aria-hidden className="text-2xl">
              ⌨️
            </span>
            <span>TasteTrup</span>
          </NavLink>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-slate-800">
        TasteTrup · Lær touch-typing · Fremgang gemmes i din browser
      </footer>
    </div>
  );
}
