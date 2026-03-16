import React, { useState } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import { getAllBooks } from '../../data/books';

export function Header({ currentBook, currentBookId, onSwitchBook, onTitleClick }) {
  const [showBookSelector, setShowBookSelector] = useState(false);
  const allBooks = getAllBooks();

  const handleBookSelect = (bookId) => {
    onSwitchBook(bookId);
    setShowBookSelector(false);
  };

  return (
    <header className="max-w-4xl mx-auto mb-6 pt-16 text-center">
      <h1
        onClick={onTitleClick}
        className="text-3xl md:text-4xl font-extrabold text-sky-600 mb-2 flex items-center justify-center gap-3 cursor-pointer select-none active:scale-95 transition"
      >
        <BookOpen className="w-10 h-10" /> 英语单词大冒险
      </h1>
      <div className="relative inline-block">
        <button
          onClick={() => setShowBookSelector(!showBookSelector)}
          className="text-sky-800 text-lg flex items-center gap-1 hover:text-sky-600 transition"
        >
          {currentBook?.title || '三年级上册'} ({currentBook?.subtitle || 'Book 3A'})
          <ChevronDown className={`w-4 h-4 transition-transform ${showBookSelector ? 'rotate-180' : ''}`} />
        </button>
        {showBookSelector && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl shadow-xl border overflow-hidden z-50 min-w-[180px]">
            {allBooks.map(book => (
              <button
                key={book.id}
                onClick={() => handleBookSelect(book.id)}
                className={`w-full px-4 py-3 text-left hover:bg-sky-50 transition ${book.id === currentBookId ? 'bg-sky-100 text-sky-700 font-bold' : 'text-gray-700'}`}
              >
                <div>{book.title}</div>
                <div className="text-xs text-gray-500">{book.subtitle}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;