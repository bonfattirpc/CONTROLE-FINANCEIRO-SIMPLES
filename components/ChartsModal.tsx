
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AnnualData, Income, Expense } from '../types';

interface ChartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  annualData: AnnualData;
  year: number;
}

const ChartsModal: React.FC<ChartsModalProps> = ({ isOpen, onClose, annualData, year }) => {
  if (!isOpen) return null;

  const monthNames = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const chartData = monthNames.map((name, index) => {
    const key = `${year}-${index}`;
    const data = annualData[key] || { incomes: [], expenses: [] };
    
    // Explicitly type the reduce return type and callback parameters to resolve operator '+' errors where TS incorrectly identifies the accumulator as the item type
    const totalIncome = (data.incomes as Income[]).reduce<number>((acc: number, curr: Income) => acc + curr.value, 0);
    const totalExpense = (data.expenses as Expense[]).reduce<number>((acc: number, curr: Expense) => acc + curr.value, 0);
    
    return {
      name,
      Receita: totalIncome,
      Despesa: totalExpense,
      Saldo: totalIncome - totalExpense
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumo Anual - {year}</h2>
        
        <div className="grid grid-cols-1 gap-8">
          <div className="h-80 w-full bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Fluxo de Caixa (Mensal)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                   formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                />
                <Legend />
                <Bar dataKey="Receita" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="h-80 w-full bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Evolução do Saldo</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                   formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                />
                <Legend />
                <Line type="monotone" dataKey="Saldo" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartsModal;
