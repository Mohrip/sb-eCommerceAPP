import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductResponse } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.API}/public/products`, { withCredentials: true });
  }

  getByCategory(categoryId: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.API}/public/categories/${categoryId}/products`, { withCredentials: true });
  }

  searchByKeyword(keyword: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.API}/public/products/keyword/${keyword}`, { withCredentials: true });
  }

  create(categoryId: number, product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.API}/admin/categories/${categoryId}/product`, product, { withCredentials: true });
  }

  update(productId: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.API}/admin/products/${productId}`, product, { withCredentials: true });
  }

  delete(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/admin/products/${productId}`, { withCredentials: true });
  }

  updateImage(productId: number, image: File): Observable<Product> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.put<Product>(`${this.API}/products/${productId}/image`, formData, { withCredentials: true });
  }
}
