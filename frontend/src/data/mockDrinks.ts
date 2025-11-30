import { Drink } from '../types/drink';

export const mockDrinks: Drink[] = [
  {
    id: '1',
    name: 'Mojito Clásico',
    description: 'Un refrescante cóctel cubano con menta, lima y ron blanco. Perfecto para el verano.',
    category: 'Cócteles',
    creationDate: '2025-11-29',
    mainImage: 'https://images.unsplash.com/photo-1724155331840-263a0454d8bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMG1vaml0byUyMGRyaW5rfGVufDF8fHx8MTc2NDQ0MzU1OHww&ixlib=rb-4.1.0&q=80&w=1080',
    ingredients: [
      { id: '1', name: 'Ron blanco', quantity: '60', unit: 'ml' },
      { id: '2', name: 'Menta', quantity: '10', unit: 'gr' },
      { id: '3', name: 'Lima', quantity: '1', unit: 'taza' },
    ],
    steps: [
      { id: '1', number: 1, description: 'Machacar la menta con azúcar', image: null, imagePreview: null },
    ],
    points: 127,
    createdBy: 'Carlos M.',
    createdByUserId: 'user2',
    comments: [
      { id: '1', userId: 'user3', userName: 'Laura P.', text: '¡Delicioso! Lo hice para una fiesta y fue un éxito.', date: '2025-11-29' },
    ]
  },
  {
    id: '2',
    name: 'Margarita Premium',
    description: 'La margarita perfecta con tequila reposado, cointreau y jugo de lima fresca.',
    category: 'Cócteles',
    creationDate: '2025-11-29',
    mainImage: 'https://images.unsplash.com/photo-1655546837806-76a6dd54ee2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnYXJpdGElMjBjb2NrdGFpbHxlbnwxfHx8fDE3NjQ0MzY5Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ingredients: [
      { id: '1', name: 'Tequila reposado', quantity: '50', unit: 'ml' },
      { id: '2', name: 'Cointreau', quantity: '30', unit: 'ml' },
    ],
    steps: [
      { id: '1', number: 1, description: 'Mezclar todos los ingredientes con hielo', image: null, imagePreview: null },
    ],
    points: 98,
    createdBy: 'Ana L.',
    createdByUserId: 'user3',
    comments: []
  },
  {
    id: '3',
    name: 'Negroni Italiano',
    description: 'Un clásico italiano amargo y aromático. Para los amantes de los sabores intensos.',
    category: 'Clásicos',
    creationDate: '2025-11-29',
    mainImage: 'https://images.unsplash.com/photo-1654677608880-51f63b5dee97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZWdyb25pJTIwY29ja3RhaWx8ZW58MXx8fHwxNzY0NDE1MzY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ingredients: [
      { id: '1', name: 'Gin', quantity: '30', unit: 'ml' },
      { id: '2', name: 'Campari', quantity: '30', unit: 'ml' },
      { id: '3', name: 'Vermouth rosso', quantity: '30', unit: 'ml' },
    ],
    steps: [
      { id: '1', number: 1, description: 'Mezclar partes iguales en vaso con hielo', image: null, imagePreview: null },
    ],
    points: 85,
    createdBy: 'Marco R.',
    createdByUserId: 'user4',
    comments: [
      { id: '1', userId: 'user1', userName: 'Usuario B.', text: 'Mi favorito absoluto, especialmente antes de cenar.', date: '2025-11-29' },
    ]
  },
  {
    id: '4',
    name: 'Espresso Martini',
    description: 'La combinación perfecta de café y vodka para una noche elegante.',
    category: 'Cócteles',
    creationDate: '2025-11-28',
    mainImage: 'https://images.unsplash.com/photo-1607687633950-c745bdb4da70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3ByZXNzbyUyMG1hcnRpbml8ZW58MXx8fHwxNzY0NDE1NjEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    ingredients: [
      { id: '1', name: 'Vodka', quantity: '50', unit: 'ml' },
      { id: '2', name: 'Licor de café', quantity: '30', unit: 'ml' },
      { id: '3', name: 'Espresso', quantity: '30', unit: 'ml' },
    ],
    steps: [
      { id: '1', number: 1, description: 'Agitar vigorosamente con hielo', image: null, imagePreview: null },
    ],
    points: 76,
    createdBy: 'Laura P.',
    createdByUserId: 'user5',
    comments: []
  },
  {
    id: '5',
    name: 'Piña Colada Tropical',
    description: 'El sabor del Caribe en un vaso. Cremoso, dulce y refrescante.',
    category: 'Tropicales',
    creationDate: '2025-11-28',
    mainImage: 'https://images.unsplash.com/photo-1697999549076-8da8e35ca507?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5hJTIwY29sYWRhJTIwdHJvcGljYWx8ZW58MXx8fHwxNzY0NDQzNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    ingredients: [
      { id: '1', name: 'Ron blanco', quantity: '60', unit: 'ml' },
      { id: '2', name: 'Crema de coco', quantity: '90', unit: 'ml' },
      { id: '3', name: 'Jugo de piña', quantity: '90', unit: 'ml' },
    ],
    steps: [
      { id: '1', number: 1, description: 'Licuar todos los ingredientes con hielo', image: null, imagePreview: null },
    ],
    points: 64,
    createdBy: 'Diego S.',
    createdByUserId: 'user1',
    comments: [
      { id: '1', userId: 'user2', userName: 'Carlos M.', text: 'El mejor para el verano, muy refrescante.', date: '2025-11-28' },
      { id: '2', userId: 'user1', userName: 'Usuario B.', text: 'Gracias por el comentario!', date: '2025-11-28' },
    ]
  },
  {
    id: '6',
    name: 'Old Fashioned',
    description: 'El cóctel de whiskey por excelencia. Elegante y atemporal.',
    category: 'Clásicos',
    creationDate: '2025-11-27',
    mainImage: 'https://images.unsplash.com/photo-1625563842947-982c9985831d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBmYXNoaW9uZWQlMjB3aGlza2V5fGVufDF8fHx8MTc2NDQ0MzU2MHww&ixlib=rb-4.1.0&q=80&w=1080',
    ingredients: [
      { id: '1', name: 'Bourbon', quantity: '60', unit: 'ml' },
      { id: '2', name: 'Azúcar', quantity: '1', unit: 'cdita' },
      { id: '3', name: 'Angostura bitters', quantity: '2', unit: 'cc' },
    ],
    steps: [
      { id: '1', number: 1, description: 'Disolver el azúcar con bitters', image: null, imagePreview: null },
    ],
    points: 52,
    createdBy: 'Roberto F.',
    createdByUserId: 'user1',
    comments: []
  },
];

// Usuario actual es "user1" (Usuario B.)
