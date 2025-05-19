import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClientService } from './client.service';
import { CreditService } from './credit.service';
import { Credit, CreditStatus, CreditType } from '../models/credit.model';

export interface CreditStats {
  totalCredits: number;
  acceptedCredits: number;
  rejectedCredits: number;
  inProgressCredits: number;
  totalAmount: number;
  averageAmount: number;
}

export interface CreditByTypeData {
  type: string;
  count: number;
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  
  constructor(
    private clientService: ClientService,
    private creditService: CreditService
  ) { }
  
  getStatistics(): Observable<{
    clientCount: number, 
    creditStats: CreditStats,
    creditsByType: CreditByTypeData[]
  }> {
    return forkJoin([
      this.clientService.getClients(),
      this.creditService.getCredits()
    ]).pipe(
      map(([clients, credits]) => {
        const acceptedCredits = credits.filter(c => c.status === CreditStatus.ACCEPTED);
        const rejectedCredits = credits.filter(c => c.status === CreditStatus.REJECTED);
        const inProgressCredits = credits.filter(c => c.status === CreditStatus.IN_PROGRESS);
        
        const totalAmount = credits.reduce((sum, credit) => sum + credit.amount, 0);
        const averageAmount = credits.length ? totalAmount / credits.length : 0;
        
        // Group credits by type
        const creditsByType: CreditByTypeData[] = Object.values(CreditType).map(type => {
          const filteredCredits = credits.filter(c => c.type === type);
          return {
            type,
            count: filteredCredits.length,
            totalAmount: filteredCredits.reduce((sum, credit) => sum + credit.amount, 0)
          };
        });
        
        return {
          clientCount: clients.length,
          creditStats: {
            totalCredits: credits.length,
            acceptedCredits: acceptedCredits.length,
            rejectedCredits: rejectedCredits.length,
            inProgressCredits: inProgressCredits.length,
            totalAmount,
            averageAmount
          },
          creditsByType
        };
      })
    );
  }
}
