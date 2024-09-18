import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { BudgetResponse } from './models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/budget';
  private budgetData$ = new BehaviorSubject<BudgetResponse | null>(null);

  constructor(private http: HttpClient) {}

  fetchBudgetData(): void {
    // Call service from backend only if the data is empty
    if (!this.budgetData$.getValue()) {
      console.log('Fetching data from backend');
      this.http.get<BudgetResponse>(this.apiUrl).subscribe((data: BudgetResponse) => {
        this.budgetData$.next(data);
      });
    } else {
      console.log('Data already available, no need to fetch from backend');
    }
  }
  getBudgetData(): Observable<BudgetResponse | null> {
    return this.budgetData$.asObservable();
  }
}
