import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateMomentAdapter } from './util/datepicker-adapter';

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Spingularchatsql6SharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective, ChatService } from './';

@NgModule({
  imports: [Spingularchatsql6SharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateMomentAdapter }, ChatService],
  entryComponents: [JhiLoginModalComponent],
  exports: [Spingularchatsql6SharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Spingularchatsql6SharedModule {
  static forRoot() {
    return {
      ngModule: Spingularchatsql6SharedModule
    };
  }
}
