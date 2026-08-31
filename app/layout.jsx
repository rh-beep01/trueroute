import { Plus_Jakarta_Sans, Kalam } from "next/font/google";
import "./globals.css";
import FloatingChat from "@/components/FloatingChat";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const kalam = Kalam({
  subsets: ["latin"],
  variable: "--font-kalam",
  weight: ["400", "700"],
});

export const metadata = {
  title: "Roamify — Multi-Generational Family Travel, Perfected.",
  description: "Custom vacation itineraries engineered for toddlers, parents, and grandparents. Nap windows protected, step-free routes confirmed, family-friendly dining guaranteed. From $49.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${plusJakartaSans.variable} ${kalam.variable}`}>
        {children}
        <FloatingChat />
      </body>
    </html>
  );
}
