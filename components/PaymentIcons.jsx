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
