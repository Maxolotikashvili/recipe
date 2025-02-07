import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { AddNewRecipeComponent } from './add-new/add-new-recipe.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },

    {
        path: 'favourites',
        component: FavouritesComponent
    },

    {
        path: 'recipe-details/:id',
        component: RecipeDetailsComponent 
    },

    {
        path: 'add-new-recipe',
        component: AddNewRecipeComponent
    },

    {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];
