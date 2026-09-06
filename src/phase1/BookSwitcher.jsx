import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, ChevronDown, Check } from 'lucide-react';

export function BookSwitcher({ books, currentId, onSwitch }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = books.find(b => b.id === currentId) || books[0];

  return (
    <div className="book-switcher" ref={ref}>
      <button
        type="button"
        className={`book-pill ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="选择课本"
      >
        <BookOpen size={16} className="book-pill-icon" />
        <span className="book-pill-text">
          <span className="book-pill-title">{current.title}</span>
          <span className="book-pill-sub">{current.subtitle}</span>
        </span>
        <ChevronDown size={14} className={`book-pill-chev ${open ? 'is-open' : ''}`} />
      </button>

      {open && (
        <ul className="book-menu" role="listbox" aria-label="课本列表">
          {books.map(b => {
            const active = b.id === currentId;
            return (
              <li key={b.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`book-option ${active ? 'is-active' : ''}`}
                  onClick={() => { onSwitch(b.id); setOpen(false); }}
                >
                  <span className="book-option-text">
                    <span className="book-option-title">{b.title}</span>
                    <span className="book-option-sub">{b.subtitle}</span>
                  </span>
                  {active && <Check size={15} className="book-option-check" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default BookSwitcher;