
"use client";
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { PaymentCardsRow, WalletPayButton } from '@/components/PaymentIcons';

export default function Home() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [btnText, setBtnText] = useState("Complete Order");
  const [submittedOrderId, setSubmittedOrderId] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [selectedPlanUrl, setSelectedPlanUrl] = useState('');
  const [countdown, setCountdown] = useState(null);
  const [showGumroadOverlay, setShowGumroadOverlay] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  const GUMROAD = {
    weekend: 'https://roamify01.gumroad.com/l/family-itinerary01?wanted=true',
    week:    'https://roamify01.gumroad.com/l/fullweek?wanted=true',
    complete:'https://roamify01.gumroad.com/l/ExtendedTrip?wanted=true',
  };

  const openPlanModal = (planUrl) => {
    setSelectedPlanUrl(planUrl);
    setIsIntakeModalOpen(true);
    setCurrentStep(1);
    setShowGumroadOverlay(false);
  };

  const openGumroadCheckout = (url) => {
    const targetUrl = url || selectedPlanUrl;
    if (!targetUrl) return;
    setIsIframeLoading(true);
    setShowGumroadOverlay(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.observe-me').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const triggerConfetti = (gumroadUrl) => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E05A47', '#DFB15B', '#2E6F40']
    });
    setBtnText("Request Received!");
    setCurrentStep(5);
    // Start a 5-second countdown, then open Gumroad Overlay
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          openGumroadCheckout(gumroadUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimeout(() => {
      setBtnText("Submit");
    }, 2500);
  };

  const submitForm = async () => {
    setBtnText("Submitting...");
    
    const getVal = (id) => document.getElementById(id)?.value || '';
    const getNum = (id) => parseInt(document.getElementById(id)?.value) || 0;
    const getCheck = (id) => document.getElementById(id)?.checked || false;

    const roamingPlaces = [
      getCheck('roam-history') ? 'Historic & Heritage' : null,
      getCheck('roam-food') ? 'Food, Markets & Culinary' : null,
      getCheck('roam-nature') ? 'Nature & Scenic Parks' : null,
      getCheck('roam-beach') ? 'Beaches & Waterfronts' : null,
      getCheck('roam-culture') ? 'Art & Cultural Museums' : null,
      getCheck('roam-family') ? 'Kids & Family Fun' : null,
      getCheck('roam-towns') ? 'Charming Towns & Strolls' : null,
      getCheck('roam-shopping') ? 'Local Boutiques & Shopping' : null,
    ].filter(Boolean).join(', ');

    const customPlaces = getVal('custom-places');
    const combinedPlaceTypes = [roamingPlaces, customPlaces].filter(Boolean).join('; ');

    const formData = {
      dest_primary: getVal('dest-primary'),
      dest_secondary: getVal('dest-secondary'),
      must_see: getVal('must-see'),
      plan_interest: getVal('plan-interest'),
      date_start: getVal('date-start'),
      date_end: getVal('date-end'),
      traveller_count: getNum('traveller-count'),
      num_adults: getNum('num-adults'),
      num_seniors: getNum('num-seniors'),
      ages_seniors: getVal('ages-seniors'),
      num_kids: getNum('num-kids'),
      ages_kids: getVal('ages-kids'),
      pace: getVal('pace'),
      place_types: combinedPlaceTypes,
      avoid_places: getVal('avoid-places'),
      accommodation: getVal('accommodation'),
      mob_walker: getCheck('mob-walker'),
      mob_wheelchair: getCheck('mob-wheelchair'),
      mob_stairs: getCheck('mob-stairs'),
      mob_stroller: getCheck('mob-stroller'),
      dietary: getVal('dietary'),
      notes: getVal('notes'),
      client_name: getVal('client-name'),
      client_email: getVal('client-email')
    };

    // Basic Validation for required fields
    if (!formData.dest_primary || !formData.date_start || !formData.date_end || !formData.client_name || !formData.client_email) {
      alert("Please fill out all required fields (Destination, Dates, Name, and Email) before submitting.");
      setBtnText("Submit");
      return;
    }

    try {
      const res = await fetch('/api/submit-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const resData = await res.json().catch(() => ({}));
      if (res.ok && (resData.success || resData.order_id)) {
        if (resData.order_id) {
          setSubmittedOrderId(resData.order_id);
        }
        triggerConfetti(selectedPlanUrl);
      } else {
        alert("There was an error submitting your request. Please try again.");
        setBtnText("Complete Order");
      }
    } catch (err) {
      alert("There was an error submitting your request. Please try again.");
      setBtnText("Complete Order");
    }
  };

  return (
    <>
      <div>
  {/* ══════════════════════════════════════════════
     STICKY HEADER
══════════════════════════════════════════════ */}
  <header id="main-header" className={"py-4 px-6 " + (isScrolled ? "scrolled" : "")}>
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      {/* Logo */}
      <a href="/" className="flex items-center gap-3 group" aria-label="Roamify Homepage">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background: '#0F172A'}}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#DFB15B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.9 19.79 19.79 0 0 1 1.61 3.27 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.55 5.55l.96-.96a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 21 15.44" />
          </svg>
        </div>
        <div>
          <span className="font-display font-bold text-lg leading-none" style={{color: '#0F172A'}}>Roamify</span>
          <span className="block text-xs font-semibold tracking-widest uppercase leading-none mt-0.5" style={{color: '#2E6F40'}}>Ages 3 to 75</span>
        </div>
      </a>
      {/* Desktop Nav */}
      <nav className="hidden lg:flex items-center gap-7">
        <a href="#why-us" className="nav-link text-sm">Why Us</a>
        <a href="#four-pass" className="nav-link text-sm">Verification</a>
        <a href="#fork-merge" className="nav-link text-sm">Fork &amp; Merge</a>
        <a href="#pricing" className="nav-link text-sm">Pricing</a>
        <a href="#sample" className="nav-link text-sm">Sample</a>
        <a href="#faq" className="nav-link text-sm">FAQ</a>
      </nav>
      <div className="flex items-center gap-3">
        <button onClick={() => window.location.href='#pricing'} className="btn-primary text-sm hidden sm:inline-block">Get Our Stress-Free Itinerary</button>
        <button id="menu-toggle" onClick={() => setIsMobileNavOpen(prev => !prev)} className="lg:hidden p-2 rounded-lg border border-canvas-border bg-white" style={{color: '#0F172A'}} aria-label="Open menu">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1={3} y1={6} x2={21} y2={6} /><line x1={3} y1={12} x2={21} y2={12} /><line x1={3} y1={18} x2={21} y2={18} />
          </svg>
        </button>
      </div>
    </div>
    {/* Mobile Nav */}
    <nav id="mobile-nav" className={"lg:hidden mt-3 mx-4 bg-white rounded-2xl border border-canvas-border shadow-md p-5 space-y-3 " + (isMobileNavOpen ? "block" : "hidden")}>
      <a href="#why-us" onClick={() => setIsMobileNavOpen(false)} className="block text-sm font-semibold py-1" style={{color: '#1E293B'}}>Why Roamify</a>
      <a href="#four-pass" onClick={() => setIsMobileNavOpen(false)} className="block text-sm font-semibold py-1" style={{color: '#1E293B'}}>Our 4-Point Check</a>
      <a href="#fork-merge" onClick={() => setIsMobileNavOpen(false)} className="block text-sm font-semibold py-1" style={{color: '#1E293B'}}>The Daily Flow</a>
      <a href="#sample" onClick={() => setIsMobileNavOpen(false)} className="block text-sm font-semibold py-1" style={{color: '#1E293B'}}>Sample Itinerary</a>
      <a href="#pricing" onClick={() => setIsMobileNavOpen(false)} className="block text-sm font-semibold py-1" style={{color: '#1E293B'}}>Pricing</a>
      <a href="#faq" onClick={() => setIsMobileNavOpen(false)} className="block text-sm font-semibold py-1" style={{color: '#1E293B'}}>FAQ</a>
      <button onClick={() => { window.location.href='#pricing'; setIsMobileNavOpen(false); }} className="btn-primary w-full text-center py-3 mt-2">Get Our Stress-Free Itinerary</button>
    </nav>
  </header>
  {/* ══════════════════════════════════════════════
     HERO SECTION
══════════════════════════════════════════════ */}
  <section className="relative min-h-screen flex items-center overflow-hidden hero-bg pt-20">
    {/* Subtle background accents */}
    <div className="absolute top-24 left-8 w-64 h-64 rounded-full opacity-20 pointer-events-none" style={{background: 'radial-gradient(circle,#DFB15B,transparent)'}} />
    <div className="absolute bottom-24 left-1/3 w-48 h-48 rounded-full opacity-15 pointer-events-none" style={{background: 'radial-gradient(circle,#E05A47,transparent)'}} />
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-12 gap-14 items-center">
      {/* LEFT: Text */}
      <div className="lg:col-span-5" style={{animation: 'fadeInUp 0.7s ease forwards'}}>
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2.5 bg-white rounded-full px-5 py-2.5 mb-8 border" style={{borderColor: '#F1EFE7', boxShadow: '0 2px 10px rgba(15,23,42,0.07)'}}>
          <span style={{color: '#DFB15B'}} className="text-sm">★★★★★</span>
          <span className="text-xs font-semibold" style={{color: '#1E293B'}}>Engineered for Multi-Gen Families · Ages 3 to 75</span>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{background: '#2E6F40'}} />
        </div>
        <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-[3.6rem] xl:text-7xl leading-[1.06] mb-5" style={{color: '#0F172A'}}>
          Multi-Generational<br />Family Travel,<br />
          <span className="shimmer-text">Perfected.</span>
        </h1>
        {/* Sub-headline in Kalam */}
        <p className="handwritten text-xl mb-4" style={{color: '#E05A47', display: 'inline-block'}}>
          "Custom itineraries engineered for toddlers, parents &amp; grandparents."
        </p>
        <p className="text-base leading-relaxed mb-10 max-w-lg" style={{color: '#475569'}}>
          No hallucinations. No broken walking routes. Every schedule protects
          <strong style={{color: '#2E6F40', fontWeight: 700}}>toddler nap windows</strong>, features
          <strong style={{color: '#2E6F40', fontWeight: 700}}>step-free routes for seniors</strong>,
          and guarantees confirmed family-friendly dining.
        </p>
        <div className="flex flex-wrap gap-3 mb-10">
          <button onClick={() => window.location.href='#pricing'} id="hero-cta-primary" className="btn-primary text-base py-4 px-8 shadow-md cursor-pointer">
            Get Our Stress-Free Family Itinerary →
          </button>
          <a href="#sample" id="hero-cta-secondary" className="btn-secondary text-base py-4 px-8 cursor-pointer">
            Explore Sample Itinerary
          </a>
        </div>
        <div className="flex flex-wrap gap-6 text-sm" style={{color: '#64748B'}}>
          <div className="flex items-center gap-2 font-semibold">
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            100% Human-Verified
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            Delivered in 3–5 Days
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            7-Day Satisfaction Guarantee
          </div>
        </div>
      </div>
      {/* RIGHT: Floating day card (desktop) */}
      <div className="hidden lg:flex flex-col items-end w-full mt-10 lg:mt-0 lg:col-span-7 gap-6" style={{animation: 'fadeInRight 0.7s ease 0.25s both', zIndex: 10}}>
        {/* Featured Image (Collage) in 16:9 box */}
        <div className="w-full lg:w-[720px] lg:h-[405px] overflow-hidden rounded-2xl border-4 shadow-xl border-white bg-gray-100 relative">
          <img src="hero_family_travel_1786805857762.jpg" alt="Family Vacation Collage" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        {/* Separated Sample Card */}
        <div className="w-full max-w-sm" style={{animation: 'floatA 4.5s ease-in-out infinite'}}>
          <div className="bg-white rounded-2xl p-6 border" style={{borderColor: '#F1EFE7', boxShadow: '0 8px 32px rgba(15,23,42,0.10)'}}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background: '#0F172A'}}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#DFB15B" strokeWidth={2} strokeLinecap="round">
                  <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <div>
                <p className="font-display font-bold text-sm leading-tight" style={{color: '#0F172A'}}>Sample Day — Rome, Italy</p>
                <p className="text-[0.65rem] font-semibold mt-0.5" style={{color: '#2E6F40'}}>4-Pass Verified ✓</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="time-pill text-[0.65rem] px-2 py-0.5" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #F1EFE7'}}>8:00</span>
                <div><p className="font-semibold text-xs" style={{color: '#0F172A'}}>Shared Breakfast — Campo de' Fiori</p><p className="text-[0.65rem] mt-0.5 leading-tight" style={{color: '#94A3B8'}}>Flat route · accessible · confirmed open ✓</p></div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="time-pill text-[0.65rem] px-2 py-0.5" style={{background: '#FDF2F0', color: '#C84B39', border: '1px solid #F1EFE7'}}>10:00</span>
                <div><p className="font-semibold text-xs" style={{color: '#0F172A'}}>Colosseum — Fast-Track</p><p className="text-[0.65rem] mt-0.5 leading-tight" style={{color: '#94A3B8'}}>Step-free entry · 4,800 steps · senior path</p></div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="time-pill text-[0.65rem] px-2 py-0.5" style={{background: '#E8F2EC', color: '#2E6F40', border: '1px solid #dce8e0'}}>12:30</span>
                <div><p className="font-semibold text-xs" style={{color: '#2E6F40'}}>🌙 Protected Nap Window</p><p className="text-[0.65rem] mt-0.5 leading-tight" style={{color: '#94A3B8'}}>Hotel rest · grandparents siesta</p></div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="time-pill text-[0.65rem] px-2 py-0.5" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #F1EFE7'}}>15:00</span>
                <div><p className="font-semibold text-xs" style={{color: '#0F172A'}}>Trevi Fountain &amp; Gelato Walk</p><p className="text-[0.65rem] mt-0.5 leading-tight" style={{color: '#94A3B8'}}>Low-crowd window · bench rest every 400m</p></div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="time-pill text-[0.65rem] px-2 py-0.5" style={{background: '#FDF2F0', color: '#C84B39', border: '1px solid #F1EFE7'}}>19:00</span>
                <div><p className="font-semibold text-xs" style={{color: '#0F172A'}}>Group Dinner — Trattoria Moderna</p><p className="text-[0.65rem] mt-0.5 leading-tight" style={{color: '#94A3B8'}}>High chairs · backup listed ✓</p></div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t text-[0.65rem]" style={{borderColor: '#F1EFE7', color: '#94A3B8'}}>
              ☂️ Rainy-Day Backup: Vatican Museums Tour
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Scroll indicator */}
    <div className="bounce-anim z-10">
      <div className="bg-white rounded-full p-3 border" style={{borderColor: '#F1EFE7', boxShadow: '0 2px 8px rgba(15,23,42,0.08)'}}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
      </div>
    </div>
  </section>
  {/* ══════════════════════════════════════════════
     DESTINATIONS MARQUEE
══════════════════════════════════════════════ */}
  <div className="border-y py-4 overflow-hidden" style={{borderColor: '#F1EFE7', background: '#FFFFFF'}}>
    {/* Flag img tags use Twemoji CDN — guaranteed cross-platform (fixes Windows emoji flag bug) */}
    <style dangerouslySetInnerHTML={{__html: ".dest-tag img { height:1.1em; width:auto; vertical-align:-0.15em; display:inline; }" }} />
    <div className="marquee-wrap">
      <div className="marquee-track">
        <span className="dest-tag"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f1ee-1f1f9.svg" alt="IT" /> Italy</span>
        <span className="dest-tag"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f1ec-1f1e7.svg" alt="GB" /> United Kingdom</span>
        <span className="dest-tag"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f1f5-1f1f9.svg" alt="PT" /> Portugal</span>
        <span className="dest-tag"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f1ea-1f1f8.svg" alt="ES" /> Spain</span>
        <span className="dest-tag"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f1ec-1f1f7.svg" alt="GR" /> Greece</span>
        <span className="dest-tag"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f1eb-1f1f7.svg" alt="FR" /> France</span>
        <span className="dest-tag"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f1e8-1f1ed.svg" alt="CH" /> Switzerland</span>
        <span className="dest-tag"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f1e6-1f1f9.svg" alt="AT" /> Austria</span>
        <span className="dest-tag"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f1ee-1f1f9.svg" alt="IT" /> Italy</span>
        <span className="dest-tag"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f1ec-1f1e7.svg" alt="GB" /> United Kingdom</span>
        <span className="dest-tag"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f1f5-1f1f9.svg" alt="PT" /> Portugal</span>
        <span className="dest-tag"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f1ea-1f1f8.svg" alt="ES" /> Spain</span>
        <span className="dest-tag"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f1ec-1f1f7.svg" alt="GR" /> Greece</span>
        <span className="dest-tag"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f1eb-1f1f7.svg" alt="FR" /> France</span>
        <span className="dest-tag"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f1e8-1f1ed.svg" alt="CH" /> Switzerland</span>
        <span className="dest-tag"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f1e6-1f1f9.svg" alt="AT" /> Austria</span>
      </div>
    </div>
  </div>
  {/* ══════════════════════════════════════════════
     WHY US / COMPARISON
══════════════════════════════════════════════ */}
  <section id="why-us" className="py-24 px-6" style={{background: '#FAFAF7'}}>
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16 observe-me">
        <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #efe0b0'}}>The Honest Difference</span>
        <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4" style={{color: '#0F172A'}}>
          Why Standard AI <span style={{color: '#E05A47'}}>Can't Plan</span> Your Family Trip
        </h2>
        <p className="handwritten text-xl mb-3" style={{color: '#2E6F40', display: 'inline-block'}}>"ChatGPT doesn't know about naptime — we do."</p>
        <p className="text-base max-w-2xl mx-auto mt-2" style={{color: '#64748B'}}>Generic AI plans 12,000 steps, recommends closed restaurants, and ignores grandpa's hip. We don't.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 observe-me">
        {/* Generic AI — BAD */}
        <div className="compare-card p-8 border border-red-100" style={{boxShadow: '0 4px 20px rgba(224,90,71,0.08)'}}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{background: '#FDF2F0'}}>😤</div>
            <div>
              <h3 className="font-display font-bold text-lg" style={{color: '#0F172A'}}>Generic AI Trip Plan</h3>
              <p className="text-sm font-medium" style={{color: '#E05A47'}}>ChatGPT / Copy-Paste Itinerary</p>
            </div>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>12,000+ Steps Per Day</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>No mobility filter — grandparents can't keep up, toddlers melt down</p></div></li>
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>Recommends Closed Restaurants</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>AI hallucinations — venues permanently closed or with different hours</p></div></li>
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>No Nap Windows Considered</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>Schedules ignore toddler sleep — ruins entire afternoons</p></div></li>
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>No Senior Mobility Planning</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>Cobblestones, stairs, long walks — zero alternative routes provided</p></div></li>
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>No Rainy-Day Backup</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>One bad weather day collapses your entire trip</p></div></li>
          </ul>
        </div>
        {/* Roamify — GOOD */}
        <div className="compare-card p-8 relative overflow-hidden" style={{border: '1.5px solid #2E6F40', boxShadow: '0 4px 24px rgba(46,111,64,0.12)'}}>
          <div className="absolute top-0 right-0 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl" style={{background: '#2E6F40'}}>✓ VERIFIED PLAN</div>
          <div className="flex items-center gap-3 mb-6 mt-1">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{background: '#E8F2EC'}}>✅</div>
            <div>
              <h3 className="font-display font-bold text-lg" style={{color: '#0F172A'}}>Roamify Verified Plan</h3>
              <p className="text-sm font-medium" style={{color: '#2E6F40'}}>4-Pass Human Verification</p>
            </div>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>≤ 6,500 Senior-Friendly Steps</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>Step count verified — bench rest points mapped every 400m</p></div></li>
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>All Restaurants Confirmed Open</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>Hours cross-checked + backup venue always provided</p></div></li>
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>Nap Window Protected: 12:30–2:30 PM</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>Activities never scheduled during toddler rest window</p></div></li>
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>Step-Free Senior Routes Mapped</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>Wheelchair/cane accessible alternatives for every attraction</p></div></li>
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>Full Rainy-Day Activity Set</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>Indoor alternatives pre-planned for every day of your trip</p></div></li>
          </ul>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 observe-me">
        <div className="stat-card">
          <p className="font-display font-bold text-4xl" style={{color: '#E05A47'}}>97%</p>
          <p className="text-sm mt-1 font-medium" style={{color: '#64748B'}}>Customer Satisfaction</p>
        </div>
        <div className="stat-card">
          <p className="font-display font-bold text-4xl" style={{color: '#2E6F40'}}>4-Pass</p>
          <p className="text-sm mt-1 font-medium" style={{color: '#64748B'}}>Verification System</p>
        </div>
        <div className="stat-card">
          <p className="font-display font-bold text-4xl" style={{color: '#DFB15B'}}>500+</p>
          <p className="text-sm mt-1 font-medium" style={{color: '#64748B'}}>Families Served</p>
        </div>
        <div className="stat-card">
          <p className="font-display font-bold text-4xl" style={{color: '#0F172A'}}>3–5</p>
          <p className="text-sm mt-1 font-medium" style={{color: '#64748B'}}>Day Delivery</p>
        </div>
      </div>
    </div>
  </section>
  <div className="section-divider mx-6" />
  {/* ══════════════════════════════════════════════
     4-PASS VERIFICATION SECTION (NEW)
══════════════════════════════════════════════ */}
  <section id="four-pass" className="py-24 px-6" style={{background: '#FAFAF7'}}>
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-14 observe-me">
        <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full" style={{background: '#E8F2EC', color: '#2E6F40', border: '1px solid #bdd9c8'}}>Our Quality Standard</span>
        <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4" style={{color: '#0F172A'}}>The 4-Pass Verification System</h2>
        <p className="text-base max-w-2xl mx-auto" style={{color: '#64748B'}}>Every itinerary passes four independent human review stages before it reaches your inbox. No shortcuts.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 observe-me">
        {/* Pass 1: Mobility Audit */}
        <div className="pass-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0" style={{background: '#0F172A'}}>1</div>
            <span className="text-xs font-bold tracking-widest uppercase" style={{color: '#2E6F40'}}>Mobility Audit</span>
          </div>
          <div className="text-2xl mb-3">🦽</div>
          <h3 className="font-display font-bold text-base mb-2" style={{color: '#0F172A'}}>Mobility Audit</h3>
          <p className="text-sm leading-relaxed" style={{color: '#64748B'}}>Step counts capped under 6,500 per day. Bench locations and step-free paths mapped at every attraction and route segment.</p>
        </div>
        {/* Pass 2: Venue Check */}
        <div className="pass-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0" style={{background: '#0F172A'}}>2</div>
            <span className="text-xs font-bold tracking-widest uppercase" style={{color: '#2E6F40'}}>Venue Check</span>
          </div>
          <div className="text-2xl mb-3">🍽️</div>
          <h3 className="font-display font-bold text-base mb-2" style={{color: '#0F172A'}}>Real-Time Venue Check</h3>
          <p className="text-sm leading-relaxed" style={{color: '#64748B'}}>Opening hours, seasonal closures, and reservation requirements cross-referenced. A confirmed backup venue is always provided.</p>
        </div>
        {/* Pass 3: Pacing */}
        <div className="pass-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0" style={{background: '#0F172A'}}>3</div>
            <span className="text-xs font-bold tracking-widest uppercase" style={{color: '#2E6F40'}}>Pacing</span>
          </div>
          <div className="text-2xl mb-3">🌙</div>
          <h3 className="font-display font-bold text-base mb-2" style={{color: '#0F172A'}}>Pacing Guardrails</h3>
          <p className="text-sm leading-relaxed" style={{color: '#64748B'}}>Guaranteed 2-hour daily rest and nap blocks are built in for toddlers and grandparents. No activities scheduled during protected windows.</p>
        </div>
        {/* Pass 4: Contingency */}
        <div className="pass-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0" style={{background: '#0F172A'}}>4</div>
            <span className="text-xs font-bold tracking-widest uppercase" style={{color: '#2E6F40'}}>Contingency</span>
          </div>
          <div className="text-2xl mb-3">☂️</div>
          <h3 className="font-display font-bold text-base mb-2" style={{color: '#0F172A'}}>Contingency Planning</h3>
          <p className="text-sm leading-relaxed" style={{color: '#64748B'}}>Rainy-day backup options and nearby healthcare and restroom points pre-mapped for every day of the trip.</p>
        </div>
      </div>
      {/* Result callout */}
      <div className="mt-14 bg-white rounded-2xl grid sm:grid-cols-2 overflow-hidden max-w-4xl mx-auto observe-me" style={{border: '1px solid #F1EFE7', boxShadow: '0 8px 24px rgba(15,23,42,0.08)'}}>
        <img src="Gemini_Generated_Image_z0s17fz0s17fz0s1.jpg" alt="Paris Family Verification" className="w-full h-64 sm:h-full object-cover" />
        <div className="p-8 sm:p-10 flex flex-col justify-center items-start">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 mb-4" style={{background: '#E8F2EC'}}>🛡️</div>
          <p className="font-semibold text-[1.05rem] leading-relaxed" style={{color: '#0F172A'}}>Result: <span style={{color: '#2E6F40'}}>Every generation is energized, rested, and ready for the next day.</span> No arguments about pace. No surprises at the door.</p>
        </div>
      </div>
    </div>
  </section>
  <div className="section-divider mx-6" />
  {/* ══════════════════════════════════════════════
     FORK & MERGE
══════════════════════════════════════════════ */}
  <section id="fork-merge" className="py-24 px-6 relative overflow-hidden" style={{background: '#FAFAF7'}}>
    <div className="absolute top-12 right-12 w-72 h-72 rounded-full pointer-events-none opacity-10" style={{background: 'radial-gradient(#DFB15B,transparent)'}} />
    <div className="absolute bottom-12 left-12 w-56 h-56 rounded-full pointer-events-none opacity-10" style={{background: 'radial-gradient(#E05A47,transparent)'}} />
    <div className="relative max-w-6xl mx-auto">
      <div className="text-center mb-16 observe-me">
        <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #efe0b0'}}>Our Signature Method</span>
        <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4" style={{color: '#0F172A'}}>
          The <span style={{color: '#E05A47'}}>Fork &amp; Merge</span><br />Daily Structure
        </h2>
        <p className="text-base max-w-2xl mx-auto" style={{color: '#64748B'}}>Every day is designed so everyone gets what they need — then comes back together for the moments that matter.</p>
      </div>
      <div className="observe-me">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Morning */}
          <div className="card p-6 text-center" style={{borderTop: '3px solid #2E6F40'}}>
            <div className="w-13 h-13 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl" style={{background: '#E8F2EC'}}>🌅</div>
            <div className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-3" style={{background: '#E8F2EC', color: '#2E6F40'}}>7AM – 12PM</div>
            <img src="Gemini_Generated_Image_m5rdkim5rdkim5rd.jpg" alt="Florence Morning" className="w-full h-40 object-cover rounded-xl mb-5 shadow-sm" />
            <h3 className="font-display font-bold text-base mb-2" style={{color: '#0F172A'}}>Shared Family Morning</h3>
            <p className="text-sm leading-relaxed" style={{color: '#64748B'}}>Breakfast together, one iconic attraction, low-step route with frequent rest stops. Everyone moves at a pace that works.</p>
            <div className="mt-4 space-y-2">
              <div className="text-xs font-semibold rounded-lg px-3 py-2" style={{background: '#E8F2EC', color: '#2E6F40'}}>✓ Step-free paths confirmed</div>
              <div className="text-xs font-semibold rounded-lg px-3 py-2" style={{background: '#E8F2EC', color: '#2E6F40'}}>✓ Accessible restrooms mapped</div>
            </div>
          </div>
          {/* Afternoon FORK */}
          <div>
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2 text-xs font-bold border" style={{color: '#E05A47', borderColor: '#F1EFE7', boxShadow: '0 2px 8px rgba(15,23,42,0.07)'}}>
                ↔ FORK — Afternoon Split
              </span>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-4 border-l-4" style={{borderLeftColor: '#DFB15B', border: '1px solid #F1EFE7', borderLeft: '3px solid #DFB15B'}}>
                <p className="text-xs font-bold mb-1" style={{color: '#8a6800'}}>PARENTS &amp; TEENS</p>
                <p className="text-xs" style={{color: '#64748B'}}>Active exploration — markets, neighbourhoods, museums at full pace.</p>
              </div>
              <div className="bg-white rounded-xl p-4" style={{border: '1px solid #F1EFE7', borderLeft: '3px solid #2E6F40'}}>
                <p className="text-xs font-bold mb-1" style={{color: '#2E6F40'}}>12:30–2:30 PM — PROTECTED REST</p>
                <p className="text-xs" style={{color: '#64748B'}}>Toddler nap window. Grandparents siesta. Zero activities scheduled.</p>
              </div>
              <div className="bg-white rounded-xl p-4" style={{border: '1px solid #F1EFE7', borderLeft: '3px solid #0F172A'}}>
                <p className="text-xs font-bold mb-1" style={{color: '#1E293B'}}>GRANDPARENTS &amp; TODDLERS</p>
                <p className="text-xs" style={{color: '#64748B'}}>Quiet café, hotel garden, gentle stroll — zero pressure pace.</p>
              </div>
            </div>
          </div>
          {/* Evening MERGE */}
          <div className="card p-6 text-center" style={{borderTop: '3px solid #E05A47'}}>
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2 text-xs font-bold border" style={{color: '#E05A47', borderColor: '#F1EFE7', boxShadow: '0 2px 8px rgba(15,23,42,0.07)'}}>
                ↔ MERGE — Evening Together
              </span>
            </div>
            <img src="Gemini_Generated_Image_7a1fx37a1fx37a1f.jpg" alt="Santorini Dinner" className="w-full h-40 object-cover rounded-xl mb-5 shadow-sm" />
            <div className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-3" style={{background: '#FDF2F0', color: '#C84B39'}}>6PM – 9PM</div>
            <h3 className="font-display font-bold text-base mb-2" style={{color: '#0F172A'}}>Group Dinner &amp; Evening</h3>
            <p className="text-sm leading-relaxed" style={{color: '#64748B'}}>Everyone reunites at a verified family restaurant. High chairs, senior seating, backup venue — all confirmed in advance.</p>
            <div className="mt-4 space-y-2">
              <div className="text-xs font-semibold rounded-lg px-3 py-2" style={{background: '#FDF2F0', color: '#C84B39'}}>✓ Early reservation confirmed</div>
              <div className="text-xs font-semibold rounded-lg px-3 py-2" style={{background: '#FDF2F0', color: '#C84B39'}}>✓ Backup restaurant included</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4" style={{border: '1px solid #F1EFE7', boxShadow: '0 2px 10px rgba(15,23,42,0.06)'}}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{background: '#FDF8ED'}}>🏆</div>
          <p className="font-semibold text-sm" style={{color: '#0F172A'}}>Result: <span style={{color: '#E05A47'}}>Every generation is energized, rested, and excited for tomorrow.</span> No one is exhausted. No arguments about pace.</p>
        </div>
      </div>
    </div>
  </section>
  <div className="section-divider mx-6" />
  {/* ══════════════════════════════════════════════
     SAMPLE ITINERARY
══════════════════════════════════════════════ */}
  <section id="sample" className="py-24 px-6" style={{background: '#FAFAF7'}}>
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16 observe-me">
        <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #efe0b0'}}>Real Sample</span>
        <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4" style={{color: '#0F172A'}}>
          3-Day Rome Itinerary <span style={{color: '#E05A47'}}>Preview</span>
        </h2>
        <p className="text-base max-w-xl mx-auto" style={{color: '#64748B'}}>See exactly what you receive — day by day, hour by hour, verified and backed up.</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-5 observe-me">
        {/* Day 1 */}
        <div className="tilt-card bg-white rounded-2xl p-6 border cursor-default" style={{borderColor: '#F1EFE7', borderTop: '3px solid #2E6F40', boxShadow: '0 2px 10px rgba(15,23,42,0.07)'}}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0" style={{background: '#2E6F40'}}>1</div>
            <div><h3 className="font-display font-bold text-base" style={{color: '#0F172A'}}>Day 1 — Arrival &amp; Centro Storico</h3><p className="text-xs font-semibold mt-0.5" style={{color: '#2E6F40'}}>6,100 steps · All accessible</p></div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #F1EFE7'}}>10:00</span><p style={{color: '#475569'}}>Hotel check-in + neighbourhood walk (flat route)</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#FDF2F0', color: '#C84B39', border: '1px solid #F1EFE7'}}>12:00</span><p style={{color: '#475569'}}>Lunch — Osteria della Trippa ✓ open, family menu</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#E8F2EC', color: '#2E6F40', border: '1px solid #dce8e0'}}>12:30</span><p className="font-semibold" style={{color: '#2E6F40'}}>🌙 Protected Nap Window</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #F1EFE7'}}>14:30</span><p style={{color: '#475569'}}>Campo de' Fiori market &amp; gelato (bench every 400m)</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#FDF2F0', color: '#C84B39', border: '1px solid #F1EFE7'}}>19:00</span><p style={{color: '#475569'}}>Group dinner — Ristorante Nonna ✓ high chairs</p></div>
          </div>
          <div className="mt-4 pt-4 border-t text-xs" style={{borderColor: '#F1EFE7', color: '#94A3B8'}}>☂️ Rainy backup: Borghese Gallery (indoor, lift access)</div>
        </div>
        {/* Day 2 */}
        <div className="tilt-card bg-white rounded-2xl p-6 border relative cursor-default" style={{borderColor: '#F1EFE7', borderTop: '3px solid #E05A47', boxShadow: '0 2px 10px rgba(15,23,42,0.07)'}}>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-5 py-1.5 rounded-full" style={{background: '#E05A47'}}>Most Popular Day</div>
          <div className="flex items-center gap-3 mb-5 mt-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0" style={{background: '#E05A47'}}>2</div>
            <div><h3 className="font-display font-bold text-base" style={{color: '#0F172A'}}>Day 2 — Ancient Rome</h3><p className="text-xs font-semibold mt-0.5" style={{color: '#E05A47'}}>5,800 steps · Lift + ramp access</p></div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#FDF2F0', color: '#C84B39', border: '1px solid #F1EFE7'}}>08:30</span><p style={{color: '#475569'}}>Colosseum fast-track — separate senior entry, lift ✓</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #F1EFE7'}}>11:00</span><p style={{color: '#475569'}}>Roman Forum (parents/teens) / Palatine café (grandparents)</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#E8F2EC', color: '#2E6F40', border: '1px solid #dce8e0'}}>12:30</span><p className="font-semibold" style={{color: '#2E6F40'}}>🌙 Nap Window — Hotel Return</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0'}}>15:00</span><p style={{color: '#475569'}}>Circus Maximus park (open green space, toddler-friendly)</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#FDF2F0', color: '#C84B39', border: '1px solid #F1EFE7'}}>19:30</span><p style={{color: '#475569'}}>Trastevere dinner — La Gatta Mangiona ✓ reserved</p></div>
          </div>
          <div className="mt-4 pt-4 border-t text-xs" style={{borderColor: '#F1EFE7', color: '#94A3B8'}}>☂️ Rainy backup: Vatican Museums (fully indoor)</div>
        </div>
        {/* Day 3 */}
        <div className="tilt-card bg-white rounded-2xl p-6 border cursor-default" style={{borderColor: '#F1EFE7', borderTop: '3px solid #DFB15B', boxShadow: '0 2px 10px rgba(15,23,42,0.07)'}}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0" style={{background: '#DFB15B'}}>3</div>
            <div><h3 className="font-display font-bold text-base" style={{color: '#0F172A'}}>Day 3 — Vatican &amp; Farewell</h3><p className="text-xs font-semibold mt-0.5" style={{color: '#8a6800'}}>4,900 steps · Fully step-free</p></div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0'}}>09:00</span><p style={{color: '#475569'}}>St. Peter's — wheelchair accessible, elevator to dome ✓</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #F1EFE7'}}>11:30</span><p style={{color: '#475569'}}>Prati neighbourhood — gelato &amp; souvenirs, flat streets</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#E8F2EC', color: '#2E6F40', border: '1px solid #dce8e0'}}>12:30</span><p className="font-semibold" style={{color: '#2E6F40'}}>🌙 Nap Window — Final Packing</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0'}}>15:00</span><p style={{color: '#475569'}}>Castel Sant'Angelo (lift available, panoramic rooftop)</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#FDF2F0', color: '#C84B39', border: '1px solid #F1EFE7'}}>19:00</span><p style={{color: '#475569'}}>Farewell dinner — Il Sorpasso ✓ outdoor terrace, high chairs</p></div>
          </div>
          <div className="mt-4 pt-4 border-t text-xs" style={{borderColor: '#F1EFE7', color: '#94A3B8'}}>☂️ Rainy backup: Doria Pamphilj Gallery (indoor, flat floors)</div>
        </div>
      </div>
      <div className="text-center mt-10 observe-me">
        <button onClick={() => window.location.href='#pricing'} className="btn-primary text-base py-4 px-10 shadow-md cursor-pointer">Get Our Stress-Free Family Itinerary →</button>
        <p className="text-sm mt-3" style={{color: '#94A3B8'}}>Full plan includes Google Maps links, transit guides, and age-group packing lists.</p>
      </div>
    </div>
  </section>
  <div className="section-divider mx-6" />
  {/* ══════════════════════════════════════════════
     PRICING
══════════════════════════════════════════════ */}
  <section id="pricing" className="py-24 px-6" style={{background: '#FAFAF7'}}>
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16 observe-me">
        <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full" style={{background: '#FDF2F0', color: '#C84B39', border: '1px solid #f5c5be'}}>Simple, Transparent Pricing</span>
        <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4" style={{color: '#0F172A'}}>Choose Your Plan</h2>
        <p className="text-base max-w-xl mx-auto" style={{color: '#64748B'}}>All plans include 4-pass human verification. No subscription. No hidden fees. Pay once, travel confidently.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start observe-me">
        {/* Weekend */}
        <div className="pricing-card p-8">
          <div className="mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{background: '#F1F5F9'}}>🗓️</div>
            <h3 className="font-display font-bold text-xl mb-1" style={{color: '#0F172A'}}>Weekend Getaway</h3>
            <p className="text-sm" style={{color: '#94A3B8'}}>Perfect for a quick family escape</p>
          </div>
          <div className="mb-6">
            <div className="flex items-end gap-2"><span className="font-display font-bold text-5xl" style={{color: '#0F172A'}}>$49</span><span className="text-sm mb-2" style={{color: '#94A3B8'}}>one-time</span></div>
            <p className="text-sm font-semibold mt-1" style={{color: '#2E6F40'}}>⚡ Delivered in 2 days</p>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm font-semibold" style={{color: '#0F172A'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>3-Day Plan (1 City)</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Full 4-Pass Human Verification</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Step-Free &amp; Senior Rest Stops</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Toddler Nap Windows Protected</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Verified Dining &amp; Dietary Check</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Google Maps &amp; Rainy-Day Plans</li>
            <li className="flex items-center gap-3 text-sm font-semibold" style={{color: '#2E6F40'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>1 Free Revision Included</li>
          </ul>
          <button onClick={() => openPlanModal(GUMROAD.weekend)} id="buy-weekend" className="btn-secondary w-full text-center block py-3.5">Get Started — $49</button>
        </div>
        {/* Full Week - POPULAR */}
        <div className="pricing-card pricing-popular p-8 relative">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-6 py-2 rounded-full" style={{background: '#E05A47', boxShadow: '0 4px 14px rgba(224,90,71,0.35)'}}>⭐ MOST POPULAR</div>
          <div className="mb-6 mt-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{background: '#FDF2F0'}}>✈️</div>
            <h3 className="font-display font-bold text-xl mb-1" style={{color: '#0F172A'}}>Full Week Plan</h3>
            <p className="text-sm" style={{color: '#94A3B8'}}>The sweet spot for family vacations</p>
          </div>
          <div className="mb-6">
            <div className="flex items-end gap-2"><span className="font-display font-bold text-5xl" style={{color: '#E05A47'}}>$99</span><span className="text-sm mb-2" style={{color: '#94A3B8'}}>one-time</span></div>
            <p className="text-sm font-semibold mt-1" style={{color: '#2E6F40'}}>⚡ Delivered in 3–5 days</p>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm font-semibold" style={{color: '#0F172A'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>7-Day Plan (Up to 2 Cities)</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Full 4-Pass Human Verification</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Step-Free &amp; Senior Rest Stops</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Toddler Nap Windows Protected</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Verified Dining &amp; Dietary Check</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Google Maps &amp; Rainy-Day Plans</li>
            <li className="flex items-center gap-3 text-sm font-semibold" style={{color: '#2E6F40'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>1 Free Revision Included</li>
          </ul>
          <button onClick={() => openPlanModal(GUMROAD.week)} id="buy-week" className="btn-primary w-full text-center block py-3.5">Get Started — $99</button>
        </div>
        {/* Extended Trip */}
        <div className="pricing-card p-8" style={{border: '1.5px solid #DFB15B'}}>
          <div className="mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{background: '#FDF8ED'}}>🌍</div>
            <h3 className="font-display font-bold text-xl mb-1" style={{color: '#0F172A'}}>Complete Family Package</h3>
            <p className="text-sm" style={{color: '#94A3B8'}}>The full multi-city grand tour</p>
          </div>
          <div className="mb-6">
            <div className="flex items-end gap-2"><span className="font-display font-bold text-5xl" style={{color: '#DFB15B'}}>$149</span><span className="text-sm mb-2" style={{color: '#94A3B8'}}>one-time</span></div>
            <p className="text-sm font-semibold mt-1" style={{color: '#2E6F40'}}>⚡ Delivered in 5–7 days</p>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm font-semibold" style={{color: '#0F172A'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#DFB15B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>10-Day Plan (Multi-City)</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#DFB15B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Full 4-Pass Human Verification</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#DFB15B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Step-Free &amp; Senior Rest Stops</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#DFB15B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Toddler Nap Windows Protected</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#DFB15B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Verified Dining &amp; Dietary Check</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#DFB15B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Google Maps &amp; Rainy-Day Plans</li>
            <li className="flex items-center gap-3 text-sm font-semibold" style={{color: '#2E6F40'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>⭐ 2 Free Revisions Included</li>
          </ul>
          <button onClick={() => openPlanModal(GUMROAD.complete)} id="buy-complete" className="btn-navy w-full text-center block py-3.5">Get Started — $149</button>
        </div>
        {/* Custom */}
        <div className="pricing-card p-8" style={{border: '1.5px solid #E2E8F0', opacity: '0.95'}}>
          <div className="mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{background: '#F1F5F9'}}>✨</div>
            <h3 className="font-display font-bold text-xl mb-1" style={{color: '#0F172A'}}>Custom Plan</h3>
            <p className="text-sm" style={{color: '#94A3B8'}}>10+ days or complex routing</p>
          </div>
          <div className="mb-6">
            <div className="flex items-end gap-2"><span className="font-display font-bold text-5xl" style={{color: '#0F172A'}}>From $199</span></div>
            <p className="text-sm font-semibold mt-1" style={{color: '#2E6F40'}}>Timeline based on scope</p>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Unlimited Days &amp; Cities</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Fully Bespoke Verification</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Dedicated Travel Specialist</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Multiple / Unlimited Revisions</li>
          </ul>
          <a href="mailto:hello@roamify.life?subject=Custom%20Itinerary%20Inquiry" className="btn-secondary w-full text-center block py-3.5">Email Us</a>
        </div>
      </div>
      {/* Guarantee */}
      <div className="mt-10 bg-white rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto observe-me" style={{border: '1px solid #F1EFE7', boxShadow: '0 2px 12px rgba(15,23,42,0.06)'}}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background: '#E8F2EC'}}>🛡️</div>
        <div>
          <h4 className="font-display font-bold text-base mb-0.5" style={{color: '#0F172A'}}>100% Satisfaction Guarantee</h4>
          <p className="text-sm" style={{color: '#64748B'}}>Not satisfied? We'll revise your plan or issue a full refund within 7 days. Zero risk.</p>
        </div>
      </div>

      {/* Payment Methods & Security Trust Bar */}
      <div className="mt-8 max-w-4xl mx-auto bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm observe-me">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Cards accepted */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-slate-600"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              Accepted Payment Cards
            </span>
            <PaymentCardsRow size="md" className="justify-center md:justify-start" />
          </div>

          {/* Right: Security badges */}
          <div className="flex flex-col items-center md:items-end gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Payment Security &amp; Encryption
            </span>
            <div className="flex items-center flex-wrap justify-center md:justify-end gap-2 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
                🔒 256-Bit SSL Encryption
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg">
                🛡️ PCI-DSS Level 1 Certified
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg">
                ⚡ Secured by <a href="https://gumroad.com" target="_blank" rel="noopener noreferrer" className="font-bold text-pink-600 hover:underline">Gumroad</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div className="section-divider mx-6" />
  {/* ══════════════════════════════════════════════
     TESTIMONIALS
══════════════════════════════════════════════ */}
  <section className="py-24 px-6" style={{background: '#FAFAF7'}}>
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16 observe-me">
        <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full" style={{background: '#E8F2EC', color: '#2E6F40', border: '1px solid #bdd9c8'}}>Real Families</span>
        <h2 className="font-display font-bold text-4xl sm:text-5xl mb-3" style={{color: '#0F172A'}}>What Our Families Say</h2>
        <p className="handwritten text-xl" style={{color: '#E05A47', display: 'inline-block'}}>"We survived Rome with a toddler and grandma. Absolute miracle."</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 observe-me">
        <div className="card p-7" style={{borderTop: '3px solid #E05A47'}}>
          <div className="flex gap-0.5 mb-4" style={{color: '#DFB15B', fontSize: '1rem'}}>★★★★★</div>
          <p className="text-sm leading-relaxed mb-5" style={{color: '#475569'}}>"My 73-year-old father-in-law has a hip replacement. I was terrified of Lisbon's cobblestones. Roamify mapped every rest stop. Dad walked more than he has in years and loved every minute."</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0" style={{background: '#E05A47'}}>SR</div>
            <div><p className="font-bold text-sm" style={{color: '#0F172A'}}>Sarah R.</p><p className="text-xs" style={{color: '#94A3B8'}}>London, UK · Lisbon Trip 🇵🇹</p></div>
          </div>
        </div>
        <div className="card p-7" style={{borderTop: '3px solid #DFB15B'}}>
          <div className="flex gap-0.5 mb-4" style={{color: '#DFB15B', fontSize: '1rem'}}>★★★★★</div>
          <p className="text-sm leading-relaxed mb-5" style={{color: '#475569'}}>"We had a 2-year-old and 4-year-old in Rome. Every other plan was insane — 15,000 steps at noon. This protected nap time every single day. Zero meltdowns. I genuinely teared up at how smooth it was."</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0" style={{background: '#DFB15B'}}>MK</div>
            <div><p className="font-bold text-sm" style={{color: '#0F172A'}}>Mike &amp; Kate D.</p><p className="text-xs" style={{color: '#94A3B8'}}>Melbourne, AU · Rome Trip 🇮🇹</p></div>
          </div>
        </div>
        <div className="card p-7" style={{borderTop: '3px solid #2E6F40'}}>
          <div className="flex gap-0.5 mb-4" style={{color: '#DFB15B', fontSize: '1rem'}}>★★★★★</div>
          <p className="text-sm leading-relaxed mb-5" style={{color: '#475569'}}>"Three generations, 10 days in Italy. My mum uses a walker. Their step-free route through Florence was genius — she saw everything and we never had to split up or feel guilty. Incredible service."</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0" style={{background: '#2E6F40'}}>JL</div>
            <div><p className="font-bold text-sm" style={{color: '#0F172A'}}>Jennifer L.</p><p className="text-xs" style={{color: '#94A3B8'}}>Boston, MA · Italy Complete 🇮🇹</p></div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div className="section-divider mx-6" />
  {/* ══════════════════════════════════════════════
     FAQ
══════════════════════════════════════════════ */}
  <section id="faq" className="py-24 px-6" style={{background: '#FAFAF7'}}>
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-16 observe-me">
        <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #efe0b0'}}>Common Questions</span>
        <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4" style={{color: '#0F172A'}}>Frequently Asked</h2>
      </div>
      <div className="space-y-3 observe-me">
        {/* FAQ 1 */}
        <div className={`faq-item overflow-hidden ${openFAQ === 0 ? 'open' : ''}`}>
          <button onClick={() => toggleFAQ(0)} className="faq-trigger w-full flex items-center justify-between p-6 text-left" aria-expanded={openFAQ === 0}>
            <span className="font-semibold pr-4 text-sm" style={{color: '#0F172A'}}>How long does delivery take for each plan?</span>
            <svg className="faq-icon flex-shrink-0" style={{color: '#E05A47'}} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
          </button>
          <div className={`faq-answer px-6 text-sm leading-relaxed ${openFAQ === 0 ? 'open' : ''}`} style={{color: '#64748B'}}>
            <div className="pb-6">Because every single restaurant, step count, transit route, and nap window is individually researched and verified by a human travel specialist, our delivery timeline scales with the duration and complexity of your trip:
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li><strong>Weekend Getaway ($49):</strong> Delivered within <strong>2 days</strong></li>
                <li><strong>Full Week Plan ($99):</strong> Delivered within <strong>3–5 days</strong></li>
                <li><strong>Complete Family Package ($149):</strong> Delivered within <strong>5–7 days</strong></li>
              </ul>
              If you have an urgent trip coming up, email us at <a href="mailto:hello@roamify.life" className="text-emerald-700 font-semibold underline">hello@roamify.life</a> and we will do our best to accommodate your schedule!
            </div>
          </div>
        </div>

        {/* FAQ 2 */}
        <div className={`faq-item overflow-hidden ${openFAQ === 1 ? 'open' : ''}`}>
          <button onClick={() => toggleFAQ(1)} className="faq-trigger w-full flex items-center justify-between p-6 text-left" aria-expanded={openFAQ === 1}>
            <span className="font-semibold pr-4 text-sm" style={{color: '#0F172A'}}>What if we want changes or corrections after delivery?</span>
            <svg className="faq-icon flex-shrink-0" style={{color: '#E05A47'}} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
          </button>
          <div className={`faq-answer px-6 text-sm leading-relaxed ${openFAQ === 1 ? 'open' : ''}`} style={{color: '#64748B'}}>
            <div className="pb-6">All plans include <strong>1 free revision / correction</strong> (the Complete Family Package includes <strong>2 free revisions</strong>). If any venue changes or you want to swap an activity, simply reply to your delivery email and we will adjust your plan. All plans also include our <strong>100% 7-day satisfaction guarantee</strong> — we'll revise your itinerary or refund you in full.</div>
          </div>
        </div>

        {/* FAQ 3 */}
        <div className={`faq-item overflow-hidden ${openFAQ === 2 ? 'open' : ''}`}>
          <button onClick={() => toggleFAQ(2)} className="faq-trigger w-full flex items-center justify-between p-6 text-left" aria-expanded={openFAQ === 2}>
            <span className="font-semibold pr-4 text-sm" style={{color: '#0F172A'}}>What does "4-Pass Verification" actually mean?</span>
            <svg className="faq-icon flex-shrink-0" style={{color: '#E05A47'}} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
          </button>
          <div className={`faq-answer px-6 text-sm leading-relaxed ${openFAQ === 2 ? 'open' : ''}`} style={{color: '#64748B'}}>
            <div className="pb-6">Four independent human review stages: (1) Mobility Audit — step counts and bench locations. (2) Real-Time Venue Check — opening hours and reservation requirements. (3) Pacing Guardrails — guaranteed 2-hour daily rest blocks. (4) Contingency Planning — rainy-day alternatives and nearby healthcare points mapped for every day.</div>
          </div>
        </div>

        {/* FAQ 4 */}
        <div className={`faq-item overflow-hidden ${openFAQ === 3 ? 'open' : ''}`}>
          <button onClick={() => toggleFAQ(3)} className="faq-trigger w-full flex items-center justify-between p-6 text-left" aria-expanded={openFAQ === 3}>
            <span className="font-semibold pr-4 text-sm" style={{color: '#0F172A'}}>How do you collect my family's specific information?</span>
            <svg className="faq-icon flex-shrink-0" style={{color: '#E05A47'}} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
          </button>
          <div className={`faq-answer px-6 text-sm leading-relaxed ${openFAQ === 3 ? 'open' : ''}`} style={{color: '#64748B'}}>
            <div className="pb-6">After purchase, you complete a structured intake form: destination, travel dates, ages of all travellers, mobility requirements, dietary restrictions, and pace preference. We use every data point to customise each hour of your itinerary.</div>
          </div>
        </div>

        {/* FAQ 5 */}
        <div className={`faq-item overflow-hidden ${openFAQ === 4 ? 'open' : ''}`}>
          <button onClick={() => toggleFAQ(4)} className="faq-trigger w-full flex items-center justify-between p-6 text-left" aria-expanded={openFAQ === 4}>
            <span className="font-semibold pr-4 text-sm" style={{color: '#0F172A'}}>Does it work for very young toddlers under 18 months?</span>
            <svg className="faq-icon flex-shrink-0" style={{color: '#E05A47'}} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
          </button>
          <div className={`faq-answer px-6 text-sm leading-relaxed ${openFAQ === 4 ? 'open' : ''}`} style={{color: '#64748B'}}>
            <div className="pb-6">Yes — this is where we excel most. We plan around 2-nap daily schedules for infants, mark all stroller-accessible routes, confirm lift availability at every museum, and note nursing-friendly cafés and family restrooms throughout.</div>
          </div>
        </div>

        {/* FAQ 6 */}
        <div className={`faq-item overflow-hidden ${openFAQ === 5 ? 'open' : ''}`}>
          <button onClick={() => toggleFAQ(5)} className="faq-trigger w-full flex items-center justify-between p-6 text-left" aria-expanded={openFAQ === 5}>
            <span className="font-semibold pr-4 text-sm" style={{color: '#0F172A'}}>How is this different from a travel agent?</span>
            <svg className="faq-icon flex-shrink-0" style={{color: '#E05A47'}} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
          </button>
          <div className={`faq-answer px-6 text-sm leading-relaxed ${openFAQ === 5 ? 'open' : ''}`} style={{color: '#64748B'}}>
            <div className="pb-6">Travel agents book flights and hotels and earn commission. We create the precise hour-by-hour daily structure that makes your trip actually work across multiple age groups and mobility levels. We complement your bookings with the detail no travel agent has the time or expertise to build.</div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* ══════════════════════════════════════════════
     FINAL CTA BANNER
  ══════════════════════════════════════════════ */}
  <section className="py-24 px-6 relative overflow-hidden" style={{background: '#0F172A'}}>
    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 25% 50%, #DFB15B 0%, transparent 60%), radial-gradient(circle at 75% 50%, #E05A47 0%, transparent 60%)'}} />
    <div className="relative max-w-3xl mx-auto text-center observe-me">
      <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8" style={{background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)'}}>
        <span className="w-2 h-2 rounded-full animate-pulse" style={{background: '#E05A47'}} />
        <span className="text-sm font-semibold" style={{color: 'rgba(255,255,255,0.8)'}}>Limited spots available this month</span>
      </div>
      <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4" style={{color: '#FFFFFF'}}>
        Ready for the Family Trip<br />of a Lifetime?
      </h2>
      <p className="handwritten text-2xl mb-8" style={{color: '#DFB15B', display: 'inline-block'}}>"Every generation. Every memory. Zero stress."</p>
      <div className="flex flex-wrap gap-4 justify-center mt-6">
        <button onClick={() => window.location.href='#pricing'} className="btn-primary text-base py-4 px-10 shadow-md cursor-pointer">
          Get Our Stress-Free Family Itinerary →
        </button>
        <a href="#pricing" className="text-base py-4 px-8 rounded-xl font-bold transition-all hover:bg-white/10 cursor-pointer" style={{border: '1.5px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.85)', fontFamily: '"Plus Jakarta Sans",sans-serif'}}>
          View All Plans
        </a>
      </div>
      <p className="text-sm mt-6" style={{color: 'rgba(255,255,255,0.4)'}}>No subscription · 7-day guarantee · 100% human-verified itineraries</p>
    </div>
  </section>
  {/* ══════════════════════════════════════════════
     FOOTER
══════════════════════════════════════════════ */}
  <footer className="py-16 px-6 border-t" style={{background: '#FAFAF7', borderColor: '#F1EFE7'}}>
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-4 gap-10 mb-12">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background: '#0F172A'}}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#DFB15B" strokeWidth={2} strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.9 19.79 19.79 0 0 1 1.61 3.27 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.55 5.55l.96-.96a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 21 15.44" /></svg>
            </div>
            <span className="font-display font-bold text-base" style={{color: '#0F172A'}}>Roamify</span>
          </div>
          <p className="text-sm leading-relaxed mb-5" style={{color: '#64748B'}}>Multi-generational travel itineraries built for ages 3 to 75. Precision-planned, human-verified.</p>
          {/* Email address with small inline icon */}
          <p className="text-xs mb-3 flex items-center gap-1.5" style={{color: '#94A3B8'}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
            <a href="mailto:hello@roamify.life" className="hover:underline font-semibold" style={{color: '#E05A47'}}>hello@roamify.life</a>
          </p>
          {/* Social logo icons — Instagram, Facebook, WhatsApp only */}
          <div className="flex items-center gap-3 mt-1">
            <a href="https://www.instagram.com/roamify.life/" target="_blank" rel="noopener noreferrer" title="Instagram" className="group">
              <img src="/logos/instagram.svg" alt="Instagram" className="w-8 h-8 rounded-lg group-hover:opacity-80 transition-opacity shadow-sm" />
            </a>
            <a href="https://www.facebook.com/share/1FQTVLfs94/" target="_blank" rel="noopener noreferrer" title="Facebook" className="group">
              <img src="/logos/facebook.svg" alt="Facebook" className="w-8 h-8 rounded-lg group-hover:opacity-80 transition-opacity shadow-sm" />
            </a>
            <a href="https://wa.me/message/N3LN7Y5F5DFHA1" target="_blank" rel="noopener noreferrer" title="WhatsApp" className="group">
              <img src="/logos/whatsapp.svg" alt="WhatsApp" className="w-8 h-8 rounded-lg group-hover:opacity-80 transition-opacity shadow-sm" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold mb-4 tracking-widest uppercase" style={{color: '#94A3B8'}}>Destinations</h4>
          <ul className="space-y-2 text-sm" style={{color: '#64748B'}}>
            <li><a href="#sample" className="hover:underline font-medium">🇮🇹 Italy, 🇬🇧 UK, 🇵🇹 Portugal</a></li>
            <li><a href="#sample" className="hover:underline font-medium">🇪🇸 Spain, 🇫🇷 France, 🇬🇷 Greece</a></li>
            <li><a href="#sample" className="hover:underline font-medium">🇳🇱 Netherlands, 🇨🇭 Switzerland</a></li>
            <li><a href="#sample" className="hover:underline font-medium">🇦🇹 Austria, 🇨🇿 Czech Republic</a></li>
            <li><a href="#sample" className="hover:underline font-medium">🇩🇪 Germany, 🇭🇷 Croatia</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold mb-4 tracking-widest uppercase" style={{color: '#94A3B8'}}>Plans</h4>
          <ul className="space-y-2 text-sm" style={{color: '#64748B'}}>
            <li><a href="#pricing" className="hover:underline font-medium">Weekend Getaway ($49)</a></li>
            <li><a href="#pricing" className="hover:underline font-medium">Full Week Plan ($99)</a></li>
            <li><a href="#pricing" className="hover:underline font-medium">Extended Trip ($149)</a></li>
            <li><a href="#sample" className="hover:underline font-medium">Sample Itinerary</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold mb-4 tracking-widest uppercase" style={{color: '#94A3B8'}}>Trust &amp; Legal</h4>
          <ul className="space-y-2 text-sm" style={{color: '#64748B'}}>
            <li><a href="#faq" className="hover:underline font-medium">FAQ</a></li>
            <li><a href="#faq" className="hover:underline font-medium">Privacy Policy</a></li>
            <li><a href="#faq" className="hover:underline font-medium">Terms of Service</a></li>
            <li><a href="#faq" className="hover:underline font-medium">Refund Policy</a></li>
          </ul>
          <div className="mt-5 bg-white rounded-xl p-3 inline-flex items-center gap-2 border" style={{borderColor: '#F1EFE7'}}>
            <span>🛡️</span>
            <span className="text-xs font-semibold" style={{color: '#0F172A'}}>100% Satisfaction Guarantee</span>
          </div>
        </div>
      </div>
      {/* Footer Payment & Security Row */}
      <div className="border-t pt-8 pb-6 flex flex-col md:flex-row justify-between items-center gap-4" style={{borderColor: '#F1EFE7'}}>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">Accepted Payment Cards:</span>
          <PaymentCardsRow size="sm" />
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">🔒 256-Bit SSL</span>
          <span>•</span>
          <span>🛡️ PCI-DSS Level 1</span>
          <span>•</span>
          <span>Powered by <a href="https://gumroad.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-pink-600 hover:underline">Gumroad</a></span>
        </div>
      </div>
      <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4" style={{borderColor: '#F1EFE7'}}>
        <p className="text-sm" style={{color: '#94A3B8'}}>© 2026 Roamify. Made with care for families everywhere.</p>
        <p className="text-xs" style={{color: '#94A3B8'}}>Serving families in the US, UK, EU, Canada &amp; Australia</p>
      </div>
    </div>
  </footer>
  {/* ══════════════════════════════════════════════
     INTAKE MODAL
══════════════════════════════════════════════ */}
  <div 
    id="intake-modal" 
    className={isIntakeModalOpen ? "open" : ""} 
    role="dialog" 
    aria-modal="true" 
    aria-labelledby="modal-title"
    onClick={(e) => {
      if (e.target.id === 'intake-modal') {
        setIsIntakeModalOpen(false);
        setCurrentStep(1);
      }
    }}
  >
    <div className="modal-card mx-4" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="modal-header p-6 border-b flex-shrink-0" style={{borderColor: '#F1EFE7'}}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 id="modal-title" className="font-display font-bold text-lg" style={{color: '#0F172A'}}>Build Your Family Itinerary</h2>
            <p className="text-sm mt-0.5" id="modal-subtitle" style={{color: '#94A3B8'}}>Step {Math.min(currentStep, 4)} of 4</p>
          </div>
          <button onClick={() => { setIsIntakeModalOpen(false); setCurrentStep(1); }} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-200 cursor-pointer" style={{background: '#F1F5F9', color: '#64748B'}} aria-label="Close">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg>
          </button>
        </div>
        {currentStep <= 4 && (
          <div className="flex gap-2">
            <div className={`step-dot ${currentStep >= 1 ? (currentStep > 1 ? 'done' : 'active') : ''}`} id="dot-1" />
            <div className={`step-dot ${currentStep >= 2 ? (currentStep > 2 ? 'done' : 'active') : ''}`} id="dot-2" />
            <div className={`step-dot ${currentStep >= 3 ? (currentStep > 3 ? 'done' : 'active') : ''}`} id="dot-3" />
            <div className={`step-dot ${currentStep >= 4 ? (currentStep > 4 ? 'done' : 'active') : ''}`} id="dot-4" />
          </div>
        )}
      </div>
      {/* Body */}
      <div className="modal-body p-6">
        {/* Step 1: Trip Details */}
        <div id="modal-step-1" className={`modal-step ${currentStep === 1 ? '' : 'hidden'}`}>
          <h3 className="font-display font-bold text-base mb-4" style={{color: '#0F172A'}}>Where &amp; When are you travelling?</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Primary Destination *</label>
              <input id="dest-primary" type="text" className="form-input" placeholder="e.g. Rome, Italy" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Secondary Destination (optional)</label>
              <input id="dest-secondary" type="text" className="form-input" placeholder="e.g. Florence" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Specific Sights or Places You Want to Visit (optional)</label>
              <input id="must-see" type="text" className="form-input" placeholder="e.g. Colosseum, Vatican Museums, Tuscan vineyard day trip, boat tour" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Which Plan? *</label>
              <select id="plan-interest" className="form-input">
                <option value>Select a plan…</option>
                <option>Weekend Getaway — $49 (3 days, 1 city)</option>
                <option>Full Week Plan — $99 (7 days, up to 2 cities)</option>
                <option>Complete Family Package — $149 (10 days, multi-city)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Start Date *</label><input id="date-start" type="date" className="form-input" /></div>
              <div><label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>End Date *</label><input id="date-end" type="date" className="form-input" /></div>
            </div>
          </div>
        </div>
        {/* Step 2: Travelers */}
        <div id="modal-step-2" className={`modal-step ${currentStep === 2 ? '' : 'hidden'}`}>
          <h3 className="font-display font-bold text-base mb-4" style={{color: '#0F172A'}}>Tell us about your party</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Total Number of Travelers *</label>
              <input id="traveller-count" type="number" min={1} className="form-input" placeholder="e.g. 4" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Number of Adults *</label>
                <input id="num-adults" type="number" min={0} className="form-input" placeholder={0} />
              </div>
              <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Number of Seniors (65+) *</label>
              <input id="num-seniors" type="number" min={0} className="form-input" placeholder={0} onInput={(e) => document.getElementById('seniors-ages-container').style.display = e.target.value > 0 ? 'block' : 'none'} />
            </div>
          </div>
          <div id="seniors-ages-container" style={{display: 'none'}}>
            <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Ages of Seniors *</label>
            <input id="ages-seniors" type="text" className="form-input" placeholder="e.g. 68, 72" />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Number of Children *</label>
            <input id="num-kids" type="number" min={0} className="form-input" placeholder={0} onInput={(e) => document.getElementById('kids-ages-container').style.display = e.target.value > 0 ? 'block' : 'none'} />
          </div>
          <div id="kids-ages-container" style={{display: 'none'}}>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Ages of Children *</label>
              <input id="ages-kids" type="text" className="form-input" placeholder="e.g. 3, 7, 12" />
            </div>
          </div>
        </div>
        {/* Step 3: Preferences */}
        <div id="modal-step-3" className={`modal-step ${currentStep === 3 ? '' : 'hidden'}`}>
          <h3 className="font-display font-bold text-base mb-4" style={{color: '#0F172A'}}>Preferences &amp; Roaming Style</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Travel Pace *</label>
              <select id="pace" className="form-input">
                <option value>Select a pace…</option>
                <option>Relaxed (1 big thing per day, lots of downtime)</option>
                <option>Moderate (Morning &amp; Afternoon activity)</option>
                <option>Fast (Pack in as much as possible!)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{color: '#64748B'}}>What type of places do you want to roam? (optional)</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                  <input type="checkbox" id="roam-history" className="w-4 h-4 rounded text-emerald-600" />
                  <span className="text-xs font-medium text-slate-700">🏛️ Historic &amp; Landmarks</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                  <input type="checkbox" id="roam-food" className="w-4 h-4 rounded text-emerald-600" />
                  <span className="text-xs font-medium text-slate-700">🍕 Food, Cafes &amp; Markets</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                  <input type="checkbox" id="roam-nature" className="w-4 h-4 rounded text-emerald-600" />
                  <span className="text-xs font-medium text-slate-700">🌳 Parks &amp; Scenic Nature</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                  <input type="checkbox" id="roam-beach" className="w-4 h-4 rounded text-emerald-600" />
                  <span className="text-xs font-medium text-slate-700">🏖️ Beaches &amp; Waterfronts</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                  <input type="checkbox" id="roam-culture" className="w-4 h-4 rounded text-emerald-600" />
                  <span className="text-xs font-medium text-slate-700">🎨 Art &amp; Museums</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                  <input type="checkbox" id="roam-family" className="w-4 h-4 rounded text-emerald-600" />
                  <span className="text-xs font-medium text-slate-700">🎡 Kids &amp; Family Fun</span>
                </label>
              </div>
              <input id="custom-places" type="text" className="form-input mt-2" placeholder="Other places/interests (e.g. vintage shopping, hidden alleyways, gardens)" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Accommodation Style (optional)</label>
              <select id="accommodation" className="form-input">
                <option value>No preference</option>
                <option>Hotels (Standard)</option>
                <option>Luxury Resorts</option>
                <option>AirBnb / Apartment Rentals</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{color: '#64748B'}}>Mobility Requirements (optional)</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" id="mob-walker" className="w-4 h-4 rounded" /><span className="text-sm font-medium" style={{color: '#475569'}}>Cane or walker in use</span></label>
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" id="mob-wheelchair" className="w-4 h-4 rounded" /><span className="text-sm font-medium" style={{color: '#475569'}}>Wheelchair required</span></label>
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" id="mob-stairs" className="w-4 h-4 rounded" /><span className="text-sm font-medium" style={{color: '#475569'}}>Must avoid stairs entirely</span></label>
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" id="mob-stroller" className="w-4 h-4 rounded" /><span className="text-sm font-medium" style={{color: '#475569'}}>Stroller / pram for toddler</span></label>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Dietary Restrictions (optional)</label>
              <input id="dietary" type="text" className="form-input" placeholder="e.g. vegetarian, nut allergy, halal" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Any specific places or activities to avoid? (optional)</label>
              <input id="avoid-places" type="text" className="form-input" placeholder="e.g. Steep climbs, crowded tourist traps, long hikes" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Anything else we should know? (optional)</label>
              <textarea id="notes" className="form-input resize-none" rows={2} placeholder="e.g. Celebrating a 70th birthday, grandad has a hip replacement" defaultValue={""} />
            </div>
          </div>
        </div>
        {/* Step 4: Contact Info */}
        <div id="modal-step-4" className={`modal-step ${currentStep === 4 ? '' : 'hidden'}`}>
          <h3 className="font-display font-bold text-base mb-4" style={{color: '#0F172A'}}>Contact Information</h3>
          <p className="text-sm mb-4" style={{color: '#64748B'}}>Where should we send your itinerary?</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Full Name *</label>
              <input id="client-name" type="text" className="form-input" placeholder="e.g. Jane Doe" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Email Address *</label>
              <input id="client-email" type="email" className="form-input" placeholder="e.g. you@example.com" />
            </div>
          </div>
        </div>
        <div id="modal-step-5" className={`modal-step text-center py-6 ${currentStep === 5 ? '' : 'hidden'}`}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4" style={{background: '#E8F2EC'}}>✔️</div>
          <h3 className="font-display font-bold text-xl mb-1" style={{color: '#0F172A'}}>You're all set!</h3>
          <p className="handwritten text-xl mb-3" style={{color: '#E05A47'}}>"Your adventure begins now."</p>

          {submittedOrderId && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 text-center">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">Your Tracking Order ID</span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono font-bold text-lg text-slate-800 tracking-wider bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">{submittedOrderId}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(submittedOrderId);
                    setCopiedOrderId(true);
                    setTimeout(() => setCopiedOrderId(false), 2000);
                  }}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                >
                  {copiedOrderId ? '✓ Copied' : 'Copy ID'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Keep this Order ID for reference and tracking</p>
            </div>
          )}

          <p className="text-sm mb-4 leading-relaxed" style={{color: '#64748B'}}>
            We've received your details! The secure checkout overlay will open directly so you can complete your order without leaving this page.
          </p>

          {/* Card logos & Security note before checkout */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 text-center">
            <PaymentCardsRow size="sm" className="justify-center mb-2" />
            <p className="text-[11px] font-medium text-slate-500 flex items-center justify-center gap-1.5 flex-wrap">
              <span>🔒 256-Bit SSL</span>
              <span>•</span>
              <span>PCI-DSS Level 1 Compliant</span>
            </p>
          </div>

          {/* Countdown ring */}
          {countdown !== null && countdown > 0 ? (
            <div className="flex flex-col items-center gap-2.5 mb-4">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#F1EFE7" strokeWidth="5" />
                  <circle
                    cx="32" cy="32" r="28"
                    fill="none"
                    stroke="#E05A47"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - countdown / 5)}`}
                    style={{transition: 'stroke-dashoffset 1s linear'}}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-bold text-xl" style={{color: '#E05A47'}}>{countdown}</span>
              </div>
              <p className="text-xs font-semibold" style={{color: '#94A3B8'}}>Opening checkout overlay in {countdown}s…</p>
            </div>
          ) : null}

          {/* Proceed to Checkout button */}
          <button
            type="button"
            onClick={() => {
              setCountdown(0);
              openGumroadCheckout();
            }}
            className="btn-primary w-full text-center block py-4 mb-2.5 font-semibold cursor-pointer shadow-md"
          >
            Proceed to In-Window Checkout →
          </button>

          {/* Dedicated Apple Pay & Google Pay Button */}
          <WalletPayButton url={selectedPlanUrl} className="w-full mb-3" />

          {/* Return to Website button */}
          <button 
            type="button"
            onClick={() => { 
              setIsIntakeModalOpen(false); 
              setCurrentStep(1); 
              setCountdown(null); 
              setShowGumroadOverlay(false);
            }} 
            className="btn-secondary w-full text-center py-3.5 text-sm cursor-pointer"
          >
            I'll Checkout Later (Return to Website)
          </button>
        </div>
      </div>
      {/* Footer nav */}
      {currentStep < 5 && (
      <div className="modal-footer p-5 border-t flex justify-between items-center flex-shrink-0" id="modal-nav" style={{borderColor: '#F1EFE7', background: '#FAFAF7'}}>
        <button onClick={() => setCurrentStep(prev => prev - 1)} id="btn-back" className={`btn-secondary text-sm py-2.5 px-6 cursor-pointer ${currentStep === 1 ? 'hidden' : ''}`}>← Back</button>
        <div className="flex-1" />
        <button onClick={() => {
          if (currentStep === 4) {
            submitForm();
          } else {
            setCurrentStep(prev => prev + 1);
          }
        }} id="btn-next" className="btn-primary text-sm py-2.5 px-8 cursor-pointer">
          {currentStep === 4 ? (btnText === 'Complete Order' ? 'Submit' : btnText) : 'Continue →'}
        </button>
      </div>
      )}
    </div>
  </div>

  {/* ══════════════════════════════════════════════
     IN-WINDOW GUMROAD CHECKOUT OVERLAY MODAL
  ══════════════════════════════════════════════ */}
  {showGumroadOverlay && selectedPlanUrl && (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-4">
      <div className="relative w-full max-w-2xl h-[92vh] max-h-[860px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Overlay Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 text-white border-b border-slate-800 flex-shrink-0 min-h-[50px]">
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5">
            {/* 256-Bit SSL Badge */}
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-md text-[11px] font-semibold text-emerald-400 flex-shrink-0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>256-Bit SSL Encrypted</span>
            </div>

            {/* PCI-DSS Level 1 Badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-300 flex-shrink-0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <span>PCI-DSS Level 1</span>
            </div>

            {/* Powered by Gumroad Official Link Badge */}
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-300 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
              <span>Powered by</span>
              <a
                href="https://gumroad.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 font-bold hover:underline inline-flex items-center gap-1"
              >
                Gumroad
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1={10} y1={14} x2={21} y2={3}/></svg>
              </a>
            </div>
          </div>

          {/* Return / Close Button */}
          <button
            type="button"
            onClick={() => setShowGumroadOverlay(false)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-slate-700 flex-shrink-0 ml-2"
          >
            <span>Close</span>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/></svg>
          </button>
        </div>

        {/* Iframe & Loading Indicator */}
        <div className="relative flex-1 w-full bg-slate-50 flex items-center justify-center overflow-hidden">
          {isIframeLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/95 gap-3">
              <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-slate-800">Loading Secure Gumroad Checkout...</p>
              <p className="text-xs text-slate-500">Preparing your handcrafted itinerary package</p>
            </div>
          )}
          <iframe
            src={selectedPlanUrl}
            className="w-full h-full border-0 bg-white"
            title="Gumroad Checkout"
            onLoad={() => setIsIframeLoading(false)}
            allow="payment; camera; microphone"
          />
        </div>

        {/* Overlay Bottom Bar for Apple Pay & Google Pay */}
        <div className="flex items-center justify-center p-3 bg-slate-900 text-white border-t border-slate-800 flex-shrink-0">
          <WalletPayButton url={selectedPlanUrl} className="w-full sm:w-auto text-xs py-2.5 px-5" />
        </div>
      </div>
    </div>
  )}
  {/* ══════════════════════════════════════════════
     JAVASCRIPT
══════════════════════════════════════════════ */}
</div>

    </>
  );
}
