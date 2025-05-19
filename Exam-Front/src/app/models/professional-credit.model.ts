import { Credit } from './credit.model';

export class ProfessionalCredit extends Credit {
  type: string = 'PROFESSIONAL';
  reason: string;
  companyName: string;
  
  constructor(data: any) {
    super();
    Object.assign(this, data);
  }
}
