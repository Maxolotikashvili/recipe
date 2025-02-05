import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Recipe } from './models/recipe.model';
import { RecipeService } from './services/recipe.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'recipe';

  private recipeService = inject(RecipeService);

  public recipes$!: Observable<Recipe[]>;

  constructor() {
    this.recipeService.getAllRecipes().subscribe((res) => {
      console.log(res);
    })  
  }
}
