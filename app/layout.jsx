import { Plus_Jakarta_Sans, Kalam } from "next/font/google";
import "./globals.css";
import FloatingChat from "@/components/FloatingChat";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const kalam = Kalam({
  subsets: ["latin"],
  variable: "--font-kalam",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.roamify.life"),
  title: {
    default: "Roamify — Multi-Generational Family Travel, Perfected",
    template: "%s | Roamify",
  },
  description:
    "Custom vacation itineraries engineered for toddlers, parents, and grandparents. Nap windows protected, step-free routes, and verified dining. From $49.",
  keywords: [
    "family travel itinerary",
    "multigenerational trip planner",
    "travel with toddlers",
    "travel with grandparents",
    "custom vacation itinerary",
    "step-free travel europe",
    "family vacation planner",
    "custom trip planning",
  ],
  authors: [{ name: "Roamify Team", url: "https://www.roamify.life" }],
  creator: "Roamify",
  publisher: "Roamify",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Roamify — Multi-Generational Family Travel, Perfected",
    description:
      "Custom vacation itineraries engineered for toddlers, parents, and grandparents. Nap windows protected, step-free routes confirmed, and verified dining. From $49.",
    url: "https://www.roamify.life",
    siteName: "Roamify",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/hero_family_travel_1786805857762.jpg",
        width: 1200,
        height: 630,
        alt: "Roamify — Precision Planned Family Travel Itineraries",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roamify — Multi-Generational Family Travel, Perfected",
    description:
      "Custom vacation itineraries engineered for toddlers, parents, and grandparents. Nap windows protected, step-free routes confirmed, and verified dining. From $49.",
    images: ["/hero_family_travel_1786805857762.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Travel",
};

export const viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Roamify",
  url: "https://www.roamify.life",
  logo: "https://www.roamify.life/logos/facebook.svg",
  image: "https://www.roamify.life/hero_family_travel_1786805857762.jpg",
  description:
    "Multi-generational custom vacation itineraries engineered for toddlers, parents, and grandparents.",
  email: "hello@roamify.life",
  sameAs: [
    "https://www.facebook.com/share/1FQTVLfs94/",
    "https://www.instagram.com/roamify.life/",
    "https://wa.me/message/N3LN7Y5F5DFHA1",
  ],
  priceRange: "$49 - $149",
  areaServed: ["US", "GB", "EU", "CA", "AU"],
  offers: [
    {
      "@type": "Offer",
      name: "Weekend Getaway Plan",
      price: "49.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: "https://www.roamify.life#pricing",
    },
    {
      "@type": "Offer",
      name: "Full Week Plan",
      price: "99.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: "https://www.roamify.life#pricing",
    },
    {
      "@type": "Offer",
      name: "Extended Trip Plan",
      price: "149.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: "https://www.roamify.life#pricing",
    },
  ],
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Roamify",
  url: "https://www.roamify.life",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} ${kalam.variable}`}>
        {children}
        <FloatingChat />
      </body>
    </html>
  );
}
