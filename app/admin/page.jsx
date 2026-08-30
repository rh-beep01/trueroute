'use client';

import { useState, useEffect, useMemo } from 'react';

// ──────────────────────────── Icons (inline SVG helpers) ────────────────────
const Icon = ({ d, size = 18, stroke = 'currentColor', fill = 'none', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const Icons = {
  search: <Icon d="M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5zm10 3.75l-4.35-4.35" />,
  filter: <Icon d={["M22 3H2l8 9.46V19l4 2v-8.54L22 3"]} />,
  refresh: <Icon d={["M23 4v6h-6", "M1 20v-6h6", "M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"]} />,
  logout: <Icon d={["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4", "M16 17l5-5-5-5", "M21 12H9"]} />,
  mail: <Icon d={["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "M22 6l-10 7L2 6"]} />,
  calendar: <Icon d={["M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z", "M16 2v4", "M8 2v4", "M3 10h18"]} />,
  users: <Icon d={["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M9 11a4 4 0 100-8 4 4 0 000 8z", "M23 21v-2a4 4 0 00-3-3.87", "M16 3.13a4 4 0 010 7.75"]} />,
  map: <Icon d={["M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z", "M8 2v16", "M16 6v16"]} />,
  clock: <Icon d={["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"]} />,
  check: <Icon d="M20 6L9 17l-5-5" />,
  x: <Icon d={["M18 6L6 18", "M6 6l12 12"]} />,
  chevDown: <Icon d="M6 9l6 6 6-6" />,
  eye: <Icon d={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 15a3 3 0 100-6 3 3 0 000 6z"]} />,
  download: <Icon d={["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"]} />,
  trash: <Icon d={["M3 6h18", "M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"]} />,
  plane: <Icon d={["M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"]} />,
  star: <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  arrowLeft: <Icon d={["M19 12H5", "M12 19l-7-7 7-7"]} />,
  menu: <Icon d={["M3 12h18", "M3 6h18", "M3 18h18"]} />,
  close: <Icon d={["M18 6L6 18", "M6 6l12 12"]} />,
};

// ──────────────────────────── Status config ──────────────────────────────────
const STATUS_CONFIG = {
  'New':         { bg: 'bg-sky-50',    text: 'text-sky-700',     border: 'border-sky-200',    dot: 'bg-sky-500',     icon: '🆕' },
  'In Progress': { bg: 'bg-amber-50',  text: 'text-amber-700',   border: 'border-amber-200',  dot: 'bg-amber-500',   icon: '⏳' },
  'Completed':   { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', icon: '✅' },
  'Cancelled':   { bg: 'bg-rose-50',   text: 'text-rose-700',    border: 'border-rose-200',   dot: 'bg-rose-500',    icon: '❌' },
};

const ALL_STATUSES = ['New', 'In Progress', 'Completed', 'Cancelled'];

// ──────────────────────────── Helpers ────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const timeAgo = (d) => {
  const now = new Date();
  const then = new Date(d);
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(d);
};

const tripDuration = (start, end) => {
  if (!start || !end) return '—';
  const d1 = new Date(start);
  const d2 = new Date(end);
  const diff = Math.ceil((d2 - d1) / 86400000);
  return `${diff} day${diff !== 1 ? 's' : ''}`;
};

const getPlanPrice = (plan) => {
  const match = plan?.match(/\$(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

const exportCSV = (requests) => {
  const headers = ['Name','Email','Destination','Secondary','Plan','Start','End','Travelers','Adults','Seniors','Children','Pace','Accommodation','Dietary','Notes','Status','Submitted'];
  const rows = requests.map(r => [
    r.client_name, r.client_email, r.dest_primary, r.dest_secondary || '', r.plan_interest,
    r.date_start, r.date_end, r.traveller_count, r.num_adults, r.num_seniors, r.num_kids,
    r.pace, r.accommodation || '', r.dietary || '', r.notes || '', r.status, r.created_at
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trueroute-requests-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ──────────────────────────── Main Component ────────────────────────────────
export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Auto-hide toast
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  // ─── Auth ──────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/requests', {
        headers: { 'Authorization': `Bearer ${password}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
        setIsAuthenticated(true);
      } else {
        const errData = await res.json();
        setError(res.status === 401 ? 'Invalid password' : (errData.error || 'Server error'));
      }
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/requests', {
        headers: { 'Authorization': `Bearer ${password}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
        setToastMessage('Data refreshed successfully');
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${password}` },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        if (selectedRequest?.id === id) setSelectedRequest(prev => ({ ...prev, status: newStatus }));
        setToastMessage(`Status updated to "${newStatus}"`);
      }
    } catch { setToastMessage('Failed to update status'); }
  };

  const deleteRequest = async (id) => {
    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${password}` },
        body: JSON.stringify({ id, status: 'Cancelled' })
      });
      if (res.ok) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Cancelled' } : r));
        if (selectedRequest?.id === id) setSelectedRequest(prev => ({ ...prev, status: 'Cancelled' }));
        setDeleteConfirm(null);
        setToastMessage('Request cancelled');
      }
    } catch { setToastMessage('Failed to cancel'); }
  };

  // ─── Computed data ────────────────────────────────────────────────────
  const filteredRequests = useMemo(() => {
    let list = [...requests];
    // Status filter
    if (statusFilter !== 'All') list = list.filter(r => r.status === statusFilter);
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r =>
        r.client_name?.toLowerCase().includes(q) ||
        r.client_email?.toLowerCase().includes(q) ||
        r.dest_primary?.toLowerCase().includes(q) ||
        r.dest_secondary?.toLowerCase().includes(q)
      );
    }
    // Sort
    switch (sortBy) {
      case 'newest': list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break;
      case 'oldest': list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); break;
      case 'name':   list.sort((a, b) => (a.client_name || '').localeCompare(b.client_name || '')); break;
      case 'trip':   list.sort((a, b) => new Date(a.date_start || 0) - new Date(b.date_start || 0)); break;
    }
    return list;
  }, [requests, statusFilter, searchQuery, sortBy]);

  const stats = useMemo(() => {
    const total = requests.length;
    const newCount = requests.filter(r => r.status === 'New').length;
    const inProgress = requests.filter(r => r.status === 'In Progress').length;
    const completed = requests.filter(r => r.status === 'Completed').length;
    const revenue = requests.filter(r => r.status !== 'Cancelled').reduce((s, r) => s + getPlanPrice(r.plan_interest), 0);
    return { total, newCount, inProgress, completed, revenue };
  }, [requests]);

  // ─── Login screen ─────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-emerald-500/25">✈️</div>
            <h1 className="text-2xl font-bold text-white mb-1">TrueRoute Admin</h1>
            <p className="text-slate-400 text-sm">Enter your password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">{error}</div>}
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all mb-4"
              autoFocus
            />
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Stat card helper ─────────────────────────────────────────────────
  const StatCard = ({ label, value, icon, color, sub }) => (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
          <p className={`text-2xl sm:text-3xl font-bold mt-1 ${color}`}>{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );

  // ─── Detail pane ──────────────────────────────────────────────────────
  const DetailPane = () => {
    if (!selectedRequest) return null;
    const r = selectedRequest;
    const sc = STATUS_CONFIG[r.status] || STATUS_CONFIG['New'];
    const hasMobility = r.mob_walker || r.mob_wheelchair || r.mob_stairs || r.mob_stroller;

    return (
      <div className={`fixed inset-0 z-50 lg:static lg:inset-auto lg:z-auto ${selectedRequest ? '' : 'hidden'}`}>
        {/* Overlay on mobile */}
        <div className="fixed inset-0 bg-black/50 lg:hidden" onClick={() => setSelectedRequest(null)} />

        <div className="fixed inset-y-0 right-0 w-full max-w-lg lg:max-w-none lg:static lg:w-auto bg-white lg:rounded-xl lg:border lg:border-slate-200/80 shadow-2xl lg:shadow-sm overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-100 p-4 sm:p-5 z-10">
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setSelectedRequest(null)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
                {Icons.arrowLeft} <span className="hidden sm:inline">Back</span>
              </button>
              <div className="flex items-center gap-2">
                <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)}
                  className={`text-xs font-bold uppercase px-3 py-1.5 rounded-lg border outline-none cursor-pointer ${sc.bg} ${sc.text} ${sc.border}`}>
                  {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {r.status !== 'Cancelled' && (
                  <button onClick={() => setDeleteConfirm(r.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                    {Icons.trash}
                  </button>
                )}
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{r.client_name}</h2>
            <a href={`mailto:${r.client_email}`} className="text-sm text-emerald-600 hover:underline flex items-center gap-1 mt-0.5">
              {Icons.mail} {r.client_email}
            </a>
            <p className="text-xs text-slate-400 mt-2">Submitted {timeAgo(r.created_at)}</p>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 space-y-6">
            {/* Trip Overview Banner */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-emerald-600 font-medium block mb-0.5">📍 Destination</span>
                  <p className="font-bold text-slate-800">{r.dest_primary}</p>
                  {r.dest_secondary && <p className="text-sm text-slate-600">+ {r.dest_secondary}</p>}
                </div>
                <div>
                  <span className="text-xs text-emerald-600 font-medium block mb-0.5">📅 Duration</span>
                  <p className="font-bold text-slate-800">{tripDuration(r.date_start, r.date_end)}</p>
                  <p className="text-xs text-slate-500">{formatDate(r.date_start)} → {formatDate(r.date_end)}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-xs text-emerald-600 font-medium block mb-0.5">💳 Plan</span>
                  <p className="font-bold text-slate-800">{r.plan_interest?.split('—')[0]?.trim()}</p>
                  <p className="text-sm font-semibold text-emerald-600">${getPlanPrice(r.plan_interest)}</p>
                </div>
              </div>
            </div>

            {/* Party Details */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">{Icons.users} Travel Party</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                  <p className="text-2xl font-bold text-slate-800">{r.num_adults || 0}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Adults</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                  <p className="text-2xl font-bold text-slate-800">{r.num_seniors || 0}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Seniors</p>
                  {r.ages_seniors && <p className="text-[10px] text-slate-400 mt-0.5">Ages: {r.ages_seniors}</p>}
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                  <p className="text-2xl font-bold text-slate-800">{r.num_kids || 0}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Children</p>
                  {r.ages_kids && <p className="text-[10px] text-slate-400 mt-0.5">Ages: {r.ages_kids}</p>}
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">{r.traveller_count || 0} travellers total</p>
            </div>

            {/* Preferences */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">{Icons.star} Preferences</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
                  <span className="text-sm text-slate-600">Travel Pace</span>
                  <span className="text-sm font-semibold text-slate-800">{r.pace || '—'}</span>
                </div>
                {r.accommodation && (
                  <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
                    <span className="text-sm text-slate-600">Accommodation</span>
                    <span className="text-sm font-semibold text-slate-800">{r.accommodation}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mobility */}
            {hasMobility && (
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">♿ Mobility Needs</h3>
                <div className="flex flex-wrap gap-2">
                  {r.mob_walker && <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-full font-medium">🦯 Walker/Cane</span>}
                  {r.mob_wheelchair && <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-full font-medium">♿ Wheelchair</span>}
                  {r.mob_stairs && <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-full font-medium">🚫 No Stairs</span>}
                  {r.mob_stroller && <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-full font-medium">👶 Stroller</span>}
                </div>
              </div>
            )}

            {/* Dietary & Notes */}
            {(r.dietary || r.notes) && (
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">📝 Additional Info</h3>
                <div className="space-y-3">
                  {r.dietary && (
                    <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-100">
                      <span className="text-xs font-semibold text-amber-700 block mb-1">Dietary Restrictions</span>
                      <p className="text-sm text-slate-700">{r.dietary}</p>
                    </div>
                  )}
                  {r.notes && (
                    <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100">
                      <span className="text-xs font-semibold text-blue-700 block mb-1">Notes</span>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{r.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
              <a href={`mailto:${r.client_email}?subject=Your TrueRoute Itinerary — ${r.dest_primary}&body=Hi ${r.client_name?.split(' ')[0]},%0D%0A%0D%0AThank you for choosing TrueRoute!`}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white text-sm font-semibold py-2.5 px-4 rounded-xl hover:bg-emerald-700 transition-colors min-w-[140px]">
                {Icons.mail} Email Client
              </a>
              {r.status === 'New' && (
                <button onClick={() => updateStatus(r.id, 'In Progress')}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white text-sm font-semibold py-2.5 px-4 rounded-xl hover:bg-amber-600 transition-colors min-w-[140px]">
                  {Icons.clock} Start Working
                </button>
              )}
              {r.status === 'In Progress' && (
                <button onClick={() => updateStatus(r.id, 'Completed')}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white text-sm font-semibold py-2.5 px-4 rounded-xl hover:bg-emerald-600 transition-colors min-w-[140px]">
                  {Icons.check} Mark Complete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Delete confirmation modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="font-bold text-lg text-slate-800 mb-2">Cancel this request?</h3>
              <p className="text-sm text-slate-500 mb-6">This will mark the request as cancelled. This action can be undone by changing the status back.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">Keep</button>
                <button onClick={() => deleteRequest(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-semibold text-sm hover:bg-rose-600 transition-colors">Cancel Request</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── Main dashboard ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-lg shadow-sm">✈️</div>
            <div>
              <span className="font-bold text-slate-800 text-sm sm:text-base block leading-tight">TrueRoute</span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:block">Admin Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={refreshData} disabled={loading}
              className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh Data">
              <span className={loading ? 'animate-spin inline-block' : ''}>{Icons.refresh}</span>
            </button>
            <button onClick={() => exportCSV(filteredRequests)}
              className="hidden sm:flex items-center gap-1.5 text-sm text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors font-medium"
              title="Export CSV">
              {Icons.download} <span>Export</span>
            </button>
            <button onClick={() => { setIsAuthenticated(false); setPassword(''); setRequests([]); setSelectedRequest(null); }}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Logout">
              {Icons.logout}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <StatCard label="Total" value={stats.total} icon="📋" color="text-slate-800" sub="All time" />
          <StatCard label="New" value={stats.newCount} icon="🆕" color="text-sky-600" sub="Awaiting action" />
          <StatCard label="In Progress" value={stats.inProgress} icon="⏳" color="text-amber-600" sub="Being prepared" />
          <StatCard label="Completed" value={stats.completed} icon="✅" color="text-emerald-600" sub="Delivered" />
          <StatCard label="Revenue" value={`$${stats.revenue.toLocaleString()}`} icon="💰" color="text-emerald-600" sub="Potential" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{Icons.search}</div>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or destination..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" />
            </div>
            <div className="flex gap-2 sm:gap-3">
              {/* Status filter */}
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 outline-none focus:border-emerald-400 cursor-pointer flex-1 sm:flex-none">
                <option value="All">All Status</option>
                {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {/* Sort */}
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 outline-none focus:border-emerald-400 cursor-pointer flex-1 sm:flex-none">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A–Z</option>
                <option value="trip">Trip Date</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">{filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found</p>
            <button onClick={() => exportCSV(filteredRequests)} className="sm:hidden text-xs text-emerald-600 font-semibold flex items-center gap-1">
              {Icons.download} Export CSV
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex gap-6">
          {/* List */}
          <div className={`flex-1 lg:flex-none lg:w-[420px] ${selectedRequest ? 'hidden lg:block' : ''}`}>
            <div className="space-y-2">
              {filteredRequests.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="font-semibold text-slate-600">No requests found</p>
                  <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                filteredRequests.map(req => {
                  const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG['New'];
                  return (
                    <div key={req.id} onClick={() => setSelectedRequest(req)}
                      className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all group ${
                        selectedRequest?.id === req.id ? 'border-emerald-300 shadow-md ring-2 ring-emerald-100' : 'border-slate-200/80 hover:border-slate-300'
                      }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot}`} />
                          <h3 className="font-semibold text-slate-800 truncate text-sm">{req.client_name}</h3>
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ml-2 ${sc.bg} ${sc.text} ${sc.border}`}>
                          {req.status}
                        </span>
                      </div>
                      <div className="ml-[18px] space-y-1">
                        <p className="text-sm text-slate-600 truncate">📍 {req.dest_primary} {req.dest_secondary && `→ ${req.dest_secondary}`}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>📅 {formatDate(req.date_start)}</span>
                          <span>👥 {req.traveller_count}</span>
                          <span className="ml-auto font-medium text-emerald-600">${getPlanPrice(req.plan_interest)}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{timeAgo(req.created_at)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Detail */}
          <div className={`flex-1 ${selectedRequest ? '' : 'hidden lg:flex lg:items-center lg:justify-center'}`}>
            {selectedRequest ? (
              <DetailPane />
            ) : (
              <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center w-full">
                <p className="text-5xl mb-4">✈️</p>
                <p className="font-semibold text-slate-600 text-lg">Select a request</p>
                <p className="text-sm text-slate-400 mt-1">Click on any request to view full details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-[slideUp_0.3s_ease-out]">
          {Icons.check} {toastMessage}
        </div>
      )}
    </div>
  );
}
