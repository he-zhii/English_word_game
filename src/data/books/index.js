import {
  Users, Home, PawPrint, Apple, Palette, Hash,
  UserPlus, Smile, Pencil, UtensilsCrossed, MapPin, Calculator,
  Heart, CalendarDays, Activity, Sparkles, Utensils,
  Mountain, Globe, Medal, ShoppingBag, Rocket, Leaf
} from 'lucide-react';
import { UNIT_ICONS } from '../../phase1/UnitIcons';

import grade3aConfig from './grade3a.json';
import grade3bConfig from './grade3b.json';
import grade4aConfig from './grade4a.json';
import grade4bConfig from './grade4b.json';
import grade5aConfig from './grade5a.json';
import grade6aConfig from './grade6a.json';

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

import grade4aUnit1 from './words/grade4a/unit1.json';
import grade4aUnit2 from './words/grade4a/unit2.json';
import grade4aUnit3 from './words/grade4a/unit3.json';
import grade4aUnit4 from './words/grade4a/unit4.json';
import grade4aUnit5 from './words/grade4a/unit5.json';
import grade4aUnit6 from './words/grade4a/unit6.json';

import grade4bUnit1 from './words/grade4b/unit1.json';
import grade4bUnit2 from './words/grade4b/unit2.json';
import grade4bUnit3 from './words/grade4b/unit3.json';
import grade4bUnit4 from './words/grade4b/unit4.json';
import grade4bUnit5 from './words/grade4b/unit5.json';
import grade4bUnit6 from './words/grade4b/unit6.json';
import grade4bNumbers from './words/grade4b/numbers.json';

import grade5aUnit1 from './words/grade5a/unit1.json';
import grade5aUnit2 from './words/grade5a/unit2.json';
import grade5aUnit3 from './words/grade5a/unit3.json';
import grade5aUnit4 from './words/grade5a/unit4.json';
import grade5aUnit5 from './words/grade5a/unit5.json';
import grade5aUnit6 from './words/grade5a/unit6.json';

import grade6aUnit1 from './words/grade6a/unit1.json';
import grade6aUnit2 from './words/grade6a/unit2.json';
import grade6aUnit3 from './words/grade6a/unit3.json';
import grade6aUnit4 from './words/grade6a/unit4.json';
import grade6aUnit5 from './words/grade6a/unit5.json';
import grade6aUnit6 from './words/grade6a/unit6.json';

const ICON_MAP = {
  // 三年级：lucide 线性图标
  Users, Home, PawPrint, Apple, Palette, Hash,
  UserPlus, Smile, Pencil, UtensilsCrossed, MapPin, Calculator,
  // 五年级、六年级：lucide 线性图标
  Heart, CalendarDays, Activity, Sparkles, Utensils,
  Mountain, Globe, Medal, ShoppingBag, Rocket, Leaf,
  // 四年级：定制彩色插画图标
  ...UNIT_ICONS
};

const WORDS_MAP = {
  grade3a: { 1: grade3aUnit1, 2: grade3aUnit2, 3: grade3aUnit3, 4: grade3aUnit4, 5: grade3aUnit5, 6: grade3aUnit6 },
  grade3b: { 1: grade3bUnit1, 2: grade3bUnit2, 3: grade3bUnit3, 4: grade3bUnit4, 5: grade3bUnit5, 6: grade3bUnit6 },
  grade4a: { 1: grade4aUnit1, 2: grade4aUnit2, 3: grade4aUnit3, 4: grade4aUnit4, 5: grade4aUnit5, 6: grade4aUnit6 },
  grade4b: { 1: grade4bUnit1, 2: grade4bUnit2, 3: grade4bUnit3, 4: grade4bUnit4, 5: grade4bUnit5, 6: grade4bUnit6, 7: grade4bNumbers },
  grade5a: { 1: grade5aUnit1, 2: grade5aUnit2, 3: grade5aUnit3, 4: grade5aUnit4, 5: grade5aUnit5, 6: grade5aUnit6 },
  grade6a: { 1: grade6aUnit1, 2: grade6aUnit2, 3: grade6aUnit3, 4: grade6aUnit4, 5: grade6aUnit5, 6: grade6aUnit6 }
};

const BOOKS_CONFIG = [
  { ...grade3aConfig, words: WORDS_MAP.grade3a },
  { ...grade3bConfig, words: WORDS_MAP.grade3b },
  { ...grade4aConfig, words: WORDS_MAP.grade4a },
  { ...grade4bConfig, words: WORDS_MAP.grade4b },
  { ...grade5aConfig, words: WORDS_MAP.grade5a },
  { ...grade6aConfig, words: WORDS_MAP.grade6a }
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