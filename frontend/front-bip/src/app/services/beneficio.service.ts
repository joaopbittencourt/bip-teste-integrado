import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Beneficio } from '../models/beneficio.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BeneficioService {
  private baseUrl = `${environment.apiUrl}/beneficios`;

  constructor(private http: HttpClient) {}

  list(): Observable<Beneficio[]> {
    return this.http.get<Beneficio[]>(this.baseUrl);
  }

  create(beneficio: Partial<Beneficio>): Observable<Beneficio> {
    return this.http.post<Beneficio>(this.baseUrl, beneficio);
  }

  update(id: number | undefined, beneficio: Partial<Beneficio>): Observable<Beneficio> {
    return this.http.put<Beneficio>(`${this.baseUrl}/${id}`, beneficio);
  }

  // Transferir valor de um beneficio para outro. Payload: { fromId, toId, amount }
  transfer(fromId: number, toId: number, amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/transfer`, { fromId, toId, amount });
  }
}
