'use client';

import React from 'react';

interface EventFormProps {
  event?: {
    eventType?: string;
    brideName?: string;
    groomName?: string;
    eventDate?: string;
    venue?: string;
    city?: string;
    state?: string;
  };
  onChange: (updatedEvent: any) => void;
}

export const EventForm: React.FC<EventFormProps> = ({ event = {}, onChange }) => {
  const safeEvent = {
    eventType: event?.eventType || '',
    brideName: event?.brideName || '',
    groomName: event?.groomName || '',
    eventDate: event?.eventDate || '',
    venue: event?.venue || '',
    city: event?.city || '',
    state: event?.state || '',
  };

  return (
    <div className="space-y-4 rounded-xl border border-stone-800 bg-stone-900/60 p-5">
      <h3 className="text-lg font-semibold text-stone-200">Event Details</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-400">Event Type</label>
          <select
            className="w-full rounded-lg border border-stone-700 bg-stone-800/80 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
            value={safeEvent.eventType}
            onChange={(e) =>
              onChange({
                ...safeEvent,
                eventType: e.target.value,
              })
            }
          >
            <option value="">Select Event Type</option>
            <option value="Wedding">Wedding</option>
            <option value="Pre-Wedding">Pre-Wedding</option>
            <option value="Engagement">Engagement</option>
            <option value="Reception">Reception</option>
            <option value="Birthday / Event">Birthday / Corporate Event</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-400">Event Date</label>
          <input
            type="date"
            className="w-full rounded-lg border border-stone-700 bg-stone-800/80 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
            value={safeEvent.eventDate}
            onChange={(e) =>
              onChange({
                ...safeEvent,
                eventDate: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-400">Bride Name (Optional)</label>
          <input
            type="text"
            className="w-full rounded-lg border border-stone-700 bg-stone-800/80 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
            placeholder="Bride Name"
            value={safeEvent.brideName}
            onChange={(e) =>
              onChange({
                ...safeEvent,
                brideName: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-400">Groom Name (Optional)</label>
          <input
            type="text"
            className="w-full rounded-lg border border-stone-700 bg-stone-800/80 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
            placeholder="Groom Name"
            value={safeEvent.groomName}
            onChange={(e) =>
              onChange({
                ...safeEvent,
                groomName: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-400">Venue / Location</label>
          <input
            type="text"
            className="w-full rounded-lg border border-stone-700 bg-stone-800/80 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
            placeholder="e.g. Royal Palace Hotel"
            value={safeEvent.venue}
            onChange={(e) =>
              onChange({
                ...safeEvent,
                venue: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-400">City</label>
          <input
            type="text"
            className="w-full rounded-lg border border-stone-700 bg-stone-800/80 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
            placeholder="e.g. Jaipur"
            value={safeEvent.city}
            onChange={(e) =>
              onChange({
                ...safeEvent,
                city: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default EventForm;
