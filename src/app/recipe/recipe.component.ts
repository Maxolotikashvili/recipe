import { Component, EventEmitter, inject, Input, OnDestroy, output, Output } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock, faHeart, faPen } from '@fortawesome/free-solid-svg-icons';
import { faHeart as notFavourite } from '@fortawesome/free-regular-svg-icons';
import { TimePipe } from '../pipes/time.pipe';
import { NutritionBenefitsPipe } from '../pipes/nutrition-benefits.pipe';
import { RecipeService } from '../services/recipe.service';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-recipe',
  imports: [CommonModule, RouterModule, FontAwesomeModule, TimePipe, NutritionBenefitsPipe, MatButtonModule],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss'
})
export class RecipeComponent implements OnDestroy {
  @Input() recipe!: Recipe;
  @Input() isUserCreated!: boolean;
  @Output() recipeDeleted: EventEmitter<Recipe> = new EventEmitter<Recipe>();
  @Output() recipeEdited: EventEmitter<Recipe> = new EventEmitter<Recipe>();

  private recipeService = inject(RecipeService);

  public icons = {
    favourite: faHeart,
    notFavourite: notFavourite,
    time: faClock,
    edit: faPen
  }
  private destroy$: Subject<void> = new Subject();

  constructor() { }

  public addOrRemoveRecipeFromFavourites() {
    this.recipeService.addOrRemoveRecipeFromFavourites(this.recipe).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response: Recipe) => {
        this.recipe.isFavourite = response.isFavourite;
      },

      error: (error: HttpErrorResponse) => {
        console.error(`Error modifying favourite recipe: ${error}`);
      }
    })
  }

  public deleteRecipe() {
    this.recipeService.deleteRecipe(this.recipe.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.recipeDeleted.emit(this.recipe);
      },

      error: (error: HttpErrorResponse) => {
        console.error(`Error deleting recipe: ${error}`);
      }
    })
  }

  public editRecipe() {
    this.recipeEdited.emit(this.recipe);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
