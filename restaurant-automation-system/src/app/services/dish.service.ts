import { Injectable } from '@angular/core';
import { Dish } from '../models/dish';
import { Observable,throwError } from 'rxjs';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { baseUrl } from '../models/baseurl';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DishService {

  dishes: Dish[];
  index: number;

  constructor(private http: HttpClient) { }

  private errorHandler(Error: HttpErrorResponse) {
    if(Error.error instanceof ErrorEvent){
      // client side error 
      console.error(Error.error.message);
    } else {
      console.error(`Backend returned code:${Error.status} with message ${Error.error}`);
    }
    return throwError('Please Try again later');
  }

  setDishes(dishes:Dish[]){
    this.dishes = dishes;
  }

  getDishes(){
    return this.dishes;
  }

  getDishDetails(): Observable<Dish[]> {
    return this.http.get<Dish[]>(baseUrl + 'getDishDetails')
                    .pipe(catchError(this.errorHandler));
  }

  getCategories() {
    return this.http.get<any>(baseUrl + 'getCategories')
                    .pipe(catchError(this.errorHandler));
  }

  addNewDish(dish: Dish) {
    return this.http.post(baseUrl + 'manager/addNewDish',dish)
                    .pipe(catchError(this.errorHandler));
  }

  updateDishPrice(dish: Dish){
    return this.http.post(baseUrl + 'manager/changeDishPrice',dish)
                    .pipe(catchError(this.errorHandler));
  }
}
