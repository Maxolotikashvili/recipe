import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Recipe } from "../models/recipe.model";
import { HttpClient } from "@angular/common/http";
import { v4 as uuidv4 } from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    private API_URL: string = `http://localhost:3000/data`;

    constructor(private http: HttpClient) { }

    public getAllRecipes(): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(this.API_URL).pipe(
            map((recipesList) => recipesList.map((recipe) => ({
                ...recipe, id: uuidv4()
            })))
        );
    }
}