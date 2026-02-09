import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderRequest } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly API = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  placeOrder(paymentMethod: string, orderRequest: OrderRequest): Observable<Order> {
    return this.http.post<Order>(
      `${this.API}/order/users/payment/${paymentMethod}`,
      orderRequest,
      { withCredentials: true }
    );
  }
}
