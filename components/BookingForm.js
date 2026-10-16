"use client";

import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function BookingForm({
  consultants = [],
  customers = [],
  onBookingCreated,
  setErrorMsg,
  setSuccessMsg,
}) {
  const [consultantId, setConsultantId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!consultantId || !customerId || !startTime) {
      setErrorMsg("Please select a consultant, customer, and start time.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultant_id: parseInt(consultantId, 10),
          customer_id: parseInt(customerId, 10),
          start_time: startTime,
          duration_minutes: parseInt(duration, 10),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccessMsg("Appointment booked successfully!");
        setStartTime("");
        setConsultantId("");
        setCustomerId("");

        if (onBookingCreated) onBookingCreated();
      } else {
        setErrorMsg(
          data.error || data.message || "Failed to book appointment.",
        );
      }
    } catch (err) {
      console.error("Booking error:", err);
      setErrorMsg("Network error: Could not reach backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Book New Appointment
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Select consultant, client, and time slot to create a new booking.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Consultant Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Consultant
          </label>
          <select
            value={consultantId}
            onChange={(e) => setConsultantId(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white text-slate-900"
            required
          >
            <option value="">
              {consultants.length > 0
                ? "Select Consultant..."
                : "Loading consultants..."}
            </option>
            {consultants.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>

        {/* Customer Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Customer
          </label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white text-slate-900"
            required
          >
            <option value="">
              {customers.length > 0
                ? "Select Customer..."
                : "Loading customers..."}
            </option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>

        {/* Start Time Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
            required
          />
        </div>

        {/* Duration Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Duration (Minutes)
          </label>
          <input
            type="number"
            min="15"
            step="15"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving Booking..." : "Schedule Appointment"}
          </button>
        </div>
      </form>
    </div>
  );
}
