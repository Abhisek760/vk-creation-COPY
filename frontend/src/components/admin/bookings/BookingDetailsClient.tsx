"use client";

import React, { useState } from "react";
import { Booking, BookingStatus, DeliveryProgress } from "@/types/booking";
import { BookingRepository } from "@/lib/repositories/bookingRepository";
import { generateInvoicePdf } from "@/lib/pdf/generateInvoicePdf";
import { formatCurrency } from "@/lib/formatCurrency";
import { toast } from "@/lib/toast";

interface BookingDetailsClientProps {
  initialBooking: Booking;
}

export const BookingDetailsClient: React.FC<BookingDetailsClientProps> = ({
  initialBooking,
}) => {
  const [booking, setBooking] = useState<Booking>(initialBooking);

  const handleStatusChange = (newStatus: BookingStatus) => {
    const updated = BookingRepository.updateStatus(booking.bookingNumber, newStatus);
    if (updated) {
      setBooking(updated);
      toast.success(`Booking status updated to ${newStatus}`);
    }
  };

  const handleDeliveryProgressChange = (key: keyof DeliveryProgress, value: boolean) => {
    const currentProgress = booking.deliveryProgress || {};
    const updatedProgress = { ...currentProgress, [key]: value };
    const updated = BookingRepository.updateDeliveryProgress(
      booking.bookingNumber,
      updatedProgress
    );

    if (updated) {
      setBooking(updated);
      toast.success("Delivery progress updated");
    }
  };

  const quoteRef = booking.quoteNumber || booking.quoteId || "N/A";
  const customerName = booking.customerName || booking.customer?.name || "Client";
  const customerEmail = booking.customerEmail || booking.customer?.email || "N/A";
  const customerPhone = booking.customerPhone || booking.customer?.phone || "N/A";

  return (
    <div className="space-y-6 text-stone-800">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Booking #{booking.bookingNumber}</h1>
          <p className="mt-1 text-stone-300 text-sm">Quote Reference: {quoteRef}</p>
        </div>
        <button
          onClick={() => generateInvoicePdf(booking)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl transition"
        >
          Download Invoice PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold text-stone-400 uppercase mb-2">Customer Details</h3>
              <p className="font-semibold text-stone-900">{customerName}</p>
              <p className="text-sm text-stone-600">{customerEmail}</p>
              <p className="text-sm text-stone-600">{customerPhone}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-400 uppercase mb-2">Event Information</h3>
              <p className="text-sm text-stone-800">
                <span className="font-medium">Type:</span> {booking.eventType || booking.event?.eventType || "N/A"}
              </p>
              <p className="text-sm text-stone-800">
                <span className="font-medium">Date:</span> {booking.eventDate || booking.event?.startDate || "N/A"}
              </p>
              <p className="text-sm text-stone-800">
                <span className="font-medium">Location:</span> {booking.eventLocation || booking.event?.location || "N/A"}
              </p>
            </div>
          </div>

          {/* Deliverables Progress */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-stone-400 uppercase mb-3">Delivery Progress</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!booking.deliveryProgress?.rawPhotosDelivered}
                  onChange={(e) => handleDeliveryProgressChange("rawPhotosDelivered", e.target.checked)}
                  className="rounded text-amber-600"
                />
                Raw Photos Delivered
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!booking.deliveryProgress?.editedPhotosDelivered}
                  onChange={(e) => handleDeliveryProgressChange("editedPhotosDelivered", e.target.checked)}
                  className="rounded text-amber-600"
                />
                Edited Photos Delivered
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!booking.deliveryProgress?.videoTeaserDelivered}
                  onChange={(e) => handleDeliveryProgressChange("videoTeaserDelivered", e.target.checked)}
                  className="rounded text-amber-600"
                />
                Video Teaser Delivered
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!booking.deliveryProgress?.fullVideoDelivered}
                  onChange={(e) => handleDeliveryProgressChange("fullVideoDelivered", e.target.checked)}
                  className="rounded text-amber-600"
                />
                Full Video Delivered
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!booking.deliveryProgress?.albumPrinted}
                  onChange={(e) => handleDeliveryProgressChange("albumPrinted", e.target.checked)}
                  className="rounded text-amber-600"
                />
                Album Printed
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Amounts */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-stone-400 uppercase">Booking Status</h3>
            <select
              value={booking.status}
              onChange={(e) => handleStatusChange(e.target.value as BookingStatus)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium outline-none"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div className="pt-4 border-t border-stone-100 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-semibold">{formatCurrency(booking.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Paid:</span>
                <span className="font-semibold">{formatCurrency(booking.paidAmount || 0)}</span>
              </div>
              <div className="flex justify-between text-rose-600 font-bold border-t pt-2">
                <span>Balance:</span>
                <span>{formatCurrency(booking.remainingAmount || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsClient;