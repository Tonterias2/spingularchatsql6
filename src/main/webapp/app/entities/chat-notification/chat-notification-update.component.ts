import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IChatNotification, ChatNotification } from 'app/shared/model/chat-notification.model';
import { ChatNotificationService } from './chat-notification.service';
import { IChatUser } from 'app/shared/model/chat-user.model';
import { ChatUserService } from 'app/entities/chat-user';
import { IChatMessage } from 'app/shared/model/chat-message.model';
import { ChatMessageService } from 'app/entities/chat-message';
import { IChatRoom } from 'app/shared/model/chat-room.model';
import { ChatRoomService } from 'app/entities/chat-room';

@Component({
  selector: 'jhi-chat-notification-update',
  templateUrl: './chat-notification-update.component.html'
})
export class ChatNotificationUpdateComponent implements OnInit {
  isSaving: boolean;

  chatusers: IChatUser[];

  chatmessages: IChatMessage[];

  chatrooms: IChatRoom[];

  editForm = this.fb.group({
    id: [],
    creationDate: [null, [Validators.required]],
    chatUserId: [],
    chatMessageId: [],
    chatRoomId: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected chatNotificationService: ChatNotificationService,
    protected chatUserService: ChatUserService,
    protected chatMessageService: ChatMessageService,
    protected chatRoomService: ChatRoomService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ chatNotification }) => {
      this.updateForm(chatNotification);
    });
    this.chatUserService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IChatUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IChatUser[]>) => response.body)
      )
      .subscribe((res: IChatUser[]) => (this.chatusers = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.chatMessageService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IChatMessage[]>) => mayBeOk.ok),
        map((response: HttpResponse<IChatMessage[]>) => response.body)
      )
      .subscribe((res: IChatMessage[]) => (this.chatmessages = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.chatRoomService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IChatRoom[]>) => mayBeOk.ok),
        map((response: HttpResponse<IChatRoom[]>) => response.body)
      )
      .subscribe((res: IChatRoom[]) => (this.chatrooms = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(chatNotification: IChatNotification) {
    this.editForm.patchValue({
      id: chatNotification.id,
      creationDate: chatNotification.creationDate != null ? chatNotification.creationDate.format(DATE_TIME_FORMAT) : null,
      chatUserId: chatNotification.chatUserId,
      chatMessageId: chatNotification.chatMessageId,
      chatRoomId: chatNotification.chatRoomId
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const chatNotification = this.createFromForm();
    if (chatNotification.id !== undefined) {
      this.subscribeToSaveResponse(this.chatNotificationService.update(chatNotification));
    } else {
      this.subscribeToSaveResponse(this.chatNotificationService.create(chatNotification));
    }
  }

  private createFromForm(): IChatNotification {
    const entity = {
      ...new ChatNotification(),
      id: this.editForm.get(['id']).value,
      creationDate:
        this.editForm.get(['creationDate']).value != null ? moment(this.editForm.get(['creationDate']).value, DATE_TIME_FORMAT) : undefined,
      chatUserId: this.editForm.get(['chatUserId']).value,
      chatMessageId: this.editForm.get(['chatMessageId']).value,
      chatRoomId: this.editForm.get(['chatRoomId']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChatNotification>>) {
    result.subscribe((res: HttpResponse<IChatNotification>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackChatUserById(index: number, item: IChatUser) {
    return item.id;
  }

  trackChatMessageById(index: number, item: IChatMessage) {
    return item.id;
  }

  trackChatRoomById(index: number, item: IChatRoom) {
    return item.id;
  }
}
