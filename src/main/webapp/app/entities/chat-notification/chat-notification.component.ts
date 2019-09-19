import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IChatNotification } from 'app/shared/model/chat-notification.model';
import { AccountService } from 'app/core';
import { ChatNotificationService } from './chat-notification.service';

@Component({
  selector: 'jhi-chat-notification',
  templateUrl: './chat-notification.component.html'
})
export class ChatNotificationComponent implements OnInit, OnDestroy {
  chatNotifications: IChatNotification[];
  currentAccount: any;
  eventSubscriber: Subscription;

  isAdmin: boolean;

  constructor(
    protected chatNotificationService: ChatNotificationService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.chatNotificationService
      .query()
      .pipe(
        filter((res: HttpResponse<IChatNotification[]>) => res.ok),
        map((res: HttpResponse<IChatNotification[]>) => res.body)
      )
      .subscribe(
        (res: IChatNotification[]) => {
          this.chatNotifications = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
      this.isAdmin = this.accountService.hasAnyAuthority(['ROLE_ADMIN']);
    });
    this.registerChangeInChatNotifications();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IChatNotification) {
    return item.id;
  }

  registerChangeInChatNotifications() {
    this.eventSubscriber = this.eventManager.subscribe('chatNotificationListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
