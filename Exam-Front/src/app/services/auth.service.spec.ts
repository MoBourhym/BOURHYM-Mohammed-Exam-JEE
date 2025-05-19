import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { ErrorService } from './error.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let errorService: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService, ErrorService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    errorService = TestBed.inject(ErrorService);
    
    // Clear localStorage before each test
    localStorage.removeItem('currentUser');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should authenticate user and store user details in localStorage', () => {
      const mockCredentials = {
        username: 'testuser',
        password: 'password'
      };

      const mockUser = {
        id: 1,
        username: 'testuser',
        token: 'fake-jwt-token'
      };

      service.login(mockCredentials.username, mockCredentials.password).subscribe(user => {
        expect(user).toEqual(mockUser);
        expect(service.currentUserValue).toEqual(mockUser);
        expect(localStorage.getItem('currentUser')).toEqual(JSON.stringify(mockUser));
        expect(service.isLoggedIn).toBeTrue();
      });

      const req = httpMock.expectOne('http://localhost:8085/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCredentials);
      req.flush(mockUser);
    });

    it('should handle login failure', () => {
      spyOn(errorService, 'handleError').and.callThrough();

      service.login('invaliduser', 'wrongpassword').subscribe({
        error: error => {
          expect(error).toBeTruthy();
          expect(errorService.handleError).toHaveBeenCalled();
          expect(localStorage.getItem('currentUser')).toBeNull();
          expect(service.isLoggedIn).toBeFalse();
        }
      });

      const req = httpMock.expectOne('http://localhost:8085/api/auth/login');
      req.flush('Invalid credentials', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should clear user from localStorage and navigate to login', () => {
      // Setup a logged in user
      const mockUser = {
        id: 1,
        username: 'testuser',
        token: 'fake-jwt-token'
      };
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      
      // Manually trigger the BehaviorSubject to have a current value
      service['currentUserSubject'].next(mockUser);
      
      // Create spy on router navigate
      const navigateSpy = spyOn(service['router'], 'navigate');
      
      expect(service.isLoggedIn).toBeTrue();
      
      // Call logout
      service.logout();
      
      // Verify the effects of logout
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(service.currentUserValue).toBeNull();
      expect(service.isLoggedIn).toBeFalse();
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('currentUserValue', () => {
    it('should return the current user value from the behavior subject', () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        token: 'fake-jwt-token'
      };
      
      service['currentUserSubject'].next(mockUser);
      
      expect(service.currentUserValue).toEqual(mockUser);
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when user is logged in', () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        token: 'fake-jwt-token'
      };
      
      service['currentUserSubject'].next(mockUser);
      
      expect(service.isLoggedIn).toBeTrue();
    });

    it('should return false when user is not logged in', () => {
      service['currentUserSubject'].next(null);
      
      expect(service.isLoggedIn).toBeFalse();
    });
  });
});
