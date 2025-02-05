export interface Recipe {
    id: string,
    title: string,
    description: string,
    category: RecipeCategory,
    type: RecipeType,
    ingredients: string[],
    instructions: string[],
    cookingTime: string,
    difficulty: RecipeDifficulty,
    servings: string,
    cuisine: string,
    isFavourite: boolean,
    dietType: RecipeDietType,
    nutrition: Nutrition,
    imageUrl: string
}

export type RecipeType = 'street' | 'pasta & noodles' | 'baked dishes' | 'barbecue' | 'seafood' | 'soup' | 'fried dishes' | 'dumplings';
export type RecipeDietType = 'vegetarian' | 'vegan' | 'none';
export type RecipeDifficulty = 'easy' | 'medium' | 'hard';
export type RecipeCategory = 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'versatile';

export interface Nutrition {
    calories: number,
    protein: number,
    fat: number
}
