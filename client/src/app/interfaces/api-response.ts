import { BadRequestType, ConflictType, NotFoundType } from '../enums'
import { Observable } from 'rxjs';

export type HttpRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
export type ErrorType = NotFoundType | ConflictType | BadRequestType;

// returned by the backend in case of error
export interface ErrorDto<Error extends ErrorType> {
  statusCode: number;
  message: Error;
}

/**
 * The following types can be used to extract the success and error types from the method signature.
 * This avoids having to write the same types twice while preserving type safety.
 * Example:
 * ```
 * getUserProfile(): Observable<ApiResponse<
 *   UserSelfViewDto,
 *   NotFoundType.PrinterFile | NotFoundType.User | ConflictType.TaskAlreadyScheduled
 * >> {
 *   type T = typeof this.getUserProfile
 *   const r = this.api.get<Success<T>, Error<T>>('/api/self/me')
 *   // r is inferred to the correct type; do stuff with it
 *   return r
 * }
 * ```
 */
export type Success<T> = T extends (...args: any[]) => Observable<ApiResponse<infer S, any>> ? S : never;
export type Error<T> = T extends (...args: any[]) => Observable<ApiResponse<any, infer E>> ? E : never;

interface HttpResponse {
  success: boolean;
}

export interface SuccessResponse<T> extends HttpResponse {
  success: true;
  data: T;
}

export interface ErrorResponse<T extends ErrorType> extends HttpResponse {
  success: false;
  error: T;
}

export type ApiResponse<Success, Error extends ErrorType = never> = SuccessResponse<Success> | ErrorResponse<Error>;
