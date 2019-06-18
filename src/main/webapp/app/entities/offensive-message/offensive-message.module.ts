import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { Spingularchatsql6SharedModule } from 'app/shared';
import {
  OffensiveMessageComponent,
  OffensiveMessageDetailComponent,
  OffensiveMessageUpdateComponent,
  OffensiveMessageDeletePopupComponent,
  OffensiveMessageDeleteDialogComponent,
  offensiveMessageRoute,
  offensiveMessagePopupRoute
} from './';

const ENTITY_STATES = [...offensiveMessageRoute, ...offensiveMessagePopupRoute];

@NgModule({
  imports: [Spingularchatsql6SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    OffensiveMessageComponent,
    OffensiveMessageDetailComponent,
    OffensiveMessageUpdateComponent,
    OffensiveMessageDeleteDialogComponent,
    OffensiveMessageDeletePopupComponent
  ],
  entryComponents: [
    OffensiveMessageComponent,
    OffensiveMessageUpdateComponent,
    OffensiveMessageDeleteDialogComponent,
    OffensiveMessageDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Spingularchatsql6OffensiveMessageModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
