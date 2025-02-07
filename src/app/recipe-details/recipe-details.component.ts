import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { map, Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { faBowlFood, faClock, faDumbbell, faGauge, faLeaf, faList, faUsers, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TimePipe } from '../pipes/time.pipe';

@Component({
  selector: 'app-recipe-details',
  imports: [CommonModule, FontAwesomeModule, TimePipe],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.scss'
})
export class RecipeDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);

  public recipe$!: Observable<Recipe>;

  public icons = {
    time: faClock,
    difficulty: faDumbbell,
    fork_knife: faUtensils,
    servings: faUsers,
    food: faBowlFood,
    vegan: faLeaf,
    nutrition: faGauge
  }

  constructor() {}

  ngOnInit(): void {
    this.getRecipe();
  }

  private getRecipe() {
    const recipeId = +this.route.snapshot.paramMap.get('id')!;

    if (recipeId) {
      this.recipe$ = this.recipeService.getAllRecipes().pipe(map((recipesList) => recipesList.find((recipe) => +  recipe.id === recipeId)!));
      this.recipe$.subscribe((item) => console.log(item))
    }
  }
}
