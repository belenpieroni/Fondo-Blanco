export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

export interface Step {
  id: string;
  number: number;
  description: string;
  image: File | null;
  imagePreview: string | null;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  date: string;
  parentId?: string | null;
  replies?: Comment[];
}

export interface Drink {
  id: string;
  name: string;
  description: string;
  category: string;
  creationDate: string;
  mainImage: string;
  ingredients: Ingredient[];
  steps: Step[];
  points: number;
  userVote?: 'like' | 'dislike' | 'favorite' | null;
  createdBy: string;
  createdByUserId: string;
  comments: Comment[];
}
