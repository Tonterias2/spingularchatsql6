import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { Spingularchatsql6SharedModule } from 'app/shared';
import {
  ChatNotificationComponent,
  ChatNotificationDetailComponent,
  ChatNotificationUpdateComponent,
  ChatNotificationDeletePopupComponent,
  ChatNotificationDeleteDialogComponent,
  chatNotificationRoute,
  chatNotificationPopupRoute
} from './';

const ENTITY_STATES = [...chatNotificationRoute, ...chatNotificationPopupRoute];

@NgModule({
  imports: [Spingularchatsql6SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ChatNotificationComponent,
    ChatNotificationDetailComponent,
    ChatNotificationUpdateComponent,
    ChatNotificationDeleteDialogComponent,
    ChatNotificationDeletePopupComponent
  ],
  entryComponents: [
    ChatNotificationComponent,
    ChatNotificationUpdateComponent,
    ChatNotificationDeleteDialogComponent,
    ChatNotificationDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Spingularchatsql6ChatNotificationModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
