import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Recipe } from './model';

@Injectable()
export class RecipeService {
  private productsUrl = 'api/recipes';

  constructor(private http: HttpClient) { }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.productsUrl)
      .pipe(
        //tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getRecipe(_id: number): Observable<Recipe> {
    
    if(_id) {
      const url = `${this.productsUrl}/${_id}`;
      return this.http.get<Recipe>(url)
        .pipe(
          //tap(data => console.log('getProduct: ' + JSON.stringify(data))),
          catchError(this.handleError)
        );
    }
    return of(this.initializeProduct());
  }

  createRecipe(product: Recipe): Observable<Recipe> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    product._id = null;
    return this.http.post<Recipe>(this.productsUrl, product, { headers: headers })
      .pipe(
        //tap(data => console.log('createProduct: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteRecipe(_id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.productsUrl}/${_id}`;
    return this.http.delete<Recipe>(url, { headers: headers })
      .pipe(
        //tap(data => console.log('deleteProduct: ' + id)),
        catchError(this.handleError)
      );
  }

  updateRecipe(product: Recipe): Observable<Recipe> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.productsUrl}/${product._id}`;
    return this.http.put<Recipe>(url, product, { headers: headers })
      .pipe(
        //tap(() => console.log('updateProduct: ' + product._id)),
        // Return the product on an update
        map(() => product),
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  private initializeProduct(): Recipe {
    // Return an initialized object
    return {
      _id: 0,
      name:null,
      overview:null,
      ingrediants:[{ingrediantname:null}],
      steps:[{
        description: null,
        time:null,
        photo:null,
        photoData: null,
        video:null
      }]   
    };
  }
}
