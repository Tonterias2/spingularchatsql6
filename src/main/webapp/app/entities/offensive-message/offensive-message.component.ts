import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IOffensiveMessage } from 'app/shared/model/offensive-message.model';
import { AccountService } from 'app/core';
import { OffensiveMessageService } from './offensive-message.service';

@Component({
  selector: 'jhi-offensive-message',
  templateUrl: './offensive-message.component.html'
})
export class OffensiveMessageComponent implements OnInit, OnDestroy {
  offensiveMessages: IOffensiveMessage[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected offensiveMessageService: OffensiveMessageService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.offensiveMessageService
      .query()
      .pipe(
        filter((res: HttpResponse<IOffensiveMessage[]>) => res.ok),
        map((res: HttpResponse<IOffensiveMessage[]>) => res.body)
      )
      .subscribe(
        (res: IOffensiveMessage[]) => {
          this.offensiveMessages = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInOffensiveMessages();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IOffensiveMessage) {
    return item.id;
  }

  registerChangeInOffensiveMessages() {
    this.eventSubscriber = this.eventManager.subscribe('offensiveMessageListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
