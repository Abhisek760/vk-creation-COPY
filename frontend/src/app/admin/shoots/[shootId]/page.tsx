'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShootScheduleEvent } from '@/types/shoot';
import { ShootRepository } from '@/lib/shootRepository';

export default function ShootDetailPage() {
  const params = useParams();
  const shootId = params.shootId as string;

  const [shoot, setShoot] = useState<ShootScheduleEvent | null>(null);

  useEffect(() => {
    if (shootId) {
      const found = ShootRepository.getById(shootId);
      setShoot(found);
    }
  }, [shootId]);

  if (!shoot) {
    return (
      <div className="min-h-screen bg-stone-950 p-10 text-stone-100 flex flex-col items-center justify-center">
        <p className="text-stone-400 text-sm">Shoot event #{shootId} not found.</p>
        <Link href="/admin/shoots" className="mt-4 text-amber-500 font-bold hover:underline">
          ← Back to Shoot Management
        </Link>
      </div>
    );
  }

  const handleToggleItem = (itemId: string) => {
    const updated = ShootRepository.toggleChecklistItem(shoot.id, itemId);
    if (updated) setShoot(updated);
  };

  const completedCount = shoot.checklist.filter((i) => i.isCompleted).length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-6 md:p-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-stone-100">{shoot.clientName}</h1>
            <span className="font-mono text-amber-500 font-bold bg-stone-900 border border-stone-800 px-3 py-1 rounded-lg text-sm">
              {shoot.eventCategory}
            </span>
          </div>
          <p className="text-sm text-stone-400 mt-1">
            📍 {shoot.venue}, {shoot.city} • Event Date: {shoot.eventDate}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/shoots"
            className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-sm font-medium text-stone-200 hover:bg-stone-800"
          >
            ← Back to All Shoots
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): On-Site Shot Checklist */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-amber-500">On-Site Interactive Shot Checklist</h2>
                <p className="text-xs text-stone-400">
                  Toggle shots as your lead photographers capture them live on set.
                </p>
              </div>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {completedCount}/{shoot.checklist.length} Done
              </span>
            </div>

            <div className="space-y-2">
              {shoot.checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleItem(item.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                    item.isCompleted
                      ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                      : 'bg-stone-950 border-stone-800 text-stone-200 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.isCompleted}
                      onChange={() => {}}
                      className="rounded border-stone-700 text-amber-500 h-4 w-4"
                    />
                    <span className={`text-xs font-semibold ${item.isCompleted ? 'line-through text-stone-500' : ''}`}>
                      {item.title}
                    </span>
                  </div>
                  <span className="rounded bg-stone-900 border border-stone-800 px-2.5 py-0.5 text-[10px] font-bold text-stone-400">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Crew Roster & Shoot Specs */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
            <h2 className="text-lg font-bold text-amber-500">Shoot Call Sheet</h2>

            <div className="space-y-2 text-xs text-stone-300 bg-stone-950 p-4 rounded-xl border border-stone-800">
              <div className="flex justify-between py-1 border-b border-stone-800">
                <span className="text-stone-400">Call Time:</span>
                <strong className="text-amber-400 font-mono text-sm">{shoot.callTime}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-800">
                <span className="text-stone-400">Ceremony Start:</span>
                <strong className="text-stone-200 font-mono">{shoot.startTime}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-400">Lead Master:</span>
                <strong className="text-stone-200">{shoot.leadPhotographer}</strong>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-stone-300 block">Assigned Crew Members:</span>
              {shoot.crew.map((member) => (
                <div key={member.id} className="flex justify-between items-center bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs">
                  <div>
                    <strong className="text-stone-200 block">{member.name}</strong>
                    <span className="text-amber-500 text-[10px] font-semibold">{member.role}</span>
                  </div>
                  <span className="text-stone-400 font-mono text-[11px]">{member.phone}</span>
                </div>
              ))}
            </div>

            {shoot.specialInstructions && (
              <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-300 space-y-1">
                <strong className="block font-bold">Special Creative Brief:</strong>
                <p className="text-[11px] text-amber-200/80">{shoot.specialInstructions}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}