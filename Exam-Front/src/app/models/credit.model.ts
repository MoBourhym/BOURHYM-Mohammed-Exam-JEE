export enum CreditStatus {
  IN_PROGRESS = 'In Progress',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected'
}

export enum PropertyType {
  APARTMENT = 'Apartment',
  HOUSE = 'House',
  COMMERCIAL = 'Commercial'
}

export enum RepaymentType {
  MONTHLY = 'Monthly',
  EARLY = 'Early'
}

export abstract class Credit {
  id?: number;
  amount: number;
  duration: number;
  interestRate: number;
  startDate: Date;
  clientId: number;
  status: CreditStatus;
}
