import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Sheet({ title, subtitle, children, footer, onClose, className = '' }) {
  const ref = useRef(null);
  const heading = useId();
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.querySelector('h2')?.focus();
    const onKey = event => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); }
      if (event.key !== 'Tab') return;
      const elements = [...ref.current.querySelectorAll('button:not([disabled]), input:not([disabled]), select, a[href]')].filter(el => el.getClientRects().length);
      const first = elements[0], last = elements.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement?.tagName === 'H2')) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', onKey); if (previous?.isConnected) previous.focus(); };
  }, []);
  return createPortal(<div className="wb-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section ref={ref} className={`wb-sheet ${className}`} role="dialog" aria-modal="true" aria-labelledby={heading}>
      <header className="sheet-heading"><div><span className="eyebrow">WORD BUDDY</span><h2 id={heading} tabIndex={-1}>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-button" aria-label="关闭" onClick={onClose}><X size={21}/></button></header>
      <div className="sheet-content">{children}</div>{footer && <footer className="sheet-footer">{footer}</footer>}
    </section>
  </div>, document.body);
}
