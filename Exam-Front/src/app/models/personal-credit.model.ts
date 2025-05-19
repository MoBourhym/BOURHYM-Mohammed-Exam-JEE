import { Credit, CreditStatus } from './credit.model';

export class PersonalCredit extends Credit {
  override type: string = 'PERSONAL';
  motif!: string;
  
  constructor(data: any) {
    super();
    Object.assign(this, data);
  }
}
