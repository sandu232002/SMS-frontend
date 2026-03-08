import { Icons } from "../components/Icons";
import { StatCard, Badge, Card } from "../components/UI";

/**
 * DashboardPage
 * Props:
 *   students: array
 *   courses:  array
 *   logs:     array
 *   setPage:  (key: string) => void
 */
export default function DashboardPage({ students, courses, logs, setPage }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const DEGREES = [
    { label: "Software Engineering", color: "bg-blue-500" },
    { label: "Computer Science",     color: "bg-green-500" },
    { label: "Information Technology", color: "bg-amber-500" },
    { label: "Business IT",           color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      {/* ── Greeting ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, Administrator</h1>
        <p className="text-sm text-gray-500 mt-1">{today}</p>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Icons.Students />}
          label="Total Students"
          value={students.length}
          sub="This month"
          badge="+12%"
          color="blue"
        />
        <StatCard
          icon={<Icons.Courses />}
          label="Active Courses"
          value={courses.filter(c => c.status).length}
          sub=""
          badge="+5 new"
          color="green"
        />
        <StatCard
          icon={<Icons.Register />}
          label="Recent Registrations"
          value={23}
          sub="Last 7 days"
          color="amber"
        />
        <StatCard
          icon={<Icons.Activity />}
          label="System Activities"
          value={logs.length}
          sub="Today"
          color="red"
        />
      </div>

      {/* ── Main content row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card padding={false}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-800">Recent Activities</h2>
              <button
                onClick={() => setPage("logs")}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                View All <Icons.ChevronRight />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {logs.slice(0, 5).map(log => (
                <div key={log.id} className="flex items-center gap-4 px-5 py-3">
                  <span className="text-xs text-gray-400 w-20 shrink-0 tabular-nums">
                    {log.timestamp.split(", ")[1]}
                  </span>
                  <Badge type={log.action} />
                  <span className="text-sm text-gray-700 font-medium shrink-0">{log.user}</span>
                  <span className="text-sm text-gray-500 truncate">{log.target}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Quick Actions */}
          <Card>
            <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => setPage("register")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Icons.Register /> Register New Student
              </button>
              <button
                onClick={() => setPage("courses")}
                className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Icons.Courses /> Update Courses
              </button>
              <button
                onClick={() => setPage("logs")}
                className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Icons.Activity /> Generate Report
              </button>
            </div>
          </Card>

          {/* Degree distribution */}
          <Card>
            <h2 className="font-semibold text-gray-800 mb-4">Degree Program Distribution</h2>
            {DEGREES.map(({ label, color }) => {
              const count = students.filter(s => s.degree === label).length;
              const pct   = students.length ? Math.round((count / students.length) * 100) : 0;
              return (
                <div key={label} className="mb-3 last:mb-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 truncate pr-2">{label}</span>
                    <span className="font-semibold text-gray-700 shrink-0">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className={`h-2 rounded-full ${color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </Card>

        </div>
      </div>
    </div>
  );
}