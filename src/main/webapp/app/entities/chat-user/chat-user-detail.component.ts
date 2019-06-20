import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IChatUser } from 'app/shared/model/chat-user.model';

@Component({
  selector: 'jhi-chat-user-detail',
  templateUrl: './chat-user-detail.component.html'
})
export class ChatUserDetailComponent implements OnInit {
  chatUser: IChatUser;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ chatUser }) => {
      this.chatUser = chatUser;
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
  previousState() {
    window.history.back();
  }
}
