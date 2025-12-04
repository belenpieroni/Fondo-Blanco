import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronLeft, ThumbsUp, ThumbsDown, Heart, Send, Reply } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Drink, Comment } from '../types/drink';
import { drinkStorage } from '../data/drinkStorage';
import { CURRENT_USER_ID, users } from '../data/users';

export function DrinkDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drink, setDrink] = useState<Drink | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
  async function loadDrink() {
    if (!id) return;

    const foundDrink = await drinkStorage.getById(id);

    if (!foundDrink) {
      setDrink(null);
      return;
    }

    // Normalizamos para evitar undefined en arrays
    const normalizedDrink: Drink = {
      ...foundDrink,
      ingredients: foundDrink.ingredients ?? [],
      steps: foundDrink.steps ?? [],
      comments: foundDrink.comments ?? [],
      userVote: foundDrink.userVote ?? null,
    };

    setDrink(normalizedDrink);
  }

  loadDrink();
}, [id]);



  if (!drink) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <h2 className="mb-4 text-foreground">Trago no encontrado</h2>
          <Button onClick={() => navigate('/')} className="bg-primary">Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const handleVote = (voteType: 'like' | 'dislike' | 'favorite') => {
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

    drinkStorage.update(drink.id, updatedDrink);
    setDrink(updatedDrink);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: String(Date.now()),
      userId: CURRENT_USER_ID,
      userName: users[CURRENT_USER_ID].name,
      text: newComment,
      date: new Date().toISOString().split('T')[0],
      parentId: null,
      replies: []
    };

    const updatedDrink = {
      ...drink,
      comments: [...drink.comments, comment]
    };

    drinkStorage.update(drink.id, updatedDrink);
    setDrink(updatedDrink);
    setNewComment('');
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;

    const reply: Comment = {
      id: String(Date.now()),
      userId: CURRENT_USER_ID,
      userName: users[CURRENT_USER_ID].name,
      text: replyText,
      date: new Date().toISOString().split('T')[0],
      parentId,
      replies: []
    };

    const updatedComments = drink.comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    });

    const updatedDrink = {
      ...drink,
      comments: updatedComments
    };

    drinkStorage.update(drink.id, updatedDrink);
    setDrink(updatedDrink);
    setReplyText('');
    setReplyTo(null);
  };

  const renderComment = (comment: Comment) => (
    <div key={comment.id} className="border-b border-border pb-4 last:border-0">
      <div className="flex items-start gap-3">
        <button
          onClick={() => navigate(`/perfil/${comment.userId}`)}
          className="w-8 h-8 bg-primary flex items-center justify-center flex-shrink-0 hover:opacity-80"
        >
          <span className="text-white text-xs">{users[comment.userId]?.avatar || comment.userName[0]}</span>
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => navigate(`/perfil/${comment.userId}`)}
              className="text-foreground hover:text-primary"
            >
              {comment.userName}
            </button>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {new Date(comment.date).toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'short' 
              })}
            </span>
          </div>
          <p className="text-foreground mb-2">{comment.text}</p>
          <button
            onClick={() => setReplyTo(comment.id)}
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <Reply size={14} />
            <span>Responder</span>
          </button>

          {/* Reply Form */}
          {replyTo === comment.id && (
            <div className="mt-3 ml-8">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Responder a ${comment.userName}...`}
                rows={2}
                className="mb-2 bg-input-background border-border text-foreground"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleAddReply(comment.id)}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white"
                  disabled={!replyText.trim()}
                >
                  Responder
                </Button>
                <Button 
                  onClick={() => {
                    setReplyTo(null);
                    setReplyText('');
                  }}
                  size="sm"
                  variant="outline"
                  className="border-border hover:bg-secondary"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-8 space-y-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex items-start gap-3">
                  <button
                    onClick={() => navigate(`/perfil/${reply.userId}`)}
                    className="w-7 h-7 bg-secondary flex items-center justify-center flex-shrink-0 hover:opacity-80"
                  >
                    <span className="text-foreground text-xs">{users[reply.userId]?.avatar || reply.userName[0]}</span>
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => navigate(`/perfil/${reply.userId}`)}
                        className="text-foreground hover:text-primary"
                      >
                        {reply.userName}
                      </button>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">
                        {new Date(reply.date).toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                    </div>
                    <p className="text-foreground">{reply.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-foreground">{drink.name}</h1>
            <button 
              onClick={() => navigate(`/perfil/${drink.createdByUserId}`)}
              className="text-muted-foreground hover:text-primary"
            >
              Por {drink.createdBy}
            </button>
          </div>
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
          {/* Main Image and Votes */}
          <div className="bg-card border border-border overflow-hidden mb-6">
            <div className="relative h-96">
              <img 
                src={drink.mainImage} 
                alt={drink.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-primary px-4 py-2 flex items-center gap-2">
                <span className="text-white">{drink.points}</span>
                <span className="text-white/80">puntos</span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-3">
                <Button
                  variant={drink.userVote === 'like' ? 'default' : 'outline'}
                  onClick={() => handleVote('like')}
                  className={`flex-1 flex items-center justify-center gap-2 ${
                    drink.userVote === 'like' 
                      ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                      : 'hover:bg-green-600/10 hover:text-green-500 hover:border-green-500 border-border'
                  }`}
                >
                  <ThumbsUp size={18} />
                  <span>Me gusta</span>
                </Button>
                
                <Button
                  variant={drink.userVote === 'dislike' ? 'default' : 'outline'}
                  onClick={() => handleVote('dislike')}
                  className={`flex-1 flex items-center justify-center gap-2 ${
                    drink.userVote === 'dislike' 
                      ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' 
                      : 'hover:bg-red-600/10 hover:text-red-500 hover:border-red-500 border-border'
                  }`}
                >
                  <ThumbsDown size={18} />
                  <span>No me gusta</span>
                </Button>
                
                <Button
                  variant={drink.userVote === 'favorite' ? 'default' : 'outline'}
                  onClick={() => handleVote('favorite')}
                  className={`flex-1 flex items-center justify-center gap-2 ${
                    drink.userVote === 'favorite' 
                      ? 'bg-pink-600 hover:bg-pink-700 text-white border-pink-600' 
                      : 'hover:bg-pink-600/10 hover:text-pink-500 hover:border-pink-500 border-border'
                  }`}
                >
                  <Heart size={18} />
                  <span>Favorito</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Description and Details */}
          <section className="bg-card border border-border p-6 mb-6">
            <h2 className="mb-4 text-foreground">Descripción</h2>
            <p className="text-foreground mb-4">{drink.description}</p>
            <div className="flex gap-4 text-muted-foreground">
              <span className="px-3 py-1 bg-secondary">{drink.category}</span>
              <span>Creado el {new Date(drink.creationDate).toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </div>
          </section>

          {/* Ingredients */}
          <section className="bg-card border border-border p-6 mb-6">
            <h2 className="mb-4 text-foreground">Ingredientes</h2>
            <ul className="space-y-2">
              {drink.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="flex items-center gap-2 text-foreground">
                  <span className="w-2 h-2 bg-primary"></span>
                  <span>{ingredient.name}</span>
                  <span className="text-muted-foreground">- {ingredient.quantity} {ingredient.unit}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Steps */}
          <section className="bg-card border border-border p-6 mb-6">
            <h2 className="mb-4 text-foreground">Preparación</h2>
            <div className="space-y-4">
              {drink.steps.map((step) => (
                <div key={step.id} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white flex items-center justify-center">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground mb-2">{step.description}</p>
                    {step.imagePreview && (
                      <img 
                        src={step.imagePreview} 
                        alt={`Paso ${step.number}`}
                        className="w-full h-48 object-cover"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Comments */}
          <section className="bg-card border border-border p-6">
            <h2 className="mb-4 text-foreground">Comentarios ({drink.comments.length})</h2>
            
            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                rows={3}
                className="mb-2 bg-input-background border-border text-foreground placeholder:text-muted-foreground"
              />
              <div className="flex justify-end">
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                  disabled={!newComment.trim()}
                >
                  <Send size={16} />
                  Comentar
                </Button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {drink.comments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Aún no hay comentarios. ¡Sé el primero en comentar!</p>
              ) : (
                drink.comments.filter(c => !c.parentId).map(renderComment)
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
