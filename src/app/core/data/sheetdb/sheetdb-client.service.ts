import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface ApiError {
  timestamp: string;
  source: string;
  code: string;
  message: string;
  errors?: { field: string; message: string }[];
}

@Injectable({ providedIn: 'root' })
export class SheetdbClientService {
  private readonly BASE_URL = environment.sheetdbUrl;
  private readonly READ_KEY = environment.sheetdbReadKey;

  constructor(private http: HttpClient) {}

  /** GET all rows from a sheet tab */
  getAll<T>(sheet: string): Observable<T[]> {
    const params = new HttpParams()
      .set('sheet', sheet);
    return this.http.get<T[]>(`${this.BASE_URL}`, {
      params,
      headers: { Authorization: `Bearer ${this.READ_KEY}` }
    }).pipe(catchError(err => this.handleError(err, 'sheetdb')));
  }

  /** GET rows matching a field value */
  search<T>(sheet: string, field: string, value: string): Observable<T[]> {
    const params = new HttpParams()
      .set('sheet', sheet)
      .set(field, value);
    return this.http.get<T[]>(`${this.BASE_URL}/search`, {
      params,
      headers: { Authorization: `Bearer ${this.READ_KEY}` }
    }).pipe(
      map((res: any) => Array.isArray(res) ? res : []),
      catchError(err => this.handleError(err, 'sheetdb'))
    );
  }

  /** POST create a row */
  create<T>(sheet: string, data: Partial<T>): Observable<any> {
    return this.http.post(`${this.BASE_URL}`, { data: [data], sheet }, {
      headers: { Authorization: `Bearer ${this.READ_KEY}` }
    }).pipe(catchError(err => this.handleError(err, 'sheetdb')));
  }

  /** PATCH update rows where field = value */
  update<T>(sheet: string, field: string, value: string, data: Partial<T>): Observable<any> {
    const params = new HttpParams().set('sheet', sheet);
    return this.http.patch(`${this.BASE_URL}/${field}/${encodeURIComponent(value)}`, { data }, {
      params,
      headers: { Authorization: `Bearer ${this.READ_KEY}` }
    }).pipe(catchError(err => this.handleError(err, 'sheetdb')));
  }

  /** DELETE row where field = value */
  delete(sheet: string, field: string, value: string): Observable<any> {
    const params = new HttpParams().set('sheet', sheet);
    return this.http.delete(`${this.BASE_URL}/${field}/${encodeURIComponent(value)}`, {
      params,
      headers: { Authorization: `Bearer ${this.READ_KEY}` }
    }).pipe(catchError(err => this.handleError(err, 'sheetdb')));
  }

  private handleError(err: any, source: string): Observable<never> {
    const error: ApiError = {
      timestamp: new Date().toISOString(),
      source,
      code: err.status ? `HTTP_${err.status}` : 'UNKNOWN_ERROR',
      message: err.error?.message || err.message || 'An unexpected error occurred',
    };
    console.error(`[${source}] Error:`, error);
    return throwError(() => error);
  }
}
