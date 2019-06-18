import { Moment } from 'moment';

export interface IChatNotification {
  id?: number;
  creationDate?: Moment;
  userId?: number;
  chatMessageId?: number;
  chatRoomId?: number;
}

export class ChatNotification implements IChatNotification {
  constructor(
    public id?: number,
    public creationDate?: Moment,
    public userId?: number,
    public chatMessageId?: number,
    public chatRoomId?: number
  ) {}
}
