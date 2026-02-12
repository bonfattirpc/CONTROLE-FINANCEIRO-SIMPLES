
import React, { useState, useEffect, useMemo } from 'react';
import { AnnualData, Expense, Income, ExpenseType } from './types';
import { loadFromStorage, saveToStorage } from './utils/storage';
import IncomeTable from './components/IncomeTable';
import ExpenseTable from './components/ExpenseTable';
import ChartsModal from './components/ChartsModal';
import InstallmentModal from './components/InstallmentModal';
import CalculatorModal from './components/CalculatorModal';

const App: React.FC = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [annualData, setAnnualData] = useState<AnnualData>(() => loadFromStorage());
  const [isChartsOpen, setIsChartsOpen] = useState(false);
  const [isInstallmentOpen, setIsInstallmentOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Persistence
  useEffect(() => {
    saveToStorage(annualData);
  }, [annualData]);

  const currentKey = `${currentYear}-${currentMonth}`;
  const monthData = useMemo(() => {
    return annualData[currentKey] || { incomes: [], expenses: [], month: currentMonth, year: currentYear };
  }, [annualData, currentKey, currentMonth, currentYear]);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const updateMonthIncomes = (newIncomes: Income[]) => {
    setAnnualData(prev => ({
      ...prev,
      [currentKey]: { ...monthData, incomes: newIncomes }
    }));
  };

  const updateMonthExpenses = (newExpenses: Expense[], applyToSeries?: string) => {
    if (applyToSeries) {
      const editedItem = newExpenses.find(e => e.seriesId === applyToSeries);
      if (!editedItem) return;

      const newAnnualData = { ...annualData };
      Object.keys(newAnnualData).forEach(key => {
        if (newAnnualData[key].expenses) {
          newAnnualData[key].expenses = newAnnualData[key].expenses.map(e => {
            if (e.seriesId === applyToSeries) {
              return { 
                ...e, 
                description: editedItem.description, 
                value: editedItem.value,
                type: editedItem.type
              };
            }
            return e;
          });
        }
      });
      setAnnualData(newAnnualData);
    } else {
      setAnnualData(prev => ({
        ...prev,
        [currentKey]: { ...monthData, expenses: newExpenses }
      }));
    }
  };

  const handleAddInstallments = (data: { description: string, value: number, type: ExpenseType, installments: number, startDate: string }) => {
    const seriesId = crypto.randomUUID();
    const installmentValue = parseFloat((data.value / data.installments).toFixed(2));
    const startMonth = new Date(data.startDate).getUTCMonth();
    const startYear = new Date(data.startDate).getUTCFullYear();

    const newAnnualData = { ...annualData };

    for (let i = 0; i < data.installments; i++) {
      const date = new Date(data.startDate);
      date.setUTCMonth(startMonth + i);
      const m = date.getUTCMonth();
      const y = date.getUTCFullYear();
      const key = `${y}-${m}`;

      const newExpense: Expense = {
        id: crypto.randomUUID(),
        type: data.type,
        description: data.description,
        value: installmentValue,
        date: date.toISOString().split('T')[0],
        status: 'A PAGAR',
        installmentsCount: data.installments,
        currentInstallment: i + 1,
        seriesId
      };

      if (!newAnnualData[key]) {
        newAnnualData[key] = { month: m, year: y, incomes: [], expenses: [] };
      }
      newAnnualData[key].expenses = [...(newAnnualData[key].expenses || []), newExpense];
    }

    setAnnualData(newAnnualData);
  };

  const totalIncome = useMemo(() => monthData.incomes.reduce((acc, curr) => acc + curr.value, 0), [monthData]);
  const totalExpense = useMemo(() => monthData.expenses.reduce((acc, curr) => acc + curr.value, 0), [monthData]);
  const toPay = useMemo(() => monthData.expenses.filter(e => e.status === 'A PAGAR').reduce((acc, curr) => acc + curr.value, 0), [monthData]);
  const balance = totalIncome - totalExpense;

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="min-h-screen bg-[#f4f7f6] p-4 md:p-6 flex flex-col">
      <div className="max-w-[1600px] mx-auto space-y-6 flex-grow w-full">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-[#1a2c4e] text-white p-2.5 rounded-lg shadow-md">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1a2c4e] uppercase tracking-tight">CONTROLE FINANCEIRO SIMPLES</h1>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="flex items-center bg-gray-50 border border-gray-200 p-1 rounded-lg">
            <button 
              onClick={() => {
                if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
                else setCurrentMonth(m => m - 1);
              }}
              className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-gray-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <div className="px-6 font-bold text-[#1a2c4e] text-sm min-w-[140px] text-center uppercase">
              {monthNames[currentMonth]} {currentYear}
            </div>
            <button 
              onClick={() => {
                if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
                else setCurrentMonth(m => m + 1);
              }}
              className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-gray-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setIsInstallmentOpen(true)}
              className="px-4 py-2 bg-white text-[#1a2c4e] font-bold rounded border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2 text-[10px] uppercase shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Parcelar
            </button>
            <button 
              onClick={() => setIsChartsOpen(true)}
              className="px-4 py-2 bg-[#1a2c4e] text-white font-bold rounded hover:bg-[#122038] transition-colors shadow-sm flex items-center gap-2 text-[10px] uppercase"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              Gráficos
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
          <div className="lg:col-span-4 space-y-6">
            <IncomeTable 
              incomes={monthData.incomes} 
              onUpdate={updateMonthIncomes} 
            />

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <button 
                onClick={() => setIsCalculatorOpen(true)}
                className="w-full py-3 bg-gray-50 border border-gray-200 text-[#1a2c4e] font-bold rounded hover:bg-gray-100 transition-colors uppercase tracking-widest text-[10px]"
              >
                Calculadora Integrada
              </button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ExpenseTable 
              expenses={monthData.expenses} 
              onUpdate={updateMonthExpenses} 
            />
          </div>
        </main>
      </div>

      {/* Footer Status Cards Row */}
      <div className="max-w-[1600px] mx-auto w-full mt-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="bg-[#28a745] text-white p-3 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Receita Total</p>
              <p className="text-xl font-bold text-gray-700">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="bg-[#17a2b8] text-white p-3 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Saldo Mensal</p>
              <p className="text-xl font-bold text-gray-700">{formatCurrency(balance)}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="bg-[#ffc107] text-white p-3 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">A Pagar Hoje</p>
              <p className="text-xl font-bold text-gray-700">{formatCurrency(toPay)}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="bg-[#dc3545] text-white p-3 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Gasto Total</p>
              <p className="text-xl font-bold text-gray-700">{formatCurrency(totalExpense)}</p>
            </div>
          </div>
        </div>
      </div>

      <ChartsModal 
        isOpen={isChartsOpen} 
        onClose={() => setIsChartsOpen(false)} 
        annualData={annualData}
        year={currentYear}
      />

      <InstallmentModal 
        isOpen={isInstallmentOpen}
        onClose={() => setIsInstallmentOpen(false)}
        onSave={handleAddInstallments}
      />

      <CalculatorModal 
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
};

export default App;
