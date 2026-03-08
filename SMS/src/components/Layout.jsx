import { Icons } from "./Icons";

// ── Navbar ─────────────────────────────────────────────────────────────────
export function Navbar() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 fixed top-0 left-0 right-0 z-30 shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-2.5 w-56 shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow">
          KDU
        </div>
        <span className="font-semibold text-gray-800 text-sm leading-tight">
          Student Management System
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <Icons.Search />
        </span>
        <input
          className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          placeholder="Search students, courses..."
        />
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <Icons.Bell />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-gray-800 leading-tight">Admin User</div>
            <div className="text-xs text-gray-500">Administrator</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            AU
          </div>
        </div>

        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <Icons.Logout />
        </button>
      </div>
    </header>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard",           Icon: Icons.Dashboard },
  { key: "register",  label: "Register New Student", Icon: Icons.Register  },
  { key: "students",  label: "Manage Students",      Icon: Icons.Students  },
  { key: "courses",   label: "Courses",              Icon: Icons.Courses   },
  { key: "logs",      label: "System Audit Logs",    Icon: Icons.Logs      },
];

export function Sidebar({ activePage, setPage }) {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 fixed left-0 top-14 bottom-0 z-20 flex flex-col py-4 shadow-sm">
      <nav className="flex-1 space-y-0.5 px-3">
        {NAV_ITEMS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activePage === key
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <Icon />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

// ── Layout wrapper ─────────────────────────────────────────────────────────
export function AppLayout({ activePage, setPage, children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar activePage={activePage} setPage={setPage} />
      <main className="ml-56 pt-14 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}