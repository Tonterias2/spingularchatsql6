import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { OffensiveMessage } from 'app/shared/model/offensive-message.model';
import { OffensiveMessageService } from './offensive-message.service';
import { OffensiveMessageComponent } from './offensive-message.component';
import { OffensiveMessageDetailComponent } from './offensive-message-detail.component';
import { OffensiveMessageUpdateComponent } from './offensive-message-update.component';
import { OffensiveMessageDeletePopupComponent } from './offensive-message-delete-dialog.component';
import { IOffensiveMessage } from 'app/shared/model/offensive-message.model';

@Injectable({ providedIn: 'root' })
export class OffensiveMessageResolve implements Resolve<IOffensiveMessage> {
  constructor(private service: OffensiveMessageService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IOffensiveMessage> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<OffensiveMessage>) => response.ok),
        map((offensiveMessage: HttpResponse<OffensiveMessage>) => offensiveMessage.body)
      );
    }
    return of(new OffensiveMessage());
  }
}

export const offensiveMessageRoute: Routes = [
  {
    path: '',
    component: OffensiveMessageComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'spingularchatsql6App.offensiveMessage.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: OffensiveMessageDetailComponent,
    resolve: {
      offensiveMessage: OffensiveMessageResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'spingularchatsql6App.offensiveMessage.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: OffensiveMessageUpdateComponent,
    resolve: {
      offensiveMessage: OffensiveMessageResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'spingularchatsql6App.offensiveMessage.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: OffensiveMessageUpdateComponent,
    resolve: {
      offensiveMessage: OffensiveMessageResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'spingularchatsql6App.offensiveMessage.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const offensiveMessagePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: OffensiveMessageDeletePopupComponent,
    resolve: {
      offensiveMessage: OffensiveMessageResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'spingularchatsql6App.offensiveMessage.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
