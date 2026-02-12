
import React, { useState } from 'react';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');

  if (!isOpen) return null;

  const handleNumber = (num: string) => {
    setDisplay((prev) => (prev === '0' ? num : prev + num));
  };

  const handleOperator = (op: string) => {
    setExpression(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const fullExpression = expression + display;
      // Using Function constructor for a simple, safe-ish eval of math expressions
      // For a production app, a math parser library would be better.
      const result = new Function(`return ${fullExpression.replace(',', '.')}`)();
      setDisplay(result.toString().replace('.', ','));
      setExpression('');
    } catch (e) {
      setDisplay('Erro');
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(display);
    alert('Valor copiado!');
  };

  const btnClass = "h-14 w-full flex items-center justify-center text-lg font-bold rounded-xl transition-colors shadow-sm";
  const numBtnClass = `${btnClass} bg-white text-gray-700 hover:bg-gray-100`;
  const opBtnClass = `${btnClass} bg-blue-50 text-blue-600 hover:bg-blue-100`;
  const actionBtnClass = `${btnClass} bg-gray-800 text-white hover:bg-gray-900`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-gray-50 rounded-3xl shadow-2xl w-full max-w-xs overflow-hidden border border-gray-200">
        <div className="p-4 bg-white border-b border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Calculadora</span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div className="text-right h-16 flex flex-col justify-end">
            <div className="text-xs text-gray-400 h-4">{expression}</div>
            <div className="text-3xl font-black text-gray-800 truncate">{display}</div>
          </div>
        </div>

        <div className="p-4 grid grid-cols-4 gap-2">
          <button onClick={clear} className={`${opBtnClass} text-red-500`}>C</button>
          <button onClick={copyToClipboard} className={opBtnClass}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
          </button>
          <button onClick={() => handleOperator('/')} className={opBtnClass}>÷</button>
          <button onClick={() => handleOperator('*')} className={opBtnClass}>×</button>

          <button onClick={() => handleNumber('7')} className={numBtnClass}>7</button>
          <button onClick={() => handleNumber('8')} className={numBtnClass}>8</button>
          <button onClick={() => handleNumber('9')} className={numBtnClass}>9</button>
          <button onClick={() => handleOperator('-')} className={opBtnClass}>-</button>

          <button onClick={() => handleNumber('4')} className={numBtnClass}>4</button>
          <button onClick={() => handleNumber('5')} className={numBtnClass}>5</button>
          <button onClick={() => handleNumber('6')} className={numBtnClass}>6</button>
          <button onClick={() => handleOperator('+')} className={opBtnClass}>+</button>

          <button onClick={() => handleNumber('1')} className={numBtnClass}>1</button>
          <button onClick={() => handleNumber('2')} className={numBtnClass}>2</button>
          <button onClick={() => handleNumber('3')} className={numBtnClass}>3</button>
          <button onClick={calculate} className={`${actionBtnClass} row-span-2 h-auto`}>=</button>

          <button onClick={() => handleNumber('0')} className={`${numBtnClass} col-span-2`}>0</button>
          <button onClick={() => handleNumber(',')} className={numBtnClass}>,</button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorModal;
