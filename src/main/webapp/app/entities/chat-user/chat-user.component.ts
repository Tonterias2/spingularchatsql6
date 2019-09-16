import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { IChatUser } from 'app/shared/model/chat-user.model';
import { AccountService } from 'app/core';
import { ChatUserService } from './chat-user.service';

@Component({
  selector: 'jhi-chat-user',
  templateUrl: './chat-user.component.html'
})
export class ChatUserComponent implements OnInit, OnDestroy {
  chatUsers: IChatUser[];
  currentAccount: any;
  eventSubscriber: Subscription;
  owner: any;
  isAdmin: boolean;

  constructor(
    protected chatUserService: ChatUserService,
    protected jhiAlertService: JhiAlertService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.chatUserService
      .query()
      .pipe(
        filter((res: HttpResponse<IChatUser[]>) => res.ok),
        map((res: HttpResponse<IChatUser[]>) => res.body)
      )
      .subscribe(
        (res: IChatUser[]) => {
          this.chatUsers = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
      this.owner = account.id;
      this.isAdmin = this.accountService.hasAnyAuthority(['ROLE_ADMIN']);
    });
    this.registerChangeInChatUsers();
  }

  myChatUser() {
    const query = {
      //          page: this.page - 1,
      //          size: this.itemsPerPage,
      //          sort: this.sort()
    };
    query['userId.equals'] = this.owner;
    this.chatUserService
      .query(query)
      .pipe(
        filter((res: HttpResponse<IChatUser[]>) => res.ok),
        map((res: HttpResponse<IChatUser[]>) => res.body)
      )
      .subscribe(
        (res: IChatUser[]) => {
          console.log('CONSOLOG: M:myChatUser & O: query : ', query);
          console.log('CONSOLOG: M:myChatUser & O: res : ', res);
          this.chatUsers = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    //      this.chatUserService
    //          .query(query)
    //          .subscribe(
    //              (res: HttpResponse<IChatUser[]>) => this.paginatePosts(res.body, res.headers),
    //              (res: HttpErrorResponse) => this.onError(res.message)
    //          );
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IChatUser) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  registerChangeInChatUsers() {
    this.eventSubscriber = this.eventManager.subscribe('chatUserListModification', response => this.loadAll());
  }

  //  protected paginatePosts(data: IChatUser[], headers: HttpHeaders) {
  //      this.links = this.parseLinks.parse(headers.get('link'));
  //      this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
  //      this.posts = data;
  //      //        console.log('CONSOLOG: M:ngOnInit & O: this.posts : ', this.posts);
  //  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
