'use client';

import React, { useState } from 'react';
import { useFarmer } from '@/context/FarmerContext';
import { useAuth } from '@/context/AuthContext';
import { FarmerLayout } from '@/components/farmer/FarmerLayout';
import {
  User,
  MapPin,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Edit2,
  Save,
  Sprout
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FarmerProfilePage() {
  const { user } = useAuth();
  const { profile, updateProfile } = useFarmer();
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields state
  const [farmerName, setFarmerName] = useState(profile.farmerName);
  const [phone, setPhone] = useState(profile.phone);
  const [farmName, setFarmName] = useState(profile.farmName);
  const [village, setVillage] = useState(profile.village);
  const [district, setDistrict] = useState(profile.district);
  const [state, setState] = useState(profile.state);
  const [pinCode, setPinCode] = useState(profile.pinCode);
  const [farmType, setFarmType] = useState(profile.farmType);
  const [farmSize, setFarmSize] = useState(profile.farmSize);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      farmerName,
      phone,
      farmName,
      village,
      district,
      state,
      pinCode,
      farmType,
      farmSize
    });
    setIsEditing(false);
  };

  return (
    <FarmerLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>👨‍🌾</span>
              <span>Farmer Profile & Mandi Credentials</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Verified APMC registry credentials, Soil Health Card diagnostics, and farm location
            </p>
          </div>

          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="self-start sm:self-auto bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold h-9 px-4 rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </Button>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="h-20 w-20 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-2xl flex items-center justify-center shrink-0 border-2 border-emerald-300 shadow-xs">
              {(profile.farmerName || 'RF').slice(0, 2).toUpperCase()}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                  {profile.farmerName}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>KYC Status: {profile.kycStatus}</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                {profile.farmName} • {profile.village}, {profile.district} ({profile.state})
              </p>
              <p className="text-xs text-emerald-800 font-bold pt-1">
                Soil Health Diagnosis: {profile.soilHealthGrade}
              </p>
            </div>
          </div>

          {/* Edit Form or View Grid */}
          {isEditing ? (
            <form onSubmit={handleSave} className="pt-6 border-t border-gray-100 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Farmer Full Name</label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Registered Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Farm / Agribusiness Name</label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="w-full px-3.5 py-2.5 font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Farm Holding Size</label>
                  <input
                    type="text"
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Village / Gram</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3.5 py-2.5 font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="text-xs h-9 rounded-xl border-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="text-xs h-9 rounded-xl bg-[#994200] hover:bg-[#7A3400] text-white font-bold"
                >
                  <Save className="h-3.5 w-3.5 mr-1" />
                  Save Credentials
                </Button>
              </div>
            </form>
          ) : (
            <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-200/60">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Registered Phone</span>
                <span className="font-bold text-gray-900 mt-0.5 block">{profile.phone}</span>
              </div>
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-200/60">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Email Address</span>
                <span className="font-bold text-gray-900 mt-0.5 block">{profile.email}</span>
              </div>
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-200/60">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Holding Size</span>
                <span className="font-bold text-gray-900 mt-0.5 block">{profile.farmSize}</span>
              </div>
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-200/60">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Farm Category</span>
                <span className="font-bold text-gray-900 mt-0.5 block">{profile.farmType}</span>
              </div>
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-200/60">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Mandi Cluster</span>
                <span className="font-bold text-gray-900 mt-0.5 block">{profile.district} APMC (Zone 4)</span>
              </div>
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-200/60">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Postal PIN</span>
                <span className="font-bold text-gray-900 mt-0.5 block">{profile.pinCode}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </FarmerLayout>
  );
}
