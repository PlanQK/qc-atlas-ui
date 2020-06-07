/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Link } from '../models/link';
import { PagedModelEntityModelProblemTypeDto } from '../models/paged-model-entity-model-problem-type-dto';
import { ProblemTypeDto } from '../models/problem-type-dto';

@Injectable({
  providedIn: 'root',
})
export class ProblemTypeControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getProblemTypes1
   */
  static readonly GetProblemTypes1Path = '/problem-types/v1/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getProblemTypes1()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProblemTypes1$Response(params?: {
    page?: number;
    size?: number;

  }): Observable<StrictHttpResponse<PagedModelEntityModelProblemTypeDto>> {

    const rb = new RequestBuilder(this.rootUrl, ProblemTypeControllerService.GetProblemTypes1Path, 'get');
    if (params) {

      rb.query('page', params.page, {});
      rb.query('size', params.size, {});

    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/hal+json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PagedModelEntityModelProblemTypeDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getProblemTypes1$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProblemTypes1(params?: {
    page?: number;
    size?: number;

  }): Observable<PagedModelEntityModelProblemTypeDto> {

    return this.getProblemTypes1$Response(params).pipe(
      map((r: StrictHttpResponse<PagedModelEntityModelProblemTypeDto>) => r.body as PagedModelEntityModelProblemTypeDto)
    );
  }

  /**
   * Path part for operation createProblemType
   */
  static readonly CreateProblemTypePath = '/problem-types/v1/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createProblemType()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createProblemType$Response(params: {
      body: ProblemTypeDto
  }): Observable<StrictHttpResponse<{ 'id'?: string, 'name': string, 'parentProblemType'?: string, '_links'?: Array<Link> }>> {

    const rb = new RequestBuilder(this.rootUrl, ProblemTypeControllerService.CreateProblemTypePath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/hal+json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{ 'id'?: string, 'name': string, 'parentProblemType'?: string, '_links'?: Array<Link> }>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `createProblemType$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createProblemType(params: {
      body: ProblemTypeDto
  }): Observable<{ 'id'?: string, 'name': string, 'parentProblemType'?: string, '_links'?: Array<Link> }> {

    return this.createProblemType$Response(params).pipe(
      map((r: StrictHttpResponse<{ 'id'?: string, 'name': string, 'parentProblemType'?: string, '_links'?: Array<Link> }>) => r.body as { 'id'?: string, 'name': string, 'parentProblemType'?: string, '_links'?: Array<Link> })
    );
  }

  /**
   * Path part for operation getProblemTypeById
   */
  static readonly GetProblemTypeByIdPath = '/problem-types/v1/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getProblemTypeById()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProblemTypeById$Response(params: {
    id: string;

  }): Observable<StrictHttpResponse<{ 'id'?: string, 'name': string, 'parentProblemType'?: string, '_links'?: Array<Link> }>> {

    const rb = new RequestBuilder(this.rootUrl, ProblemTypeControllerService.GetProblemTypeByIdPath, 'get');
    if (params) {

      rb.path('id', params.id, {});

    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/hal+json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{ 'id'?: string, 'name': string, 'parentProblemType'?: string, '_links'?: Array<Link> }>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getProblemTypeById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProblemTypeById(params: {
    id: string;

  }): Observable<{ 'id'?: string, 'name': string, 'parentProblemType'?: string, '_links'?: Array<Link> }> {

    return this.getProblemTypeById$Response(params).pipe(
      map((r: StrictHttpResponse<{ 'id'?: string, 'name': string, 'parentProblemType'?: string, '_links'?: Array<Link> }>) => r.body as { 'id'?: string, 'name': string, 'parentProblemType'?: string, '_links'?: Array<Link> })
    );
  }

  /**
   * Path part for operation updateProblemType
   */
  static readonly UpdateProblemTypePath = '/problem-types/v1/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateProblemType()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateProblemType$Response(params: {
    id: string;
      body: ProblemTypeDto
  }): Observable<StrictHttpResponse<{ 'id'?: string, 'name': string, 'parentProblemType'?: string, '_links'?: Array<Link> }>> {

    const rb = new RequestBuilder(this.rootUrl, ProblemTypeControllerService.UpdateProblemTypePath, 'put');
    if (params) {

      rb.path('id', params.id, {});

      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/hal+json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{ 'id'?: string, 'name': string, 'parentProblemType'?: string, '_links'?: Array<Link> }>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateProblemType$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateProblemType(params: {
    id: string;
      body: ProblemTypeDto
  }): Observable<{ 'id'?: string, 'name': string, 'parentProblemType'?: string, '_links'?: Array<Link> }> {

    return this.updateProblemType$Response(params).pipe(
      map((r: StrictHttpResponse<{ 'id'?: string, 'name': string, 'parentProblemType'?: string, '_links'?: Array<Link> }>) => r.body as { 'id'?: string, 'name': string, 'parentProblemType'?: string, '_links'?: Array<Link> })
    );
  }

  /**
   * Path part for operation deleteProblemType
   */
  static readonly DeleteProblemTypePath = '/problem-types/v1/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteProblemType()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteProblemType$Response(params: {
    id: string;

  }): Observable<StrictHttpResponse<ProblemTypeDto>> {

    const rb = new RequestBuilder(this.rootUrl, ProblemTypeControllerService.DeleteProblemTypePath, 'delete');
    if (params) {

      rb.path('id', params.id, {});

    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/hal+json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ProblemTypeDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `deleteProblemType$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteProblemType(params: {
    id: string;

  }): Observable<ProblemTypeDto> {

    return this.deleteProblemType$Response(params).pipe(
      map((r: StrictHttpResponse<ProblemTypeDto>) => r.body as ProblemTypeDto)
    );
  }

}
