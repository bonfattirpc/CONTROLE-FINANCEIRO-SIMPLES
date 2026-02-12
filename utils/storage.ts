
import { AnnualData } from '../types';

const STORAGE_KEY = 'finance_control_data_v1';

export const saveToStorage = (data: AnnualData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadFromStorage = (): AnnualData => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};
