/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { QraphEdge } from '../models/qraph-edge';

@Injectable({
  providedIn: 'root',
})
export class QraphService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getQubitGraph
   */
  static readonly GetQubitGraphPath = '/qraph/qpus/{backendName}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getQubitGraph()` instead.
   *
   * This method doesn't expect any request body.
   */
  getQubitGraph$Response(params: {
    backendName: string;

  }): Observable<StrictHttpResponse<Array<QraphEdge>>> {

    const rb = new RequestBuilder(this.rootUrl, QraphService.GetQubitGraphPath, 'get');
    if (params) {

      rb.path('backendName', params.backendName, {});

    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/hal+json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<QraphEdge>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getQubitGraph$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getQubitGraph(params: {
    backendName: string;

  }): Observable<Array<QraphEdge>> {

    return this.getQubitGraph$Response(params).pipe(
      map((r: StrictHttpResponse<Array<QraphEdge>>) => r.body as Array<QraphEdge>)
    );
  }

}
