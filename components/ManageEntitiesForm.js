"use client";

import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function ManageEntitiesForm({
  onEntityAdded,
  setErrorMsg,
  setSuccessMsg,
}) {
  const [consultantName, setConsultantName] = useState("");
  const [consultantEmail, setConsultantEmail] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [loadingConsultant, setLoadingConsultant] = useState(false);
  const [loadingCustomer, setLoadingCustomer] = useState(false);

  // Add Consultant Handler
  const handleAddConsultant = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!consultantName || !consultantEmail) {
      setErrorMsg("Please enter consultant name and email.");
      return;
    }

    setLoadingConsultant(true);
    try {
      const res = await fetch(`${API_BASE}/consultants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: consultantName,
          email: consultantEmail,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccessMsg(`Consultant "${consultantName}" added successfully.`);
        setConsultantName("");
        setConsultantEmail("");
        if (onEntityAdded) onEntityAdded();
      } else {
        setErrorMsg(data.error || data.message || "Failed to add consultant.");
      }
    } catch {
      setErrorMsg("Network error adding consultant.");
    } finally {
      setLoadingConsultant(false);
    }
  };

  // Add Customer Handler
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!customerName || !customerEmail) {
      setErrorMsg("Please enter customer name and email.");
      return;
    }

    setLoadingCustomer(true);
    try {
      const res = await fetch(`${API_BASE}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customerName,
          email: customerEmail,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccessMsg(`Customer "${customerName}" added successfully.`);
        setCustomerName("");
        setCustomerEmail("");
        if (onEntityAdded) onEntityAdded();
      } else {
        setErrorMsg(data.error || data.message || "Failed to add customer.");
      }
    } catch {
      setErrorMsg("Network error adding customer.");
    } finally {
      setLoadingCustomer(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-6">
      <h2 className="text-xl font-bold text-slate-900">
        Manage Consultants & Customers
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Consultant Form */}
        <form onSubmit={handleAddConsultant} className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">
            Add New Consultant
          </h3>
          <input
            type="text"
            placeholder="Consultant Name"
            value={consultantName}
            onChange={(e) => setConsultantName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            required
          />
          <input
            type="email"
            placeholder="Consultant Email"
            value={consultantEmail}
            onChange={(e) => setConsultantEmail(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            required
          />
          <button
            type="submit"
            disabled={loadingConsultant}
            className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            {loadingConsultant ? "Adding..." : "Add Consultant"}
          </button>
        </form>

        {/* Add Customer Form */}
        <form onSubmit={handleAddCustomer} className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">
            Add New Customer
          </h3>
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            required
          />
          <input
            type="email"
            placeholder="Customer Email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            required
          />
          <button
            type="submit"
            disabled={loadingCustomer}
            className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            {loadingCustomer ? "Adding..." : "Add Customer"}
          </button>
        </form>
      </div>
    </div>
  );
}
