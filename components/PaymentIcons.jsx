import React from 'react';

export const PAYMENT_METHODS = [
  { name: 'Visa', src: '/payments/visa.png', alt: 'Visa' },
  { name: 'Mastercard', src: '/payments/mastercard.png', alt: 'Mastercard' },
  { name: 'American Express', src: '/payments/amex.png', alt: 'American Express' },
  { name: 'Discover', src: '/payments/discover.png', alt: 'Discover' },
  { name: 'Diners Club', src: '/payments/diners.png', alt: 'Diners Club' },
  { name: 'JCB', src: '/payments/jcb.png', alt: 'JCB' },
  { name: 'Apple Pay', src: '/payments/applepay.png', alt: 'Apple Pay' },
  { name: 'Google Pay', src: '/payments/googlepay.png', alt: 'Google Pay' },
];

export function PaymentCardImage({ item, size = "md" }) {
  // Same identical box dimensions for every card logo
  const boxClass =
    size === "sm"
      ? "w-11 h-7 rounded-md p-1"
      : "w-14 h-9 rounded-lg p-1.5";

  return (
    <div
      className={`${boxClass} bg-white border border-slate-200/90 shadow-xs flex items-center justify-center overflow-hidden transition-transform hover:scale-105`}
      title={item.name}
    >
      <img
        src={item.src}
        alt={item.alt}
        className="w-full h-full object-contain object-center"
        loading="lazy"
      />
    </div>
  );
}

export function PaymentCardsRow({ size = "md", className = "" }) {
  return (
    <div className={`flex items-center flex-wrap gap-2 ${className}`}>
      {PAYMENT_METHODS.map((item) => (
        <PaymentCardImage key={item.name} item={item} size={size} />
      ))}
    </div>
  );
}

export function WalletPayButton({ url, className = "" }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-black text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg border border-slate-700/80 group text-sm ${className}`}
      title="Open checkout in new window to pay with Apple Pay or Google Pay"
    >
      <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md shadow-xs flex-shrink-0">
        <img src="/payments/applepay.png" alt="Apple Pay" className="h-4 w-auto object-contain" />
        <span className="text-slate-300 text-[10px] font-normal">•</span>
        <img src="/payments/googlepay.png" alt="Google Pay" className="h-4 w-auto object-contain" />
      </span>
      <span>Pay with Apple Pay / Google Pay</span>
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1={10} y1={14} x2={21} y2={3}/></svg>
    </a>
  );
}
