import { Component, OnInit, Injectable } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { IChatUser } from 'app/shared/model/chat-user.model';
import { HttpResponse } from '@angular/common/http';
import { IUser } from 'app/core';

@Component({
  selector: 'jhi-contact-modal',
  templateUrl: './contact-modal.component.html',
  styles: []
})
@Injectable({ providedIn: 'root' })
export class ContactModalComponent {
  users: IUser[];
  constructor(private userService: UserService) {}
  initialize(searchkeyword: String) {
    const query = {};
    query['searchkeyword'] = searchkeyword;
    this.userService.userlist(query).subscribe((res: HttpResponse<IUser[]>) => {
      this.users = res.body;
    });
  }
}
