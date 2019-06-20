import { Moment } from 'moment';
import { IChatRoom } from 'app/shared/model/chat-room.model';
import { IChatMessage } from 'app/shared/model/chat-message.model';
import { IChatRoomAllowedUser } from 'app/shared/model/chat-room-allowed-user.model';
import { IOffensiveMessage } from 'app/shared/model/offensive-message.model';
import { IChatNotification } from 'app/shared/model/chat-notification.model';

export interface IChatUser {
  id?: number;
  creationDate?: Moment;
  bannedUser?: boolean;
  imageContentType?: string;
  image?: any;
  userId?: number;
  chatRooms?: IChatRoom[];
  chatMessages?: IChatMessage[];
  chatRoomAllowedUsers?: IChatRoomAllowedUser[];
  offensiveMessages?: IOffensiveMessage[];
  chatNotifications?: IChatNotification[];
}

export class ChatUser implements IChatUser {
  constructor(
    public id?: number,
    public creationDate?: Moment,
    public bannedUser?: boolean,
    public imageContentType?: string,
    public image?: any,
    public userId?: number,
    public chatRooms?: IChatRoom[],
    public chatMessages?: IChatMessage[],
    public chatRoomAllowedUsers?: IChatRoomAllowedUser[],
    public offensiveMessages?: IOffensiveMessage[],
    public chatNotifications?: IChatNotification[]
  ) {
    this.bannedUser = this.bannedUser || false;
  }
}
