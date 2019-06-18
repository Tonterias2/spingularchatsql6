/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Spingularchatsql6TestModule } from '../../../test.module';
import { OffensiveMessageUpdateComponent } from 'app/entities/offensive-message/offensive-message-update.component';
import { OffensiveMessageService } from 'app/entities/offensive-message/offensive-message.service';
import { OffensiveMessage } from 'app/shared/model/offensive-message.model';

describe('Component Tests', () => {
  describe('OffensiveMessage Management Update Component', () => {
    let comp: OffensiveMessageUpdateComponent;
    let fixture: ComponentFixture<OffensiveMessageUpdateComponent>;
    let service: OffensiveMessageService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Spingularchatsql6TestModule],
        declarations: [OffensiveMessageUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(OffensiveMessageUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OffensiveMessageUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OffensiveMessageService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new OffensiveMessage(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new OffensiveMessage();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
