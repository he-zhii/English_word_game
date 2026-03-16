import React from 'react';
import { Star, ArrowRight } from 'lucide-react';

export function UnitGrid({ units, getUnitWordCount, onUnitSelect }) {
  return (
    <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
      {units.map(unit => (
        <div
          key={unit.id}
          onClick={() => onUnitSelect(unit)}
          className={`group cursor-pointer rounded-3xl p-6 shadow-lg border-b-8 border border-white/30 backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-2xl bg-white/80 ${unit.themeColor.split(' ')[1]} active:scale-95`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${unit.themeColor.split(' ')[0]} ${unit.themeColor.split(' ')[2]}`}>
              <unit.icon className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold bg-white/50 text-gray-600 px-2 py-1 rounded-lg">
              第 {unit.id} 单元
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">{unit.title}</h3>
          <p className="text-gray-500 text-sm font-medium mb-4">{unit.subtitle}</p>
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-black/5">
            <div className="flex gap-1 text-xs font-bold text-gray-400">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              {getUnitWordCount(unit.id)} 词
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-600" />
          </div>
        </div>
      ))}
    </main>
  );
}

export default UnitGrid;