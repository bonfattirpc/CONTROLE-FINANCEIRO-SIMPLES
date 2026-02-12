
import React, { useState } from 'react';
import { ExpenseType } from '../types';

interface InstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { description: string, value: number, type: ExpenseType, installments: number, startDate: string }) => void;
}

const InstallmentModal: React.FC<InstallmentModalProps> = ({ isOpen, onClose, onSave }) => {
  const [description, setDescription] = useState('');
  const [totalValue, setTotalValue] = useState(0);
  const [type, setType] = useState<ExpenseType>('VARIÁVEL');
  const [installments, setInstallments] = useState(1);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ description, value: totalValue, type, installments, startDate });
    setDescription('');
    setTotalValue(0);
    setInstallments(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Adicionar Parcelamento</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">DESCRIÇÃO</label>
            <input 
              required
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: Compra Notebook"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">VALOR TOTAL</label>
                <input 
                  required
                  type="number" 
                  step="0.01"
                  value={totalValue}
                  onChange={(e) => setTotalValue(parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">PARCELAS</label>
                <input 
                  required
                  type="number" 
                  min="1"
                  value={installments}
                  onChange={(e) => setInstallments(parseInt(e.target.value) || 1)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">TIPO</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as ExpenseType)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="FIXA">FIXA</option>
              <option value="VARIÁVEL">VARIÁVEL</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">DATA INICIAL</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors">
              CANCELAR
            </button>
            <button type="submit" className="flex-1 py-2 bg-blue-600 text-white font-bold hover:bg-blue-700 rounded-lg transition-colors shadow-lg">
              GERAR PARCELAS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstallmentModal;
