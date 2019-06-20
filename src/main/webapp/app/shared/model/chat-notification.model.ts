import { Moment } from 'moment';

export interface IChatNotification {
  id?: number;
  creationDate?: Moment;
  chatUserId?: number;
  chatMessageId?: number;
  chatRoomId?: number;
}

export class ChatNotification implements IChatNotification {
  constructor(
    public id?: number,
    public creationDate?: Moment,
    public chatUserId?: number,
    public chatMessageId?: number,
    public chatRoomId?: number
  ) {}
}
