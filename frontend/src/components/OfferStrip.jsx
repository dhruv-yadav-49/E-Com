const OFFERS = [
  { icon: '🏦', title: '10% Instant Discount', sub: 'with SBI Credit Card (also valid on EMI)', color: '#2563eb' },
  { icon: '💳', title: '5% Cashback', sub: 'on every HDFC Bank Debit/Credit Card purchase', color: '#7c3aed' },
  { icon: '🎁', title: 'Extra ₹500 Off', sub: 'on orders above ₹2,999 with code SHOPZEN', color: '#059669' },
];

export default function OfferStrip() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '16px' }}>
      {OFFERS.map((offer, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '14px 16px',
            borderRadius: '14px',
            background: 'var(--bg2)',
            border: `1px solid ${offer.color}33`,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = `${offer.color}77`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = `${offer.color}33`; }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${offer.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
            {offer.icon}
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '3px' }}>{offer.title}</p>
            <p style={{ fontSize: '11px', color: 'var(--text3)', lineHeight: 1.4 }}>{offer.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
