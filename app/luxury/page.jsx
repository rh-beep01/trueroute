"use client";
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export default function LuxuryHome() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [btnText, setBtnText] = useState("Submit Trip Details");
  const [submittedOrderId, setSubmittedOrderId] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState(false);

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

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E05A47', '#DFB15B', '#2E6F40']
    });
    setBtnText("Trip Registered!");
    setCurrentStep(5);
    setTimeout(() => {
      setBtnText("Submit");
    }, 2500);
  };

  const submitForm = async () => {
    setBtnText("Registering Trip...");
    
    const getVal = (id) => document.getElementById(id)?.value || '';
    const getNum = (id) => parseInt(document.getElementById(id)?.value) || 0;
    const getCheck = (id) => document.getElementById(id)?.checked || false;

    const formData = {
      dest_primary: getVal('dest-primary'),
      dest_secondary: getVal('dest-secondary'),
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

    if (!formData.dest_primary || !formData.date_start || !formData.date_end || !formData.client_name || !formData.client_email) {
      alert("Please fill in your primary destination, travel dates, name, and email.");
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
        triggerConfetti();
      } else {
        alert("We had trouble saving your trip details. Please try again or reach out to hello@roamify.life.");
        setBtnText("Submit Trip Details");
      }
    } catch (err) {
      alert("We had trouble saving your trip details. Please try again or reach out to hello@roamify.life.");
      setBtnText("Submit Trip Details");
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
      <a href="#" className="flex items-center gap-3 group">
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
        <a href="#why-us" className="nav-link text-sm">Why Roamify</a>
        <a href="#four-pass" className="nav-link text-sm">Our 4-Point Check</a>
        <a href="#fork-merge" className="nav-link text-sm">The Daily Flow</a>
        <a href="#sample" className="nav-link text-sm">Sample Itinerary</a>
        <a href="#pricing" className="nav-link text-sm">Pricing</a>
        <a href="#faq" className="nav-link text-sm">FAQ</a>
      </nav>
      <div className="flex items-center gap-3">
        <button onClick={() => window.location.href='#pricing'} className="btn-primary text-sm hidden sm:inline-block">Plan Your Family Trip</button>
        <button id="menu-toggle" className="lg:hidden p-2 rounded-lg border border-canvas-border bg-white" style={{color: '#0F172A'}} aria-label="Open menu">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1={3} y1={6} x2={21} y2={6} /><line x1={3} y1={12} x2={21} y2={12} /><line x1={3} y1={18} x2={21} y2={18} />
          </svg>
        </button>
      </div>
    </div>
    {/* Mobile Nav */}
    <nav id="mobile-nav" className={"hidden lg:hidden mt-3 mx-4 bg-white rounded-2xl border border-canvas-border shadow-md p-5 space-y-3 " + (isMobileNavOpen ? "!block" : "hidden")}>
      <a href="#why-us" onClick={() => setIsMobileNavOpen(false)} className="block text-sm font-semibold py-1" style={{color: '#1E293B'}}>Why Roamify</a>
      <a href="#four-pass" onClick={() => setIsMobileNavOpen(false)} className="block text-sm font-semibold py-1" style={{color: '#1E293B'}}>Our 4-Point Check</a>
      <a href="#fork-merge" onClick={() => setIsMobileNavOpen(false)} className="block text-sm font-semibold py-1" style={{color: '#1E293B'}}>The Daily Flow</a>
      <a href="#sample" onClick={() => setIsMobileNavOpen(false)} className="block text-sm font-semibold py-1" style={{color: '#1E293B'}}>Sample Itinerary</a>
      <a href="#pricing" onClick={() => setIsMobileNavOpen(false)} className="block text-sm font-semibold py-1" style={{color: '#1E293B'}}>Pricing</a>
      <a href="#faq" onClick={() => setIsMobileNavOpen(false)} className="block text-sm font-semibold py-1" style={{color: '#1E293B'}}>FAQ</a>
      <button onClick={() => { window.location.href='#pricing'; setIsMobileNavOpen(false); }} className="btn-primary w-full text-center py-3 mt-2">Plan Your Family Trip</button>
    </nav>
  </header>
  {/* ══════════════════════════════════════════════
     HERO SECTION
  ══════════════════════════════════════════════ */}
  <section className="relative min-h-screen flex items-center overflow-hidden hero-bg pt-20">
    <div className="absolute top-24 left-8 w-64 h-64 rounded-full opacity-20 pointer-events-none" style={{background: 'radial-gradient(circle,#DFB15B,transparent)'}} />
    <div className="absolute bottom-24 left-1/3 w-48 h-48 rounded-full opacity-15 pointer-events-none" style={{background: 'radial-gradient(circle,#E05A47,transparent)'}} />
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-12 gap-14 items-center">
      {/* LEFT: Text */}
      <div className="lg:col-span-5" style={{animation: 'fadeInUp 0.7s ease forwards'}}>
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2.5 bg-white rounded-full px-5 py-2.5 mb-8 border" style={{borderColor: '#F1EFE7', boxShadow: '0 2px 10px rgba(15,23,42,0.07)'}}>
          <span style={{color: '#DFB15B'}} className="text-sm">★★★★★</span>
          <span className="text-xs font-semibold" style={{color: '#1E293B'}}>Handcrafted for Families · Western Europe &amp; Mediterranean</span>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{background: '#2E6F40'}} />
        </div>
        <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-[3.6rem] xl:text-7xl leading-[1.06] mb-5" style={{color: '#0F172A'}}>
          Europe Together,<br />
          <span className="shimmer-text">Without the Friction.</span>
        </h1>
        {/* Sub-headline in Kalam */}
        <p className="handwritten text-xl mb-4" style={{color: '#E05A47', display: 'inline-block'}}>
          "Thoughtfully crafted so toddlers nap on time and grandparents never feel rushed."
        </p>
        <p className="text-base leading-relaxed mb-10 max-w-lg" style={{color: '#475569'}}>
          Traveling with three generations shouldn't feel like a logistics marathon. We design 
          personalized, human-verified European itineraries with
          <strong style={{color: '#2E6F40', fontWeight: 700}}> step-free walking paths</strong>,
          <strong style={{color: '#2E6F40', fontWeight: 700}}> protected afternoon breaks</strong>, and
          family-welcoming dining spots where everyone actually enjoys the journey.
        </p>
        <div className="flex flex-wrap gap-3 mb-10">
          <button onClick={() => window.location.href='#pricing'} id="hero-cta-primary" className="btn-primary text-base py-4 px-8">
            Get Your Custom Itinerary — From $49
          </button>
          <a href="#sample" id="hero-cta-secondary" className="btn-secondary text-base py-4 px-8">
            Explore a Sample Day
          </a>
        </div>
        <div className="flex flex-wrap gap-6 text-sm" style={{color: '#64748B'}}>
          <div className="flex items-center gap-2 font-semibold">
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            100% Specialist-Crafted
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            Delivered in 2–5 Days
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            7-Day Peace-of-Mind Guarantee
          </div>
        </div>
      </div>
      {/* RIGHT: Floating day card */}
      <div className="hidden lg:flex flex-col items-end w-full mt-10 lg:mt-0 lg:col-span-7 gap-6" style={{animation: 'fadeInRight 0.7s ease 0.25s both', zIndex: 10}}>
        <div className="w-full lg:w-[720px] lg:h-[405px] overflow-hidden rounded-2xl border-4 shadow-xl border-white bg-gray-100 relative">
          <img src="/hero_family_travel_1786805857762.jpg" alt="Family Vacation in Europe" className="absolute inset-0 w-full h-full object-cover" />
        </div>
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
                <p className="text-[0.65rem] font-semibold mt-0.5" style={{color: '#2E6F40'}}>4-Point Verified ✓</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="time-pill text-[0.65rem] px-2 py-0.5" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #F1EFE7'}}>8:30</span>
                <div><p className="font-semibold text-xs" style={{color: '#0F172A'}}>Gentle Breakfast — Campo de' Fiori</p><p className="text-[0.65rem] mt-0.5 leading-tight" style={{color: '#94A3B8'}}>Flat piazza walk · outdoor seating reserved ✓</p></div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="time-pill text-[0.65rem] px-2 py-0.5" style={{background: '#FDF2F0', color: '#C84B39', border: '1px solid #F1EFE7'}}>10:00</span>
                <div><p className="font-semibold text-xs" style={{color: '#0F172A'}}>Colosseum Fast-Track Visit</p><p className="text-[0.65rem] mt-0.5 leading-tight" style={{color: '#94A3B8'}}>Elevator entry confirmed · max 4,800 steps · bench stops mapped</p></div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="time-pill text-[0.65rem] px-2 py-0.5" style={{background: '#E8F2EC', color: '#2E6F40', border: '1px solid #dce8e0'}}>12:30</span>
                <div><p className="font-semibold text-xs" style={{color: '#2E6F40'}}>🌙 Afternoon Recharge &amp; Nap Time</p><p className="text-[0.65rem] mt-0.5 leading-tight" style={{color: '#94A3B8'}}>Hotel siesta · zero rushing · fresh coffee nearby</p></div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="time-pill text-[0.65rem] px-2 py-0.5" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #F1EFE7'}}>15:30</span>
                <div><p className="font-semibold text-xs" style={{color: '#0F172A'}}>Trevi Fountain &amp; Gelato Stroll</p><p className="text-[0.65rem] mt-0.5 leading-tight" style={{color: '#94A3B8'}}>Shaded pedestrian paths · benches every 300m</p></div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="time-pill text-[0.65rem] px-2 py-0.5" style={{background: '#FDF2F0', color: '#C84B39', border: '1px solid #F1EFE7'}}>19:00</span>
                <div><p className="font-semibold text-xs" style={{color: '#0F172A'}}>Family Dinner — Trattoria da Enzo</p><p className="text-[0.65rem] mt-0.5 leading-tight" style={{color: '#94A3B8'}}>High chairs &amp; quiet courtyard table verified ✓</p></div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t text-[0.65rem]" style={{borderColor: '#F1EFE7', color: '#94A3B8'}}>
              ☂️ Rainy-Day Backup: Galleria Borghese ground-floor tour
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
        <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #efe0b0'}}>The Thoughtful Difference</span>
        <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4" style={{color: '#0F172A'}}>
          Why Generic AI Apps <span style={{color: '#E05A47'}}>Fall Short</span> for Families
        </h2>
        <p className="handwritten text-xl mb-3" style={{color: '#2E6F40', display: 'inline-block'}}>"Algorithms calculate distances. We design around how your family actually feels."</p>
        <p className="text-base max-w-2xl mx-auto mt-2" style={{color: '#64748B'}}>Automated travel tools ignore cobblestones, stairs, and fatigue. We build itineraries around realistic human energy.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 observe-me">
        {/* Generic AI — BAD */}
        <div className="compare-card p-8 border border-red-100" style={{boxShadow: '0 4px 20px rgba(224,90,71,0.08)'}}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{background: '#FDF2F0'}}>😤</div>
            <div>
              <h3 className="font-display font-bold text-lg" style={{color: '#0F172A'}}>Standard AI &amp; Generic Planners</h3>
              <p className="text-sm font-medium" style={{color: '#E05A47'}}>Crammed checklists with zero real-world context</p>
            </div>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>12,000+ uncalibrated steps daily</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>Exhausts grandparents' knees and leads straight to toddler meltdowns.</p></div></li>
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>Sends strollers &amp; walkers into steep stairs</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>No awareness of European cobblestones, steep hills, or broken lifts.</p></div></li>
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>Zero designated downtime or nap windows</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>Continuous sightseeing with no time for afternoon recharge or rest.</p></div></li>
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>Suggests closed venues or unverified dining</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>Outdated opening hours, long waitlists, and no high chairs or kid options.</p></div></li>
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>No backup plans when weather or energy changes</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>One rainstorm or tired family member derails the entire afternoon.</p></div></li>
          </ul>
        </div>
        {/* Roamify — GOOD */}
        <div className="compare-card p-8 relative overflow-hidden" style={{border: '1.5px solid #2E6F40', boxShadow: '0 4px 24px rgba(46,111,64,0.12)'}}>
          <div className="absolute top-0 right-0 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl" style={{background: '#2E6F40'}}>✓ THE ROAMIFY STANDARD</div>
          <div className="flex items-center gap-3 mb-6 mt-1">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{background: '#E8F2EC'}}>✅</div>
            <div>
              <h3 className="font-display font-bold text-lg" style={{color: '#0F172A'}}>Handcrafted Roamify Itinerary</h3>
              <p className="text-sm font-medium" style={{color: '#2E6F40'}}>4-Point Specialist Verification</p>
            </div>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>Measured, relaxed pacing (≤ 6,500 steps/day)</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>Flat, scenic routes with shaded benches and easy cafe stops every 300–400m.</p></div></li>
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>Certified step-free routes for strollers &amp; seniors</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>Elevators, ramps, and smooth walkways pre-checked at every major sight.</p></div></li>
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>Protected afternoon recharge (12:30–2:30 PM)</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>Dedicated quiet blocks for toddler naps and relaxed reading before evening.</p></div></li>
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>Live-verified, family-welcoming dining</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>Authentic local spots with reserved seating, high chairs, and great menus.</p></div></li>
            <li className="flex items-start gap-3"><svg className="flex-shrink-0 mt-0.5" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg><div><p className="font-semibold text-sm" style={{color: '#0F172A'}}>Built-in rainy-day &amp; rest contingencies</p><p className="text-xs mt-0.5" style={{color: '#94A3B8'}}>Curated indoor options and nearby rest zones mapped for every single day.</p></div></li>
          </ul>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 observe-me">
        <div className="stat-card">
          <p className="font-display font-bold text-4xl" style={{color: '#E05A47'}}>98%</p>
          <p className="text-sm mt-1 font-medium" style={{color: '#64748B'}}>Happy Family Rating</p>
        </div>
        <div className="stat-card">
          <p className="font-display font-bold text-4xl" style={{color: '#2E6F40'}}>4-Point</p>
          <p className="text-sm mt-1 font-medium" style={{color: '#64748B'}}>Human Verification</p>
        </div>
        <div className="stat-card">
          <p className="font-display font-bold text-4xl" style={{color: '#DFB15B'}}>500+</p>
          <p className="text-sm mt-1 font-medium" style={{color: '#64748B'}}>Family Trips Planned</p>
        </div>
        <div className="stat-card">
          <p className="font-display font-bold text-4xl" style={{color: '#0F172A'}}>2–5</p>
          <p className="text-sm mt-1 font-medium" style={{color: '#64748B'}}>Days Turnaround</p>
        </div>
      </div>
    </div>
  </section>
  <div className="section-divider mx-6" />
  {/* ══════════════════════════════════════════════
     4-PASS VERIFICATION SECTION
══════════════════════════════════════════════ */}
  <section id="four-pass" className="py-24 px-6" style={{background: '#FAFAF7'}}>
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-14 observe-me">
        <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full" style={{background: '#E8F2EC', color: '#2E6F40', border: '1px solid #bdd9c8'}}>Our Craft &amp; Care</span>
        <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4" style={{color: '#0F172A'}}>The 4-Point Verification Checklist</h2>
        <p className="text-base max-w-2xl mx-auto" style={{color: '#64748B'}}>Every itinerary is individually reviewed by experienced travel specialists before it reaches your inbox. Zero guesswork.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 observe-me">
        {/* Pass 1: Mobility Audit */}
        <div className="pass-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0" style={{background: '#0F172A'}}>1</div>
            <span className="text-xs font-bold tracking-widest uppercase" style={{color: '#2E6F40'}}>Mobility &amp; Terrain</span>
          </div>
          <div className="text-2xl mb-3">🦽</div>
          <h3 className="font-display font-bold text-base mb-2" style={{color: '#0F172A'}}>Mobility &amp; Terrain Audit</h3>
          <p className="text-sm leading-relaxed" style={{color: '#64748B'}}>Step counts kept under 6,500/day. Elevators, gentle ramps, and rest stops mapped along every route.</p>
        </div>
        {/* Pass 2: Venue Check */}
        <div className="pass-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0" style={{background: '#0F172A'}}>2</div>
            <span className="text-xs font-bold tracking-widest uppercase" style={{color: '#2E6F40'}}>Live Venue Check</span>
          </div>
          <div className="text-2xl mb-3">🍽️</div>
          <h3 className="font-display font-bold text-base mb-2" style={{color: '#0F172A'}}>Live Venue Verification</h3>
          <p className="text-sm leading-relaxed" style={{color: '#64748B'}}>Current seasonal hours, reservation windows, and family seating options verified directly with local establishments.</p>
        </div>
        {/* Pass 3: Pacing */}
        <div className="pass-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0" style={{background: '#0F172A'}}>3</div>
            <span className="text-xs font-bold tracking-widest uppercase" style={{color: '#2E6F40'}}>Pacing &amp; Rest</span>
          </div>
          <div className="text-2xl mb-3">🌙</div>
          <h3 className="font-display font-bold text-base mb-2" style={{color: '#0F172A'}}>Rhythm &amp; Rest Balancing</h3>
          <p className="text-sm leading-relaxed" style={{color: '#64748B'}}>Protected 2-hour midday recharge blocks engineered for young children and elder family members.</p>
        </div>
        {/* Pass 4: Contingency */}
        <div className="pass-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0" style={{background: '#0F172A'}}>4</div>
            <span className="text-xs font-bold tracking-widest uppercase" style={{color: '#2E6F40'}}>Weather &amp; Backup</span>
          </div>
          <div className="text-2xl mb-3">☂️</div>
          <h3 className="font-display font-bold text-base mb-2" style={{color: '#0F172A'}}>Contingency Planning</h3>
          <p className="text-sm leading-relaxed" style={{color: '#64748B'}}>Curated indoor alternatives, nearby pharmacies, and calm rest spots pre-planned for every day of your trip.</p>
        </div>
      </div>
      {/* Result callout */}
      <div className="mt-14 bg-white rounded-2xl grid sm:grid-cols-2 overflow-hidden max-w-4xl mx-auto observe-me" style={{border: '1px solid #F1EFE7', boxShadow: '0 8px 24px rgba(15,23,42,0.08)'}}>
        <img src="/Gemini_Generated_Image_z0s17fz0s17fz0s1.jpg" alt="Family in Paris" className="w-full h-64 sm:h-full object-cover" />
        <div className="p-8 sm:p-10 flex flex-col justify-center items-start">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 mb-4" style={{background: '#E8F2EC'}}>🛡️</div>
          <p className="font-semibold text-[1.05rem] leading-relaxed" style={{color: '#0F172A'}}>The Result: <span style={{color: '#2E6F40'}}>Your family spends time making memories together</span> — not arguing over directions, climbing surprise stairs, or managing exhausted meltdowns.</p>
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
        <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #efe0b0'}}>Our Signature Flow</span>
        <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4" style={{color: '#0F172A'}}>
          The <span style={{color: '#E05A47'}}>Fork &amp; Merge</span><br />Daily Family Rhythm
        </h2>
        <p className="text-base max-w-2xl mx-auto" style={{color: '#64748B'}}>Different generations have different energy levels. Our daily structure gives everyone room to explore their way — then brings the whole family together for dinner.</p>
      </div>
      <div className="observe-me">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Morning */}
          <div className="card p-6 text-center" style={{borderTop: '3px solid #2E6F40'}}>
            <div className="w-13 h-13 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl" style={{background: '#E8F2EC'}}>🌅</div>
            <div className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-3" style={{background: '#E8F2EC', color: '#2E6F40'}}>8:30 AM – 12:00 PM</div>
            <img src="/Gemini_Generated_Image_m5rdkim5rdkim5rd.jpg" alt="Florence Morning" className="w-full h-40 object-cover rounded-xl mb-5 shadow-sm" />
            <h3 className="font-display font-bold text-base mb-2" style={{color: '#0F172A'}}>Shared Morning Exploration</h3>
            <p className="text-sm leading-relaxed" style={{color: '#64748B'}}>A relaxed breakfast together, followed by a major cultural sight on a smooth, step-free walking route.</p>
            <div className="mt-4 space-y-2">
              <div className="text-xs font-semibold rounded-lg px-3 py-2" style={{background: '#E8F2EC', color: '#2E6F40'}}>✓ Step-free access pre-checked</div>
              <div className="text-xs font-semibold rounded-lg px-3 py-2" style={{background: '#E8F2EC', color: '#2E6F40'}}>✓ Clean restrooms &amp; rest stops mapped</div>
            </div>
          </div>
          {/* Afternoon FORK */}
          <div>
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2 text-xs font-bold border" style={{color: '#E05A47', borderColor: '#F1EFE7', boxShadow: '0 2px 8px rgba(15,23,42,0.07)'}}>
                ↔ THE FORK — Parallel Afternoons
              </span>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-4 border-l-4" style={{borderLeftColor: '#DFB15B', border: '1px solid #F1EFE7', borderLeft: '3px solid #DFB15B'}}>
                <p className="text-xs font-bold mb-1" style={{color: '#8a6800'}}>PARENTS &amp; TEENS</p>
                <p className="text-xs" style={{color: '#64748B'}}>Active exploration: vibrant neighborhoods, boutique shops, and scenic viewpoints.</p>
              </div>
              <div className="bg-white rounded-xl p-4" style={{border: '1px solid #F1EFE7', borderLeft: '3px solid #2E6F40'}}>
                <p className="text-xs font-bold mb-1" style={{color: '#2E6F40'}}>12:30–2:30 PM — PROTECTED RECHARGE</p>
                <p className="text-xs" style={{color: '#64748B'}}>Quiet downtime at the hotel. Nap time for young kids, relaxed reading for adults.</p>
              </div>
              <div className="bg-white rounded-xl p-4" style={{border: '1px solid #F1EFE7', borderLeft: '3px solid #0F172A'}}>
                <p className="text-xs font-bold mb-1" style={{color: '#1E293B'}}>GRANDPARENTS &amp; LITTLE ONES</p>
                <p className="text-xs" style={{color: '#64748B'}}>Shaded garden walk, relaxed piazza cafe, effortless people-watching.</p>
              </div>
            </div>
          </div>
          {/* Evening MERGE */}
          <div className="card p-6 text-center" style={{borderTop: '3px solid #E05A47'}}>
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2 text-xs font-bold border" style={{color: '#E05A47', borderColor: '#F1EFE7', boxShadow: '0 2px 8px rgba(15,23,42,0.07)'}}>
                ↔ THE MERGE — Family Dinner
              </span>
            </div>
            <img src="/Gemini_Generated_Image_7a1fx37a1fx37a1f.jpg" alt="Santorini Dinner" className="w-full h-40 object-cover rounded-xl mb-5 shadow-sm" />
            <div className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-3" style={{background: '#FDF2F0', color: '#C84B39'}}>6:30 PM – 9:00 PM</div>
            <h3 className="font-display font-bold text-base mb-2" style={{color: '#0F172A'}}>Reunited for Dinner</h3>
            <p className="text-sm leading-relaxed" style={{color: '#64748B'}}>Three generations come together at a family-friendly restaurant with reserved seating and delicious local food.</p>
            <div className="mt-4 space-y-2">
              <div className="text-xs font-semibold rounded-lg px-3 py-2" style={{background: '#FDF2F0', color: '#C84B39'}}>✓ Table reserved with high chairs</div>
              <div className="text-xs font-semibold rounded-lg px-3 py-2" style={{background: '#FDF2F0', color: '#C84B39'}}>✓ Verified dietary &amp; kid options</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4" style={{border: '1px solid #F1EFE7', boxShadow: '0 2px 10px rgba(15,23,42,0.06)'}}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{background: '#FDF8ED'}}>🏆</div>
          <p className="font-semibold text-sm" style={{color: '#0F172A'}}>The Result: <span style={{color: '#E05A47'}}>Every generation feels energized and happy for tomorrow's adventures.</span> No exhaustion. No compromises.</p>
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
        <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #efe0b0'}}>Inside Your Guide</span>
        <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4" style={{color: '#0F172A'}}>
          A 3-Day Look: <span style={{color: '#E05A47'}}>Rome for Families</span>
        </h2>
        <p className="text-base max-w-xl mx-auto" style={{color: '#64748B'}}>Here is how your actual day-by-day itinerary looks — clear timings, step-counted routes, verified dining, and backup plans.</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-5 observe-me">
        {/* Day 1 */}
        <div className="tilt-card bg-white rounded-2xl p-6 border cursor-default" style={{borderColor: '#F1EFE7', borderTop: '3px solid #2E6F40', boxShadow: '0 2px 10px rgba(15,23,42,0.07)'}}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0" style={{background: '#2E6F40'}}>1</div>
            <div><h3 className="font-display font-bold text-base" style={{color: '#0F172A'}}>Day 1 — Arrival &amp; Historic Center</h3><p className="text-xs font-semibold mt-0.5" style={{color: '#2E6F40'}}>6,100 steps · Gentle flat route</p></div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #F1EFE7'}}>10:00</span><p style={{color: '#475569'}}>Hotel check-in + relaxed walk to historic center</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#FDF2F0', color: '#C84B39', border: '1px solid #F1EFE7'}}>12:00</span><p style={{color: '#475569'}}>Lunch — Osteria della Trippa ✓ high chairs &amp; quiet terrace</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#E8F2EC', color: '#2E6F40', border: '1px solid #dce8e0'}}>12:30</span><p className="font-semibold" style={{color: '#2E6F40'}}>🌙 Afternoon Recharge &amp; Nap Window</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #F1EFE7'}}>15:00</span><p style={{color: '#475569'}}>Campo de' Fiori artisan market (benches every 300m)</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#FDF2F0', color: '#C84B39', border: '1px solid #F1EFE7'}}>19:00</span><p style={{color: '#475569'}}>Family dinner — Ristorante Nonna ✓ table reserved</p></div>
          </div>
          <div className="mt-4 pt-4 border-t text-xs" style={{borderColor: '#F1EFE7', color: '#94A3B8'}}>☂️ Rainy backup: Galleria Borghese flat corridor tour</div>
        </div>
        {/* Day 2 */}
        <div className="tilt-card bg-white rounded-2xl p-6 border relative cursor-default" style={{borderColor: '#F1EFE7', borderTop: '3px solid #E05A47', boxShadow: '0 2px 10px rgba(15,23,42,0.07)'}}>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-5 py-1.5 rounded-full" style={{background: '#E05A47'}}>Signature Day</div>
          <div className="flex items-center gap-3 mb-5 mt-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0" style={{background: '#E05A47'}}>2</div>
            <div><h3 className="font-display font-bold text-base" style={{color: '#0F172A'}}>Day 2 — Ancient Rome &amp; Gardens</h3><p className="text-xs font-semibold mt-0.5" style={{color: '#E05A47'}}>5,800 steps · Priority elevator access</p></div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#FDF2F0', color: '#C84B39', border: '1px solid #F1EFE7'}}>08:30</span><p style={{color: '#475569'}}>Colosseum priority entry — step-free elevator access ✓</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #F1EFE7'}}>11:00</span><p style={{color: '#475569'}}>Roman Forum stroll (parents/teens) / Palatine cafe (grandparents)</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#E8F2EC', color: '#2E6F40', border: '1px solid #dce8e0'}}>12:30</span><p className="font-semibold" style={{color: '#2E6F40'}}>🌙 Hotel Break &amp; Toddler Nap</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0'}}>15:30</span><p style={{color: '#475569'}}>Circus Maximus parklands (open lawns, toddler-friendly)</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#FDF2F0', color: '#C84B39', border: '1px solid #F1EFE7'}}>19:30</span><p style={{color: '#475569'}}>Trastevere dining — La Gatta Mangiona ✓ reserved</p></div>
          </div>
          <div className="mt-4 pt-4 border-t text-xs" style={{borderColor: '#F1EFE7', color: '#94A3B8'}}>☂️ Rainy backup: Vatican Museums ground-level tour</div>
        </div>
        {/* Day 3 */}
        <div className="tilt-card bg-white rounded-2xl p-6 border cursor-default" style={{borderColor: '#F1EFE7', borderTop: '3px solid #DFB15B', boxShadow: '0 2px 10px rgba(15,23,42,0.07)'}}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0" style={{background: '#DFB15B'}}>3</div>
            <div><h3 className="font-display font-bold text-base" style={{color: '#0F172A'}}>Day 3 — Vatican &amp; Farewell Dinner</h3><p className="text-xs font-semibold mt-0.5" style={{color: '#8a6800'}}>4,900 steps · Step-free access</p></div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0'}}>09:00</span><p style={{color: '#475569'}}>St. Peter's Basilica — dedicated accessible entry ✓</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #F1EFE7'}}>11:30</span><p style={{color: '#475569'}}>Prati neighborhood — relaxed boutiques &amp; wide sidewalks</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#E8F2EC', color: '#2E6F40', border: '1px solid #dce8e0'}}>12:30</span><p className="font-semibold" style={{color: '#2E6F40'}}>🌙 Afternoon Rest &amp; Packing Time</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0'}}>15:30</span><p style={{color: '#475569'}}>Castel Sant'Angelo (elevator access &amp; panoramic views)</p></div>
            <div className="flex gap-2.5 items-start"><span className="time-pill flex-shrink-0" style={{background: '#FDF2F0', color: '#C84B39', border: '1px solid #F1EFE7'}}>19:00</span><p style={{color: '#475569'}}>Farewell family dinner — Il Sorpasso ✓ courtyard seating</p></div>
          </div>
          <div className="mt-4 pt-4 border-t text-xs" style={{borderColor: '#F1EFE7', color: '#94A3B8'}}>☂️ Rainy backup: Doria Pamphilj Gallery (flat marble halls)</div>
        </div>
      </div>
      <div className="text-center mt-10 observe-me">
        <button onClick={() => window.location.href='#pricing'} className="btn-primary text-base py-4 px-10">Get Your Custom Itinerary →</button>
        <p className="text-sm mt-3" style={{color: '#94A3B8'}}>Includes interactive Google Maps links, transit guidance, and family packing tips.</p>
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
        <p className="text-base max-w-xl mx-auto" style={{color: '#64748B'}}>Every plan includes full 4-point verification by our travel team. One-time fee, zero subscriptions.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start observe-me">
        {/* Weekend */}
        <div className="pricing-card p-8">
          <div className="mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{background: '#F1F5F9'}}>🗓️</div>
            <h3 className="font-display font-bold text-xl mb-1" style={{color: '#0F172A'}}>Weekend Getaway</h3>
            <p className="text-sm" style={{color: '#94A3B8'}}>Perfect for a quick city break</p>
          </div>
          <div className="mb-6">
            <div className="flex items-end gap-2"><span className="font-display font-bold text-5xl" style={{color: '#0F172A'}}>$49</span><span className="text-sm mb-2" style={{color: '#94A3B8'}}>one-time</span></div>
            <p className="text-sm font-semibold mt-1" style={{color: '#2E6F40'}}>⚡ Delivered in 2 days</p>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm font-semibold" style={{color: '#0F172A'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>3-Day Itinerary (1 City)</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Full 4-Point Specialist Check</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Step-Free Routes &amp; Rest Stops</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Protected Afternoon Nap Breaks</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Family Dining &amp; Dietary Check</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Google Maps &amp; Rainy-Day Backup</li>
            <li className="flex items-center gap-3 text-sm font-semibold" style={{color: '#2E6F40'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>1 Free Itinerary Revision</li>
          </ul>
          <button onClick={() => setIsIntakeModalOpen(true)} id="buy-weekend" className="btn-secondary w-full text-center block py-3.5">Select Plan — $49</button>
        </div>
        {/* Full Week - POPULAR */}
        <div className="pricing-card pricing-popular p-8 relative">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-6 py-2 rounded-full" style={{background: '#E05A47', boxShadow: '0 4px 14px rgba(224,90,71,0.35)'}}>⭐ MOST POPULAR</div>
          <div className="mb-6 mt-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{background: '#FDF2F0'}}>✈️</div>
            <h3 className="font-display font-bold text-xl mb-1" style={{color: '#0F172A'}}>Full Week Plan</h3>
            <p className="text-sm" style={{color: '#94A3B8'}}>The standard family European vacation</p>
          </div>
          <div className="mb-6">
            <div className="flex items-end gap-2"><span className="font-display font-bold text-5xl" style={{color: '#E05A47'}}>$99</span><span className="text-sm mb-2" style={{color: '#94A3B8'}}>one-time</span></div>
            <p className="text-sm font-semibold mt-1" style={{color: '#2E6F40'}}>⚡ Delivered in 3–5 days</p>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm font-semibold" style={{color: '#0F172A'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>7-Day Plan (Up to 2 Cities)</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Full 4-Point Specialist Check</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Step-Free Routes &amp; Rest Stops</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Protected Afternoon Nap Breaks</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Family Dining &amp; Dietary Check</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#E05A47" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Google Maps &amp; Rainy-Day Backup</li>
            <li className="flex items-center gap-3 text-sm font-semibold" style={{color: '#2E6F40'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>1 Free Itinerary Revision</li>
          </ul>
          <button onClick={() => setIsIntakeModalOpen(true)} id="buy-week" className="btn-primary w-full text-center block py-3.5">Select Plan — $99</button>
        </div>
        {/* Extended Trip */}
        <div className="pricing-card p-8" style={{border: '1.5px solid #DFB15B'}}>
          <div className="mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{background: '#FDF8ED'}}>🌍</div>
            <h3 className="font-display font-bold text-xl mb-1" style={{color: '#0F172A'}}>Complete Family Package</h3>
            <p className="text-sm" style={{color: '#94A3B8'}}>For multi-city extended journeys</p>
          </div>
          <div className="mb-6">
            <div className="flex items-end gap-2"><span className="font-display font-bold text-5xl" style={{color: '#DFB15B'}}>$149</span><span className="text-sm mb-2" style={{color: '#94A3B8'}}>one-time</span></div>
            <p className="text-sm font-semibold mt-1" style={{color: '#2E6F40'}}>⚡ Delivered in 5–7 days</p>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm font-semibold" style={{color: '#0F172A'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#DFB15B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>10-Day Plan (Multi-City)</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#DFB15B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Full 4-Point Specialist Check</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#DFB15B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Step-Free Routes &amp; Rest Stops</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#DFB15B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Protected Afternoon Nap Breaks</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#DFB15B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Family Dining &amp; Dietary Check</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#DFB15B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Google Maps &amp; Rainy-Day Backup</li>
            <li className="flex items-center gap-3 text-sm font-semibold" style={{color: '#2E6F40'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>⭐ 2 Free Itinerary Revisions</li>
          </ul>
          <button onClick={() => setIsIntakeModalOpen(true)} id="buy-complete" className="btn-navy w-full text-center block py-3.5">Select Plan — $149</button>
        </div>
        {/* Custom */}
        <div className="pricing-card p-8" style={{border: '1.5px solid #E2E8F0', opacity: '0.95'}}>
          <div className="mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{background: '#F1F5F9'}}>✨</div>
            <h3 className="font-display font-bold text-xl mb-1" style={{color: '#0F172A'}}>Custom Journey</h3>
            <p className="text-sm" style={{color: '#94A3B8'}}>For trips over 10 days or unique routes</p>
          </div>
          <div className="mb-6">
            <div className="flex items-end gap-2"><span className="font-display font-bold text-5xl" style={{color: '#0F172A'}}>From $199</span></div>
            <p className="text-sm font-semibold mt-1" style={{color: '#2E6F40'}}>Timeline tailored to your trip</p>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Any Duration &amp; Multi-Country</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Dedicated Family Travel Planner</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Direct WhatsApp Planning Support</li>
            <li className="flex items-center gap-3 text-sm font-medium" style={{color: '#475569'}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Multiple Iterative Revisions</li>
          </ul>
          <a href="mailto:hello@roamify.life?subject=Custom%20Trip%20Inquiry" className="btn-secondary w-full text-center block py-3.5">Contact Us Directly</a>
        </div>
      </div>
      {/* Guarantee */}
      <div className="mt-10 bg-white rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto observe-me" style={{border: '1px solid #F1EFE7', boxShadow: '0 2px 12px rgba(15,23,42,0.06)'}}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background: '#E8F2EC'}}>🛡️</div>
        <div>
          <h4 className="font-display font-bold text-base mb-0.5" style={{color: '#0F172A'}}>100% Peace-of-Mind Guarantee</h4>
          <p className="text-sm" style={{color: '#64748B'}}>If your itinerary doesn't feel completely right for your family's needs, we will adjust it for free or provide a full refund within 7 days.</p>
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
        <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full" style={{background: '#E8F2EC', color: '#2E6F40', border: '1px solid #bdd9c8'}}>From Real Families</span>
        <h2 className="font-display font-bold text-4xl sm:text-5xl mb-3" style={{color: '#0F172A'}}>What Travelers Say</h2>
        <p className="handwritten text-xl" style={{color: '#E05A47', display: 'inline-block'}}>"Three generations across Europe, completely stress-free."</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 observe-me">
        <div className="card p-7" style={{borderTop: '3px solid #E05A47'}}>
          <div className="flex gap-0.5 mb-4" style={{color: '#DFB15B', fontSize: '1rem'}}>★★★★★</div>
          <p className="text-sm leading-relaxed mb-5" style={{color: '#475569'}}>"My 73-year-old father-in-law had knee surgery last year. Roamify mapped every incline and hill in Lisbon so he never struggled. He walked the city with total confidence and loved every minute."</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0" style={{background: '#E05A47'}}>SR</div>
            <div><p className="font-bold text-sm" style={{color: '#0F172A'}}>Sarah R.</p><p className="text-xs" style={{color: '#94A3B8'}}>London, UK · Lisbon Trip 🇵🇹</p></div>
          </div>
        </div>
        <div className="card p-7" style={{borderTop: '3px solid #DFB15B'}}>
          <div className="flex gap-0.5 mb-4" style={{color: '#DFB15B', fontSize: '1rem'}}>★★★★★</div>
          <p className="text-sm leading-relaxed mb-5" style={{color: '#475569'}}>"Visiting Rome with a 2-year-old and a 4-year-old felt overwhelming until we got our Roamify plan. The scheduled afternoon nap breaks kept the kids cheerful all week."</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0" style={{background: '#DFB15B'}}>MK</div>
            <div><p className="font-bold text-sm" style={{color: '#0F172A'}}>Mike &amp; Kate D.</p><p className="text-xs" style={{color: '#94A3B8'}}>Melbourne, AU · Rome Trip 🇮🇹</p></div>
          </div>
        </div>
        <div className="card p-7" style={{borderTop: '3px solid #2E6F40'}}>
          <div className="flex gap-0.5 mb-4" style={{color: '#DFB15B', fontSize: '1rem'}}>★★★★★</div>
          <p className="text-sm leading-relaxed mb-5" style={{color: '#475569'}}>"We took 3 generations to Florence and Venice. The step-free routing allowed my mother with her walker to see every museum without getting stuck on stairs. Truly invaluable."</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0" style={{background: '#2E6F40'}}>JL</div>
            <div><p className="font-bold text-sm" style={{color: '#0F172A'}}>Jennifer L.</p><p className="text-xs" style={{color: '#94A3B8'}}>Boston, MA · Italy Family Vacation 🇮🇹</p></div>
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
        <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full" style={{background: '#FDF8ED', color: '#8a6800', border: '1px solid #efe0b0'}}>Clear Answers</span>
        <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4" style={{color: '#0F172A'}}>Frequently Asked Questions</h2>
      </div>
      <div className="space-y-3 observe-me">
        {/* FAQ 1 */}
        <div className={`faq-item overflow-hidden ${openFAQ === 0 ? 'open' : ''}`}>
          <button onClick={() => toggleFAQ(0)} className="faq-trigger w-full flex items-center justify-between p-6 text-left" aria-expanded={openFAQ === 0}>
            <span className="font-semibold pr-4 text-sm" style={{color: '#0F172A'}}>How long does it take to receive my custom itinerary?</span>
            <svg className="faq-icon flex-shrink-0" style={{color: '#E05A47'}} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
          </button>
          <div className={`faq-answer px-6 text-sm leading-relaxed ${openFAQ === 0 ? 'open' : ''}`} style={{color: '#64748B'}}>
            <div className="pb-6">Because every restaurant, walking route, and rest stop is personally researched and verified by a travel specialist, our delivery timeline depends on the length of your trip:
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li><strong>Weekend Getaway ($49):</strong> Delivered within <strong>2 days</strong></li>
                <li><strong>Full Week Plan ($99):</strong> Delivered within <strong>3–5 days</strong></li>
                <li><strong>Complete Family Package ($149):</strong> Delivered within <strong>5–7 days</strong></li>
              </ul>
              If you have an urgent departure, email us at <a href="mailto:hello@roamify.life" className="text-emerald-700 font-semibold underline">hello@roamify.life</a> and we will do our best to expedite it.
            </div>
          </div>
        </div>

        {/* FAQ 2 */}
        <div className={`faq-item overflow-hidden ${openFAQ === 1 ? 'open' : ''}`}>
          <button onClick={() => toggleFAQ(1)} className="faq-trigger w-full flex items-center justify-between p-6 text-left" aria-expanded={openFAQ === 1}>
            <span className="font-semibold pr-4 text-sm" style={{color: '#0F172A'}}>Can I request changes or corrections after receiving my plan?</span>
            <svg className="faq-icon flex-shrink-0" style={{color: '#E05A47'}} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
          </button>
          <div className={`faq-answer px-6 text-sm leading-relaxed ${openFAQ === 1 ? 'open' : ''}`} style={{color: '#64748B'}}>
            <div className="pb-6">Yes, absolutely! The Weekend Getaway and Full Week plans include <strong>1 free revision</strong>, and the Complete Family Package includes <strong>2 free revisions</strong>. Simply reply to your delivery email with your requested tweaks and we will update your guide promptly.</div>
          </div>
        </div>

        {/* FAQ 3 */}
        <div className={`faq-item overflow-hidden ${openFAQ === 2 ? 'open' : ''}`}>
          <button onClick={() => toggleFAQ(2)} className="faq-trigger w-full flex items-center justify-between p-6 text-left" aria-expanded={openFAQ === 2}>
            <span className="font-semibold pr-4 text-sm" style={{color: '#0F172A'}}>What does the 4-point verification check involve?</span>
            <svg className="faq-icon flex-shrink-0" style={{color: '#E05A47'}} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
          </button>
          <div className={`faq-answer px-6 text-sm leading-relaxed ${openFAQ === 2 ? 'open' : ''}`} style={{color: '#64748B'}}>
            <div className="pb-6">Every plan passes through four strict checks: (1) <strong>Mobility &amp; Steps:</strong> Capped under 6,500 daily steps with verified step-free options. (2) <strong>Venue Check:</strong> Live opening hours, reservation details, and family amenities confirmed. (3) <strong>Pacing:</strong> Guaranteed 2-hour midday recharge breaks. (4) <strong>Contingencies:</strong> Rainy-day alternatives and nearby rest areas included for each day.</div>
          </div>
        </div>

        {/* FAQ 4 */}
        <div className={`faq-item overflow-hidden ${openFAQ === 3 ? 'open' : ''}`}>
          <button onClick={() => toggleFAQ(3)} className="faq-trigger w-full flex items-center justify-between p-6 text-left" aria-expanded={openFAQ === 3}>
            <span className="font-semibold pr-4 text-sm" style={{color: '#0F172A'}}>How do you tailor the itinerary to our family's specific needs?</span>
            <svg className="faq-icon flex-shrink-0" style={{color: '#E05A47'}} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
          </button>
          <div className={`faq-answer px-6 text-sm leading-relaxed ${openFAQ === 3 ? 'open' : ''}`} style={{color: '#64748B'}}>
            <div className="pb-6">After you choose a plan, our simple intake form asks for your family members' ages, mobility requirements (strollers, canes, wheelchairs, stair avoidance), dietary preferences, and preferred travel pace. We build every single day around those exact details.</div>
          </div>
        </div>

        {/* FAQ 5 */}
        <div className={`faq-item overflow-hidden ${openFAQ === 4 ? 'open' : ''}`}>
          <button onClick={() => toggleFAQ(4)} className="faq-trigger w-full flex items-center justify-between p-6 text-left" aria-expanded={openFAQ === 4}>
            <span className="font-semibold pr-4 text-sm" style={{color: '#0F172A'}}>Is this suitable for babies and toddlers under 2 years old?</span>
            <svg className="faq-icon flex-shrink-0" style={{color: '#E05A47'}} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
          </button>
          <div className={`faq-answer px-6 text-sm leading-relaxed ${openFAQ === 4 ? 'open' : ''}`} style={{color: '#64748B'}}>
            <div className="pb-6">Yes — in fact, it's one of the main reasons families come to us. We make sure routes are stroller-friendly, identify elevators at historical sights and transit stations, and keep mornings and afternoons short and flexible.</div>
          </div>
        </div>

        {/* FAQ 6 */}
        <div className={`faq-item overflow-hidden ${openFAQ === 5 ? 'open' : ''}`}>
          <button onClick={() => toggleFAQ(5)} className="faq-trigger w-full flex items-center justify-between p-6 text-left" aria-expanded={openFAQ === 5}>
            <span className="font-semibold pr-4 text-sm" style={{color: '#0F172A'}}>How is this different from a standard travel agent?</span>
            <svg className="faq-icon flex-shrink-0" style={{color: '#E05A47'}} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
          </button>
          <div className={`faq-answer px-6 text-sm leading-relaxed ${openFAQ === 5 ? 'open' : ''}`} style={{color: '#64748B'}}>
            <div className="pb-6">Traditional travel agents usually focus on booking flights and hotels for commission. We specialize entirely in the actual day-to-day experience on the ground — where to walk, when to rest, which restaurants to visit, and how to keep three generations happy together.</div>
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
        <span className="text-sm font-semibold" style={{color: 'rgba(255,255,255,0.8)'}}>Currently taking requests for upcoming family trips</span>
      </div>
      <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4" style={{color: '#FFFFFF'}}>
        Ready to Experience Europe<br />Without the Stress?
      </h2>
      <p className="handwritten text-2xl mb-8" style={{color: '#DFB15B', display: 'inline-block'}}>"Every generation. Every memory. Completely stress-free."</p>
      <div className="flex flex-wrap gap-4 justify-center mt-6">
        <button onClick={() => window.location.href='#pricing'} className="btn-primary text-base py-4 px-10">
          Get Your Custom Itinerary — From $49
        </button>
        <a href="#pricing" className="text-base py-4 px-8 rounded-xl font-bold transition-all" style={{border: '1.5px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.85)', fontFamily: '"Plus Jakarta Sans",sans-serif'}}>
          View All Plans
        </a>
      </div>
      <p className="text-sm mt-6" style={{color: 'rgba(255,255,255,0.4)'}}>One-time fee · 7-day money-back guarantee · Handcrafted by family travel experts</p>
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
          <p className="text-sm leading-relaxed mb-4" style={{color: '#64748B'}}>Personalized multi-generational travel itineraries for ages 3 to 75. Thoughtfully designed, human-verified.</p>
          <p className="text-xs" style={{color: '#94A3B8'}}>📧 <a href="mailto:hello@roamify.life" className="font-semibold hover:underline" style={{color: '#E05A47'}}>hello@roamify.life</a></p>
        </div>
        <div>
          <h4 className="text-xs font-bold mb-4 tracking-widest uppercase" style={{color: '#94A3B8'}}>Destinations</h4>
          <ul className="space-y-2 text-sm" style={{color: '#64748B'}}>
            <li><a href="#" className="hover:underline font-medium">🇮🇹 Italy, 🇬🇧 UK, 🇵🇹 Portugal</a></li>
            <li><a href="#" className="hover:underline font-medium">🇪🇸 Spain, 🇫🇷 France, 🇬🇷 Greece</a></li>
            <li><a href="#" className="hover:underline font-medium">🇳🇱 Netherlands, 🇨🇭 Switzerland</a></li>
            <li><a href="#" className="hover:underline font-medium">🇦🇹 Austria, 🇨🇿 Czech Republic</a></li>
            <li><a href="#" className="hover:underline font-medium">🇩🇪 Germany, 🇭🇷 Croatia</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold mb-4 tracking-widest uppercase" style={{color: '#94A3B8'}}>Itinerary Plans</h4>
          <ul className="space-y-2 text-sm" style={{color: '#64748B'}}>
            <li><a href="#pricing" className="hover:underline font-medium">Weekend Getaway ($49)</a></li>
            <li><a href="#pricing" className="hover:underline font-medium">Full Week Plan ($99)</a></li>
            <li><a href="#pricing" className="hover:underline font-medium">Complete Package ($149)</a></li>
            <li><a href="#sample" className="hover:underline font-medium">Sample Itinerary</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold mb-4 tracking-widest uppercase" style={{color: '#94A3B8'}}>Support &amp; Trust</h4>
          <ul className="space-y-2 text-sm" style={{color: '#64748B'}}>
            <li><a href="#faq" className="hover:underline font-medium">Frequently Asked Questions</a></li>
            <li><a href="#" className="hover:underline font-medium">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline font-medium">Terms of Service</a></li>
            <li><a href="#" className="hover:underline font-medium">Refund Policy</a></li>
          </ul>
          <div className="mt-5 bg-white rounded-xl p-3 inline-flex items-center gap-2 border" style={{borderColor: '#F1EFE7'}}>
            <span>🛡️</span>
            <span className="text-xs font-semibold" style={{color: '#0F172A'}}>100% Satisfaction Guarantee</span>
          </div>
        </div>
      </div>
      <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4" style={{borderColor: '#F1EFE7'}}>
        <p className="text-sm" style={{color: '#94A3B8'}}>© 2026 Roamify. Designed with care for families worldwide.</p>
        <p className="text-xs" style={{color: '#94A3B8'}}>Helping families travel across Europe with ease</p>
      </div>
    </div>
  </footer>
  {/* ══════════════════════════════════════════════
     INTAKE MODAL
  ══════════════════════════════════════════════ */}
  <div id="intake-modal" className={isIntakeModalOpen ? "open" : ""} role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div className="modal-card mx-4">
      {/* Header */}
      <div className="p-6 border-b" style={{borderColor: '#F1EFE7'}}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 id="modal-title" className="font-display font-bold text-lg" style={{color: '#0F172A'}}>Plan Your Family Itinerary</h2>
            <p className="text-sm mt-0.5" id="modal-subtitle" style={{color: '#94A3B8'}}>Step {Math.min(currentStep, 4)} of 4</p>
          </div>
          <button onClick={() => { setIsIntakeModalOpen(false); setCurrentStep(1); }} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{background: '#F1F5F9', color: '#64748B'}} aria-label="Close">
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
      <div className="p-6">
        {/* Step 1: Trip Details */}
        <div id="modal-step-1" className={`modal-step ${currentStep === 1 ? '' : 'hidden'}`}>
          <h3 className="font-display font-bold text-base mb-4" style={{color: '#0F172A'}}>Where &amp; When Are You Traveling?</h3>
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
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Select Your Plan *</label>
              <select id="plan-interest" className="form-input">
                <option value>Choose a plan…</option>
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
          <h3 className="font-display font-bold text-base mb-4" style={{color: '#0F172A'}}>Who Is Traveling With You?</h3>
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
          <h3 className="font-display font-bold text-base mb-4" style={{color: '#0F172A'}}>Pacing &amp; Accessibility Preferences</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Desired Travel Pace *</label>
              <select id="pace" className="form-input">
                <option value>Select a pace…</option>
                <option>Relaxed (1 main sight per day, plenty of downtime)</option>
                <option>Moderate (Balanced morning outing &amp; relaxed afternoon walk)</option>
                <option>Active (See as much as comfortably possible)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Accommodation Preference (optional)</label>
              <select id="accommodation" className="form-input">
                <option value>No preference</option>
                <option>Boutique Hotels</option>
                <option>Family Resorts &amp; Hotels</option>
                <option>Vacation Rentals / Apartments</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{color: '#64748B'}}>Accessibility Requirements (optional)</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" id="mob-walker" className="w-4 h-4 rounded" /><span className="text-sm font-medium" style={{color: '#475569'}}>Cane or walker in use</span></label>
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" id="mob-wheelchair" className="w-4 h-4 rounded" /><span className="text-sm font-medium" style={{color: '#475569'}}>Wheelchair accessibility needed</span></label>
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" id="mob-stairs" className="w-4 h-4 rounded" /><span className="text-sm font-medium" style={{color: '#475569'}}>Avoid steep stairs &amp; hills</span></label>
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" id="mob-stroller" className="w-4 h-4 rounded" /><span className="text-sm font-medium" style={{color: '#475569'}}>Stroller-friendly routes needed</span></label>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Dietary Restrictions or Preferences (optional)</label>
              <input id="dietary" type="text" className="form-input" placeholder="e.g. vegetarian, nut allergy, gluten-free, halal" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Special Notes for our Planners (optional)</label>
              <textarea id="notes" className="form-input resize-none" rows={2} placeholder="e.g. Grandma needs level walking, toddler naps at 1 PM" defaultValue={""} />
            </div>
          </div>
        </div>
        {/* Step 4: Contact Info */}
        <div id="modal-step-4" className={`modal-step ${currentStep === 4 ? '' : 'hidden'}`}>
          <h3 className="font-display font-bold text-base mb-4" style={{color: '#0F172A'}}>Where Should We Send Your Itinerary?</h3>
          <p className="text-sm mb-4" style={{color: '#64748B'}}>Enter your contact information so we can confirm and deliver your completed guide.</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{color: '#64748B'}}>Your Full Name *</label>
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
          <h3 className="font-display font-bold text-xl mb-1" style={{color: '#0F172A'}}>Trip Details Received!</h3>
          <p className="handwritten text-xl mb-3" style={{color: '#E05A47'}}>"Your family adventure is in good hands."</p>

          {submittedOrderId && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 text-center">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">Your Trip Reference ID</span>
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
              <p className="text-[11px] text-slate-400 mt-1">Keep this ID handy if you contact support</p>
            </div>
          )}

          <p className="text-sm mb-5 leading-relaxed" style={{color: '#64748B'}}>We have saved your preferences! Complete checkout below and our family travel specialists will start handcrafting your verified itinerary right away.</p>
          <a href="https://trueroute.gumroad.com/l/family-itinerary" className="btn-primary w-full text-center block py-4 mb-3">Proceed to Checkout →</a>
          <button onClick={() => { setIsIntakeModalOpen(false); setCurrentStep(1); }} className="btn-secondary w-full text-center py-3.5 text-sm">Finish Later</button>
        </div>
      </div>
      {/* Footer nav */}
      {currentStep < 5 && (
      <div className="p-5 border-t flex justify-between items-center" id="modal-nav" style={{borderColor: '#F1EFE7', background: '#FAFAF7'}}>
        <button onClick={() => setCurrentStep(prev => prev - 1)} id="btn-back" className={`btn-secondary text-sm py-2.5 px-6 ${currentStep === 1 ? 'hidden' : ''}`}>← Back</button>
        <div className="flex-1" />
        <button onClick={() => {
          if (currentStep === 4) {
            submitForm();
          } else {
            setCurrentStep(prev => prev + 1);
          }
        }} id="btn-next" className="btn-primary text-sm py-2.5 px-8">
          {currentStep === 4 ? (btnText === 'Submit Trip Details' ? 'Submit' : btnText) : 'Next Step →'}
        </button>
      </div>
      )}
    </div>
  </div>
</div>
    </>
  );
}
