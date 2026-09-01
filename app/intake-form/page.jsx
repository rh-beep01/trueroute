
"use client";
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export default function IntakeForm() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [btnText, setBtnText] = useState("Complete Order");

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
    setBtnText("Request Received!");
    setTimeout(() => {
      setIsIntakeModalOpen(false);
      setBtnText("Complete Order");
    }, 2500);
  };

  return (
    <>
      <div className="page">
  {/* Header */}
  <div className="header">
    <div className="logo-row">
      <div className="logo-icon">🧭</div>
      <div className="logo-text">Roam<span>ify</span></div>
    </div>
    <h1>Your Custom Itinerary<br />Starts Here</h1>
    <p>Fill out this form and email it back to us. Your verified, day-by-day family itinerary<br />will be delivered directly to your inbox according to your plan timeline.</p>
  </div>
  {/* Thank you banner */}
  <div className="thankyou">
    <div className="thankyou-icon">🎉</div>
    <div className="thankyou-text">
      <strong>Thank you for your purchase!</strong> — Please complete this form so we can build your perfect itinerary.
    </div>
  </div>
  {/* Steps */}
  <div className="steps">
    <div className="step">
      <div className="step-num done">✓</div>
      <div className="step-label"><strong>Purchased</strong>Order confirmed</div>
    </div>
    <div className="step-arrow">→</div>
    <div className="step">
      <div className="step-num">2</div>
      <div className="step-label"><strong>Fill this form</strong>5 minutes</div>
    </div>
    <div className="step-arrow">→</div>
    <div className="step">
      <div className="step-num" style={{background: '#64748B'}}>3</div>
      <div className="step-label"><strong>We verify</strong>Human-checked</div>
    </div>
    <div className="step-arrow">→</div>
    <div className="step">
      <div className="step-num" style={{background: '#64748B'}}>4</div>
      <div className="step-label"><strong>Delivered</strong>PDF + Maps link</div>
    </div>
  </div>
  {/* Body */}
  <div className="body">
    {/* Section 1: Trip Basics */}
    <div className="section">
      <div className="section-title">✈️ &nbsp;Trip Basics</div>
      <div className="field-row">
        <div className="field">
          <label>Travel Start Date <span className="req">*</span></label>
          <input className="line" type="text" placeholder="e.g. 15 October 2026" />
        </div>
        <div className="field">
          <label>Travel End Date <span className="req">*</span></label>
          <input className="line" type="text" placeholder="e.g. 22 October 2026" />
        </div>
      </div>
      <div className="field">
        <label>Destination(s) <span className="req">*</span></label>
        <div className="hint">List all cities/regions in order of visit</div>
        <input className="line" type="text" placeholder="e.g. Rome → Florence → Tuscany" />
      </div>
      <div className="field">
        <label>Specific sights or places you want to visit (optional)</label>
        <div className="hint">List any must-see landmarks, museums, or excursions</div>
        <input className="line" type="text" placeholder="e.g. Colosseum, Vatican, Amalfi boat trip, Tuscan cooking class" />
      </div>
      <div className="field-row">
        <div className="field">
          <label>Your Package</label>
          <input className="line" type="text" placeholder="Weekend / Full Week / Extended / Custom" />
        </div>
        <div className="field">
          <label>Your Name <span className="req">*</span></label>
          <input className="line" type="text" placeholder="First name is fine" />
        </div>
      </div>
      <div className="field">
        <label>Your Email Address <span className="req">*</span></label>
        <div className="hint">We'll deliver the finished itinerary here</div>
        <input className="line" type="email" placeholder="youremail@example.com" />
      </div>
    </div>
    {/* Section 2: Traveler Ages */}
    <div className="section">
      <div className="section-title">👨‍👩‍👧‍👦 &nbsp;Your Travel Group</div>
      <div className="field">
        <label>List every traveler's age <span className="req">*</span></label>
        <div className="hint">This is the most important field — it shapes everything from restaurant choice to daily pace</div>
      </div>
      <table className="age-table">
        <thead>
          <tr>
            <th>Traveler #</th>
            <th>Age</th>
            <th>Relationship (optional)</th>
            <th>Mobility Notes (optional)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td><input type="text" placeholder="e.g. 38" /></td><td><input type="text" placeholder="e.g. Mum" /></td><td><input type="text" placeholder="e.g. None / Bad knees / Stroller" /></td></tr>
          <tr><td>2</td><td><input type="text" placeholder /></td><td><input type="text" placeholder /></td><td><input type="text" placeholder /></td></tr>
          <tr><td>3</td><td><input type="text" placeholder /></td><td><input type="text" placeholder /></td><td><input type="text" placeholder /></td></tr>
          <tr><td>4</td><td><input type="text" placeholder /></td><td><input type="text" placeholder /></td><td><input type="text" placeholder /></td></tr>
          <tr><td>5</td><td><input type="text" placeholder /></td><td><input type="text" placeholder /></td><td><input type="text" placeholder /></td></tr>
          <tr><td>6</td><td><input type="text" placeholder /></td><td><input type="text" placeholder /></td><td><input type="text" placeholder /></td></tr>
          <tr><td>7+</td><td colSpan={3}><input type="text" style={{width: '100%'}} placeholder="Add more ages here, comma separated: e.g. 12, 15, 70" /></td></tr>
        </tbody>
      </table>
    </div>
    {/* Section 3: Preferences */}
    <div className="section">
      <div className="section-title">🎯 &nbsp;Interests &amp; Preferences</div>
      <div className="field">
        <label>What does your family enjoy? <span className="req">*</span></label>
        <div className="hint">Check all that apply</div>
        <div className="check-grid">
          <label className="check-item"><input type="checkbox" /> 🏛️ History &amp; museums</label>
          <label className="check-item"><input type="checkbox" /> 🍕 Food &amp; local cuisine</label>
          <label className="check-item"><input type="checkbox" /> 🌿 Nature &amp; outdoors</label>
          <label className="check-item"><input type="checkbox" /> 🎨 Art &amp; culture</label>
          <label className="check-item"><input type="checkbox" /> 🛍️ Shopping &amp; markets</label>
          <label className="check-item"><input type="checkbox" /> 🎢 Theme parks &amp; rides</label>
          <label className="check-item"><input type="checkbox" /> 🏖️ Beach &amp; relaxation</label>
          <label className="check-item"><input type="checkbox" /> 🧗 Adventure activities</label>
        </div>
      </div>
      <div className="field" style={{marginTop: 20}}>
        <label>Preferred daily pace <span className="req">*</span></label>
        <div className="pace-row">
          <div className="pace-opt">🐢<br />Relaxed<br /><span style={{fontSize: 10, fontWeight: 400}}>Max 2–3 activities/day</span></div>
          <div className="pace-opt" style={{borderColor: '#E05A47', color: '#E05A47', background: '#FDF2F0'}}>⚖️<br />Balanced<br /><span style={{fontSize: 10, fontWeight: 400}}>Mix of busy + rest</span></div>
          <div className="pace-opt">🏃<br />Full days<br /><span style={{fontSize: 10, fontWeight: 400}}>See as much as possible</span></div>
        </div>
        <div className="hint" style={{marginTop: 8}}>Circle or note your preference when you email this back</div>
      </div>
    </div>
    {/* Section 4: Budget & Restrictions */}
    <div className="section">
      <div className="section-title">💰 &nbsp;Budget &amp; Restrictions</div>
      <div className="field-row">
        <div className="field">
          <label>Daily budget per person <span className="req">*</span></label>
          <div className="hint">Excluding accommodation</div>
          <input className="line" type="text" placeholder="e.g. $80/person/day" />
        </div>
        <div className="field">
          <label>Accommodation style</label>
          <input className="line" type="text" placeholder="Hotel / Airbnb / Mix" />
        </div>
      </div>
      <div className="field">
        <label>Dietary restrictions or allergies</label>
        <div className="hint">We'll verify every restaurant has suitable options</div>
        <input className="line" type="text" placeholder="e.g. Gluten-free, nut allergy, vegetarian, halal, none" />
      </div>
      <div className="field">
        <label>Any must-do activities or hard avoids?</label>
        <textarea className="box" placeholder="e.g. MUST: Colosseum tour, Vatican. AVOID: crowded tourist traps, anything requiring lots of walking for grandma" defaultValue={""} />
      </div>
    </div>
    {/* Section 5: Anything else */}
    <div className="section">
      <div className="section-title">💬 &nbsp;Anything Else We Should Know?</div>
      <div className="field">
        <textarea className="box" style={{minHeight: 100}} placeholder="Share anything that will help us build the perfect trip — special occasions (birthday, anniversary), fears (heights, crowds), previous trips, etc." defaultValue={""} />
      </div>
    </div>
    {/* Email CTA */}
    <div className="email-box">
      <div className="email-icon">📧</div>
      <div className="email-text">
        <h3>Email this form back to us</h3>
        <p>Once filled in, print this page to PDF (or take a screenshot) and email it to:<br />
          <a href="mailto:hello@roamify.life">hello@roamify.life</a><br /><br />
          Subject line: <strong style={{color: 'white'}}>Roamify Order — [Your Name] — [Destination]</strong><br />
          e.g. <em style={{color: 'rgba(255,255,255,0.6)'}}>Roamify Order — Sarah — Rome &amp; Tuscany</em></p>
      </div>
    </div>
    {/* Promise */}
    <div className="promise">
      <div className="promise-icon">🛡️</div>
      <div className="promise-text">
        <h4>Our Delivery Promise</h4>
        <p>Your completed itinerary — day-by-day plan, verified restaurants, step-free routes, Google Maps link, and polished PDF — will be delivered to your email according to your plan's delivery window (Weekend: 2 days, Full Week: 3–5 days, Complete Family: 5–7 days). If you have any questions before then, email us at <strong>hello@roamify.life</strong> and we'll reply within 2 hours.</p>
      </div>
    </div>
  </div>{/* /body */}
  {/* Footer */}
  <div className="footer">
    <div>
      <div className="footer-brand">Roam<span>ify</span></div>
      <div className="footer-tagline">AI-Powered Speed. Human-Verified Perfection.</div>
    </div>
    <div className="footer-tagline" style={{textAlign: 'right'}}>
      hello@roamify.life<br />
      www.roamify.life
    </div>
  </div>
</div>

    </>
  );
}
