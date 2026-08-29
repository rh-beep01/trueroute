import '../globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata = {
  title: 'TrueRoute Admin',
  description: 'Admin Dashboard for TrueRoute',
};

export default function AdminLayout({ children }) {
  return (
    <div className={`${plusJakarta.variable} min-h-screen bg-slate-50 font-sans`}>
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✈️</span>
          <span className="font-display font-bold text-lg text-slate-800">TrueRoute Admin</span>
        </div>
      </nav>
      <main className="p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
