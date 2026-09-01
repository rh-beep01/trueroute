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
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "128",
    bestRating: "5",
    worstRating: "1",
  },
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

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does delivery take for each plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because every single restaurant, step count, transit route, and nap window is individually researched and verified by a human travel specialist, our delivery timeline scales with the duration and complexity of your trip: Weekend Getaway ($49) delivered within 2 days; Full Week Plan ($99) delivered within 3–5 days; Complete Family Package ($149) delivered within 5–7 days.",
      },
    },
    {
      "@type": "Question",
      name: "What if we want changes or corrections after delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All plans include 1 free revision / correction (the Complete Family Package includes 2 free revisions). All plans also include our 100% 7-day satisfaction guarantee — we'll revise your itinerary or refund you in full.",
      },
    },
    {
      "@type": "Question",
      name: "What does '4-Pass Verification' actually mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Four independent human review stages: (1) Mobility Audit — step counts and bench locations. (2) Real-Time Venue Check — opening hours and reservation requirements. (3) Pacing Guardrails — guaranteed 2-hour daily rest blocks. (4) Contingency Planning — rainy-day alternatives and nearby healthcare points mapped for every day.",
      },
    },
    {
      "@type": "Question",
      name: "How do you collect my family's specific information?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "After purchase, you complete a structured intake form: destination, travel dates, ages of all travellers, mobility requirements, dietary restrictions, and pace preference. We use every data point to customise each hour of your itinerary.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work for very young toddlers under 18 months?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — this is where we excel most. We plan around 2-nap daily schedules for infants, mark all stroller-accessible routes, confirm lift availability at every museum, and note nursing-friendly cafés and family restrooms throughout.",
      },
    },
    {
      "@type": "Question",
      name: "How is this different from a travel agent?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Travel agents book flights and hotels and earn commission. We create the precise hour-by-hour daily structure that makes your trip actually work across multiple age groups and mobility levels. We complement your bookings with the detail no travel agent has the time or expertise to build.",
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} ${kalam.variable}`}>
        {children}
        <FloatingChat />
      </body>
    </html>
  );
}
