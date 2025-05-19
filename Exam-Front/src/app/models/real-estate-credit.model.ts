import { Credit, PropertyType } from './credit.model';

export class RealEstateCredit extends Credit {
  type: string = 'REAL_ESTATE';
  propertyType: PropertyType;
  
  constructor(data: any) {
    super();
    Object.assign(this, data);
  }
}
