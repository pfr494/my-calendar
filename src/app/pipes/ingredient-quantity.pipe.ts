import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ingredientQuantity'
})
export class IngredientQuantityPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
