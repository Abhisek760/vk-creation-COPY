'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { OperationalTask } from '@/types/team';
import { getStoredBookings } from '@/lib/storage';

export default function AdminCalendarPage() {
  const [tasks, setTasks] = useState<OperationalTask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formState, setFormState] = useState({
    title: '',
    bookingNumber: 'VKCREATION-2026-001',
    customerName: 'Rahul & Sneha',
    assignedMemberName: 'Karan Malhotra (Editor)',
    dueDate: '2026-11-25',
    category: 'Editing' as const,
    priority: 'High' as const,
  });

  useEffect(() => {
    const bookings = getStoredBookings();

    const mockTasks: OperationalTask[] = [
      {
        id: 'tsk-1',
        title: 'Wedding Highlight Video Teaser Edit',
        bookingNumber: bookings[0]?.bookingNumber || 'VKCREATION-2026-001',
        customerName: bookings[0]?.customerName || 'Rahul & Sneha',
        assignedMemberId: 'tm-4',
        assignedMemberName: 'Karan (Video Editor)',
        dueDate: '2026-11-25',
        category: 'Editing',
        priority: 'High',
        status: 'In Progress',
      },
      {
        id: 'tsk-2',
        title: 'Pre-Wedding Raw Photo Transfer to Drive',
        bookingNumber: bookings[1]?.bookingNumber || 'VKCREATION-2026-002',
        customerName: bookings[1]?.customerName || 'Priya & Ankit',
        assignedMemberId: 'tm-1',
        assignedMemberName: 'Aman (Lead Photo)',
        dueDate: '2026-10-10',
        category: 'Delivery',
        priority: 'Medium',
        status: 'Pending',
      },
      {
        id: 'tsk-3',
        title: 'Flush Mount Photobook Album Design Review',
        bookingNumber: 'VKCREATION-2026-001',
        customerName: 'Vikram & Ananya',
        assignedMemberId: 'tm-3',
        assignedMemberName: 'Priya (Candid)',
        dueDate: '2026-12-01',
        category: 'Album Design',
        priority: 'Low',
        status: 'Pending',
      },
    ];

    setTasks(mockTasks);
  }, []);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const created: OperationalTask = {
      id: `tsk-${Date.now()}`,
      title: formState.title,
      bookingNumber: formState.bookingNumber,
      customerName: formState.customerName,
      assignedMemberId: 'tm-1',
      assignedMemberName: formState.assignedMemberName,
      dueDate: formState.dueDate,
      category: formState.category,
      priority: formState.priority,
      status: 'Pending',
    };

    setTasks([created, ...tasks]);
    setIsModalOpen(false);
  };

  const handleToggleTaskStatus = (id: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'Pending' ? 'In Progress' : t.status === 'In Progress' ? 'Completed' : 'Pending';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-6 md:p-10">
      {/* Top Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-stone-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-100">Operational Task & Deadline Calendar</h1>
          <p className="text-sm text-stone-400 mt-1">
            Track shoot schedules, post-production editing deadlines, and crew task assignments.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-400 transition"
          >
            + Create Operational Task
          </button>
          <Link
            href="/admin?settings=open"
            className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-sm font-medium text-stone-200 hover:bg-stone-800"
          >
            🌐Back to settings 
          </Link>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-900/60 p-4">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-800 text-xs uppercase text-stone-400">
            <tr>
              <th className="py-3 px-4">Task Detail</th>
              <th className="py-3 px-4">Booking Ref</th>
              <th className="py-3 px-4">Assigned Crew</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {tasks.map((t) => (
              <tr key={t.id} className="hover:bg-stone-800/40">
                <td className="py-3 px-4">
                  <div className="font-bold text-stone-200">{t.title}</div>
                  <div className="text-xs text-stone-500">Client: {t.customerName}</div>
                </td>
                <td className="py-3 px-4 font-mono text-amber-500 text-xs">{t.bookingNumber}</td>
                <td className="py-3 px-4 text-stone-300 font-medium">{t.assignedMemberName}</td>
                <td className="py-3 px-4">
                  <span className="rounded bg-stone-800 px-2 py-0.5 text-xs text-stone-300 border border-stone-700">
                    {t.category}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium text-amber-400">{t.dueDate}</td>
                <td className="py-3 px-4">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      t.priority === 'High'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {t.priority}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleToggleTaskStatus(t.id)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold border transition ${
                      t.status === 'Completed'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : t.status === 'In Progress'
                        ? 'bg-blue-950 text-blue-400 border-blue-800'
                        : 'bg-stone-800 text-stone-400 border-stone-700'
                    }`}
                  >
                    {t.status} (Toggle)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Task Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreateTask}
            className="w-full max-w-lg rounded-2xl border border-stone-800 bg-stone-900 p-6 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="text-lg font-bold text-stone-100">Create Production Task</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Task Title / Deliverable *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cinematic Teaser Color Grading"
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Assigned Crew Member</label>
                  <input
                    type="text"
                    required
                    value={formState.assignedMemberName}
                    onChange={(e) => setFormState({ ...formState, assignedMemberName: e.target.value })}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Target Due Date</label>
                  <input
                    type="date"
                    required
                    value={formState.dueDate}
                    onChange={(e) => setFormState({ ...formState, dueDate: e.target.value })}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Category</label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value as any })}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
                  >
                    <option value="Editing">Editing</option>
                    <option value="Shoot">Shoot</option>
                    <option value="Album Design">Album Design</option>
                    <option value="Client Meeting">Client Meeting</option>
                    <option value="Delivery">Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1">Priority</label>
                  <select
                    value={formState.priority}
                    onChange={(e) => setFormState({ ...formState, priority: e.target.value as any })}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-stone-800 bg-stone-950 px-4 py-2 text-xs text-stone-300 hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-amber-500 px-5 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400"
              >
                Save Task Assignment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}