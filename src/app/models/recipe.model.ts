export interface Recipe {
    id: string,
    title: string,
    description: string,
    category: RecipeCategory,
    type: RecipeType,
    ingredients: string[],
    instructions: string[],
    backgroundColor?: string,
    color?: string,
    cookingTime: number,
    difficulty: RecipeDifficulty,
    servings: string,
    cuisine?: string,
    countryFlag?: string,
    isFavourite: boolean,
    dietType: RecipeDietType,
    nutrition?: Nutrition,
    imageUrl?: string,
    isUserCreated?: boolean,
}

export type RecipeType = 'street' | 'pasta & noodles' | 'baked dishes' | 'barbecue' | 'seafood' | 'stew' | 'fried dishes' | 'dumplings' | 'versatile';
export type RecipeDietType = 'vegetarian' | 'vegan' | 'none';
export type RecipeDifficulty = 'easy' | 'medium' | 'hard';
export type RecipeCategory = 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'versatile';

export interface Nutrition {
    calories: number,
    protein: number,
    fat: number
}
