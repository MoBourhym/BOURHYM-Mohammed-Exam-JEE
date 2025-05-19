import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Client } from '../models/client.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8085/api/clients';

  constructor(
    private http: HttpClient, 
    private errorService: ErrorService
  ) { }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }

  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${client.id}`, client)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }

  searchClientsByName(name: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/search?name=${name}`)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }
}
