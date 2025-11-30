import { Drink } from '../types/drink';
import { mockDrinks } from './mockDrinks';

// Simulamos un almacenamiento en memoria
let drinks: Drink[] = [...mockDrinks];

export const drinkStorage = {
  getAll: (): Drink[] => drinks,
  
  getById: (id: string): Drink | undefined => drinks.find(d => d.id === id),
  
  getByUserId: (userId: string): Drink[] => drinks.filter(d => d.createdByUserId === userId),
  
  add: (drink: Drink): void => {
    drinks = [...drinks, drink];
  },
  
  update: (id: string, updatedDrink: Partial<Drink>): void => {
    drinks = drinks.map(d => d.id === id ? { ...d, ...updatedDrink } : d);
  },
  
  delete: (id: string): void => {
    drinks = drinks.filter(d => d.id !== id);
  },
  
  search: (query: string): Drink[] => {
    const lowerQuery = query.toLowerCase();
    return drinks.filter(drink => 
      drink.name.toLowerCase().includes(lowerQuery) ||
      drink.description.toLowerCase().includes(lowerQuery) ||
      drink.category.toLowerCase().includes(lowerQuery)
    );
  }
};
