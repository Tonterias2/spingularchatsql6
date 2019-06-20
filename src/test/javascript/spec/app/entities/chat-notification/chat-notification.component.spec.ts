/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Spingularchatsql6TestModule } from '../../../test.module';
import { ChatNotificationComponent } from 'app/entities/chat-notification/chat-notification.component';
import { ChatNotificationService } from 'app/entities/chat-notification/chat-notification.service';
import { ChatNotification } from 'app/shared/model/chat-notification.model';

describe('Component Tests', () => {
  describe('ChatNotification Management Component', () => {
    let comp: ChatNotificationComponent;
    let fixture: ComponentFixture<ChatNotificationComponent>;
    let service: ChatNotificationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Spingularchatsql6TestModule],
        declarations: [ChatNotificationComponent],
        providers: []
      })
        .overrideTemplate(ChatNotificationComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ChatNotificationComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ChatNotificationService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ChatNotification(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.chatNotifications[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
