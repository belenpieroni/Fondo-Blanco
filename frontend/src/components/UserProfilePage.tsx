import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronLeft, UserPlus, UserMinus } from 'lucide-react';
import { Button } from './ui/button';
import { Drink } from '../types/drink';
import { drinkStorage } from '../data/drinkStorage';
import { users, CURRENT_USER_ID } from '../data/users';
import { User } from '../types/user';

export function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(userId ? users[userId] : null);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (userId) {
      const foundUser = users[userId];
      setUser(foundUser);
      
      const userDrinks = drinkStorage.getByUserId(userId);
      setDrinks(userDrinks.sort((a, b) => b.points - a.points));
      
      // Check if current user is following this user
      const currentUser = users[CURRENT_USER_ID];
      setIsFollowing(currentUser.following.includes(userId));
    }
  }, [userId]);

  const handleFollowToggle = () => {
    if (!user) return;
    
    // Update following status
    const currentUser = users[CURRENT_USER_ID];
    if (isFollowing) {
      currentUser.following = currentUser.following.filter(id => id !== user.id);
      user.followers = user.followers.filter(id => id !== CURRENT_USER_ID);
    } else {
      currentUser.following.push(user.id);
      user.followers.push(CURRENT_USER_ID);
    }
    
    setIsFollowing(!isFollowing);
    setUser({ ...user });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="mb-4 text-foreground">Usuario no encontrado</h2>
          <Button onClick={() => navigate('/')} className="bg-primary">Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const isOwnProfile = userId === CURRENT_USER_ID;

  return (
    <>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-foreground">{user.name}</h1>
        </div>
        
        <button 
          onClick={() => navigate(`/perfil/${CURRENT_USER_ID}`)}
          className="w-10 h-10 bg-primary flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <span className="text-white">{users[CURRENT_USER_ID].avatar}</span>
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Profile Header */}
          <div className="bg-card border border-border p-8 mb-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white text-4xl">{user.avatar}</span>
              </div>
              
              <div className="flex-1">
                <h2 className="text-foreground mb-2">{user.name}</h2>
                <p className="text-muted-foreground mb-4">{user.username}</p>
                
                {user.bio && (
                  <p className="text-foreground mb-4">{user.bio}</p>
                )}
                
                <div className="flex gap-6 mb-4">
                  <div>
                    <span className="text-foreground">{drinks.length}</span>
                    <span className="text-muted-foreground ml-1">tragos</span>
                  </div>
                  <button className="hover:opacity-80">
                    <span className="text-foreground">{user.followers.length}</span>
                    <span className="text-muted-foreground ml-1">seguidores</span>
                  </button>
                  <button className="hover:opacity-80">
                    <span className="text-foreground">{user.following.length}</span>
                    <span className="text-muted-foreground ml-1">seguidos</span>
                  </button>
                </div>
                
                {!isOwnProfile && (
                  <Button
                    onClick={handleFollowToggle}
                    className={`${
                      isFollowing 
                        ? 'bg-secondary hover:bg-secondary/80 text-foreground border border-border' 
                        : 'bg-primary hover:bg-primary/90 text-white'
                    } flex items-center gap-2`}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus size={18} />
                        Dejar de seguir
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} />
                        Seguir
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* User's Drinks */}
          <div>
            <h2 className="text-foreground mb-4">Tragos creados</h2>
            
            {drinks.length === 0 ? (
              <div className="bg-card border border-border p-8 text-center">
                <p className="text-muted-foreground">
                  {isOwnProfile ? 'Aún no has creado ningún trago' : 'Este usuario no ha creado tragos aún'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drinks.map((drink) => (
                  <div
                    key={drink.id}
                    onClick={() => navigate(`/trago/${drink.id}`)}
                    className="bg-card border border-border overflow-hidden hover:border-primary transition-colors cursor-pointer"
                  >
                    <div className="relative h-48">
                      <img 
                        src={drink.mainImage} 
                        alt={drink.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-primary px-3 py-1">
                        <span className="text-white">{drink.points} pts</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-foreground mb-2">{drink.name}</h3>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{drink.category}</span>
                        <span>{drink.comments.length} comentarios</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
