
import React, { useState } from 'react';
import { Income } from '../types';

interface IncomeTableProps {
  incomes: Income[];
  onUpdate: (updatedIncomes: Income[]) => void;
}

const IncomeTable: React.FC<IncomeTableProps> = ({ incomes, onUpdate }) => {
  const addRow = () => {
    const newIncome: Income = {
      id: crypto.randomUUID(),
      description: 'Nova Entrada',
      type: 'SALÁRIO',
      value: 0
    };
    onUpdate([...incomes, newIncome]);
    return newIncome;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const table = e.currentTarget.closest('table');
      if (table) {
        const inputs = Array.from(table.querySelectorAll('input'));
        const index = inputs.indexOf(e.currentTarget);
        if (index > -1 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        } else if (index === inputs.length - 1) {
          addRow();
          setTimeout(() => {
            const updatedInputs = Array.from(table.querySelectorAll('input'));
            if (updatedInputs.length > inputs.length) {
              updatedInputs[index + 1].focus();
            }
          }, 50);
        }
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === 'Nova Entrada' || val === 'SALÁRIO' || val === '0') {
      e.target.value = '';
    } else {
      e.target.select();
    }
  };

  const removeRow = (id: string) => {
    onUpdate(incomes.filter(i => i.id !== id));
  };

  const handleChange = (id: string, field: keyof Income, value: string | number) => {
    onUpdate(incomes.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-[#1a2c4e] p-3.5 flex justify-between items-center">
        <h3 className="font-bold text-white uppercase tracking-wider text-xs">Entradas / Receitas</h3>
        <button onClick={addRow} className="bg-[#ffffff22] text-white w-7 h-7 rounded hover:bg-[#ffffff44] transition-colors flex items-center justify-center font-bold text-sm">
          +
        </button>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-2.5 text-left font-semibold text-gray-400 text-xs uppercase">Descrição</th>
            <th className="px-4 py-2.5 text-left font-semibold text-gray-400 text-xs uppercase">Tipo</th>
            <th className="px-4 py-2.5 text-right font-semibold text-gray-400 text-xs uppercase">Valor</th>
            <th className="px-2 py-2.5 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {incomes.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 group">
              <td className="px-4 py-3.5">
                <input 
                  type="text" 
                  value={item.description}
                  onFocus={handleFocus}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-600 font-medium placeholder-gray-300"
                />
              </td>
              <td className="px-4 py-3.5">
                <input 
                  type="text" 
                  value={item.type}
                  onFocus={handleFocus}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => handleChange(item.id, 'type', e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-500 uppercase font-medium placeholder-gray-300"
                />
              </td>
              <td className="px-4 py-3.5 text-right">
                <input 
                  type="number" 
                  value={item.value === 0 ? '' : item.value}
                  placeholder="0,00"
                  step="0.01"
                  onFocus={handleFocus}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => handleChange(item.id, 'value', parseFloat(e.target.value) || 0)}
                  className="w-28 text-right bg-transparent border-none focus:ring-0 p-0 text-[#1a2c4e] font-bold placeholder-gray-300"
                />
              </td>
              <td className="px-2 py-3.5 text-center">
                <button onClick={() => removeRow(item.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </td>
            </tr>
          ))}
          {incomes.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-12 text-center text-gray-400 italic text-sm">Sem registros de entrada</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IncomeTable;
