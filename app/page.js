"use client";

import { useState, useEffect } from "react";
import BookingForm from "@/components/BookingForm";
import BookingList from "@/components/BookingList";
import RescheduleModal from "@/components/RescheduleModal";
import ManageEntitiesForm from "@/components/ManageEntitiesForm";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function Home() {
  const [bookings, setBookings] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Auto-dismiss toast notifications after 4 seconds
  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/bookings`);
      if (!res.ok) return;
      const result = await res.json();
      const rawList = result.data || result || [];
      const sortedList = [...rawList].sort(
        (a, b) => Number(a.id) - Number(b.id),
      );
      setBookings(sortedList);
    } catch (err) {
      console.error("Fetch bookings error:", err);
    }
  };

  const fetchConsultants = async () => {
    try {
      const res = await fetch(`${API_BASE}/consultants`);
      if (!res.ok) return;
      const result = await res.json();
      setConsultants(result.data || result || []);
    } catch (err) {
      console.error("Fetch consultants error:", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_BASE}/customers`);
      if (!res.ok) return;
      const result = await res.json();
      setCustomers(result.data || result || []);
    } catch (err) {
      console.error("Fetch customers error:", err);
    }
  };

  const refreshAllData = () => {
    fetchBookings();
    fetchConsultants();
    fetchCustomers();
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: "DELETE",
      });
      const result = await res.json().catch(() => ({}));
      if (res.ok) {
        setSuccessMsg("Appointment cancelled. Time slot released.");
        fetchBookings();
      } else {
        setErrorMsg(result.error || result.message || "Cancel failed");
      }
    } catch {
      setErrorMsg("Failed to cancel appointment.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100/70 py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased relative">
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Appointment Booking Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Real-time appointment schedule management and conflict prevention
          </p>
        </div>

        {/* 1. Manage Consultants & Customers */}
        <ManageEntitiesForm
          onEntityAdded={refreshAllData}
          setErrorMsg={setErrorMsg}
          setSuccessMsg={setSuccessMsg}
        />

        {/* 2. Create Booking Form */}
        <BookingForm
          consultants={consultants}
          customers={customers}
          onBookingCreated={fetchBookings}
          setErrorMsg={setErrorMsg}
          setSuccessMsg={setSuccessMsg}
        />

        {/* 3. Appointments List */}
        <BookingList
          bookings={bookings}
          consultants={consultants}
          customers={customers}
          onCancel={handleCancel}
          onRescheduleClick={(booking) => setSelectedBooking(booking)}
        />

        {/* Reschedule Modal */}
        {selectedBooking && (
          <RescheduleModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onRescheduleSuccess={fetchBookings}
            setErrorMsg={setErrorMsg}
            setSuccessMsg={setSuccessMsg}
          />
        )}
      </div>

      {/* Floating Bottom Right Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {errorMsg && (
          <div className="pointer-events-auto p-4 bg-rose-900 text-white border border-rose-700 rounded-xl shadow-2xl text-sm font-medium flex items-center justify-between gap-3 animate-bounce">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg("")}
              className="text-rose-200 hover:text-white font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {successMsg && (
          <div className="pointer-events-auto p-4 bg-slate-900 text-white border border-slate-700 rounded-xl shadow-2xl text-sm font-medium flex items-center justify-between gap-3 transition-all duration-300">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-lg">✓</span>
              <span>{successMsg}</span>
            </div>
            <button
              onClick={() => setSuccessMsg("")}
              className="text-slate-400 hover:text-white font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
