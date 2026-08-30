import '../globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata = {
  title: 'Roamify Admin',
  description: 'Admin Dashboard for Roamify Itinerary Management',
};

export default function AdminLayout({ children }) {
  return (
    <div className={`${plusJakarta.variable} font-sans`}>
      {children}
    </div>
  );
}
