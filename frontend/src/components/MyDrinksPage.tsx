import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Drink } from '../types/drink';
import { drinkStorage } from '../data/drinkStorage';
import { CURRENT_USER_ID, currentUser } from '../data/users';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

export function MyDrinksPage() {
  const navigate = useNavigate();
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const myDrinks = drinkStorage.getByUserId(CURRENT_USER_ID);
    setDrinks(myDrinks);
  }, []);

  // Ordenar por puntos de mayor a menor
  const sortedDrinks = [...drinks].sort((a, b) => b.points - a.points);

  const handleDelete = (id: string) => {
    drinkStorage.delete(id);
    setDrinks(drinks.filter(d => d.id !== id));
    setDeleteId(null);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Mis tragos</h1>
          <p className="text-muted-foreground mt-1">{drinks.length} tragos creados</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/crear-trago')}
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
          >
            <Plus size={18} />
            Crear trago
          </Button>
          <button 
            onClick={() => navigate(`/perfil/${CURRENT_USER_ID}`)}
            className="w-10 h-10 bg-primary flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <span className="text-white">{currentUser.avatar}</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          {sortedDrinks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Aún no has creado ningún trago</p>
              <Button 
                onClick={() => navigate('/crear-trago')}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Crear mi primer trago
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedDrinks.map((drink) => (
                <div 
                  key={drink.id} 
                  className="bg-card border border-border overflow-hidden hover:border-primary transition-colors"
                >
                  <div className="flex gap-4 p-4">
                    <div 
                      onClick={() => navigate(`/trago/${drink.id}`)}
                      className="w-32 h-32 flex-shrink-0 cursor-pointer"
                    >
                      <img 
                        src={drink.mainImage} 
                        alt={drink.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div 
                          onClick={() => navigate(`/trago/${drink.id}`)}
                          className="flex-1 cursor-pointer"
                        >
                          <h3 className="mb-1 text-foreground">{drink.name}</h3>
                          <p className="text-muted-foreground">{drink.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                          <div className="text-center">
                            <div className="text-primary">{drink.points}</div>
                            <div className="text-muted-foreground">puntos</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-foreground">
                              <MessageCircle size={16} />
                              <span>{drink.comments.length}</span>
                            </div>
                            <div className="text-muted-foreground">
                              {drink.comments.length === 1 ? 'comentario' : 'comentarios'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span className="px-3 py-1 bg-secondary">{drink.category}</span>
                          <span>Creado el {new Date(drink.creationDate).toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => navigate(`/editar-trago/${drink.id}`)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 border-border hover:bg-secondary"
                          >
                            <Edit size={16} />
                            Editar
                          </Button>
                          <Button
                            onClick={() => setDeleteId(drink.id)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                          >
                            <Trash2 size={16} />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">¿Eliminar trago?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Esta acción no se puede deshacer. El trago será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border hover:bg-secondary">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
