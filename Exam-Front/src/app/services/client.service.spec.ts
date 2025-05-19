import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientService } from './client.service';
import { ErrorService } from './error.service';
import { Client } from '../models/client.model';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;
  let errorService: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientService, ErrorService]
    });
    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
    errorService = TestBed.inject(ErrorService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getClients', () => {
    it('should return an Observable<Client[]>', () => {
      const mockClients: Client[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '123456789', address: '123 Main St' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '987654321', address: '456 Oak St' }
      ];

      service.getClients().subscribe(clients => {
        expect(clients.length).toBe(2);
        expect(clients).toEqual(mockClients);
      });

      const req = httpMock.expectOne('http://localhost:8085/api/clients');
      expect(req.request.method).toBe('GET');
      req.flush(mockClients);
    });

    it('should handle errors when getting clients fails', () => {
      spyOn(errorService, 'handleError').and.callThrough();

      service.getClients().subscribe({
        error: error => {
          expect(error).toBeTruthy();
          expect(errorService.handleError).toHaveBeenCalled();
        }
      });

      const req = httpMock.expectOne('http://localhost:8085/api/clients');
      req.flush('Error occurred', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getClient', () => {
    it('should return the client with the specified id', () => {
      const mockClient: Client = { 
        id: 1, 
        firstName: 'John', 
        lastName: 'Doe', 
        email: 'john@example.com', 
        phone: '123456789', 
        address: '123 Main St' 
      };

      service.getClient(1).subscribe(client => {
        expect(client).toEqual(mockClient);
      });

      const req = httpMock.expectOne('http://localhost:8085/api/clients/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockClient);
    });
  });

  describe('createClient', () => {
    it('should create a new client', () => {
      const mockClient: Client = { 
        firstName: 'John', 
        lastName: 'Doe', 
        email: 'john@example.com', 
        phone: '123456789', 
        address: '123 Main St' 
      };
      
      const mockResponse: Client = {
        id: 1,
        ...mockClient
      };

      service.createClient(mockClient).subscribe(client => {
        expect(client).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:8085/api/clients');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockClient);
      req.flush(mockResponse);
    });
  });

  describe('updateClient', () => {
    it('should update an existing client', () => {
      const mockClient: Client = { 
        id: 1,
        firstName: 'John', 
        lastName: 'Doe', 
        email: 'john.updated@example.com', 
        phone: '123456789', 
        address: '123 Main St' 
      };

      service.updateClient(mockClient).subscribe(client => {
        expect(client).toEqual(mockClient);
      });

      const req = httpMock.expectOne('http://localhost:8085/api/clients/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockClient);
      req.flush(mockClient);
    });
  });

  describe('deleteClient', () => {
    it('should delete a client', () => {
      service.deleteClient(1).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('http://localhost:8085/api/clients/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});
