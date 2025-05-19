import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credit, CreditStatus } from '../models/credit.model';
import { PersonalCredit } from '../models/personal-credit.model';
import { RealEstateCredit } from '../models/real-estate-credit.model';
import { ProfessionalCredit } from '../models/professional-credit.model';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private apiUrl = '/api/credits';

  constructor(private http: HttpClient) { }

  getCredits(): Observable<Credit[]> {
    return this.http.get<Credit[]>(this.apiUrl);
  }

  getCredit(id: number): Observable<Credit> {
    return this.http.get<Credit>(`${this.apiUrl}/${id}`);
  }

  getCreditsByClientId(clientId: number): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${this.apiUrl}/client/${clientId}`);
  }

  getCreditsByStatus(status: CreditStatus): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${this.apiUrl}/status/${status}`);
  }
  
  createPersonalCredit(credit: PersonalCredit): Observable<PersonalCredit> {
    return this.http.post<PersonalCredit>(`${this.apiUrl}/personal`, credit);
  }
  
  createRealEstateCredit(credit: RealEstateCredit): Observable<RealEstateCredit> {
    return this.http.post<RealEstateCredit>(`${this.apiUrl}/realestate`, credit);
  }
  
  createProfessionalCredit(credit: ProfessionalCredit): Observable<ProfessionalCredit> {
    return this.http.post<ProfessionalCredit>(`${this.apiUrl}/professional`, credit);
  }

  updateCreditStatus(id: number, status: CreditStatus): Observable<Credit> {
    return this.http.patch<Credit>(`${this.apiUrl}/${id}/status`, { status });
  }

  deleteCredit(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
