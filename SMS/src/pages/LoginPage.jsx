import { useState } from "react";
import { Icons } from "../components/Icons";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [remember, setRemember] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }
    // TODO: replace with real API call
    if (username === "admin" && password === "admin") {
      setLoading(true);
      setTimeout(() => { setLoading(false); onLogin(); }, 600);
    } else {
      setError("Invalid credentials. Use admin / admin for demo.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex w-full max-w-4xl">

        {/* ── Left panel ── */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm mx-auto mb-4 shadow-md">
              KDU
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Student Management System</h1>
            <p className="text-gray-500 text-sm mt-1">Administrator Login</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username / Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icons.User />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icons.Lock />
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Icons.Eye />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-xs bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Remember Me
              </label>
              <button className="text-sm text-blue-600 hover:underline">Forgot Password?</button>
            </div>

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : null}
              {loading ? "Signing in…" : "Login"}
            </button>

            {/* Demo hint */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-center text-gray-600">
              <strong>Demo:</strong> Username:{" "}
              <code className="bg-white px-1.5 py-0.5 rounded border border-blue-100">admin</code>
              {" "}| Password:{" "}
              <code className="bg-white px-1.5 py-0.5 rounded border border-blue-100">admin</code>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            © 2025 KDU – Software Engineering Department
            <br />Version 1.0
          </p>
        </div>

        {/* ── Right panel ── */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 flex-col items-center justify-center p-10 gap-6">
          {/* Placeholder campus image */}
          <div className="w-72 h-44 rounded-2xl overflow-hidden shadow-lg bg-white/60 flex items-center justify-center border border-white">
            <div className="text-center text-gray-400">
              <svg viewBox="0 0 120 80" className="w-36 mx-auto" fill="none">
                <rect width="120" height="80" rx="6" fill="#e0e7ef"/>
                <rect x="10" y="10" width="100" height="60" rx="4" fill="white" opacity="0.6"/>
                <rect x="45" y="30" width="30" height="40" rx="2" fill="#3b82f6" opacity="0.3"/>
                <rect x="20" y="40" width="20" height="30" rx="2" fill="#3b82f6" opacity="0.2"/>
                <rect x="80" y="40" width="20" height="30" rx="2" fill="#3b82f6" opacity="0.2"/>
                <circle cx="60" cy="20" r="6" fill="#3b82f6" opacity="0.4"/>
              </svg>
              <p className="text-xs mt-2 font-medium text-blue-400">KDU Campus</p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Efficient Student Registration &amp; Management
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Streamline your academic administration with our comprehensive student management platform
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            {[
              ["📚", "Course Management"],
              ["👤", "Student Tracking"],
              ["📊", "Analytics & Reports"],
              ["🔒", "Secure Access"],
            ].map(([em, label]) => (
              <div key={label} className="bg-white/70 backdrop-blur rounded-xl p-3.5 flex flex-col items-center gap-1.5 shadow-sm border border-white">
                <span className="text-2xl">{em}</span>
                <span className="text-xs font-medium text-gray-600 text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}