import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CountriesService } from '../services/countries.service';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';
import { identity, map, Subject, takeUntil, tap } from 'rxjs';
import { notEmptyArrayValidator } from '../curstom-validators/empty-array.validator';
import { RecipeComponent } from "../recipe/recipe.component";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-new-recipe',
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, RecipeComponent],
  templateUrl: './add-new-recipe.component.html',
  styleUrl: './add-new-recipe.component.scss'
})
export class AddNewRecipeComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private countriesService = inject(CountriesService);
  private recipeService = inject(RecipeService);

  private destroy$: Subject<void> = new Subject();
  public recipesList: Recipe[] = [];
  public newRecipeId!: number;
  private existingRecipe!: Recipe | null;
  public recipeForm!: FormGroup;
  public isFormCreated!: boolean;
  public countriesList: { name: string, abbr: string }[] = [];
  public errorMessage: string = '';
  public previewImage: string | ArrayBuffer | null = null;
  public newRecipeMessage: string = '';

  // Form getters
  public get image() {
    return this.recipeForm.get('image');
  }

  public get description() {
    return this.recipeForm.get('description');
  }

  public get title() {
    return this.recipeForm.get('title');
  }

  public get category() {
    return this.recipeForm.get('category');
  }

  public get type() {
    return this.recipeForm.get('type');
  }

  public get cookingTime() {
    return this.recipeForm.get('cookingTime');
  }

  public get difficulty() {
    return this.recipeForm.get('difficulty');
  }

  public get cuisine() {
    return this.recipeForm.get('cuisine');
  }

  public get servings() {
    return this.recipeForm.get('servings');
  }

  public get dietOption() {
    return this.recipeForm.get('dietOption');
  }

  public get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  public get instructions() {
    return this.recipeForm.get('instructions') as FormArray;
  }

  public get calories() {
    return this.recipeForm.get('calories');
  }

  public get fat() {
    return this.recipeForm.get('fat');
  }

  public get protein() {
    return this.recipeForm.get('protein');
  }

  constructor() { }

  ngOnInit(): void {
    this.getAllRecipes();
    this.getCountriesList();
  }

  public getAllRecipes() {
    this.recipeService.getAllRecipes().pipe(
      tap((recipesList) => this.newRecipeId = recipesList.length + 1),
      map((recipesList) => recipesList.filter((recipe) => recipe.isUserCreated)),
      takeUntil(this.destroy$)
    ).subscribe((recipesList) => {
      this.recipesList = recipesList;
    })
  }

  public getCountriesList() {
    this.countriesList = this.countriesService.countries;
  }

  public initializeForm() {
    this.recipeForm = this.formBuilder.group({
      image: new FormControl(''),
      description: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      cookingTime: new FormControl('', Validators.required),
      difficulty: new FormControl('', Validators.required),
      servings: new FormControl('', Validators.required),
      dietOption: new FormControl('', Validators.required),
      cuisine: new FormControl(''),
      calorie: new FormControl(''),
      fat: new FormControl(''),
      protein: new FormControl(''),

      ingredients: this.formBuilder.array([], notEmptyArrayValidator()),
      instructions: this.formBuilder.array([], notEmptyArrayValidator())
    })
    this.isFormCreated = true;
  }

  addIngredient() {
    this.ingredients.push(new FormControl('', Validators.required));
  }

  addInstruction() {
    this.instructions.push(new FormControl('', Validators.required));
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  removeInstruction(index: number) {
    this.instructions.removeAt(index);
  }

  public onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Only JPEG, JPG, PNG and SVG images are allowed.';
        this.previewImage = null;
        return;
      }

      this.errorMessage = '';

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
        this.recipeForm.patchValue({ image: this.previewImage })
      };
      reader.readAsDataURL(file);
    }
  }

  public submitForm() {
    if (this.recipeForm.status === 'INVALID') return;

    if (this.existingRecipe) {
      this.updateRecipe()
      return;
    }

    const newRecipe: Recipe = {
      ...this.recipeForm.value,
      image: undefined,
      imageUrl: this.image,
      id: this.newRecipeId,
      nutrition: {
        calories: this.calories?.value,
        fat: this.fat?.value,
        protein: this.protein?.value,
      },
      isFavourite: false,
      isUserCreated: true
    }

    this.recipeService.addRecipe(newRecipe).pipe(takeUntil(this.destroy$)).subscribe({
      next: (newRecipe: Recipe) => {
        this.newRecipeMessage = 'Your new recipe has been created successfuly!';
        setTimeout(() => {
          this.newRecipeMessage = '';
        }, 3000);

        this.isFormCreated = false;
        this.recipesList.push(newRecipe);
      }
    });
  }

  public deleteRecipe(recipe: Recipe) {
    this.recipesList = this.recipesList.filter((recipes) => recipes.id !== recipe.id);
  }

  public editRecipe(recipe: Recipe) {
    if (this.recipeForm) {
      this.recipeForm.reset();
    } else {
      this.initializeForm();
    }
    this.previewImage = recipe.imageUrl!;

    this.recipeForm.patchValue({
      image: recipe.imageUrl,
      description: recipe.description,
      title: recipe.title,
      type: recipe.type,
      category: recipe.category,
      cookingTime: recipe.cookingTime,
      difficulty: recipe.difficulty,
      servings: recipe.servings,
      dietOption: recipe.dietType,
      calorie: recipe.nutrition?.calories,
      fat: recipe.nutrition?.fat,
      protein: recipe.nutrition?.protein,
      cuisine: recipe.cuisine
    })

    if (recipe.ingredients && recipe.ingredients.length > 0) {
      recipe.ingredients.forEach((ingredient: string) => {
        this.ingredients.push(new FormControl(ingredient, Validators.required));
      });
    }

    if (recipe.instructions && recipe.instructions.length > 0) {
      recipe.instructions.forEach((instruction: string) => {
        this.instructions.push(new FormControl(instruction, Validators.required));
      });
    }

    this.existingRecipe = recipe;
    this.isFormCreated = true;
  }


  public updateRecipe() {
    const updatedRecipe: Recipe = {
      ...this.existingRecipe,
      ...this.recipeForm.value,
      dietOption: undefined,
      dietType: this.dietOption?.value,
      image: undefined,
      calorie: undefined,
      fat: undefined,
      protein: undefined,
      countryFlag: this.countriesList.find((countries) => countries.name === this.cuisine?.value)?.abbr || '',
      nutrition: {
        fat: this.fat?.value || 0,
        protein: this.protein?.value || 0,
        calories: this.calories?.value || 0
      },
      imageUrl: this.image?.value
    };

    this.recipeService.editRecipe(updatedRecipe).subscribe({
      next: (newRecipe: Recipe) => {
        this.newRecipeMessage = 'Recipe updated successffuly!';
        const changedRecipeIndex = this.recipesList.indexOf(this.recipesList.find((recipes) => recipes.id === newRecipe.id)!);
        this.recipesList[changedRecipeIndex] = newRecipe;
        this.isFormCreated = false;
        this.recipeForm.reset();

        setTimeout(() => {
          this.newRecipeMessage = '';
        }, 3000);
      },

      error: (error: HttpErrorResponse) => {
        console.error(`Error editing recipe: ${error}`);
      },

      complete: () => {
        this.existingRecipe = null;
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
