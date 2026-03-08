import { useState } from "react";
import { Icons } from "../components/Icons";
import {
  Breadcrumb, PageHeader, Card, Modal, Badge, StatusDot,
  EmptyState, ActionButton, Select,
} from "../components/UI";

const ALL_ACTIONS = ["All Activities", "CREATE", "UPDATE", "DELETE", "VIEW"];

/**
 * AuditLogsPage
 * Props:
 *   logs: array
 */
export default function AuditLogsPage({ logs }) {
  const [filterAction,  setFilterAction]  = useState("All Activities");
  const [filterUser,    setFilterUser]    = useState("All Users");
  const [filterRange,   setFilterRange]   = useState("all");
  const [expandedLog,   setExpandedLog]   = useState(null);

  const users = ["All Users", ...new Set(logs.map(l => l.user))];

  const filtered = logs.filter(l => {
    const matchAction = filterAction === "All Activities" || l.action === filterAction;
    const matchUser   = filterUser   === "All Users"      || l.user   === filterUser;
    return matchAction && matchUser;
  });

  const totalToday    = logs.length;
  const failedOps     = logs.filter(l => l.status !== "Success").length;
  const activeUsers   = new Set(logs.map(l => l.user)).size;
  const latestTime    = logs[0]?.timestamp.split(", ")[1] ?? "—";

  const STATS = [
    { label: "Total Activities Today", value: totalToday,  valueColor: "text-gray-800" },
    { label: "Failed Operations",       value: failedOps,   valueColor: "text-red-500"  },
    { label: "Active Users",            value: activeUsers, valueColor: "text-gray-800" },
    { label: "Latest Activity",         value: latestTime,  valueColor: "text-gray-800" },
  ];

  return (
    <div>
      <Breadcrumb items={["Dashboard", "System Audit Logs"]} />

      <PageHeader
        title="System Audit Logs"
        subtitle="Complete activity history and trail"
      />

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map(({ label, value, valueColor }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Table card ── */}
      <Card padding={false}>
        {/* Filters */}
        <div className="p-4 border-b border-gray-50">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
            <Icons.Filter /> Filters
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Quick range buttons */}
            <div className="flex gap-2">
              {[["today","Today"],["7d","Last 7 Days"],["30d","Last 30 Days"]].map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setFilterRange(k)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    filterRange === k
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <Select
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
              className="w-auto"
            >
              {ALL_ACTIONS.map(a => <option key={a}>{a}</option>)}
            </Select>

            <Select
              value={filterUser}
              onChange={e => setFilterUser(e.target.value)}
              className="w-auto"
            >
              {users.map(u => <option key={u}>{u}</option>)}
            </Select>

            <button
              onClick={() => { setFilterAction("All Activities"); setFilterUser("All Users"); setFilterRange("all"); }}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>

            <button className="ml-auto px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors">
              <Icons.Download /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                {["Timestamp","User / Administrator","Action Type","Target","Details","IP Address","Status"].map(h => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <EmptyState message="No log entries match the selected filters." />
              ) : (
                filtered.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap tabular-nums">
                      {log.timestamp}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-800 whitespace-nowrap">
                      {log.user}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge type={log.action} />
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 text-xs max-w-[180px]">
                      <span className="truncate block">{log.target}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 max-w-[200px]">
                      <span className="truncate block">
                        {log.details.length > 50 ? log.details.slice(0, 50) + "…" : log.details}
                      </span>
                      {log.details.length > 50 && (
                        <button
                          onClick={() => setExpandedLog(log)}
                          className="text-blue-500 hover:underline text-xs mt-0.5"
                        >
                          View More
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500 whitespace-nowrap">
                      {log.ip}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusDot status={log.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400">
          Showing {filtered.length} of {logs.length} entries
        </div>
      </Card>

      {/* ── Detail Modal ── */}
      {expandedLog && (
        <Modal title="Activity Details" onClose={() => setExpandedLog(null)} size="sm">
          <div className="space-y-3 text-sm">
            {[
              ["Timestamp",  expandedLog.timestamp],
              ["User",       expandedLog.user],
              ["Action",     expandedLog.action],
              ["Target",     expandedLog.target],
              ["IP Address", expandedLog.ip],
              ["Status",     expandedLog.status],
              ["Details",    expandedLog.details],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-4">
                <span className="text-gray-400 w-24 shrink-0 font-medium">{k}</span>
                <span className="text-gray-800">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-5 pt-4 border-t border-gray-100">
            <ActionButton color="gray" onClick={() => setExpandedLog(null)} outline>Close</ActionButton>
          </div>
        </Modal>
      )}
    </div>
  );
}