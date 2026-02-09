import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CategoryResponse } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly API = 'http://localhost:5000/api/v1';

  constructor(private http: HttpClient) {}

  getAll(pageNumber = 0, pageSize = 50): Observable<CategoryResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<CategoryResponse>(`${this.API}/public/categories`, { params, withCredentials: true });
  }

  create(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.API}/public/categories`, category, { withCredentials: true });
  }

  update(categoryId: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.API}/admin/categories/${categoryId}`, category, { withCredentials: true });
  }

  delete(categoryId: number): Observable<Category> {
    return this.http.delete<Category>(`${this.API}/admin/categories/${categoryId}`, { withCredentials: true });
  }
}
