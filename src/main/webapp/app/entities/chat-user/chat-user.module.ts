import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { Spingularchatsql6SharedModule } from 'app/shared';
import {
  ChatUserComponent,
  ChatUserDetailComponent,
  ChatUserUpdateComponent,
  ChatUserDeletePopupComponent,
  ChatUserDeleteDialogComponent,
  chatUserRoute,
  chatUserPopupRoute
} from './';

const ENTITY_STATES = [...chatUserRoute, ...chatUserPopupRoute];

@NgModule({
  imports: [Spingularchatsql6SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ChatUserComponent,
    ChatUserDetailComponent,
    ChatUserUpdateComponent,
    ChatUserDeleteDialogComponent,
    ChatUserDeletePopupComponent
  ],
  entryComponents: [ChatUserComponent, ChatUserUpdateComponent, ChatUserDeleteDialogComponent, ChatUserDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Spingularchatsql6ChatUserModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
