import { Drink } from '../types/drink';

const API_URL = "http://localhost:3001/drinks";

export const drinkStorage = {
  
  // Obtener todas las recetas
  getAll: async (): Promise<Drink[]> => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener recetas");
    return res.json();
  },

  // Obtener receta por ID
  getById: async (id: string): Promise<Drink | undefined> => {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Receta no encontrada");
    return res.json();
  },

  // Obtener recetas de un usuario
  getByUserId: async (userId: string): Promise<Drink[]> => {
    const res = await fetch(`${API_URL}?createdByUserId=${userId}`);
    if (!res.ok) throw new Error("Error al filtrar por usuario");
    return res.json();
  },

  // Agregar receta
  add: async (drink: Drink): Promise<void> => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(drink),
    });

    if (!res.ok) throw new Error("Error al agregar receta");
  },

  // Actualizar receta parcial
  update: async (id: string, updatedDrink: Partial<Drink>): Promise<void> => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedDrink),
    });

    if (!res.ok) throw new Error("Error al actualizar receta");
  },

  // Eliminar receta
  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Error al eliminar receta");
  },

  // Búsqueda global por texto
  search: async (query: string): Promise<Drink[]> => {
    const res = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Error al buscar recetas");
    return res.json();
  }
};
