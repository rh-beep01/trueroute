'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

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
        setRequests(data.requests);
        setIsAuthenticated(true);
      } else {
        const errData = await res.json();
        if (res.status === 401) {
          setError('Invalid password');
        } else {
          setError(errData.error || 'A server error occurred. Check your Supabase configuration.');
        }
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ id, status: newStatus })
      });
      
      if (res.ok) {
        setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest({ ...selectedRequest, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">Admin Login</h1>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Admin Password"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#2E6F40] focus:border-transparent outline-none mb-4"
          />
          <button type="submit" disabled={loading} className="w-full bg-[#2E6F40] text-white py-3 rounded-lg font-semibold hover:bg-[#235832] transition-colors">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="flex gap-6 relative">
      {/* List View */}
      <div className={`flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${selectedRequest ? 'hidden lg:block lg:w-1/3 lg:flex-none' : ''}`}>
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="font-bold text-slate-800">Itinerary Requests</h2>
          <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full font-semibold">{requests.length} total</span>
        </div>
        <div className="divide-y divide-slate-100 max-h-[80vh] overflow-y-auto">
          {requests.length === 0 ? (
            <p className="p-8 text-center text-slate-500">No requests found.</p>
          ) : (
            requests.map(req => (
              <div 
                key={req.id} 
                onClick={() => setSelectedRequest(req)}
                className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedRequest?.id === req.id ? 'bg-slate-50 border-l-4 border-l-[#2E6F40]' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-800 truncate">{req.client_name}</h3>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusColor(req.status)}`}>{req.status}</span>
                </div>
                <p className="text-sm text-slate-600 truncate mb-1">🌍 {req.dest_primary} {req.dest_secondary && `& ${req.dest_secondary}`}</p>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>{new Date(req.created_at).toLocaleDateString()}</span>
                  <span>{req.plan_interest.split('—')[0].trim()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail View */}
      {selectedRequest && (
        <div className="flex-[2] bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-6">
            <div>
              <button onClick={() => setSelectedRequest(null)} className="lg:hidden text-sm text-blue-600 font-semibold mb-2 flex items-center gap-1">← Back to List</button>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">{selectedRequest.client_name}</h2>
              <a href={`mailto:${selectedRequest.client_email}`} className="text-blue-600 hover:underline">{selectedRequest.client_email}</a>
            </div>
            <div className="flex gap-2">
              <select 
                value={selectedRequest.status}
                onChange={(e) => updateStatus(selectedRequest.id, e.target.value)}
                className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:border-[#2E6F40]"
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Trip Details</h3>
              <dl className="space-y-3 text-sm">
                <div><dt className="text-slate-500 mb-0.5">Primary Destination</dt><dd className="font-semibold">{selectedRequest.dest_primary}</dd></div>
                {selectedRequest.dest_secondary && <div><dt className="text-slate-500 mb-0.5">Secondary Destination</dt><dd className="font-semibold">{selectedRequest.dest_secondary}</dd></div>}
                <div><dt className="text-slate-500 mb-0.5">Dates</dt><dd className="font-semibold">{selectedRequest.date_start} to {selectedRequest.date_end}</dd></div>
                <div><dt className="text-slate-500 mb-0.5">Plan Selected</dt><dd className="font-semibold">{selectedRequest.plan_interest}</dd></div>
                <div><dt className="text-slate-500 mb-0.5">Travel Pace</dt><dd className="font-semibold">{selectedRequest.pace}</dd></div>
                {selectedRequest.accommodation && <div><dt className="text-slate-500 mb-0.5">Accommodation Style</dt><dd className="font-semibold">{selectedRequest.accommodation}</dd></div>}
              </dl>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Party Details ({selectedRequest.traveller_count} Total)</h3>
              <dl className="space-y-3 text-sm">
                <div><dt className="text-slate-500 mb-0.5">Adults</dt><dd className="font-semibold">{selectedRequest.num_adults}</dd></div>
                <div><dt className="text-slate-500 mb-0.5">Seniors (65+)</dt><dd className="font-semibold">{selectedRequest.num_seniors} {selectedRequest.ages_seniors && `(Ages: ${selectedRequest.ages_seniors})`}</dd></div>
                <div><dt className="text-slate-500 mb-0.5">Children</dt><dd className="font-semibold">{selectedRequest.num_kids} {selectedRequest.ages_kids && `(Ages: ${selectedRequest.ages_kids})`}</dd></div>
              </dl>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Special Requirements</h3>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4 text-sm">
              <div>
                <span className="text-slate-500 block mb-1">Mobility Requirements:</span>
                <ul className="list-disc pl-5 font-semibold">
                  {selectedRequest.mob_walker && <li>Cane or walker in use</li>}
                  {selectedRequest.mob_wheelchair && <li>Wheelchair required</li>}
                  {selectedRequest.mob_stairs && <li>Must avoid stairs entirely</li>}
                  {selectedRequest.mob_stroller && <li>Stroller / pram for toddler</li>}
                  {!selectedRequest.mob_walker && !selectedRequest.mob_wheelchair && !selectedRequest.mob_stairs && !selectedRequest.mob_stroller && <li className="font-normal text-slate-500 list-none -ml-5">None specified</li>}
                </ul>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Dietary Restrictions:</span>
                <p className="font-semibold">{selectedRequest.dietary || 'None specified'}</p>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Additional Notes:</span>
                <p className="font-semibold whitespace-pre-wrap">{selectedRequest.notes || 'None specified'}</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
