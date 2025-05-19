import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreditService } from './credit.service';
import { ErrorService } from './error.service';
import { Credit, CreditStatus, CreditType } from '../models/credit.model';
import { PersonalCredit } from '../models/personal-credit.model';
import { RealEstateCredit } from '../models/real-estate-credit.model';
import { ProfessionalCredit } from '../models/professional-credit.model';

describe('CreditService', () => {
  let service: CreditService;
  let httpMock: HttpTestingController;
  let errorService: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CreditService, ErrorService]
    });
    service = TestBed.inject(CreditService);
    httpMock = TestBed.inject(HttpTestingController);
    errorService = TestBed.inject(ErrorService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCredits', () => {
    it('should return an Observable<Credit[]>', () => {
      const mockPersonalCredit: PersonalCredit = { 
        id: 1,
        clientId: 1,
        amount: 10000,
        term: 24,
        interestRate: 5.5,
        startDate: new Date(),
        endDate: new Date(),
        status: CreditStatus.ACTIVE,
        type: CreditType.PERSONAL,
        purpose: 'Home renovation'
      };

      const mockRealEstateCredit: RealEstateCredit = {
        id: 2,
        clientId: 2,
        amount: 200000,
        term: 360,
        interestRate: 3.25,
        startDate: new Date(),
        endDate: new Date(),
        status: CreditStatus.ACTIVE,
        type: CreditType.REAL_ESTATE,
        propertyAddress: '123 Main St',
        propertyValue: 250000
      };

      const mockCredits = [mockPersonalCredit, mockRealEstateCredit];

      service.getCredits().subscribe(credits => {
        expect(credits.length).toBe(2);
        expect(credits).toEqual(mockCredits);
      });

      const req = httpMock.expectOne('http://localhost:8085/api/credits');
      expect(req.request.method).toBe('GET');
      req.flush(mockCredits);
    });

    it('should handle errors when getting credits fails', () => {
      spyOn(errorService, 'handleError').and.callThrough();

      service.getCredits().subscribe({
        error: error => {
          expect(error).toBeTruthy();
          expect(errorService.handleError).toHaveBeenCalled();
        }
      });

      const req = httpMock.expectOne('http://localhost:8085/api/credits');
      req.flush('Error occurred', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getCredit', () => {
    it('should return the credit with the specified id', () => {
      const mockCredit: PersonalCredit = { 
        id: 1,
        clientId: 1,
        amount: 10000,
        term: 24,
        interestRate: 5.5,
        startDate: new Date(),
        endDate: new Date(),
        status: CreditStatus.ACTIVE,
        type: CreditType.PERSONAL,
        purpose: 'Home renovation'
      };

      service.getCredit(1).subscribe(credit => {
        expect(credit).toEqual(mockCredit);
      });

      const req = httpMock.expectOne('http://localhost:8085/api/credits/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockCredit);
    });
  });

  describe('createCredit', () => {
    it('should create a personal credit', () => {
      const mockCredit: PersonalCredit = {
        clientId: 1,
        amount: 10000,
        term: 24,
        interestRate: 5.5,
        startDate: new Date(),
        endDate: new Date(),
        status: CreditStatus.ACTIVE,
        type: CreditType.PERSONAL,
        purpose: 'Home renovation'
      };

      const mockResponse: PersonalCredit = {
        id: 1,
        ...mockCredit
      };

      service.createCredit(mockCredit).subscribe(credit => {
        expect(credit).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:8085/api/credits');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCredit);
      req.flush(mockResponse);
    });

    it('should create a real estate credit', () => {
      const mockCredit: RealEstateCredit = {
        clientId: 2,
        amount: 200000,
        term: 360,
        interestRate: 3.25,
        startDate: new Date(),
        endDate: new Date(),
        status: CreditStatus.ACTIVE,
        type: CreditType.REAL_ESTATE,
        propertyAddress: '123 Main St',
        propertyValue: 250000
      };

      const mockResponse: RealEstateCredit = {
        id: 2,
        ...mockCredit
      };

      service.createCredit(mockCredit).subscribe(credit => {
        expect(credit).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:8085/api/credits');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCredit);
      req.flush(mockResponse);
    });

    it('should create a professional credit', () => {
      const mockCredit: ProfessionalCredit = {
        clientId: 3,
        amount: 50000,
        term: 60,
        interestRate: 4.5,
        startDate: new Date(),
        endDate: new Date(),
        status: CreditStatus.ACTIVE,
        type: CreditType.PROFESSIONAL,
        businessName: 'ABC Corp',
        businessType: 'LLC'
      };

      const mockResponse: ProfessionalCredit = {
        id: 3,
        ...mockCredit
      };

      service.createCredit(mockCredit).subscribe(credit => {
        expect(credit).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:8085/api/credits');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCredit);
      req.flush(mockResponse);
    });
  });

  describe('updateCredit', () => {
    it('should update an existing credit', () => {
      const mockCredit: PersonalCredit = {
        id: 1,
        clientId: 1,
        amount: 12000, // Updated amount
        term: 24,
        interestRate: 5.5,
        startDate: new Date(),
        endDate: new Date(),
        status: CreditStatus.ACTIVE,
        type: CreditType.PERSONAL,
        purpose: 'Home renovation'
      };

      service.updateCredit(mockCredit).subscribe(credit => {
        expect(credit).toEqual(mockCredit);
      });

      const req = httpMock.expectOne('http://localhost:8085/api/credits/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockCredit);
      req.flush(mockCredit);
    });
  });

  describe('deleteCredit', () => {
    it('should delete a credit', () => {
      service.deleteCredit(1).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('http://localhost:8085/api/credits/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('getCreditsByClientId', () => {
    it('should return credits for the specified client', () => {
      const mockCredits: Credit[] = [
        { 
          id: 1,
          clientId: 1,
          amount: 10000,
          term: 24,
          interestRate: 5.5,
          startDate: new Date(),
          endDate: new Date(),
          status: CreditStatus.ACTIVE,
          type: CreditType.PERSONAL
        },
        { 
          id: 3,
          clientId: 1,
          amount: 5000,
          term: 12,
          interestRate: 6.0,
          startDate: new Date(),
          endDate: new Date(),
          status: CreditStatus.ACTIVE,
          type: CreditType.PERSONAL
        }
      ];

      service.getCreditsByClientId(1).subscribe(credits => {
        expect(credits.length).toBe(2);
        expect(credits).toEqual(mockCredits);
      });

      const req = httpMock.expectOne('http://localhost:8085/api/credits/client/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockCredits);
    });
  });
});
