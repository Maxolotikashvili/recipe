import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RecipeComponent } from '../recipe/recipe.component';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../services/recipe.service';
import { map, Subject, takeUntil } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-favourites',
 imports: [CommonModule, RecipeComponent],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.scss'
})
export class FavouritesComponent implements OnInit, OnDestroy {
  private recipeService = inject(RecipeService);
  
  private destroy$: Subject<void> = new Subject();
  public favouriteRecipesList: Recipe[] = [];

  constructor() {}
  
  ngOnInit(): void {
    this.getRecipes();
  }

  public getRecipes() {
    this.recipeService.getAllRecipes().pipe(takeUntil(this.destroy$), map((recipesList) => recipesList.filter((recipe) => recipe.isFavourite))).subscribe({
      next: (response: Recipe[]) => {
        this.favouriteRecipesList = response;
      },

      error: (error: HttpErrorResponse) => {
        console.error(`Error fetching favourite recipes: ${error}`);
      }
    });
  }

  public deleteRecipe(recipe: Recipe) {
    this.favouriteRecipesList = this.favouriteRecipesList.filter((recipes) => recipes.id !== recipe.id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
