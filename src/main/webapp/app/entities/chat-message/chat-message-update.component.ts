import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IChatMessage, ChatMessage } from 'app/shared/model/chat-message.model';
import { ChatMessageService } from './chat-message.service';
import { IChatRoom } from 'app/shared/model/chat-room.model';
import { ChatRoomService } from 'app/entities/chat-room';
import { IChatUser } from 'app/shared/model/chat-user.model';
import { ChatUserService } from 'app/entities/chat-user';

@Component({
  selector: 'jhi-chat-message-update',
  templateUrl: './chat-message-update.component.html'
})
export class ChatMessageUpdateComponent implements OnInit {
  isSaving: boolean;

  chatrooms: IChatRoom[];

  chatusers: IChatUser[];

  editForm = this.fb.group({
    id: [],
    messageSentAt: [null, [Validators.required]],
    message: [null, [Validators.required, Validators.maxLength(65000)]],
    isReceived: [],
    isDelivered: [],
    chatRoomId: [],
    chatUserId: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected chatMessageService: ChatMessageService,
    protected chatRoomService: ChatRoomService,
    protected chatUserService: ChatUserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ chatMessage }) => {
      this.updateForm(chatMessage);
    });
    this.chatRoomService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IChatRoom[]>) => mayBeOk.ok),
        map((response: HttpResponse<IChatRoom[]>) => response.body)
      )
      .subscribe((res: IChatRoom[]) => (this.chatrooms = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.chatUserService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IChatUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IChatUser[]>) => response.body)
      )
      .subscribe((res: IChatUser[]) => (this.chatusers = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(chatMessage: IChatMessage) {
    this.editForm.patchValue({
      id: chatMessage.id,
      messageSentAt: chatMessage.messageSentAt,
      message: chatMessage.message,
      isReceived: chatMessage.isReceived,
      isDelivered: chatMessage.isDelivered,
      chatRoomId: chatMessage.chatRoomId,
      chatUserId: chatMessage.chatUserId
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const chatMessage = this.createFromForm();
    if (chatMessage.id !== undefined) {
      this.subscribeToSaveResponse(this.chatMessageService.update(chatMessage));
    } else {
      this.subscribeToSaveResponse(this.chatMessageService.create(chatMessage));
    }
  }

  private createFromForm(): IChatMessage {
    const entity = {
      ...new ChatMessage(),
      id: this.editForm.get(['id']).value,
      messageSentAt: this.editForm.get(['messageSentAt']).value,
      message: this.editForm.get(['message']).value,
      isReceived: this.editForm.get(['isReceived']).value,
      isDelivered: this.editForm.get(['isDelivered']).value,
      chatRoomId: this.editForm.get(['chatRoomId']).value,
      chatUserId: this.editForm.get(['chatUserId']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChatMessage>>) {
    result.subscribe((res: HttpResponse<IChatMessage>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

  trackChatRoomById(index: number, item: IChatRoom) {
    return item.id;
  }

  trackChatUserById(index: number, item: IChatUser) {
    return item.id;
  }
}
