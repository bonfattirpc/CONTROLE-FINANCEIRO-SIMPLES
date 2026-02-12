
import { AnnualData } from '../types';

const STORAGE_KEY = 'finance_control_data_v1';

export const saveToStorage = (data: AnnualData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar dados no localStorage:', error);
  }
};

export const loadFromStorage = (): AnnualData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return {};
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao carregar dados do localStorage:', error);
    return {};
  }
};
