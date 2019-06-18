/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Spingularchatsql6TestModule } from '../../../test.module';
import { OffensiveMessageDetailComponent } from 'app/entities/offensive-message/offensive-message-detail.component';
import { OffensiveMessage } from 'app/shared/model/offensive-message.model';

describe('Component Tests', () => {
  describe('OffensiveMessage Management Detail Component', () => {
    let comp: OffensiveMessageDetailComponent;
    let fixture: ComponentFixture<OffensiveMessageDetailComponent>;
    const route = ({ data: of({ offensiveMessage: new OffensiveMessage(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Spingularchatsql6TestModule],
        declarations: [OffensiveMessageDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(OffensiveMessageDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OffensiveMessageDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.offensiveMessage).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
