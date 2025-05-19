import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RepaymentService } from './repayment.service';
import { ErrorService } from './error.service';
import { Repayment, RepaymentStatus } from '../models/repayment.model';

describe('RepaymentService', () => {
  let service: RepaymentService;
  let httpMock: HttpTestingController;
  let errorService: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RepaymentService, ErrorService]
    });
    service = TestBed.inject(RepaymentService);
    httpMock = TestBed.inject(HttpTestingController);
    errorService = TestBed.inject(ErrorService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRepayments', () => {
    it('should return an Observable<Repayment[]>', () => {
      const mockRepayments: Repayment[] = [
        { 
          id: 1, 
          creditId: 1, 
          amount: 500, 
          dueDate: new Date(), 
          paymentDate: new Date(), 
          status: RepaymentStatus.PAID 
        },
        { 
          id: 2, 
          creditId: 1, 
          amount: 500, 
          dueDate: new Date(), 
          paymentDate: null, 
          status: RepaymentStatus.PENDING 
        }
      ];

      service.getRepayments().subscribe(repayments => {
        expect(repayments.length).toBe(2);
        expect(repayments).toEqual(mockRepayments);
      });

      const req = httpMock.expectOne('http://localhost:8085/api/repayments');
      expect(req.request.method).toBe('GET');
      req.flush(mockRepayments);
    });

    it('should handle errors when getting repayments fails', () => {
      spyOn(errorService, 'handleError').and.callThrough();

      service.getRepayments().subscribe({
        error: error => {
          expect(error).toBeTruthy();
          expect(errorService.handleError).toHaveBeenCalled();
        }
      });

      const req = httpMock.expectOne('http://localhost:8085/api/repayments');
      req.flush('Error occurred', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getRepaymentsByCreditId', () => {
    it('should return repayments for the specified credit', () => {
      const mockRepayments: Repayment[] = [
        { 
          id: 1, 
          creditId: 1, 
          amount: 500, 
          dueDate: new Date(), 
          paymentDate: new Date(), 
          status: RepaymentStatus.PAID 
        },
        { 
          id: 2, 
          creditId: 1, 
          amount: 500, 
          dueDate: new Date(), 
          paymentDate: null, 
          status: RepaymentStatus.PENDING 
        }
      ];

      service.getRepaymentsByCreditId(1).subscribe(repayments => {
        expect(repayments.length).toBe(2);
        expect(repayments).toEqual(mockRepayments);
      });

      const req = httpMock.expectOne('http://localhost:8085/api/repayments/credit/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockRepayments);
    });
  });

  describe('getRepayment', () => {
    it('should return the repayment with the specified id', () => {
      const mockRepayment: Repayment = { 
        id: 1, 
        creditId: 1, 
        amount: 500, 
        dueDate: new Date(), 
        paymentDate: new Date(), 
        status: RepaymentStatus.PAID 
      };

      service.getRepayment(1).subscribe(repayment => {
        expect(repayment).toEqual(mockRepayment);
      });

      const req = httpMock.expectOne('http://localhost:8085/api/repayments/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockRepayment);
    });
  });

  describe('createRepayment', () => {
    it('should create a new repayment', () => {
      const mockRepayment: Repayment = { 
        creditId: 1, 
        amount: 500, 
        dueDate: new Date(), 
        paymentDate: new Date(), 
        status: RepaymentStatus.PAID 
      };
      
      const mockResponse: Repayment = {
        id: 1,
        ...mockRepayment
      };

      service.createRepayment(mockRepayment).subscribe(repayment => {
        expect(repayment).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:8085/api/repayments');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRepayment);
      req.flush(mockResponse);
    });
  });

  describe('updateRepayment', () => {
    it('should update an existing repayment', () => {
      const mockRepayment: Repayment = { 
        id: 1,
        creditId: 1, 
        amount: 500, 
        dueDate: new Date(), 
        paymentDate: new Date(), 
        status: RepaymentStatus.PAID // Changed from PENDING to PAID
      };

      service.updateRepayment(mockRepayment).subscribe(repayment => {
        expect(repayment).toEqual(mockRepayment);
      });

      const req = httpMock.expectOne('http://localhost:8085/api/repayments/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockRepayment);
      req.flush(mockRepayment);
    });
  });

  describe('deleteRepayment', () => {
    it('should delete a repayment', () => {
      service.deleteRepayment(1).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('http://localhost:8085/api/repayments/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('makePayment', () => {
    it('should make a payment on a repayment', () => {
      const mockRepayment: Repayment = { 
        id: 1,
        creditId: 1, 
        amount: 500, 
        dueDate: new Date(), 
        paymentDate: new Date(), 
        status: RepaymentStatus.PAID 
      };

      service.makePayment(1).subscribe(repayment => {
        expect(repayment).toEqual(mockRepayment);
      });

      const req = httpMock.expectOne('http://localhost:8085/api/repayments/1/pay');
      expect(req.request.method).toBe('POST');
      req.flush(mockRepayment);
    });
  });
});
