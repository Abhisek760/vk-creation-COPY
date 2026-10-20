'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudioOperationsRepository } from '@/lib/studioOperationsRepository';
import { TeamMember, OperationalTask, StudioNotification } from '@/types/operations';

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<OperationalTask[]>([]);
  const [notifications, setNotifications] = useState<StudioNotification[]>([]);

  useEffect(() => {
    setMembers(StudioOperationsRepository.getTeamMembers());
    setTasks(StudioOperationsRepository.getTasks());
    setNotifications(StudioOperationsRepository.getNotifications());
  }, []);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Studio Operations</span>
          <h1 className="text-3xl font-extrabold text-stone-100 mt-1">Team Management & Task Assignments</h1>
          <p className="text-sm text-stone-400 mt-0.5">
            Role-based permissions, crew availability, pending task trackers, and system alerts.
          </p>
        </div>

        <Link
          href="/admin?settings=open"
          className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-xs font-semibold text-stone-200 hover:bg-stone-800"
        >
          🌐Back to settings 
        </Link>
      </div>

      {/* Notifications & System Alerts */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
        <h2 className="text-lg font-bold text-amber-500">System Notifications & Operational Alerts</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border text-xs space-y-1 ${
                notif.severity === 'Critical'
                  ? 'bg-red-950/40 border-red-800 text-red-200'
                  : notif.severity === 'Warning'
                  ? 'bg-amber-950/40 border-amber-800 text-amber-200'
                  : 'bg-stone-950 border-stone-800 text-stone-300'
              }`}
            >
              <div className="flex justify-between font-bold">
                <span>{notif.type}</span>
                <span className="text-[10px] font-mono opacity-80">{notif.date}</span>
              </div>
              <strong className="block text-stone-100">{notif.title}</strong>
              <p className="opacity-90">{notif.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Roster Grid */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
        <h2 className="text-lg font-bold text-amber-500">Studio Crew Roster</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <div key={m.id} className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-stone-100 text-sm">{m.name}</h3>
                  <span className="text-amber-400 font-semibold">{m.role}</span>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-900 text-stone-300 border border-stone-800">
                  {m.status}
                </span>
              </div>

              <div className="text-stone-400 space-y-0.5">
                <p>📞 {m.phone}</p>
                <p>✉️ {m.email}</p>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between text-stone-400">
                <span>Active Bookings:</span>
                <strong className="text-stone-200 font-mono">{m.activeAssignmentsCount}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks Table */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
        <h2 className="text-lg font-bold text-amber-500">Active Tasks & Deadlines</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-stone-800 uppercase text-stone-400">
              <tr>
                <th className="py-3 px-4">Task Description</th>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Assigned Crew</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 font-medium">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-stone-800/40">
                  <td className="py-3.5 px-4 font-bold text-stone-200">{task.taskTitle}</td>
                  <td className="py-3.5 px-4 font-mono text-amber-400">{task.bookingNumber}</td>
                  <td className="py-3.5 px-4 text-stone-300">{task.assignedTo} ({task.assignedRole})</td>
                  <td className="py-3.5 px-4 font-mono text-stone-400">{task.dueDate}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        task.priority === 'Urgent'
                          ? 'bg-red-950 text-red-400'
                          : task.priority === 'High'
                          ? 'bg-amber-950 text-amber-400'
                          : 'bg-stone-900 text-stone-400'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-stone-300">{task.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}