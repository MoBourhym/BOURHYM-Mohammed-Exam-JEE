import { RepaymentType } from './credit.model';

export interface Repayment {
  id?: number;
  date: Date;
  amount: number;
  type: RepaymentType;
  creditId: number;
}
