import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ThumbsUp, ThumbsDown, Heart, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Drink } from '../types/drink';
import { drinkStorage } from '../data/drinkStorage';
import { CURRENT_USER_ID, currentUser } from '../data/users';

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [drinks, setDrinks] = useState<Drink[]>([]);

  useEffect(() => {
    const allDrinks = searchQuery 
      ? drinkStorage.search(searchQuery)
      : drinkStorage.getAll();
    setDrinks(allDrinks);
  }, [searchQuery]);

  const handleVote = (drinkId: string, voteType: 'like' | 'dislike' | 'favorite') => {
    const drink = drinks.find(d => d.id === drinkId);
    if (!drink) return;

    let pointsChange = 0;
    let newUserVote: 'like' | 'dislike' | 'favorite' | null = voteType;

    if (drink.userVote === voteType) {
      newUserVote = null;
      if (voteType === 'like') pointsChange = -1;
      if (voteType === 'dislike') pointsChange = 1;
      if (voteType === 'favorite') pointsChange = -5;
    } else {
      if (drink.userVote === 'like') pointsChange += -1;
      if (drink.userVote === 'dislike') pointsChange += 1;
      if (drink.userVote === 'favorite') pointsChange += -5;

      if (voteType === 'like') pointsChange += 1;
      if (voteType === 'dislike') pointsChange += -1;
      if (voteType === 'favorite') pointsChange += 5;
    }

    const updatedDrink = {
      ...drink,
      points: drink.points + pointsChange,
      userVote: newUserVote
    };

    drinkStorage.update(drinkId, updatedDrink);
    setDrinks(drinks.map(d => d.id === drinkId ? updatedDrink : d));
  };

  // Ordenar por puntos de mayor a menor
  const sortedDrinks = [...drinks].sort((a, b) => b.points - a.points);

  return (
    <>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-foreground">{searchQuery ? `Resultados para "${searchQuery}"` : 'Los más puntuados del día'}</h1>
          <p className="text-muted-foreground mt-1">
            {searchQuery ? `${sortedDrinks.length} tragos encontrados` : '29 de noviembre, 2025'}
          </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDrinks.map((drink) => (
              <div 
                key={drink.id} 
                className="bg-card border border-border overflow-hidden hover:border-primary transition-colors cursor-pointer"
              >
                <div 
                  onClick={() => navigate(`/trago/${drink.id}`)}
                  className="relative h-48"
                >
                  <img 
                    src={drink.mainImage} 
                    alt={drink.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-primary px-3 py-1 flex items-center gap-1">
                    <span className="text-white">{drink.points}</span>
                    <span className="text-white/80">pts</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div 
                    onClick={() => navigate(`/trago/${drink.id}`)}
                    className="mb-2"
                  >
                    <h3 className="mb-1 text-foreground">{drink.name}</h3>
                    <p className="text-muted-foreground">{drink.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-muted-foreground mb-4">
                    <span>{drink.category}</span>
                    <button 
                      onClick={() => navigate(`/perfil/${drink.createdByUserId}`)}
                      className="hover:text-primary transition-colors"
                    >
                      Por {drink.createdBy}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={drink.userVote === 'like' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleVote(drink.id, 'like')}
                      className={`flex-1 flex items-center justify-center ${
                        drink.userVote === 'like' 
                          ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                          : 'hover:bg-green-600/10 hover:text-green-500 hover:border-green-500 border-border'
                      }`}
                    >
                      <ThumbsUp size={16} />
                    </Button>
                    
                    <Button
                      variant={drink.userVote === 'dislike' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleVote(drink.id, 'dislike')}
                      className={`flex-1 flex items-center justify-center ${
                        drink.userVote === 'dislike' 
                          ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' 
                          : 'hover:bg-red-600/10 hover:text-red-500 hover:border-red-500 border-border'
                      }`}
                    >
                      <ThumbsDown size={16} />
                    </Button>
                    
                    <Button
                      variant={drink.userVote === 'favorite' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleVote(drink.id, 'favorite')}
                      className={`flex-1 flex items-center justify-center ${
                        drink.userVote === 'favorite' 
                          ? 'bg-pink-600 hover:bg-pink-700 text-white border-pink-600' 
                          : 'hover:bg-pink-600/10 hover:text-pink-500 hover:border-pink-500 border-border'
                      }`}
                    >
                      <Heart size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
