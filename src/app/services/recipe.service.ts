import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Recipe, RecipeDietType } from "../models/recipe.model";
import { HttpClient } from "@angular/common/http";
@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    private API_URL: string = `http://localhost:3000/recipes`;

    constructor(private http: HttpClient) { }

    public getAllRecipes(): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(this.API_URL).pipe(
            map((recipesList) => recipesList.map((recipe) => ({
                ...this.generateRandomBoxColor(recipe)
            })))
        );
    }

    private generateRandomBoxColor(recipe: Recipe): Recipe {
        const backgroundColorsList: string[] = ['#edf7d4', '#f9f0e3', '#fae6e8', '#f2e0c3', '#f9ecc9', '#f8d9fe', '#dcd9fe', '#d9eafe', '#d9fefa', '#d9fee2', '#f3fed9', '#fef1d9', '#fed9d9'];
        const colorsList: string[] = ['#d9ff7a', '#ffd393', '#ff7d8a', '#ecbd72', '#ffdb79', '#eb85ff', '#9a91ff', '#81bbff', '#83fff2', '#87ffa4', '#d9ff80', '#ffd17b', '#ff7c7c'];
        const randomColorIndex: number = Math.floor(Math.random() * backgroundColorsList.length);
    
        return {
            ...recipe,
            backgroundColor: backgroundColorsList[randomColorIndex],
            color: colorsList[randomColorIndex]
        };
    }

    public addRecipe(newRecipe: Recipe): Observable<Recipe> {
        return this.http.post<Recipe>(this.API_URL, newRecipe).pipe(map((recipe) => this.generateRandomBoxColor(recipe)));
    }

    public changeRecipe(id: Recipe['id']) {
        return this.http.patch(this.API_URL, id);
    }

    public editRecipe(recipe: Recipe) {
        return this.http.put<Recipe>(`${this.API_URL}/${recipe.id}`, recipe);
    }

    public deleteRecipe(id: Recipe['id']): Observable<Recipe> {
        return this.http.delete<Recipe>(`${this.API_URL}/${id}`);
    }

    public addOrRemoveRecipeFromFavourites(recipe: Recipe): Observable<Recipe> {
        return this.http.patch<Recipe>(`${this.API_URL}/${recipe.id}`, {isFavourite: !recipe.isFavourite});
    }
}