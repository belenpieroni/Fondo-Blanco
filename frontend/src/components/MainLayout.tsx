import { Outlet, useNavigate, useLocation } from 'react-router';
import { Trophy, ChefHat, Wine, Search } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { Input } from './ui/input';
import { CURRENT_USER_ID, currentUser } from '../data/users';

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-primary flex items-center justify-center">
              <ChefHat className="text-white" size={24} />
            </div>
            <span className="text-foreground font-serif">Fondo Blanco</span>
          </button>
        </div>
        
        <div className="flex-1 p-4 space-y-4">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tragos..."
              className="pl-10 bg-input-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </form>
          
          <button
            onClick={() => navigate('/mis-tragos')}
            className={`w-full flex items-center gap-3 px-3 py-2 transition-colors ${
              location.pathname === '/mis-tragos' 
                ? 'bg-primary text-white' 
                : 'text-foreground hover:bg-secondary'
            }`}
          >
            <Wine size={20} />
            <span>Mis tragos</span>
          </button>
          
          <div className="pt-4">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white flex items-center gap-2">
              <Trophy size={18} />
              Desafíos
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
