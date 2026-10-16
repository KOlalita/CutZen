import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, ChevronUp, Users, Phone, Calendar, Mail, UserCheck } from 'lucide-react';
import { api } from '../../api/client';

function ClientCard({ client }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl bg-white border border-stone-200 shadow-sm overflow-hidden">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-blue-700 font-bold text-lg">
          {(client.names || client.userName || 'C').charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-stone-900 truncate">{client.names} {client.lastNames}</h4>
          <p className="text-xs text-stone-500">@{client.userName}</p>
        </div>
        {expanded ? <ChevronUp className="h-5 w-5 text-stone-400" /> : <ChevronDown className="h-5 w-5 text-stone-400" />}
      </button>
      
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-stone-100 pt-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-stone-400" />
              <span className="text-stone-600">{client.phoneNumber || 'No phone'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-stone-400" />
              <span className="text-stone-600">{client.age ? `${client.age} years` : 'No age'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-stone-400" />
            <span className="text-stone-600">{client.userName}</span>
          </div>
          {client.desciption && (
            <p className="text-sm text-stone-500 bg-stone-50 rounded-lg p-3">{client.desciption}</p>
          )}
        </div>
      )}
    </div>
  );
}

export function AdminClientsView() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getUsers('Client', search)
      .then(data => setClients(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Clients</h2>
        <div className="flex items-center gap-2 mt-1">
          <UserCheck className="h-4 w-4 text-blue-600" />
          <p className="text-sm text-stone-500">{clients.length} registered clients</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute inset-y-0 left-0 ml-4 h-5 w-5 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-12 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-stone-400"
        />
      </div>

      {/* Counter Badge */}
      <div className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 p-3">
        <Users className="h-5 w-5 text-blue-600" />
        <div>
          <p className="text-lg font-bold text-blue-900">{clients.length}</p>
          <p className="text-xs text-blue-600">Total Clients</p>
        </div>
      </div>

      <div className="space-y-3">
        {clients.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-white border border-stone-200">
            <Users className="mx-auto h-12 w-12 text-stone-300 mb-3" />
            <p className="text-stone-500 text-sm">No clients found</p>
          </div>
        ) : (
          clients.map(client => <ClientCard key={client.id} client={client} />)
        )}
      </div>
    </div>
  );
}