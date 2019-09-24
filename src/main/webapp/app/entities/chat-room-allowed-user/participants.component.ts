import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { AccountService } from 'app/core';
import { ITEMS_PER_PAGE } from 'app/shared';

import { IChatRoomAllowedUser } from 'app/shared/model/chat-room-allowed-user.model';
import { ChatRoomAllowedUserService } from './chat-room-allowed-user.service';

import { IChatUser } from 'app/shared/model/chat-user.model';
import { ChatUserService } from 'app/entities/chat-user';

import { IChatRoom } from 'app/shared/model/chat-room.model';
import { ChatRoomService } from 'app/entities/chat-room/chat-room.service';

@Component({
  selector: 'jhi-participants',
  templateUrl: './participants.component.html'
})
export class ParticipantsComponent implements OnInit, OnDestroy {
  currentAccount: any;
  chatRooms: IChatRoom[];
  chatRoom: IChatRoom;
  chatUser: IChatUser;
  chatRoomAllowedUsers: IChatRoomAllowedUser[];
  chatRoomAllowedUser: IChatRoomAllowedUser;
  bannedCRAUser: IChatRoomAllowedUser;
  allowedCRAUser: IChatRoomAllowedUser;

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

  nameParamFollows: any;
  valueParamFollows: any;
  userQuery: boolean;

  isParticipant: boolean;
  loggedChatUserOwns: boolean;
  chatRoomId: number;

  creationDate: string;

