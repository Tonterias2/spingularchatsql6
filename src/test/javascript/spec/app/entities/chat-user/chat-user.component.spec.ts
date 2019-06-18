/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Spingularchatsql6TestModule } from '../../../test.module';
import { ChatUserComponent } from 'app/entities/chat-user/chat-user.component';
import { ChatUserService } from 'app/entities/chat-user/chat-user.service';
import { ChatUser } from 'app/shared/model/chat-user.model';

describe('Component Tests', () => {
  describe('ChatUser Management Component', () => {
    let comp: ChatUserComponent;
    let fixture: ComponentFixture<ChatUserComponent>;
    let service: ChatUserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Spingularchatsql6TestModule],
        declarations: [ChatUserComponent],
        providers: []
      })
        .overrideTemplate(ChatUserComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ChatUserComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ChatUserService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ChatUser(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.chatUsers[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
