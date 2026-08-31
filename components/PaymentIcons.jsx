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
  const containerHeight = size === "sm" ? "h-7 min-w-[38px] px-1.5" : "h-8 min-w-[46px] px-2";
  const imgHeight = size === "sm" ? "h-4 max-w-[36px]" : "h-5 max-w-[42px]";

  return (
    <div
      className={`${containerHeight} bg-white rounded-md border border-slate-200 shadow-xs flex items-center justify-center transition-all hover:border-slate-300`}
      title={item.name}
    >
      <img
        src={item.src}
        alt={item.alt}
        className={`${imgHeight} w-auto object-contain`}
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