  constructor(
    protected chatRoomService: ChatRoomService,
    protected chatUserService: ChatUserService,
    protected chatRoomAllowedUserService: ChatRoomAllowedUserService,
    protected parseLinks: JhiParseLinks,
    protected jhiAlertService: JhiAlertService,
    protected accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
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
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.chatRoomIdEquals != null) {
        this.nameParamFollows = 'chatRoomId.equals';
        this.valueParamFollows = params.chatRoomIdEquals;
        this.userQuery = true;
      }
    });
  }

  loadAll() {
    const query = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort()
    };
    query[this.nameParamFollows] = this.valueParamFollows;
    this.chatRoomAllowedUserService
      .query(query)
      .subscribe(
        (res: HttpResponse<IChatRoomAllowedUser[]>) => this.paginateChatRoomAllowedUsers(res.body, res.headers),
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    //              console.log('CONSOLOG: M:loadAll & O: this.query : ', query);
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition() {
    this.router.navigate(['/chat-room-allowed-user'], {
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
      '/chat-room-allowed-user',
      {
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    ]);
    this.loadAll();
  }

  ngOnInit() {
    this.accountService.identity().then(account => {
      this.currentAccount = account;
      //          console.log( 'CONSOLOG: M:ngOnInit & O: this.currentAccount : ', this.currentAccount );
      this.chatLoggedUser();
      this.loadAll();
      this.isaParticipant();
    });
    this.registerChangeInChatRoomAllowedUsers();
  }

  private chatLoggedUser() {
    const query = {};
    query['userId.equals'] = this.currentAccount.id;
    //        console.log('CONSOLOG: M:ngOnInit & O: query : ', query);
    this.chatUserService.query(query).subscribe(
      (res: HttpResponse<IChatUser[]>) => {
        this.chatUser = res.body[0];
        //              console.log( 'CONSOLOG: M:ngOnInit & O: this.chatUser : ', this.chatUser );
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    this.chatRoomId = this.valueParamFollows;
    this.isOwner().subscribe(
      (res: HttpResponse<IChatRoom[]>) => {
        this.chatRooms = res.body;
        if (this.chatRooms[0].chatUserId === this.chatUser.userId) {
          this.loggedChatUserOwns = true;
          //                  console.log( 'CONSOLOG: M: ngOnInit & O: this.loggedChatUserOwns : ', this.loggedChatUserOwns, 'this.chatRooms[0].chatUserId', this.chatRooms[0].chatUserId, 'this.chatUser.userId', this.chatUser.userId );
        } else {
          this.loggedChatUserOwns = false;
          //                  console.log( 'CONSOLOG: M: ngOnInit & O: this.loggedChatUserOwns : ', this.loggedChatUserOwns, 'this.chatRooms[0].chatUserId', this.chatRooms[0].chatUserId, 'this.chatUser.userId', this.chatUser.userId );
        }
        //              console.log( 'CONSOLOG: M: ngOnInit & O: this.chatRooms : ', this.chatRooms );
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  private isOwner() {
    //    console.log('CONSOLOG: M: isOwner & O: chatRoomId : ', chatRoomId);
    const query = {};
    if (this.currentAccount.id != null) {
      query['id.equals'] = this.chatRoomId;
      query['queryParams'] = 1;
    }
    return this.chatRoomService.query(query);
  }

  private isaParticipant() {
    // console.log('CONSOLOG: M: isaParticipant & O: chatRoomId : ', chatRoomId);
    //    this.isFollowing = false;
    const query = {};
    if (this.currentAccount.id != null) {
      query['chatUserId.equals'] = this.currentAccount.id;
      query['chatRoomId.equals'] = this.chatRoomId;
      query['queryParams'] = 2;
    }
    //        console.log( 'CONSOLOG: M: isaParticipant & O: query : ', query );
    //        return this.chatRoomAllowedUserService.query( query );
    this.chatRoomAllowedUserService.query(query).subscribe(
      (res: HttpResponse<IChatRoomAllowedUser[]>) => {
        this.chatRoomAllowedUser = res.body[0];
        //              console.log('CONSOLOG: M: ngOnInit & O: res.body : ', res.body);
        //              console.log('CONSOLOG: M: ngOnInit & O: this.chatRoomAllowedUser : ', this.chatRoomAllowedUser);
        if (this.chatRoomAllowedUser) {
          this.isParticipant = true;
          //                  console.log('CONSOLOG: M: ngOnInit & O: this.isParticipant : ', this.isParticipant);
        } else {
          this.isParticipant = false;
          //                  console.log('CONSOLOG: M: ngOnInit & O: this.isParticipant : ', this.isParticipant);
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  joinCR() {
    //      console.log('CONSOLOG: M:joinCR & O: this.chatRoomId : ', this.valueParamFollows);
    this.chatRoomAllowedUser = new Object();
    //    this.isSaving = true;
    this.chatRoomAllowedUser.creationDate = moment(moment().format('YYYY-MM-DDTHH:mm'), 'YYYY-MM-DDTHH:mm');
    this.chatRoomAllowedUser.chatUserId = this.currentAccount.id;
    this.chatRoomAllowedUser.chatRoomId = this.valueParamFollows;
    this.chatRoomAllowedUser.bannedUser = false;
    this.chatRoomAllowedUser.bannedDate = moment(moment().format('YYYY-MM-DDTHH:mm'), 'YYYY-MM-DDTHH:mm');
    //      console.log('CONSOLOG: M:joinCR & O: this.chatRoomAllowedUser : ', this.chatRoomAllowedUser);
    if (this.isParticipant === false) {
      this.subscribeToSaveResponse(this.chatRoomAllowedUserService.create(this.chatRoomAllowedUser));
      this.isParticipant = true;
    }
  }

  leaveCR() {
    if (this.isParticipant === true) {
      const query = {};
      if (this.currentAccount.id != null) {
        query['chatUserId.equals'] = this.currentAccount.id;
        query['chatRoomId.equals'] = this.chatRoomId;
        query['queryParams'] = 2;
      }
      this.chatRoomAllowedUserService.query(query).subscribe(
        (res: HttpResponse<IChatRoomAllowedUser[]>) => {
          this.chatRoomAllowedUser = res.body[0];
          if (this.chatRoomAllowedUser) {
            this.subscribeToSaveResponse(this.chatRoomAllowedUserService.delete(this.chatRoomAllowedUser.id));
            this.isParticipant = false;
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
  }

  banUser(cRAUId) {
    //        console.log( 'CONSOLOG: M:banUser & O: banUser : ', cRAUId );
    const query = {};
    if (this.currentAccount.id != null) {
      query['id.equals'] = cRAUId;
      query['queryParams'] = 1;
    }
    this.chatRoomAllowedUserService.query(query).subscribe(
      (res: HttpResponse<IChatRoomAllowedUser[]>) => {
        this.bannedCRAUser = res.body[0];
        this.bannedCRAUser.bannedUser = true;
        this.bannedCRAUser.bannedDate = moment(moment().format('YYYY-MM-DDTHH:mm'), 'YYYY-MM-DDTHH:mm');
        //                console.log('CONSOLOG: banUser & O: query : ', query);
        //                console.log('CONSOLOG: banUser & O: this.bannedCRAUser : ', this.bannedCRAUser);
        this.subscribeToSaveResponse(this.chatRoomAllowedUserService.update(this.bannedCRAUser));
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  allowUser(cRAUId) {
    //        console.log( 'CONSOLOG: M:banUser & O: banUser : ', cRAUId );
    const query = {};
    if (this.currentAccount.id != null) {
      query['id.equals'] = cRAUId;
      query['queryParams'] = 1;
    }
    this.chatRoomAllowedUserService.query(query).subscribe(
      (res: HttpResponse<IChatRoomAllowedUser[]>) => {
        this.bannedCRAUser = res.body[0];
        this.bannedCRAUser.bannedUser = false;
        this.bannedCRAUser.bannedDate = moment(moment().format('YYYY-MM-DDTHH:mm'), 'YYYY-MM-DDTHH:mm');
        //                console.log('CONSOLOG: banUser & O: query : ', query);
        //                console.log('CONSOLOG: banUser & O: this.bannedCRAUser : ', this.bannedCRAUser);
        this.subscribeToSaveResponse(this.chatRoomAllowedUserService.update(this.bannedCRAUser));
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IChatRoomAllowedUser>>) {
    result.subscribe((res: HttpResponse<IChatRoomAllowedUser>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess() {
    window.location.reload();
  }

  private onSaveError() {
    //      this.isSaving = false;
  }

  previousState() {
    window.history.back();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IChatRoomAllowedUser) {
    return item.id;
  }

  registerChangeInChatRoomAllowedUsers() {
    this.eventSubscriber = this.eventManager.subscribe('chatRoomAllowedUserListModification', response => this.loadAll());
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateChatRoomAllowedUsers(data: IChatRoomAllowedUser[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.chatRoomAllowedUsers = data;
    //        console.log( 'CONSOLOG: M:paginateChatRoomAllowedUsers & O: this.chatRoomAllowedUsers : ', this.chatRoomAllowedUsers );
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
