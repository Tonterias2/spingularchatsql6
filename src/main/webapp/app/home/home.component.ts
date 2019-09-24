import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from '../shared';

import { LoginModalService, AccountService, Account, UserService } from 'app/core';

import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { Observable } from 'rxjs';

import { IChatRoom } from 'app/shared/model/chat-room.model';

import { ITEMS_PER_PAGE } from 'app/shared';
import { ChatRoomService } from '../entities/chat-room/chat-room.service';

import { IChatMessage } from 'app/shared/model/chat-message.model';
import { ChatMessageService } from '../entities/chat-message/chat-message.service';

import { IChatUser } from 'app/shared/model/chat-user.model';
import { ChatUserService } from '../entities/chat-user/chat-user.service';

import { IChatRoomAllowedUser } from 'app/shared/model/chat-room-allowed-user.model';
import { ChatRoomAllowedUserService } from '../entities/chat-room-allowed-user/chat-room-allowed-user.service';

import { IChatNotification, ChatNotification } from 'app/shared/model/chat-notification.model';
import { ChatNotificationService } from '../entities/chat-notification/chat-notification.service';

import { IOffensiveMessage } from 'app/shared/model/offensive-message.model';
import { OffensiveMessageService } from '../entities/offensive-message/offensive-message.service';
import { ContactModalComponent } from 'app/contact-modal/contact-modal.component';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { threadId } from 'worker_threads';
import { objectExpression } from '@babel/types';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
  account: Account;
  modalRef: NgbModalRef;
  messages: Array<Object> = [];
  message = '';
  users: Array<Object> = [];
  chatMessage: IChatMessage;
  chatMessages: IChatMessage[];
  chatUser: IChatUser;
  chatUsers: IChatUser[];
  chatRooms: IChatRoom[];
  chatRoom: IChatRoom;
  chatRoomAllowedUsers: IChatRoomAllowedUser[];
  notifyChatRoomAllowedUsers: IChatRoomAllowedUser[];
  chatNotifications: IChatNotification[];
  chatNotification: IChatNotification;
  offensiveMessages: IOffensiveMessage[];
  offensiveMessaged: IOffensiveMessage;

  chatroomexist: boolean;
  currentAccount: any;
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

  currentChatRoomId: number;
  currentChatRoomName: String;
  searchtext: String;

  arrayAux = [];
  arrayIds = [];

  constructor(
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    private eventManager: JhiEventManager,
    private chatService: ChatService,
    protected chatRoomService: ChatRoomService,
    protected chatMessageService: ChatMessageService,
    protected chatUserService: ChatUserService,
    protected chatRoomAllowedUserService: ChatRoomAllowedUserService,
    protected chatNotificationService: ChatNotificationService,
    protected offensiveMessageService: OffensiveMessageService,
    protected parseLinks: JhiParseLinks,
    protected jhiAlertService: JhiAlertService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modal: ContactModalComponent
  ) {}

  ngOnInit() {
    this.chatService.connect();

    this.chatService.receive().subscribe(message => {
      this.messages.push(message);
    });

    this.accountService.identity().then(account => {
      this.currentAccount = account;
      const query = {};
      query['userId.equals'] = this.currentAccount.id;
      //      console.log('CONSOLOG: M:ngOnInit & O: query : ', query);
      this.chatUserService.query(query).subscribe(
        (res: HttpResponse<IChatUser[]>) => {
          this.chatUser = res.body[0];
          console.log('CONSOLOG: M:ngOnInit & O: this.chatUser : ', this.chatUser);
          this.myChatRooms();
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    });

    this.registerChangeInChatRooms();

    this.registerAuthenticationSuccess();
    this.registerLogoutSuccess();
  }

  myChatRooms() {
    const query = {};
    if (this.currentAccount.id != null) {
      query['chatUserId.equals'] = this.chatUser.id;
      query['queryParams'] = 1;
    }
    this.chatRoomService.query(query).subscribe(
      //          (res: HttpResponse<IChatRoom[]>) => this.paginateChatRooms(res.body, res.headers),
      (res: HttpResponse<IChatRoom[]>) => {
        this.chatRooms = res.body;
        //                console.log('CONSOLOG: M:myChatRooms & O: query : ', query);
        //                console.log('CONSOLOG: M:myChatRooms & O: this.chatRooms : ', this.chatRooms);
        const query2 = {};
        query2['chatUserId.equals'] = this.chatUser.id;
        query2['bannedUser.equals'] = 'false';
        query2['queryParams'] = 2;
        this.chatRoomAllowedUserService.query(query2).subscribe(
          (res2: HttpResponse<IChatRoomAllowedUser[]>) => {
            //                          console.log('CONSOLOG: M:myChatRooms & O: query2 : ', query2);
            this.chatRoomAllowedUsers = res2.body;
            //                          console.log('CONSOLOG: M:myChatRooms & O: chatRoomAllowedUsers : ', this.chatRoomAllowedUsers);
            if (this.chatRoomAllowedUsers != null) {
              const arrayChatRoomAllowedUsers = [];
              this.chatRoomAllowedUsers.forEach(chatRoomAllowedUser => {
                //                                  console.log('CONSOLOG: M:myChatRooms & O: arrayChatRoomAllowedUsers : ', arrayChatRoomAllowedUsers);
                arrayChatRoomAllowedUsers.push(chatRoomAllowedUser.chatRoomId);
              });
              const query3 = {};
              query3['id.in'] = arrayChatRoomAllowedUsers;
              this.chatRoomService.query(query3).subscribe(
                (res3: HttpResponse<IChatRoom[]>) => {
                  //                                          console.log('CONSOLOG: M:myChatRoomsEND & O: query3 : ', query3);
                  //                                          console.log('CONSOLOG: M:myChatRoomsEND & O: CR+res3.body : ', res3.body);
                  this.chatRooms = this.filterArray(this.chatRooms.concat(res3.body));
                  //                                          console.log('CONSOLOG: M:myChatRoomsEND & O: this.chatRooms : ', this.chatRooms);
                },
                (res3: HttpErrorResponse) => this.onError(res3.message)
              );
            }
            //                          console.log('CONSOLOG: M:myChatRoomsPOST & O: this.chatRooms : ', this.chatRooms);
          },
          (res2: HttpErrorResponse) => this.onError(res2.message)
        );
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  private filterArray(chatRooms: IChatRoom[]) {
    this.arrayAux = [];
    this.arrayIds = [];
    chatRooms.map((x: { id: any }) => {
      if (this.arrayIds.length >= 1 && this.arrayIds.includes(x.id) === false) {
        this.arrayAux.push(x);
        this.arrayIds.push(x.id);
        //        console.log('CONSOLOG: M:filterArray & O: this.arrayAux.push(x) : ', this.arrayAux);
        //        console.log('CONSOLOG: M:filterArray & O: this.arrayIds : ', this.arrayIds);
      } else if (this.arrayIds.length === 0) {
        this.arrayAux.push(x);
        this.arrayIds.push(x.id);
        //        console.log('CONSOLOG: M:filterArray & O: else this.arrayAux.push(x) : ', this.arrayAux);
        //        console.log('CONSOLOG: M:filterArray & O: else this.arrayIds : ', this.arrayIds);
      }
    });
    //    console.log('CONSOLOG: M:filterInterests & O: this.follows : ', this.arrayIds, this.arrayAux);
    return this.arrayAux;
  }

  registerAuthenticationSuccess() {
    this.eventManager.subscribe('authenticationSuccess', (message: any) => {
      this.accountService.identity().then(account => {
        this.currentAccount = account;
        this.chatService.disconnect();
        this.chatService.connect();
      });
    });
  }

  registerLogoutSuccess() {
    this.eventManager.subscribe('logoutSuccess', (message: any) => {
      this.chatService.disconnect();
      this.chatService.connect();
    });
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  login() {
    this.modalRef = this.loginModalService.open();
  }

  sendMessage(message: string) {
    if (message.length === 0) {
      return;
    }
    this.chatMessage = new Object();
    this.chatMessage.chatUserId = this.chatUser.id;
    this.chatMessage.chatRoomId = this.currentChatRoomId;
    this.chatMessage.message = message;
    //      console.log('CONSOLOG: M:sendMessage & O: this.chatMessage: ', this.chatMessage);
    this.chatService.sendMessage(this.chatMessage);
    this.message = '';
    this.notifyCRAUs();
    this.fetchNewChatMessage();
  }

  notifyCRAUs() {
    //    console.log('CONSOLOG: M:fetchChatRoom & O: chatRoomId : ', chatRoomId);
    const query = {};
    query['chatRoomId.equals'] = this.chatMessage.chatRoomId;
    query['chatUserId.equals'] = this.chatMessage.chatUserId;
    query['message.equals'] = this.chatMessage.message;
    query['queryParams'] = 3;
    //    console.log('CONSOLOG: M:notifyCRAUs & O: query : ', query);
    this.chatMessageService.query(query).subscribe(
      (res: HttpResponse<IChatMessage[]>) => {
        this.chatMessage = res.body[0];
        //        console.log('CONSOLOG: M:fetchChatRoom & O: this.chatMessage : ', this.chatMessage);
        const query2 = {};
        query2['chatRoomId.equals'] = this.chatMessage.chatRoomId;
        query2['queryParams'] = 1;
        //        console.log('CONSOLOG: M:notifyCRAUs & O: query2 : ', query2);
        this.chatRoomAllowedUserService.query(query2).subscribe(
          (res2: HttpResponse<IChatRoomAllowedUser[]>) => {
            this.notifyChatRoomAllowedUsers = res2.body;
            //            console.log('CONSOLOG: M:notifyCRAUs & O: notifyChatRoomAllowedUsers : ', this.notifyChatRoomAllowedUsers);
            if (this.notifyChatRoomAllowedUsers != null) {
              const arrayChatRoomAllowedUsers = [];
              this.notifyChatRoomAllowedUsers.forEach(chatRoomAllowedUser => {
                this.chatNotification = new Object();
                if (this.chatUser.id !== chatRoomAllowedUser.chatUserId) {
                  //                    console.log('CONSOLOG: M:notifyCRAUs & O: IF this.chatUser.id : ', this.chatUser.id, 'chatRoomAllowedUser.chatUserId: ', chatRoomAllowedUser.chatUserId);
                  this.chatNotification.chatUserId = chatRoomAllowedUser.chatUserId;
                  this.chatNotification.chatMessageId = this.chatMessage.id;
                  this.chatNotification.chatRoomId = this.chatMessage.chatRoomId;
                  this.chatNotification.creationDate = moment(this.chatMessage.messageSentAt);
                  //                    console.log('CONSOLOG: M:notifyCRAUs & O: this.chatNotification : ', this.chatNotification);
                  this.subscribeToSaveResponse(this.chatNotificationService.create(this.chatNotification));
                }
              });
              const query3 = {};
              query3['id.equals'] = this.chatMessage.chatRoomId;
              this.chatRoomService.query(query3).subscribe(
                (res3: HttpResponse<IChatRoom[]>) => {
                  this.chatRoom = res3.body[0];
                  if (this.chatUser.id !== this.chatRoom.chatUserId) {
                    //                      console.log('CONSOLOG: M:notifyCRAUs & O: IF this.chatRoom.chatUserId : ', this.chatRoom.chatUserId);
                    this.chatNotification.chatUserId = this.chatRoom.chatUserId;
                    this.chatNotification.chatMessageId = this.chatMessage.id;
                    this.chatNotification.chatRoomId = this.chatMessage.chatRoomId;
                    this.chatNotification.creationDate = moment(this.chatMessage.messageSentAt);
                    //                      console.log('CONSOLOG: M:notifyCRAUs & O: this.chatNotification : ', this.chatNotification);
                    this.subscribeToSaveResponse(this.chatNotificationService.create(this.chatNotification));
                  }
                },
                (res3: HttpErrorResponse) => this.onError(res3.message)
              );
            }
          },
          (res2: HttpErrorResponse) => this.onError(res2.message)
        );
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  loadAll() {}

  fetchChatRoom(chatRoomId: number, chatRoomName: String) {
    this.chatroomexist = true;
    //    console.log('CONSOLOG: M:fetchChatRoom & O: chatRoomId : ', chatRoomId);
    this.currentChatRoomName = chatRoomName;
    this.currentChatRoomId = chatRoomId;
    if (chatRoomId !== undefined) {
      const query = {};
      query['chatRoomId.equals'] = this.currentChatRoomId;
      query['queryParams'] = 1;
      //      console.log('CONSOLOG: M:fetchChatRoom & O: query : ', query);
      this.chatMessageService.query(query).subscribe(
        (res: HttpResponse<IChatMessage[]>) => {
          this.chatMessages = res.body;
          console.log('CONSOLOG: M:fetchChatRoom & O: this.messages : ', this.chatMessages);
          this.chatMessages.forEach(chatMessage => {
            const query2 = {};
            query2['chatMessageId.equals'] = chatMessage.id;
            query2['chatUserId.equals'] = chatMessage.chatUserId;
            query2['queryParams'] = 2;
            //          console.log('CONSOLOG: M:fetchChatRoom & O: query2 : ', query2);
            this.offensiveMessageService.query(query2).subscribe(
              (res2: HttpResponse<IOffensiveMessage[]>) => {
                this.offensiveMessages = res2.body;
                // console.log('CONSOLOG: M:fetchChatRoom & O: this.offensiveMessages : ', this.offensiveMessages);
                if (this.offensiveMessages.length >= 1) {
                  chatMessage.offmsg = true;
                } else {
                  chatMessage.offmsg = false;
                }
              },
              (res2: HttpErrorResponse) => this.onError(res2.message)
            );
          });
          const query3 = {};
          query3['chatRoomId.equals'] = this.currentChatRoomId;
          query3['chatUserId.equals'] = this.chatUser.id;
          query3['queryParams'] = 2;
          //          console.log('CONSOLOG: M:fetchChatRoom & O: query2 : ', query2);
          this.chatNotificationService.query(query3).subscribe(
            (res3: HttpResponse<IChatNotification[]>) => {
              this.chatNotifications = res3.body;
              //              console.log('CONSOLOG: M:fetchChatRoom & O: this.chatNotifications : ', this.chatNotifications);
              if (this.chatNotifications) {
                this.chatNotifications.forEach(chatNotification => {
                  //                    console.log('CONSOLOG: M:fetchChatRoom & O: chatNotification : ', chatNotification);
                  this.subscribeToSaveResponse(this.chatNotificationService.delete(chatNotification.id));
                });
              }
            },
            (res3: HttpErrorResponse) => this.onError(res3.message)
          );
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
  }

  offensiveMessage(messageId: number) {
    //    console.log('CONSOLOG: M:offensiveMessage & O: messageId : ', messageId);
    this.offensiveMessaged = new Object();
    this.offensiveMessaged.creationDate = moment(moment().format('YYYY-MM-DDTHH:mm'), 'YYYY-MM-DDTHH:mm');
    this.offensiveMessaged.isOffensive = true;
    this.offensiveMessaged.chatUserId = this.chatUser.id;
    this.offensiveMessaged.chatMessageId = messageId;
    //    console.log('CONSOLOG: M:offensiveMessage & O: this.offensiveMessaged : ', this.offensiveMessaged);
    this.subscribeToSaveResponse(this.offensiveMessageService.create(this.offensiveMessaged));
    window.location.reload();
  }

  discardOffensiveMessage(messageId: any) {
    const query = {};
    if (this.currentAccount.id != null) {
      query['chatUserId.equals'] = this.chatUser.id;
      query['chatMessageId.equals'] = messageId;
      query['queryParams'] = 2;
    }
    this.offensiveMessageService.query(query).subscribe(
      (res: HttpResponse<IOffensiveMessage[]>) => {
        this.offensiveMessaged = res.body[0];
        console.log('CONSOLOG: M:discardOffensiveMessage & O: this.offensiveMessaged : ', this.offensiveMessaged);
        if (this.offensiveMessaged) {
          this.subscribeToSaveResponse(this.offensiveMessageService.delete(this.offensiveMessaged.id));
          window.location.reload();
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  registerChangeInChatRooms() {
    this.eventSubscriber = this.eventManager.subscribe('chatRoomListModification', (response: any) => this.loadAll());
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateChatRooms(data: IChatRoom[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.chatRooms = data;
    //    console.log('CONSOLOG: M:paginateChatRooms & O: this.chatRooms : ', this.chatRooms);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChatNotification>>) {
    result.subscribe((res: HttpResponse<IChatNotification>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }
  protected subscribeToSaveMessage(result: Observable<HttpResponse<IChatMessage>>) {
    result.subscribe((res: HttpResponse<IChatMessage>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    //    this.isSaving = false;
    //    this.previousState();
  }

  protected onSaveError() {
    //    this.isSaving = false;
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
  protected fetchNewChatMessage() {
    const query = {};
    query['chatRoomId.equals'] = this.currentChatRoomId;
    query['queryParams'] = 1;
    this.chatMessageService.query(query).subscribe((res: HttpResponse<IChatMessage[]>) => {
      this.chatMessages = res.body;
    });
  }

  searchcontact() {
    this.users = [];
    this.modal.initialize(this.searchtext);
    if (this.modal.users) {
      this.modal.users.forEach(obj => {
        this.users.push(obj.login);
      });
    }
  }
}
