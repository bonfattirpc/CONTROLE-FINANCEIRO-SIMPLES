
import React from 'react';
import { Expense, ExpenseStatus, ExpenseType } from '../types';

interface ExpenseTableProps {
  expenses: Expense[];
  onUpdate: (updatedExpenses: Expense[], applyToSeries?: string) => void;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, onUpdate }) => {
  const addRow = () => {
    const newExp: Expense = {
      id: crypto.randomUUID(),
      type: 'VARIÁVEL',
      description: 'Nova Despesa',
      value: 0,
      date: new Date().toISOString().split('T')[0],
      status: 'A PAGAR'
    };
    onUpdate([...expenses, newExp]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === 'Enter') {
      const table = e.currentTarget.closest('table');
      if (table) {
        const focusables = Array.from(table.querySelectorAll('input, select'));
        const index = focusables.indexOf(e.currentTarget);
        if (index > -1 && index < focusables.length - 1) {
          (focusables[index + 1] as HTMLElement).focus();
        } else if (index === focusables.length - 1) {
          addRow();
          setTimeout(() => {
            const updatedFocusables = Array.from(table.querySelectorAll('input, select'));
            if (updatedFocusables.length > focusables.length) {
              const nextField = updatedFocusables[index + 1] as HTMLElement;
              if (nextField) nextField.focus();
            }
          }, 50);
        }
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === 'Nova Despesa' || val === '0' || val === '0.00') {
      e.target.value = '';
    } else {
      e.target.select();
    }
  };

  const removeRow = (id: string) => {
    onUpdate(expenses.filter(e => e.id !== id));
  };

  const handleChange = (id: string, field: keyof Expense, value: any) => {
    const item = expenses.find(e => e.id === id);
    if (!item) return;

    if (item.seriesId && (field === 'description' || field === 'value' || field === 'type')) {
       onUpdate(expenses.map(e => e.id === id ? { ...e, [field]: value } : e), item.seriesId);
    } else {
       onUpdate(expenses.map(e => e.id === id ? { ...e, [field]: value } : e));
    }
  };

  const statusColors = {
    'PAGO': 'text-green-600',
    'A PAGAR': 'text-red-500'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-[#1a2c4e] p-3.5 flex justify-between items-center">
        <h3 className="font-bold text-white uppercase tracking-wider text-xs">Movimentação Financeira (Despesas)</h3>
        <button onClick={addRow} className="bg-[#ffffff22] text-white py-1.5 px-5 rounded text-xs font-bold hover:bg-[#ffffff44] transition-colors flex items-center gap-2 uppercase">
          + Inserir
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-400 uppercase text-xs">Tipo</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-400 uppercase text-xs">Descrição</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-400 uppercase text-xs">Valor</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-400 uppercase text-xs">Vencimento</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-400 uppercase text-xs">Situação</th>
              <th className="px-2 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-gray-50 group">
                <td className="px-4 py-4">
                  <select 
                    value={exp.type}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => handleChange(exp.id, 'type', e.target.value)}
                    className="bg-transparent border-none focus:ring-0 p-0 text-xs font-bold text-gray-500 cursor-pointer uppercase"
                  >
                    <option value="FIXA">FIXA</option>
                    <option value="VARIÁVEL">VARIÁVEL</option>
                  </select>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <input 
                      type="text" 
                      value={exp.description}
                      onFocus={handleFocus}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => handleChange(exp.id, 'description', e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-600 font-medium text-sm"
                    />
                    {exp.installmentsCount && (
                      <span className="text-[10px] text-blue-500 font-bold uppercase mt-1">
                        PARCELA {exp.currentInstallment}/{exp.installmentsCount}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                   <div className="flex items-center justify-end font-bold text-sm">
                     <span className="text-gray-300 mr-2 font-normal">R$</span>
                     <input 
                        type="number" 
                        value={exp.value === 0 ? '' : exp.value}
                        placeholder="0,00"
                        step="0.01"
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => handleChange(exp.id, 'value', parseFloat(e.target.value) || 0)}
                        className="w-24 text-right bg-transparent border-none focus:ring-0 p-0 text-gray-700 font-bold"
                      />
                   </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <input 
                    type="date" 
                    value={exp.date}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => handleChange(exp.id, 'date', e.target.value)}
                    className="bg-transparent border-none focus:ring-0 p-0 text-gray-400 text-xs text-center"
                  />
                </td>
                <td className="px-4 py-4 text-center">
                   <select 
                    value={exp.status}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => handleChange(exp.id, 'status', e.target.value)}
                    className={`text-[11px] font-black border-none focus:ring-0 cursor-pointer bg-transparent text-center uppercase ${statusColors[exp.status]}`}
                  >
                    <option value="A PAGAR">A PAGAR</option>
                    <option value="PAGO">PAGO</option>
                  </select>
                </td>
                <td className="px-2 py-4 text-center">
                   <button onClick={() => removeRow(exp.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center text-gray-400 italic text-sm">
                  Sem despesas para o período selecionado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;
