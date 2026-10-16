import React, { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, Sparkles, DollarSign, Clock } from 'lucide-react';
import { api } from '../../api/client';

function ServiceCard({ service, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl bg-white border border-stone-200 p-4 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-amber-600">
          <Sparkles className="h-7 w-7" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-stone-900">{service.name}</h4>
              <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{service.description}</p>
            </div>
            <div className="flex gap-1 ml-2">
              <button onClick={() => onEdit(service)} className="p-2 rounded-lg bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-700 transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => onDelete(service.id)} className="p-2 rounded-lg bg-stone-100 text-stone-600 hover:bg-red-100 hover:text-red-700 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-700">
              <DollarSign className="h-4 w-4" />
              {service.price?.toFixed(2)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-stone-500">
              <Clock className="h-3 w-3" />
              {service.durationMinutes || 60} min
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceModal({ service, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    durationMinutes: 60, // ← POR DEFECTO 60 MINUTOS
    ...service,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      price: parseFloat(form.price) || 0,
      durationMinutes: parseInt(form.durationMinutes) || 60,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-stone-900">{service ? 'Edit Service' : 'New Service'}</h3>
          <button onClick={onClose} className="p-2 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Service Name</label>
            <input type="text" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Price ($)</label>
              <input type="number" step="0.01" value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} required className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Duration (min)</label>
              <input type="number" value={form.durationMinutes} onChange={e => setForm(p => ({...p, durationMinutes: e.target.value}))} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} rows={3} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
          </div>
          <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-[#5d4037] to-[#a1887f] py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all">
            {service ? 'Update Service' : 'Create Service'}
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminServicesView() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const loadServices = () => {
    setLoading(true);
    api.getAdminServices(1, 100)
      .then(data => {
        console.log('Services loaded:', data);
        setServices(data);
      })
      .catch(err => {
        console.error('Error loading services:', err);
        alert('Failed to load services: ' + err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleCreate = async (data) => {
    try {
      console.log('Creating service:', data);
      await api.createService(data);
      setModalOpen(false);
      loadServices();
    } catch (err) {
      console.error('Create error:', err);
      alert('Failed to create: ' + err.message);
    }
  };

    const handleEdit = async (data) => {
    console.log('Editing service:', editingService); // ← Mira el objeto completo
    console.log('Service ID:', editingService?.id);  // ← ¿Es undefined?
    console.log('Data to send:', JSON.stringify(data, null, 2));
  
    try {
    await api.updateService(editingService.id, data);
      console.log('Updating service:', editingService.id, data);
      await api.updateService(editingService.id, data);
      setModalOpen(false);
      setEditingService(null);
      loadServices();
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      console.log('Deleting service:', id);
      await api.deleteService(id);
      loadServices();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete: ' + err.message);
    }
  };

  const filtered = services.filter(s => 
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Services</h2>
          <p className="text-sm text-stone-500 mt-1">{services.length} services offered</p>
        </div>
        <button 
          onClick={() => { setEditingService(null); setModalOpen(true); }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5d4037] to-[#a1887f] px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      <div className="relative">
        <Search className="absolute inset-y-0 left-0 ml-4 h-5 w-5 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services..."
          className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-12 pr-4 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 placeholder:text-stone-400"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-white border border-stone-200">
            <Sparkles className="mx-auto h-12 w-12 text-stone-300 mb-3" />
            <p className="text-stone-500 text-sm">No services found</p>
          </div>
        ) : (
          filtered.map(service => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              onEdit={(s) => { setEditingService(s); setModalOpen(true); }}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {modalOpen && (
        <ServiceModal
          service={editingService}
          onClose={() => { setModalOpen(false); setEditingService(null); }}
          onSave={editingService ? handleEdit : handleCreate}
        />
      )}
    </div>
  );
}