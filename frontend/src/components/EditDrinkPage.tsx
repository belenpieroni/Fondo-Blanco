import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronLeft, Plus, X, Upload, Info, Utensils, List, UtensilsCrossed, ListOrdered } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Ingredient, Step } from '../types/drink';
import { categories } from '../data/ingredients';
import { IngredientAutocomplete } from './IngredientAutocomplete';
import { drinkStorage } from '../data/drinkStorage';
import { CURRENT_USER_ID, users } from '../data/users';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"

export function EditDrinkPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [drinkName, setDrinkName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setSelectedCategories] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [creationDate, setCreationDate] = useState('');
  const allCategories = ["Cócteles", "Tragos largos", "Shots", "Sin alcohol", "Clásicos", "Tropicales", "Cremosos", "Refrescantes"]
  
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: '', quantity: '', unit: 'ml' }
  ]);
  
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', number: 1, description: '', image: null, imagePreview: null }
  ]);

  useEffect(() => {
  async function loadDrink() {
    if (!id) return;

    const drink = await drinkStorage.getById(id);

    if (drink && drink.createdByUserId === CURRENT_USER_ID) {
      setDrinkName(drink.name);
      setDescription(drink.description);
      setSelectedCategories(drink.categories);
      setMainImagePreview(drink.mainImage);
      setCreationDate(drink.creationDate);
      setIngredients(drink.ingredients);
      setSteps(drink.steps);
    } else {
      navigate('/mis-tragos');
    }
  }

  loadDrink();
}, [id, navigate]);


  const addIngredient = () => {
    const newId = (Math.max(...ingredients.map(i => parseInt(i.id)), 0) + 1).toString();
    setIngredients([...ingredients, { id: newId, name: '', quantity: '', unit: 'ml' }]);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(i => i.id !== id));
    }
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | undefined) => {
  const normalized = value ?? '';
  setIngredients(ingredients.map(i =>
    i.id === id ? { ...i, [field]: normalized } : i
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

  const updateStep = (id: string, field: keyof Step, value: string | undefined) => {
  const normalized = value ?? '';
  setSteps(steps.map(s =>
    s.id === id ? { ...s, [field]: normalized } : s
  ));
};

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      setSelectedCategories(categories.filter(c => c !== category));
    } else {
      setSelectedCategories([...categories, category]);
    }
  };
  const removeCategory = (category: string) => {
    setSelectedCategories(categories.filter(c => c !== category));
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
    
    if (!id) return;
    
    drinkStorage.update(id, {
      name: drinkName,
      description,
      categories,
      mainImage: mainImagePreview || '',
      ingredients,
      steps,
    });
    
    alert('¡Trago actualizado con éxito!');
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
          <h1 className="text-foreground">Editar trago</h1>
        </div>

        <button
          onClick={() => navigate(`/perfil/${CURRENT_USER_ID}`)}
          className="w-10 h-10 bg-primary flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <span className="text-white">{users[CURRENT_USER_ID].avatar}</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">

          {/* TABS */}
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

            {/* TAB: INFO */}
            <TabsContent value="info">
              <section className="bg-card border border-border p-6 space-y-6">
                <h2 className="text-foreground mb-4">Información básica</h2>

                {/* Nombre */}
                <div>
                  <Label htmlFor="drink-name" className="text-foreground">Nombre del trago</Label>
                  <Input
                    id="drink-name"
                    value={drinkName}
                    onChange={(e) => setDrinkName(e.target.value)}
                    placeholder="Ej: Mojito Clásico"
                    required
                  />
                </div>

                {/* Descripción */}
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe tu trago..."
                    rows={4}
                    required
                  />
                </div>

                {/* Categorías */}
                <div className="grid grid-cols-2 gap-4">

                  {/* Selección múltiple de categorías */}
                  <div>
                    <Label className="text-foreground">Categorías</Label>

                    <div className="mt-2 space-y-3">

                      {/* Badges de categorías seleccionadas */}
                      {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {categories.map(cat => (
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

                      {/* Selector para agregar nuevas categorías */}
                      <Select value="" onValueChange={toggleCategory}>
                        <SelectTrigger className="bg-input-background border-border text-foreground">
                          <SelectValue placeholder="Selecciona categorías" />
                        </SelectTrigger>

                        <SelectContent className="bg-card border-border">
                          {allCategories
                            .filter(cat => !categories.includes(cat)) // ← FILTRO REAL
                            .map(cat => (
                              <SelectItem 
                                key={cat}
                                value={cat}
                                className="text-foreground hover:bg-secondary"
                              >
                                {cat}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                    </div>
                  </div>
                </div>
                {/* Imagen principal */}
                <div>
                  <Label>Imagen principal</Label>
                  <div className="mt-2">
                    {mainImagePreview ? (
                      <div className="relative">
                        <img
                          src={mainImagePreview}
                          className="w-full h-64 object-cover"
                        />
                        <label
                          htmlFor="main-image"
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer"
                        >
                          <Upload size={32} />
                          <input
                            id="main-image"
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <label
                        htmlFor="main-image"
                        className="border-2 border-dashed h-40 flex items-center justify-center cursor-pointer"
                      >
                        <Upload className="mb-2" size={32} />
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
              </section>
            </TabsContent>

            {/* TAB: INGREDIENTES */}
            <TabsContent value="ingredients">
              <section className="bg-card border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-foreground">Ingredientes</h2>
                  <Button type="button" variant="outline" onClick={addIngredient}>
                    <Plus size={16} />
                    Agregar ingrediente
                  </Button>
                </div>

                <div className="space-y-3">
                  {ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="flex items-end gap-3">
                      <div className="flex-1">
                        <Label>Nombre</Label>
                        <IngredientAutocomplete
                          id={`ingredient-${ingredient.id}`}
                          value={ingredient.name}
                          onChange={(value) =>
                            updateIngredient(ingredient.id, 'name', value)
                          }
                          placeholder="Ej: Ron blanco"
                          required
                        />
                      </div>

                      <div className="w-32">
                        <Label>Cantidad</Label>
                        <Input
                          value={ingredient.quantity}
                          onChange={(e) =>
                            updateIngredient(ingredient.id, 'quantity', e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="w-32">
                        <Label>Unidad</Label>
                        <Select
                          value={ingredient.unit}
                          onValueChange={(value: string) =>
                            updateIngredient(ingredient.id, 'unit', value)
                          }
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gr">gr</SelectItem>
                            <SelectItem value="ml">ml</SelectItem>
                            <SelectItem value="cc">cc</SelectItem>
                            <SelectItem value="cdita">cdita</SelectItem>
                            <SelectItem value="taza">taza</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(ingredient.id)}
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
              </section>
            </TabsContent>

            {/* TAB: PASOS */}
            <TabsContent value="steps">
              <section className="bg-card border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-foreground">Paso a paso</h2>
                  <Button type="button" variant="outline" onClick={addStep}>
                    <Plus size={16} />
                    Agregar paso
                  </Button>
                </div>

                <div className="space-y-6">
                  {steps.map((step) => (
                    <div key={step.id} className="border border-border p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-primary text-white flex items-center justify-center">
                          {step.number}
                        </div>

                        <div className="flex-1 space-y-3">
                          <div>
                            <Label>Descripción del paso</Label>
                            <Textarea
                              value={step.description}
                              onChange={(e) =>
                                updateStep(step.id, 'description', e.target.value)
                              }
                              rows={3}
                              required
                            />
                          </div>

                          <div>
                            <Label>Imagen del paso (opcional)</Label>
                            {step.imagePreview ? (
                              <div className="relative">
                                <img
                                  src={step.imagePreview}
                                  className="w-full h-48 object-cover"
                                />
                                <label
                                  htmlFor={`step-image-${step.id}`}
                                  className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer"
                                >
                                  <Upload size={24} />
                                  <input
                                    id={`step-image-${step.id}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleStepImageChange(step.id, e)}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            ) : (
                              <label
                                htmlFor={`step-image-${step.id}`}
                                className="border-2 border-dashed w-full h-32 flex items-center justify-center cursor-pointer"
                              >
                                <Upload className="mb-2" size={24} />
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

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeStep(step.id)}
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
                </div>
              </section>
            </TabsContent>
          </Tabs>

          {/* Submit */}
          <div className="flex justify-end gap-4 mt-8">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Guardar cambios</Button>
          </div>

        </div>
      </div>
    </div>
  );
}
