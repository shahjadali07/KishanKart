'use client';

import React, { useState } from 'react';
import { BuyerLayout } from '@/components/buyer/BuyerLayout';
import { useBuyer } from '@/context/BuyerContext';
import { BuyerAddress } from '@/types/buyer';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Home,
  Building,
  Navigation,
  X
} from 'lucide-react';

export default function BuyerAddressesPage() {
  const {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  } = useBuyer();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [houseStreet, setHouseStreet] = useState('');
  const [villageCity, setVillageCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [pinCode, setPinCode] = useState('');
  const [type, setType] = useState<'Home' | 'Work' | 'Other'>('Work');
  const [isDefault, setIsDefault] = useState(false);

  const openAddModal = () => {
    setEditingId(null);
    setFullName('');
    setPhone('');
    setHouseStreet('');
    setVillageCity('');
    setDistrict('');
    setState('Uttar Pradesh');
    setPinCode('');
    setType('Work');
    setIsDefault(addresses.length === 0);
    setModalOpen(true);
  };

  const openEditModal = (addr: BuyerAddress) => {
    setEditingId(addr.id);
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setHouseStreet(addr.houseStreet);
    setVillageCity(addr.villageCity);
    setDistrict(addr.district);
    setState(addr.state);
    setPinCode(addr.pinCode);
    setType(addr.type);
    setIsDefault(addr.isDefault);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !houseStreet) return;

    if (editingId) {
      updateAddress(editingId, {
        fullName,
        phone,
        houseStreet,
        villageCity,
        district,
        state,
        pinCode,
        type,
        isDefault
      });
      if (isDefault) setDefaultAddress(editingId);
    } else {
      addAddress({
        fullName,
        phone,
        houseStreet,
        villageCity,
        district,
        state,
        pinCode,
        type,
        isDefault
      });
    }

    setModalOpen(false);
  };

  return (
    <BuyerLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Warehouse & Delivery Facilities
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage verified freight destination addresses, storage yards and processing plant locations
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold rounded-xl transition shadow-xs self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Add New Facility Address
          </button>
        </div>

        {/* Addresses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-3xl border p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4 ${
                addr.isDefault
                  ? 'border-[#994200] ring-1 ring-[#994200]/20'
                  : 'border-gray-200/90'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 uppercase tracking-wider flex items-center gap-1">
                    {addr.type === 'Work' ? <Building className="h-3 w-3" /> : <Home className="h-3 w-3" />}
                    {addr.type} Facility
                  </span>

                  {addr.isDefault && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 bg-amber-50 text-[#994200] rounded-full border border-amber-200">
                      Primary Destination
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-gray-900 text-sm">
                  {addr.fullName}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {addr.houseStreet}, {addr.villageCity}, {addr.district}, {addr.state} - {addr.pinCode}
                </p>

                <p className="text-xs text-gray-400 font-mono">
                  Phone: {addr.phone}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div>
                  {!addr.isDefault && (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="font-bold text-[#994200] hover:underline"
                    >
                      Set as Default
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(addr)}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                    title="Edit Address"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Delete Address"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Add/Edit Address */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold text-base text-gray-900">
                  {editingId ? 'Edit Facility Address' : 'Add New Warehouse / Facility'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Company / Facility Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharma Foods Processing Hub"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Plot / Street / Area</label>
                  <input
                    type="text"
                    required
                    placeholder="Plot 42, Transport Nagar"
                    value={houseStreet}
                    onChange={(e) => setHouseStreet(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">City / Mandi</label>
                    <input
                      type="text"
                      required
                      placeholder="Lucknow"
                      value={villageCity}
                      onChange={(e) => setVillageCity(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">District</label>
                    <input
                      type="text"
                      required
                      placeholder="Lucknow"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      placeholder="226012"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Facility Type</label>
                  <div className="flex gap-2">
                    {(['Work', 'Home', 'Other'] as const).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setType(t)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                          type === t
                            ? 'bg-[#994200] text-white border-[#994200]'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-1 font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="accent-[#994200] rounded"
                  />
                  Set as primary delivery destination
                </label>

                <div className="pt-3 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border rounded-xl text-gray-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#994200] text-white rounded-xl font-bold shadow-xs"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </BuyerLayout>
  );
}
