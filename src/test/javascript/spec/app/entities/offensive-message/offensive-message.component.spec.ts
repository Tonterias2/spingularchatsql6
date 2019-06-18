/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Spingularchatsql6TestModule } from '../../../test.module';
import { OffensiveMessageComponent } from 'app/entities/offensive-message/offensive-message.component';
import { OffensiveMessageService } from 'app/entities/offensive-message/offensive-message.service';
import { OffensiveMessage } from 'app/shared/model/offensive-message.model';

describe('Component Tests', () => {
  describe('OffensiveMessage Management Component', () => {
    let comp: OffensiveMessageComponent;
    let fixture: ComponentFixture<OffensiveMessageComponent>;
    let service: OffensiveMessageService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Spingularchatsql6TestModule],
        declarations: [OffensiveMessageComponent],
        providers: []
      })
        .overrideTemplate(OffensiveMessageComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OffensiveMessageComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OffensiveMessageService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new OffensiveMessage(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.offensiveMessages[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
