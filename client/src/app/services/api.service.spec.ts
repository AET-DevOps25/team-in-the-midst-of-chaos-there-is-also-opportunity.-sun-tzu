import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { ErrorType } from '../interfaces';
import { NotFoundType } from '../enums';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle successful GET request', () => {
    const mockData = { message: 'Success' };
    service.get('/test').subscribe(response => {
      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.data).toEqual(mockData);
      }
    });

    const req = httpMock.expectOne('/api/test');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should handle error GET request', () => {
    const mockError: { statusCode: number; message: ErrorType } = {
      statusCode: 404,
      message: NotFoundType.RadioNotFound,
    };
    service.get('/test').subscribe(response => {
      expect(response.success).toBe(false);
      if (!response.success) {
        expect(response.error).toBe(NotFoundType.RadioNotFound);
      }
    });

    const req = httpMock.expectOne('/api/test');
    expect(req.request.method).toBe('GET');
    req.flush(mockError, { status: 404, statusText: 'Not Found' });
  });
});
