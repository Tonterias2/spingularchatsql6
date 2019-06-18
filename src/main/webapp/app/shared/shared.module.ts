import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Spingularchatsql6SharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [Spingularchatsql6SharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
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
