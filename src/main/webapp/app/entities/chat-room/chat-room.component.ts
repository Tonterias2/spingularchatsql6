import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { ITEMS_PER_PAGE } from 'app/shared';

import { AccountService } from 'app/core';

import { IChatRoom } from 'app/shared/model/chat-room.model';
import { ChatRoomService } from './chat-room.service';

import { IChatUser } from 'app/shared/model/chat-user.model';
import { ChatUserService } from 'app/entities/chat-user';

import { IChatRoomAllowedUser } from 'app/shared/model/chat-room-allowed-user.model';
import { ChatRoomAllowedUserService } from 'app/entities/chat-room-allowed-user/chat-room-allowed-user.service';

@Component({
  selector: 'jhi-chat-room',
  templateUrl: './chat-room.component.html'
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  currentAccount: any;
  chatRooms: IChatRoom[];
  chatUsers: IChatUser[];
  chatUser: IChatUser;
  chatRoomAllowedUsers: IChatRoomAllowedUser[];

  currentSearch: string;

  error: any;
  success: any;
  eventSubscriber: Subscription;
  routeData: any;
  links: any;
  totalItems: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;
  owner: any;
  isAdmin: boolean;

  arrayAux = [];
  arrayIds = [];

  constructor(
    protected chatRoomService: ChatRoomService,
    protected chatUserService: ChatUserService,
    protected chatRoomAllowedUserService: ChatRoomAllowedUserService,
    protected parseLinks: JhiParseLinks,
    protected jhiAlertService: JhiAlertService,
    protected accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: JhiDataUtils,
    protected router: Router,
    protected eventManager: JhiEventManager
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
    });
  }

  loadAll() {
    if (this.currentSearch) {
      const query = {
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort()
      };
      query['roomDescription.contains'] = this.currentSearch;
      query['queryParams'] = 1;
      this.chatRoomService.query(query).subscribe(
        (res: HttpResponse<IChatRoom[]>) => {
          this.chatRooms = res.body;
          //                  console.log('CONSOLOG: M:loadAll & O: this.chatRooms : ', this.chatRooms);
          const query2 = {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()
          };
          query2['roomName.contains'] = this.currentSearch;
          query2['queryParams'] = 1;
          this.chatRoomService.query(query2).subscribe(
            (res2: HttpResponse<IChatRoom[]>) => {
              //                              console.log('CONSOLOG: M:loadAll & O: res2.body : ', res2.body);
              this.chatRooms = this.filterArray(this.chatRooms.concat(res2.body));
              //                              console.log('CONSOLOG: M:loadAll & O: this.chatRooms : ', this.chatRooms);
            },
            (res2: HttpErrorResponse) => this.onError(res2.message)
          );
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
      return;
    }
    this.chatRoomService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe(
        (res: HttpResponse<IChatRoom[]>) => this.paginateChatRooms(res.body, res.headers),
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  private filterArray(chatRooms) {
    this.arrayAux = [];
    this.arrayIds = [];
    chatRooms.map(x => {
      if (this.arrayIds.length >= 1 && this.arrayIds.includes(x.id) === false) {
        this.arrayAux.push(x);
        this.arrayIds.push(x.id);
      } else if (this.arrayIds.length === 0) {
        this.arrayAux.push(x);
        this.arrayIds.push(x.id);
      }
    });
    //              console.log('CONSOLOG: M:filterInterests & O: this.follows : ', this.arrayIds, this.arrayAux);
    return this.arrayAux;
  }

  search(query) {
    if (!query) {
      return this.clear();
    }
    this.page = 0;
    this.currentSearch = query;
    this.router.navigate([
      '/chat-room',
      {
        search: this.currentSearch,
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    ]);
    this.loadAll();
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition() {
    this.router.navigate(['/chat-room'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    });
    this.loadAll();
  }

  clear() {
    this.page = 0;
    this.router.navigate([
      '/chat-room',
      {
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    ]);
    this.loadAll();
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
      this.owner = account.id;
      this.isAdmin = this.accountService.hasAnyAuthority(['ROLE_ADMIN']);
      const query = {};
      query['id.equals'] = this.currentAccount.id;
      //        console.log('CONSOLOG: M:ngOnInit & O: query : ', query);
      this.chatUserService.query(query).subscribe(
        (res: HttpResponse<IChatUser[]>) => {
          this.chatUser = res.body[0];
          //            console.log('CONSOLOG: M:ngOnInit & O: this.chatUser : ', this.chatuser);
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    });
    this.registerChangeInChatRooms();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IChatRoom) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  registerChangeInChatRooms() {
    this.eventSubscriber = this.eventManager.subscribe('chatRoomListModification', response => this.loadAll());
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  myChatRooms() {
    const query = {};
    if (this.currentAccount.id != null) {
      query['chatUserId.equals'] = this.chatUser.id;
      query['queryParams'] = 1;
    }
    this.chatRoomService.query(query).subscribe(
      //        (res: HttpResponse<IChatRoom[]>) => this.paginateChatRooms(res.body, res.headers),
      (res: HttpResponse<IChatRoom[]>) => {
        this.chatRooms = res.body;
        //              console.log('CONSOLOG: M:myChatRooms & O: query : ', query);
        //              console.log('CONSOLOG: M:myChatRooms & O: this.chatRooms : ', this.chatRooms);
        const query2 = {};
        query2['chatUserId.equals'] = this.chatUser.id;
        query2['bannedUser.equals'] = 'false';
        query2['queryParams'] = 1;
        this.chatRoomAllowedUserService.query(query2).subscribe(
          (res2: HttpResponse<IChatRoomAllowedUser[]>) => {
            //                        console.log('CONSOLOG: M:myChatRooms & O: query2 : ', query2);
            this.chatRoomAllowedUsers = res2.body;
            //                        console.log('CONSOLOG: M:myChatRooms & O: chatRoomAllowedUsers : ', this.chatRoomAllowedUsers);
            if (this.chatRoomAllowedUsers != null) {
              const arrayChatRoomAllowedUsers = [];
              this.chatRoomAllowedUsers.forEach(chatRoomAllowedUser => {
                //                                console.log('CONSOLOG: M:myChatRooms & O: arrayChatRoomAllowedUsers : ', arrayChatRoomAllowedUsers);
                arrayChatRoomAllowedUsers.push(chatRoomAllowedUser.chatRoomId);
              });
              const query3 = {};
              query3['id.in'] = arrayChatRoomAllowedUsers;
              this.chatRoomService.query(query3).subscribe(
                (res3: HttpResponse<IChatRoom[]>) => {
                  //                                        this.calbums = res.body;
                  this.chatRooms = this.filterArray(this.chatRooms.concat(res3.body));
                  //                                        console.log('CONSOLOG: M:myChatRoomsEND & O: this.chatRooms : ', this.chatRooms);
                },
                (res3: HttpErrorResponse) => this.onError(res3.message)
              );
            }
            //                        this.chatRooms = this.filterArray(this.chatRooms.concat(res2.body));
            //                        console.log('CONSOLOG: M:myChatRoomsPOST & O: this.chatRooms : ', this.chatRooms);
          },
          (res2: HttpErrorResponse) => this.onError(res2.message)
        );
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  protected paginateChatRooms(data: IChatRoom[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.chatRooms = data;
    //  console.log('CONSOLOG: M:paginateChatRooms & O: this.chatRooms : ', this.chatRooms);
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
