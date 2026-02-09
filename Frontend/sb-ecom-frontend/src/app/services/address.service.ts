import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from '../models/address.model';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private readonly API = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.API}/addresses`, { withCredentials: true });
  }

  getById(addressId: number): Observable<Address> {
    return this.http.get<Address>(`${this.API}/addresses/${addressId}`, { withCredentials: true });
  }

  getMyAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.API}/users/addresses`, { withCredentials: true });
  }

  create(address: Partial<Address>): Observable<Address> {
    return this.http.post<Address>(`${this.API}/addresses`, address, { withCredentials: true });
  }

  update(addressId: number, address: Partial<Address>): Observable<Address> {
    return this.http.put<Address>(`${this.API}/addresses/${addressId}`, address, { withCredentials: true });
  }

  delete(addressId: number): Observable<string> {
    return this.http.delete(`${this.API}/addresses/${addressId}`, { withCredentials: true, responseType: 'text' });
  }
}
