import { useEffect } from "react";
import { Icons } from "./Icons";

// ── Badge ──────────────────────────────────────────────────────────────────
export function Badge({ type }) {
  const styles = {
    CREATE: "bg-green-100 text-green-700 border border-green-200",
    UPDATE: "bg-blue-100 text-blue-700 border border-blue-200",
    DELETE: "bg-red-100 text-red-700 border border-red-200",
    VIEW:   "bg-gray-100 text-gray-600 border border-gray-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${styles[type] || styles.VIEW}`}>
      {type}
    </span>
  );
}

// ── StatusDot ──────────────────────────────────────────────────────────────
export function StatusDot({ status }) {
  return status === "Success" ? (
    <span className="flex items-center gap-1 text-green-600 text-sm">
      <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Success
    </span>
  ) : (
    <span className="flex items-center gap-1 text-red-500 text-sm">
      <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Failed
    </span>
  );
}

// ── Toggle ─────────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, size = "md" }) {
  const sizes = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl" };
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <Icons.Close />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────
export function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-pulse ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <Icons.CheckCircle /> {message}
    </div>
  );
}

// ── StatCard ───────────────────────────────────────────────────────────────
export function StatCard({ icon, label, value, sub, badge, color }) {
  const colors = {
    blue:  "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    amber: "text-amber-600 bg-amber-50",
    red:   "text-red-500 bg-red-50",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className={`p-2 rounded-lg ${colors[color]}`}>{icon}</span>
        {badge && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Icons.TrendUp /> {badge}
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-sm font-medium text-gray-600">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

// ── Breadcrumb ─────────────────────────────────────────────────────────────
export function Breadcrumb({ items }) {
  return (
    <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <Icons.ChevronRight />}
          <span className={i === items.length - 1 ? "text-gray-800 font-medium" : ""}>{item}</span>
        </span>
      ))}
    </nav>
  );
}

// ── FormField ──────────────────────────────────────────────────────────────
export function FormField({ label, children, error, hint, required, colSpan = 1 }) {
  return (
    <div className={colSpan === 2 ? "col-span-2" : "col-span-1"}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="text-xs text-blue-500 mt-0.5">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

// ── Input ──────────────────────────────────────────────────────────────────
export function Input({ error, className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-all ${
        error
          ? "border-red-400 focus:ring-2 focus:ring-red-200"
          : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      } ${className}`}
    />
  );
}

// ── Select ─────────────────────────────────────────────────────────────────
export function Select({ children, className = "", ...props }) {
  return (
    <select
      {...props}
      className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white ${className}`}
    >
      {children}
    </select>
  );
}

// ── PageHeader ─────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── SectionHeading ─────────────────────────────────────────────────────────
export function SectionHeading({ icon, children }) {
  return (
    <h2 className="text-base font-semibold text-blue-600 mb-4 flex items-center gap-2">
      {icon} {children}
    </h2>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────
export function Card({ children, className = "", padding = true }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${padding ? "p-6" : ""} ${className}`}>
      {children}
    </div>
  );
}

// ── EmptyState ─────────────────────────────────────────────────────────────
export function EmptyState({ message = "No data found." }) {
  return (
    <tr>
      <td colSpan={99} className="px-5 py-14 text-center text-gray-400 text-sm">
        {message}
      </td>
    </tr>
  );
}

// ── ActionButton ───────────────────────────────────────────────────────────
export function ActionButton({ onClick, color = "blue", icon, children, outline = false, small = false }) {
  const variants = {
    blue:  outline ? "border border-blue-200 text-blue-600 hover:bg-blue-50"  : "bg-blue-600 hover:bg-blue-700 text-white",
    red:   outline ? "border border-red-200 text-red-500 hover:bg-red-50"     : "bg-red-500 hover:bg-red-600 text-white",
    green: outline ? "border border-green-200 text-green-600 hover:bg-green-50" : "bg-green-500 hover:bg-green-600 text-white",
    gray:  "border border-gray-200 text-gray-600 hover:bg-gray-50",
    amber: "border border-amber-200 text-amber-500 hover:bg-amber-50",
  };
  const sizes = small ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm";
  return (
    <button
      onClick={onClick}
      className={`rounded-lg font-medium flex items-center gap-2 transition-colors ${variants[color]} ${sizes}`}
    >
      {icon} {children}
    </button>
  );
}