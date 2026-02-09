import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly API = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getMyCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.API}/carts/users/cart`, { withCredentials: true });
  }

  getAllCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.API}/carts`, { withCredentials: true });
  }

  addProduct(productId: number, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.API}/carts/products/${productId}/${quantity}`, {}, { withCredentials: true });
  }

  updateQuantity(productId: number, operation: 'increase' | 'delete'): Observable<Cart> {
    return this.http.put<Cart>(`${this.API}/cart/products/${productId}/quantity/${operation}`, {}, { withCredentials: true });
  }

  removeProduct(cartId: number, productId: number): Observable<string> {
    return this.http.delete(`${this.API}/carts/${cartId}/product/${productId}`, { withCredentials: true, responseType: 'text' });
  }
}
