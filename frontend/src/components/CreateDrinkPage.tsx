import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Plus, X, Upload, Info, Utensils, List, UtensilsCrossed, ListOrdered } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Ingredient, Step, Drink } from '../types/drink';
import { categories } from '../data/ingredients';
import { IngredientAutocomplete } from './IngredientAutocomplete';
import { drinkStorage } from '../data/drinkStorage';
import { CURRENT_USER_ID, users } from '../data/users';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"

export function CreateDrinkPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [drinkName, setDrinkName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [creationDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: '', quantity: '', unit: 'ml' }
  ]);
  
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', number: 1, description: '', image: null, imagePreview: null }
  ]);

  const addIngredient = () => {
    const newId = (Math.max(...ingredients.map(i => parseInt(i.id)), 0) + 1).toString();
    setIngredients([...ingredients, { id: newId, name: '', quantity: '', unit: 'ml' }]);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(i => i.id !== id));
    }
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setIngredients(ingredients.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    ));
  };

  const addStep = () => {
    const newNumber = steps.length + 1;
    const newId = (Math.max(...steps.map(s => parseInt(s.id)), 0) + 1).toString();
    setSteps([...steps, { id: newId, number: newNumber, description: '', image: null, imagePreview: null }]);
  };

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      const filteredSteps = steps.filter(s => s.id !== id);
      const renumberedSteps = filteredSteps.map((step, index) => ({
        ...step,
        number: index + 1
      }));
      setSteps(renumberedSteps);
    }
  };

  const updateStep = (id: string, field: keyof Step, value: string) => {
    setSteps(steps.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };
		
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  const removeCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter(c => c !== category));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStepImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSteps(steps.map(s => 
          s.id === id ? { ...s, image: file, imagePreview: reader.result as string } : s
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDrink: Drink = {
      id: String(Date.now()),
      name: drinkName,
      description,
      categories: selectedCategories,
      creationDate,
      mainImage: mainImagePreview || 'https://images.unsplash.com/photo-1724155331840-263a0454d8bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      ingredients,
      steps,
      points: 0,
      userVote: null,
      createdBy: users[CURRENT_USER_ID].name,
      createdByUserId: CURRENT_USER_ID,
      comments: []
    };
    
    fetch("http://localhost:3001/drinks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDrink)
    });
    alert('¡Trago creado con éxito!');
    navigate('/mis-tragos');
  };

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
          <h1 className="text-foreground">Crear un trago</h1>
        </div>
        
        <button 
          onClick={() => navigate(`/perfil/${CURRENT_USER_ID}`)}
          className="w-10 h-10 bg-primary flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <span className="text-white">{users[CURRENT_USER_ID].avatar}</span>
        </button>
      </header>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="h-full max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col p-6">
              <TabsList className="flex w-full bg-transparent border-b border-border">
                <TabsTrigger 
                  value="info" 
                  className="
                    flex-1 h-12 flex items-center justify-center gap-2 font-medium
                    border-b-2 border-transparent rounded-none text-foreground
                    hover:bg-primary/10 transition-colors

                    data-[state=active]:bg-primary
                    data-[state=active]:text-white
                    data-[state=active]:border-primary
                  "
                >
                  <Info size={16} />
                  Información
                </TabsTrigger>
                <TabsTrigger 
                  value="ingredients"
                  className="
                    flex-1 h-12 flex items-center justify-center gap-2 font-medium
                    border-b-2 border-transparent rounded-none text-foreground
                    hover:bg-primary/10 transition-colors

                    data-[state=active]:bg-primary
                    data-[state=active]:text-white
                    data-[state=active]:border-primary
                  "
                >
                  <Utensils size={16} />
                  Ingredientes ({ingredients.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="steps"
                  className="
                    flex-1 h-12 flex items-center justify-center gap-2 font-medium
                    border-b-2 border-transparent rounded-none text-foreground
                    hover:bg-primary/10 transition-colors

                    data-[state=active]:bg-primary
                    data-[state=active]:text-white
                    data-[state=active]:border-primary
                  "
                >
                  <List size={16} />
                  Pasos ({steps.length})
                </TabsTrigger>
              </TabsList>

              {/* Tab: Información Básica */}
              <TabsContent value="info" className="flex-1 overflow-y-auto mt-0">
                <div className="bg-card border border-border p-6">
                  <div className="space-y-4">
                    <h2 className="text-foreground">Información básica</h2>
                    <div>
                      <Label htmlFor="drink-name" className="text-foreground">Nombre del trago</Label>
                      <Input
                        id="drink-name"
                        value={drinkName}
                        onChange={(e) => setDrinkName(e.target.value)}
                        placeholder="Ej: Mojito Clásico"
                        required
                        className="bg-input-background border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-foreground">Descripción</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe tu trago..."
                        rows={4}
                        required
                        className="bg-input-background border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div>
                      <Label className="text-foreground">Categorías</Label>
                      <div className="mt-2 space-y-3">
                        {selectedCategories.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {selectedCategories.map(cat => (
                              <Badge 
                                key={cat}
                                className="bg-primary text-white px-3 py-1 flex items-center gap-2"
                              >
                                {cat}
                                <button
                                  type="button"
                                  onClick={() => removeCategory(cat)}
                                  className="hover:opacity-70"
                                >
                                  <X size={14} />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <Select
                          value=""
                          onValueChange={toggleCategory}
                        >
                          <SelectTrigger className="bg-input-background border-border text-foreground">
                            <SelectValue placeholder="Selecciona categorías" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {categories.map(cat => (
                              <SelectItem 
                                key={cat} 
                                value={cat} 
                                className="text-foreground hover:bg-secondary"
                                disabled={selectedCategories.includes(cat)}
                              >
                                {cat} {selectedCategories.includes(cat) ? '✓' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="creation-date" className="text-foreground">Fecha de creación</Label>
                      <Input
                        id="creation-date"
                        type="date"
                        value={creationDate}
                        disabled
                        className="bg-input-background border-border text-muted-foreground"
                      />
                    </div>

                    <div>
                      <Label htmlFor="main-image" className="text-foreground">Imagen principal (opcional)</Label>
                      <div className="mt-2">
                        {mainImagePreview ? (
                          <div className="relative">
                            <img
                              src={mainImagePreview}
                              alt="Preview"
                              className="w-full h-64 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setMainImage(null);
                                setMainImagePreview(null);
                              }}
                              className="absolute top-2 right-2 p-2 bg-destructive text-white hover:bg-destructive/90"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor="main-image"
                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border cursor-pointer hover:bg-secondary/50"
                          >
                            <Upload className="text-muted-foreground mb-2" size={32} />
                            <span className="text-muted-foreground">Subir imagen</span>
                            <input
                              id="main-image"
                              type="file"
                              accept="image/*"
                              onChange={handleMainImageChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        type="button"
                        onClick={() => setActiveTab('ingredients')}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        Siguiente: Ingredientes
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Tab: Ingredientes */}
              <TabsContent value="ingredients" className="flex-1 overflow-y-auto mt-0">
                <div className="bg-card border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-foreground">Ingredientes</h2>
                    <Button
                      type="button"
                      onClick={addIngredient}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 border-border hover:bg-secondary"
                    >
                      <Plus size={16} />
                      Agregar ingrediente
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {ingredients.map((ingredient) => (
                      <div key={ingredient.id} className="flex items-end gap-3">
                        <div className="flex-1">
                          <Label htmlFor={`ingredient-name-${ingredient.id}`} className="text-foreground">Nombre</Label>
                          <IngredientAutocomplete
                            id={`ingredient-name-${ingredient.id}`}
                            value={ingredient.name}
                            onChange={(value) => updateIngredient(ingredient.id, 'name', value)}
                            placeholder="Ej: Ron blanco"
                            required
                          />
                        </div>
                        
                        <div className="w-32">
                          <Label htmlFor={`ingredient-quantity-${ingredient.id}`} className="text-foreground">Cantidad</Label>
                          <Input
                            id={`ingredient-quantity-${ingredient.id}`}
                            value={ingredient.quantity}
                            onChange={(e) => updateIngredient(ingredient.id, 'quantity', e.target.value)}
                            placeholder="60"
                            required
                            className="bg-input-background border-border text-foreground"
                          />
                        </div>
                        
                        <div className="w-32">
                          <Label htmlFor={`ingredient-unit-${ingredient.id}`} className="text-foreground">Unidad</Label>
                          <Select
                            value={ingredient.unit}
                            onValueChange={(value: string) => updateIngredient(ingredient.id, 'unit', value)}
                          >
                            <SelectTrigger id={`ingredient-unit-${ingredient.id}`} className="bg-input-background border-border text-foreground">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                              <SelectItem value="gr" className="text-foreground hover:bg-secondary">gr</SelectItem>
                              <SelectItem value="ml" className="text-foreground hover:bg-secondary">ml</SelectItem>
                              <SelectItem value="cc" className="text-foreground hover:bg-secondary">cc</SelectItem>
                              <SelectItem value="cdita" className="text-foreground hover:bg-secondary">cdita</SelectItem>
                              <SelectItem value="taza" className="text-foreground hover:bg-secondary">taza</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Button
                          type="button"
                          onClick={() => removeIngredient(ingredient.id)}
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={ingredients.length === 1}
                        >
                          <X size={20} />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab('info')}
                      className="border-border hover:bg-secondary"
                    >
                      Anterior
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab('steps')}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Siguiente: Pasos
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Tab: Paso a paso */}
              <TabsContent value="steps" className="flex-1 overflow-y-auto mt-0">
                <div className="bg-card border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-foreground">Paso a paso</h2>
                    <Button
                      type="button"
                      onClick={addStep}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 border-border hover:bg-secondary"
                    >
                      <Plus size={16} />
                      Agregar paso
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {steps.map((step) => (
                      <div key={step.id} className="border border-border p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary text-white flex items-center justify-center">
                            {step.number}
                          </div>
                          
                          <div className="flex-1 space-y-3">
                            <div>
                              <Label htmlFor={`step-description-${step.id}`} className="text-foreground">Descripción del paso</Label>
                              <Textarea
                                id={`step-description-${step.id}`}
                                value={step.description}
                                onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                                placeholder="Describe este paso..."
                                rows={3}
                                required
                                className="bg-input-background border-border text-foreground placeholder:text-muted-foreground"
                              />
                            </div>

                            <div>
                              <Label htmlFor={`step-image-${step.id}`} className="text-foreground">Imagen del paso (opcional)</Label>
                              <div className="mt-2">
                                {step.imagePreview ? (
                                  <div className="relative">
                                    <img
                                      src={step.imagePreview}
                                      alt={`Paso ${step.number}`}
                                      className="w-full h-48 object-cover"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSteps(steps.map(s => 
                                          s.id === step.id ? { ...s, image: null, imagePreview: null } : s
                                        ));
                                      }}
                                      className="absolute top-2 right-2 p-2 bg-destructive text-white hover:bg-destructive/90"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                ) : (
                                  <label
                                    htmlFor={`step-image-${step.id}`}
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border cursor-pointer hover:bg-secondary/50"
                                  >
                                    <Upload className="text-muted-foreground mb-2" size={24} />
                                    <span className="text-muted-foreground">Subir imagen del paso</span>
                                    <input
                                      id={`step-image-${step.id}`}
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleStepImageChange(step.id, e)}
                                      className="hidden"
                                    />
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>

                          <Button
                            type="button"
                            onClick={() => removeStep(step.id)}
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                            disabled={steps.length === 1}
                          >
                            <X size={20} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab('ingredients')}
                      className="border-border hover:bg-secondary"
                    >
                      Anterior
                    </Button>
                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => navigate(-1)} className="border-border hover:bg-secondary">
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                        Crear trago
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </div>
      </div>
    </div>
  );
}
