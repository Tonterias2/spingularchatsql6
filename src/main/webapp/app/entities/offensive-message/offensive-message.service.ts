import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IOffensiveMessage } from 'app/shared/model/offensive-message.model';

type EntityResponseType = HttpResponse<IOffensiveMessage>;
type EntityArrayResponseType = HttpResponse<IOffensiveMessage[]>;

@Injectable({ providedIn: 'root' })
export class OffensiveMessageService {
  public resourceUrl = SERVER_API_URL + 'api/offensive-messages';

  constructor(protected http: HttpClient) {}

  create(offensiveMessage: IOffensiveMessage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(offensiveMessage);
    return this.http
      .post<IOffensiveMessage>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(offensiveMessage: IOffensiveMessage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(offensiveMessage);
    return this.http
      .put<IOffensiveMessage>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOffensiveMessage>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOffensiveMessage[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(offensiveMessage: IOffensiveMessage): IOffensiveMessage {
    const copy: IOffensiveMessage = Object.assign({}, offensiveMessage, {
      creationDate:
        offensiveMessage.creationDate != null && offensiveMessage.creationDate.isValid() ? offensiveMessage.creationDate.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.creationDate = res.body.creationDate != null ? moment(res.body.creationDate) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((offensiveMessage: IOffensiveMessage) => {
        offensiveMessage.creationDate = offensiveMessage.creationDate != null ? moment(offensiveMessage.creationDate) : null;
      });
    }
    return res;
  }
}
