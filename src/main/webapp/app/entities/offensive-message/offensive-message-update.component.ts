import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IOffensiveMessage, OffensiveMessage } from 'app/shared/model/offensive-message.model';
import { OffensiveMessageService } from './offensive-message.service';
import { IChatUser } from 'app/shared/model/chat-user.model';
import { ChatUserService } from 'app/entities/chat-user';
import { IChatMessage } from 'app/shared/model/chat-message.model';
import { ChatMessageService } from 'app/entities/chat-message';

@Component({
  selector: 'jhi-offensive-message-update',
  templateUrl: './offensive-message-update.component.html'
})
export class OffensiveMessageUpdateComponent implements OnInit {
  isSaving: boolean;

  chatusers: IChatUser[];

  chatmessages: IChatMessage[];

  editForm = this.fb.group({
    id: [],
    creationDate: [null, [Validators.required]],
    isOffensive: [],
    chatUserId: [],
    chatMessageId: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected offensiveMessageService: OffensiveMessageService,
    protected chatUserService: ChatUserService,
    protected chatMessageService: ChatMessageService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ offensiveMessage }) => {
      this.updateForm(offensiveMessage);
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
  }

  updateForm(offensiveMessage: IOffensiveMessage) {
    this.editForm.patchValue({
      id: offensiveMessage.id,
      creationDate: offensiveMessage.creationDate != null ? offensiveMessage.creationDate.format(DATE_TIME_FORMAT) : null,
      isOffensive: offensiveMessage.isOffensive,
      chatUserId: offensiveMessage.chatUserId,
      chatMessageId: offensiveMessage.chatMessageId
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const offensiveMessage = this.createFromForm();
    if (offensiveMessage.id !== undefined) {
      this.subscribeToSaveResponse(this.offensiveMessageService.update(offensiveMessage));
    } else {
      this.subscribeToSaveResponse(this.offensiveMessageService.create(offensiveMessage));
    }
  }

  private createFromForm(): IOffensiveMessage {
    const entity = {
      ...new OffensiveMessage(),
      id: this.editForm.get(['id']).value,
      creationDate:
        this.editForm.get(['creationDate']).value != null ? moment(this.editForm.get(['creationDate']).value, DATE_TIME_FORMAT) : undefined,
      isOffensive: this.editForm.get(['isOffensive']).value,
      chatUserId: this.editForm.get(['chatUserId']).value,
      chatMessageId: this.editForm.get(['chatMessageId']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOffensiveMessage>>) {
    result.subscribe((res: HttpResponse<IOffensiveMessage>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
}
