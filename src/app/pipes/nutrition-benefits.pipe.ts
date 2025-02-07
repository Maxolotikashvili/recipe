import { Pipe, PipeTransform } from '@angular/core';
import { Nutrition } from '../models/recipe.model';

@Pipe({
  name: 'nutritionBenefits',
  pure: true
})
export class NutritionBenefitsPipe implements PipeTransform {
  transform(nutrition: Nutrition): string[] {
    const benefits: string[] = [];
    if (nutrition.protein > 10) {
      benefits.push('Protein rich');
    }
    if (nutrition.fat < 10) {
      benefits.push('Low fat');
    }
    if (nutrition.calories < 400) {
      benefits.push('Low calorie');
    }
    if (nutrition.fat < 15 && nutrition.calories < 500) {
      benefits.push('Heart healthy');
    }
    if (nutrition.protein > 20 && nutrition.fat < 12) {
      benefits.push('Great for muscle growth');
    }
    if (nutrition.calories < 300 && nutrition.fat < 10 && nutrition.protein > 5) {
      benefits.push('Weight loss friendly');
    }

    return benefits;
  }
}
