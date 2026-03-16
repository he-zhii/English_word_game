import {
  Users, Home, PawPrint, Apple, Palette, Hash,
  UserPlus, Smile, Pencil, UtensilsCrossed, MapPin, Calculator
} from 'lucide-react';

import grade3aConfig from './grade3a.json';
import grade3bConfig from './grade3b.json';

import grade3aUnit1 from './words/grade3a/unit1.json';
import grade3aUnit2 from './words/grade3a/unit2.json';
import grade3aUnit3 from './words/grade3a/unit3.json';
import grade3aUnit4 from './words/grade3a/unit4.json';
import grade3aUnit5 from './words/grade3a/unit5.json';
import grade3aUnit6 from './words/grade3a/unit6.json';

import grade3bUnit1 from './words/grade3b/unit1.json';
import grade3bUnit2 from './words/grade3b/unit2.json';
import grade3bUnit3 from './words/grade3b/unit3.json';
import grade3bUnit4 from './words/grade3b/unit4.json';
import grade3bUnit5 from './words/grade3b/unit5.json';
import grade3bUnit6 from './words/grade3b/unit6.json';

const ICON_MAP = {
  Users, Home, PawPrint, Apple, Palette, Hash,
  UserPlus, Smile, Pencil, UtensilsCrossed, MapPin, Calculator
};

const WORDS_MAP = {
  grade3a: { 1: grade3aUnit1, 2: grade3aUnit2, 3: grade3aUnit3, 4: grade3aUnit4, 5: grade3aUnit5, 6: grade3aUnit6 },
  grade3b: { 1: grade3bUnit1, 2: grade3bUnit2, 3: grade3bUnit3, 4: grade3bUnit4, 5: grade3bUnit5, 6: grade3bUnit6 }
};

const BOOKS_CONFIG = [
  { ...grade3aConfig, words: WORDS_MAP.grade3a },
  { ...grade3bConfig, words: WORDS_MAP.grade3b }
];

export const getBookById = (bookId) => BOOKS_CONFIG.find(b => b.id === bookId);

export const getUnitsWithIcons = (bookId) => {
  const book = getBookById(bookId);
  if (!book) return [];
  return book.units.map(unit => ({
    ...unit,
    icon: ICON_MAP[unit.icon] || Users
  }));
};

export const getAllBooks = () => BOOKS_CONFIG.map(book => ({
  id: book.id,
  title: book.title,
  subtitle: book.subtitle,
  unitCount: book.units.length
}));

export { BOOKS_CONFIG };