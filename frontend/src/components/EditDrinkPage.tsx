import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronLeft, Plus, X, Upload } from 'lucide-react';
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

export function EditDrinkPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drinkName, setDrinkName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [creationDate, setCreationDate] = useState('');
  
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: '', quantity: '', unit: 'ml' }
  ]);
  
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', number: 1, description: '', image: null, imagePreview: null }
  ]);

  useEffect(() => {
  async function loadDrink() {
    if (!id) return;

    const drink = await drinkStorage.getById(id); // ⬅ AHORA SÍ ESPERAMOS LA PROMESA

    if (drink && drink.createdByUserId === CURRENT_USER_ID) {
      setDrinkName(drink.name);
      setDescription(drink.description);
      setCategory(drink.category);
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
      category,
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

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <section className="bg-card border border-border p-6">
              <h2 className="mb-6 text-foreground">Información básica</h2>
              
              <div className="space-y-4">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-foreground">Categoría</Label>
                    <Select
                      value={category}
                      onValueChange={setCategory}
                      required
                    >
                      <SelectTrigger id="category" className="bg-input-background border-border text-foreground">
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat} className="text-foreground hover:bg-secondary">{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                </div>

                <div>
                  <Label htmlFor="main-image" className="text-foreground">Imagen principal</Label>
                  <div className="mt-2">
                    {mainImagePreview ? (
                      <div className="relative">
                        <img
                          src={mainImagePreview}
                          alt="Preview"
                          className="w-full h-64 object-cover"
                        />
                        <label
                          htmlFor="main-image"
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Upload className="text-white" size={32} />
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
              </div>
            </section>

            {/* Ingredients */}
            <section className="bg-card border border-border p-6">
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
                        onValueChange={(value: string) => updateIngredient(ingredient.id, 'unit', value)
                        }

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
            </section>

            {/* Steps */}
            <section className="bg-card border border-border p-6">
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
                                <label
                                  htmlFor={`step-image-${step.id}`}
                                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                  <Upload className="text-white" size={24} />
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
            </section>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="border-border hover:bg-secondary">
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                Guardar cambios
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
