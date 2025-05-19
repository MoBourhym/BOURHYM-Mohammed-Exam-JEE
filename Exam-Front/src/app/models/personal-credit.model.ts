import { Credit, CreditStatus } from './credit.model';

export class PersonalCredit extends Credit {
  type: string = 'PERSONAL';
  motif: string;
  
  constructor(data: any) {
    super();
    Object.assign(this, data);
  }
}
