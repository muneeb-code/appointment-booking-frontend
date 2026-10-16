import "./globals.css";

export const metadata = {
  title: "Appointment Booking App",
  description: "Real-time appointment schedule management portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
