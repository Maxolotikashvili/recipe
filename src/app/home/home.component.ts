import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { faGear, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { RecipeComponent } from "../recipe/recipe.component";

@Component({
  selector: 'app-home',
  providers: [],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FontAwesomeModule, RecipeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private recipeService = inject(RecipeService)

  public icons = {
    magnifyingGlass: faMagnifyingGlass,
    filter: faGear,
  }
  public searchControl: FormControl = new FormControl('');
  public recipesList: Recipe[] = [];
  public filteredRecipesList: Recipe[] = [];
  private destroy$: Subject<void> = new Subject();

  constructor() { }

  ngOnInit(): void {
    this.getRecipes();
    this.filterRecipesBySearchInput();
  }

  public getRecipes() {
    this.recipeService.getAllRecipes().pipe(takeUntil(this.destroy$)).subscribe({
      next: (response: Recipe[]) => {
        this.recipesList = response;
        this.filteredRecipesList = response;
      },

      error: (error: HttpErrorResponse) => {
        console.error(`Error loading recipes: ${error}`);
      }
    });
  }

  public filterRecipesBySearchInput() {
    this.searchControl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((inputValue: string) => {
      const value = (inputValue || '').trim().toLowerCase();

      if (!value) {
        this.filteredRecipesList = this.recipesList;
        return;
      }

      this.filteredRecipesList = this.recipesList.filter((recipe) => recipe.title.toLowerCase().includes(value));
    })
  }

  public deleteRecipe(deletedRecipe: Recipe) {
    this.recipesList = this.recipesList.filter((recipe) => recipe.id !== deletedRecipe.id);
    this.filteredRecipesList = this.recipesList;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
