"use client";

import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function RescheduleModal({
  booking,
  onClose,
  onRescheduleSuccess,
  setErrorMsg,
  setSuccessMsg,
}) {
  // datetime-local input ke liye start_time formatting helper
  const formatForInput = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [newStartTime, setNewStartTime] = useState(
    formatForInput(booking?.start_time),
  );
  const [newDuration, setNewDuration] = useState(
    booking?.duration_minutes || 30,
  );
  const [loading, setLoading] = useState(false);

  if (!booking) return null;

  const handleReschedule = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!newStartTime) {
      setErrorMsg("Please select a new start date and time.");
      return;
    }

    setLoading(true);

    try {
      const formattedDate = new Date(newStartTime).toISOString();

      const payload = {
        consultant_id: Number(booking.consultant_id),
        customer_id: Number(booking.customer_id),
        start_time: formattedDate,
        duration_minutes: Number(newDuration),
      };

      // Backend ke /bookings/:id/reschedule endpoint par request
      const res = await fetch(`${API_BASE}/bookings/${booking.id}/reschedule`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccessMsg(`Booking #${booking.id} rescheduled successfully!`);
        onClose();
        if (onRescheduleSuccess) onRescheduleSuccess();
      } else {
        const errorDetail =
          data.error ||
          data.message ||
          "Time slot conflict or invalid data. Failed to reschedule.";
        setErrorMsg(errorDetail);
      }
    } catch (err) {
      console.error("Reschedule network error:", err);
      setErrorMsg("Network error: Could not reach server to reschedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-900">
            Reschedule Booking #{booking.id}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-600 font-bold p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleReschedule} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              New Start Time
            </label>
            <input
              type="datetime-local"
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              New Duration (Minutes)
            </label>
            <input
              type="number"
              min="15"
              step="15"
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
