"use client";

export default function BookingList({
  bookings = [],
  consultants = [],
  customers = [],
  onCancel,
  onRescheduleClick,
}) {
  const getConsultantName = (id) => {
    const found = consultants.find((c) => Number(c.id) === Number(id));
    return found ? found.name : `Consultant #${id}`;
  };

  const getCustomerName = (id) => {
    const found = customers.find((c) => Number(c.id) === Number(id));
    return found ? found.name : `Customer #${id}`;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      {/* Table Header / Title Bar */}
      <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Scheduled Appointments
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active bookings sorted in ascending order by ID (#1, #2, #3...)
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200/60 shadow-xs">
          Total: {bookings.length}
        </span>
      </div>

      {/* Empty State */}
      {bookings.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
            📅
          </div>
          <p className="text-sm font-semibold text-slate-700">
            No appointments scheduled
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Book a new appointment above to populate this schedule.
          </p>
        </div>
      ) : (
        /* Dynamic Modern Table View */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                <th className="py-3.5 px-6">ID</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Consultant</th>
                <th className="py-3.5 px-6">Date & Time</th>
                <th className="py-3.5 px-6">Duration</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* ID */}
                  <td className="py-4 px-6 font-bold text-slate-400 text-xs group-hover:text-slate-700 transition-colors">
                    #{booking.id}
                  </td>

                  {/* Customer */}
                  <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">
                    {getCustomerName(booking.customer_id)}
                  </td>

                  {/* Consultant */}
                  <td className="py-4 px-6 font-medium text-slate-600 whitespace-nowrap">
                    {getConsultantName(booking.consultant_id)}
                  </td>

                  {/* Date & Time */}
                  <td className="py-4 px-6 text-slate-600 whitespace-nowrap font-sans text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/70 border border-slate-200/50 rounded-md text-slate-700 font-medium">
                      <span>📅</span>
                      {formatDate(booking.start_time)}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="py-4 px-6 text-slate-500 whitespace-nowrap text-xs">
                    <span className="inline-flex items-center gap-1">
                      <span>⏱️</span>
                      {booking.duration_minutes} mins
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => onRescheduleClick(booking)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-all active:scale-95"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => onCancel(booking.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50/50 hover:bg-rose-100/80 border border-rose-200/80 rounded-lg transition-all active:scale-95"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
