import { Component, OnInit } from '@angular/core';
import { Recipe } from './model';
import { RecipeService } from './recipe.service';

@Component({
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  pageTitle = 'Recipe List';
  errorMessage = '';
 _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredProducts = this.listFilter ? this.performFilter(this.listFilter) : this.products;
  }

  filteredProducts: Recipe[] = [];
  products: Recipe[] = [];

  constructor(private productService: RecipeService) { }


  performFilter(filterBy: string): Recipe[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter((product: Recipe) =>
      product.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }
  ngOnInit(): void {
    this.productService.getRecipes().subscribe(
      products => {
        console.log(products);
        this.products = products;
        this.filteredProducts = this.products;
      },
      error => this.errorMessage = <any>error
    );
  }
}
